// About pop-up (ported from the portfolio artifact): a soft mist spreads
// out of whatever was clicked ("About me" link/button or the "?") until it fills
// the screen, then shrinks back into it on close.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => document.querySelector(s);

  // Put your photo's path here (e.g. 'assets/me.jpg') to replace the placeholder.
  const ME_PHOTO = '';
  const me = $('#me'), mePh = $('#mePh');
  if (ME_PHOTO) me.src = ME_PHOTO;
  me.addEventListener('load', () => { me.hidden = false; mePh.hidden = true; });

  const pop = $('#aboutPop'), plate = $('#plate'), closeBtn = $('#cpClose');
  let opener = null, origin = null, anim = 0;

  // The pop-up is revealed through a soft, shapeless mist: several feathered blobs
  // (styles.css) around the click that grow together and drift a little as they
  // grow, so no clear outline ever shows. r is the mist's size in px.
  function setMask(r, cx, cy, t) {
    pop.style.setProperty('--r', `${r}px`);
    pop.style.setProperty('--cx', `${cx}px`);
    pop.style.setProperty('--cy', `${cy}px`);
    pop.style.setProperty('--w', (Math.sin(t * Math.PI * 1.5) * .5).toFixed(3));   // the drift
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
  // just big enough for the mist's solid core to cover the farthest corner of the
  // screen: growing or shrinking beyond that would show nothing (and feel like a pause)
  const coverR = () => Math.max(...[[0, 0], [innerWidth, 0], [0, innerHeight], [innerWidth, innerHeight]]
    .map(([x, y]) => Math.hypot(x - origin.x, y - origin.y))) / .42;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3), easeInOut = (t) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  function openAbout(el) {
    if (!pop.hidden) return;
    opener = el || null;
    const r = (el && el.getBoundingClientRect()) || { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    origin = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: Math.max(80, r.width * 1.8) };
    pop.hidden = false; pop.scrollTop = 0; more.classList.remove('gone'); toolbox.classList.remove('in'); document.body.style.overflow = 'hidden'; plate.classList.remove('in');
    const finish = () => {
      pop.classList.add('full');
      setTimeout(() => { plate.classList.add('in'); onPopScroll(); }, 250);
      closeBtn.focus({ preventScroll: true });
    };
    if (reduce) { finish(); return; }
    pop.classList.remove('full'); setMask(origin.w * .5, origin.x, origin.y, 0);
    requestAnimationFrame(() => animateMask(origin.w * .5, coverR(), 1000, easeOut, finish));
  }
  function closeAbout() {
    if (pop.hidden) return;
    const end = () => {
      pop.hidden = true; pop.classList.remove('full'); document.body.style.overflow = '';
      if (opener) opener.focus({ preventScroll: true });
    };
    if (reduce) { end(); return; }
    // start exactly where the mist just covers the screen, so it shrinks from the first frame
    setMask(coverR(), origin.x, origin.y, 1); pop.classList.remove('full');
    animateMask(coverR(), 0, 800, easeInOut, end);
  }

  // the page continues below the plate: a cue leads to the tools, which pop in as they come into view
  const more = $('#cpMore'), toolbox = $('#toolbox');
  toolbox.querySelectorAll('.tool').forEach((t, i) => t.style.setProperty('--i', i));
  more.addEventListener('click', () => toolbox.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
  const onPopScroll = () => {
    more.classList.toggle('gone', pop.scrollTop > 40);
    if (toolbox.getBoundingClientRect().top < innerHeight * .85) toolbox.classList.add('in');
  };
  pop.addEventListener('scroll', onPopScroll, { passive: true });
  addEventListener('resize', onPopScroll);

  document.querySelectorAll('[data-about]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); openAbout(a); }));
  closeBtn.addEventListener('click', closeAbout);
  document.addEventListener('keydown', (e) => {
    if (pop.hidden) return;
    if (e.key === 'Escape') closeAbout();
    if (e.key === 'Tab') { // keep focus inside the pop-up
      const f = [...pop.querySelectorAll('button, a[href], [tabindex="0"]')]; if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { f[f.length - 1].focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { f[0].focus(); e.preventDefault(); }
    }
  });
})();
