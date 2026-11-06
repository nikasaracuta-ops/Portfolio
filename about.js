// About pop-up (ported from the portfolio artifact): a soft mist spreads
// out of whatever was clicked ("About me" link/button or the "?") until it fills
// the screen, then shrinks back into it on close.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => document.querySelector(s);

  // The photo: wherever the cursor (or a finger) passes, soft patches of the photo
  // turn into one of two heat-map versions and fade back after a moment.
  (() => {
    const box = $('#polaroid'), cv = $('#heat'), hint = $('#heatHint');
    if (!box || !cv) return;
    if (matchMedia('(pointer: coarse)').matches) hint.textContent = 'Drag over the photo';
    const ctx = cv.getContext('2d'), mask = document.createElement('canvas'), mctx = mask.getContext('2d');
    const heats = ['assets/about/heat-a.webp', 'assets/about/heat-b.webp'].map((src) => { const i = new Image(); i.src = src; return i; });
    let blobs = [], raf = 0, W = 0, H = 0, last = null, piece = 0, count = 0;
    const LIFE = 1700;
    const size = () => {
      const r = box.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
      W = r.width; H = r.height;
      cv.width = mask.width = Math.round(W * d); cv.height = mask.height = Math.round(H * d);
      ctx.setTransform(d, 0, 0, d, 0, 0); mctx.setTransform(d, 0, 0, d, 0, 0);
    };
    // the heat maps are cut exactly like the photo, so they cover it one to one
    const place = () => [0, 0, W, H];
    const draw = (now) => {
      blobs = blobs.filter((b) => now - b.t < LIFE);
      ctx.clearRect(0, 0, W, H);
      const [hx, hy, hw, hh] = place();
      for (let k = 0; k < 2; k++) {
        const mine = blobs.filter((b) => b.k === k);
        if (!mine.length || !heats[k].complete) continue;
        mctx.globalCompositeOperation = 'source-over'; mctx.clearRect(0, 0, W, H);
        for (const b of mine) {
          const a = 1 - (now - b.t) / LIFE, g = mctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          g.addColorStop(0, `rgba(0,0,0,${(a * .95).toFixed(3)})`); g.addColorStop(.55, `rgba(0,0,0,${(a * .7).toFixed(3)})`); g.addColorStop(1, 'rgba(0,0,0,0)');
          mctx.fillStyle = g; mctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
        }
        mctx.globalCompositeOperation = 'source-in'; mctx.drawImage(heats[k], hx, hy, hw, hh);
        ctx.drawImage(mask, 0, 0, W, H);
      }
      raf = blobs.length ? requestAnimationFrame(draw) : 0;
    };
    const add = (x, y) => {
      if (++count % 7 === 0) piece = 1 - piece;   // every few patches the other heat map
      blobs.push({ x, y, r: (W * (.12 + Math.random() * .1)), t: performance.now(), k: piece });
      if (!raf) raf = requestAnimationFrame(draw);
    };
    box.addEventListener('pointermove', (e) => {
      if (!W) size();
      const r = box.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (last && Math.hypot(x - last[0], y - last[1]) < W * .04) return;
      last = [x, y]; add(x, y); hint.classList.add('gone');
    }, { passive: true });
    box.addEventListener('pointerleave', () => { last = null; });
    addEventListener('resize', () => { W = 0; });
    // a little hint when the page opens: a short heat trail across the face
    box.sweep = () => {
      if (reduce) return;
      size(); let i = 0;
      const step = () => { add(W * (.3 + i * .05), H * (.3 + Math.sin(i / 2) * .05)); if (++i < 9) setTimeout(step, 70); };
      setTimeout(step, 700);
    };
  })();

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
      setTimeout(() => { plate.classList.add('in'); onPopScroll(); const p = $('#polaroid'); if (p && p.sweep) p.sweep(); }, 250);
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
