(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => document.querySelector(s);

  const pop = $('#aboutPop'), plate = $('#plate'), stage = $('#bioStage'), closeBtn = $('#cpClose');
  let opener = null, origin = null, anim = 0, splitTimer = 0;

  const helloWord = $('#helloWord'), GREETINGS = ['Ciao!', 'Hola!', '你好!', 'Hello!', 'Salut!', 'Hallo!', 'Привет!'];
  let greet = 0, greetTimer = 0, swapTimer = 0;
  function cycleGreeting() {
    helloWord.classList.add('bio__word--out');
    swapTimer = setTimeout(() => {
      greet = (greet + 1) % GREETINGS.length;
      helloWord.textContent = GREETINGS[greet];
      helloWord.classList.remove('bio__word--out');
    }, 300);
  }
  const startGreetings = () => { if (!reduce) greetTimer = setInterval(cycleGreeting, 1800); };
  const stopGreetings = () => { clearInterval(greetTimer); clearTimeout(swapTimer); greet = 0; helloWord.textContent = GREETINGS[0]; helloWord.classList.remove('bio__word--out'); };

  function setMask(r, cx, cy, t) {
    pop.style.setProperty('--r', `${r}px`);
    pop.style.setProperty('--cx', `${cx}px`);
    pop.style.setProperty('--cy', `${cy}px`);
    pop.style.setProperty('--w', (Math.sin(t * Math.PI * 1.5) * .5).toFixed(3));
  }
  function animateMask(from, to, dur, curve, done) {
    cancelAnimationFrame(anim);
    const t0 = performance.now();
    (function step(now) {
      const t = Math.min(1, (now - t0) / dur), k = curve(t);
      setMask(from + (to - from) * k, origin.x, origin.y, k);
      if (t < 1) anim = requestAnimationFrame(step); else if (done) done();
    })(t0);
  }
  const coverR = () => Math.max(...[[0, 0], [innerWidth, 0], [0, innerHeight], [innerWidth, innerHeight]]
    .map(([x, y]) => Math.hypot(x - origin.x, y - origin.y))) / .42;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3), easeInOut = (t) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  function openAbout(el) {
    if (!pop.hidden) return;
    opener = el || null;
    const r = (el && el.getBoundingClientRect()) || { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    origin = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: Math.max(80, r.width * 1.8) };
    pop.hidden = false; pop.scrollTop = 0; more.classList.remove('gone'); toolbox.classList.remove('in'); document.body.style.overflow = 'hidden'; plate.classList.remove('in'); clearTimeout(splitTimer); stage.classList.remove('bio__stage--split');
    const finish = () => {
      pop.classList.add('full');
      setTimeout(() => { plate.classList.add('in'); onPopScroll(); startGreetings(); }, 250);
      splitTimer = setTimeout(() => stage.classList.add('bio__stage--split'), reduce ? 0 : 1300);
      closeBtn.focus({ preventScroll: true, focusVisible: false });
    };
    if (reduce) { finish(); return; }
    pop.classList.remove('full'); setMask(origin.w * .5, origin.x, origin.y, 0);
    requestAnimationFrame(() => animateMask(origin.w * .5, coverR(), 1000, easeOut, finish));
  }
  function closeAbout() {
    if (pop.hidden) return;
    const end = () => {
      pop.hidden = true; pop.classList.remove('full'); document.body.style.overflow = ''; stopGreetings();
      if (opener) opener.focus({ preventScroll: true });
    };
    if (reduce) { end(); return; }
    setMask(coverR(), origin.x, origin.y, 1); pop.classList.remove('full');
    animateMask(coverR(), 0, 800, easeInOut, end);
  }

  const more = $('#cpMore'), toolbox = $('#toolbox');
  toolbox.querySelectorAll('.tool').forEach((t, i) => t.style.setProperty('--i', i));
  more.addEventListener('click', () => toolbox.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
  const onPopScroll = () => {
    more.classList.toggle('gone', pop.scrollTop > 40);
    pop.classList.toggle('cloudpop--scrolled', pop.scrollTop > 40);
    if (toolbox.getBoundingClientRect().top < innerHeight * .85) toolbox.classList.add('in');
  };
  pop.addEventListener('scroll', onPopScroll, { passive: true });
  addEventListener('resize', onPopScroll);

  document.querySelectorAll('[data-about]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); openAbout(a); }));
  closeBtn.addEventListener('click', closeAbout);
  document.addEventListener('keydown', (e) => {
    if (pop.hidden) return;
    if (e.key === 'Escape') closeAbout();
    if (e.key === 'Tab') {
      const f = [...pop.querySelectorAll('button, a[href], [tabindex="0"]')]; if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { f[f.length - 1].focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { f[0].focus(); e.preventDefault(); }
    }
  });
})();
