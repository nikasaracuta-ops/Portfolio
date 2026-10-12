// About pop-up (ported from the portfolio artifact): the cloud silhouette grows
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
  const PUFF = 700 / 852; // puff.webp aspect ratio
  let opener = null, origin = null, anim = 0;
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function setMask(w, cx, cy) {
    const h = w / PUFF;
    pop.style.setProperty('--ms', `${w}px ${h}px`);
    pop.style.setProperty('--mx', `${cx - w / 2}px`);
    pop.style.setProperty('--my', `${cy - h * .42}px`);
  }
  function animateMask(from, to, done) {
    cancelAnimationFrame(anim);
    const t0 = performance.now(), dur = 900;
    (function step(now) {
      const t = Math.min(1, (now - t0) / dur);
      setMask(from + (to - from) * ease(t), origin.x, origin.y);
      if (t < 1) anim = requestAnimationFrame(step); else if (done) done();
    })(t0);
  }
  const bigSize = () => Math.hypot(innerWidth, innerHeight) * 3.2;

  function openAbout(el) {
    if (!pop.hidden) return;
    opener = el || null;
    const r = (el && el.getBoundingClientRect()) || { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    origin = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: Math.max(80, r.width * 1.8) };
    pop.hidden = false; pop.scrollTop = 0; document.body.style.overflow = 'hidden'; plate.classList.remove('in');
    const finish = () => {
      pop.classList.add('full');
      setTimeout(() => plate.classList.add('in'), 250);
      closeBtn.focus({ preventScroll: true });
    };
    if (reduce) { finish(); return; }
    pop.classList.remove('full'); setMask(origin.w, origin.x, origin.y);
    requestAnimationFrame(() => animateMask(origin.w, bigSize(), finish));
  }
  function closeAbout() {
    if (pop.hidden) return;
    const end = () => {
      pop.hidden = true; pop.classList.remove('full'); document.body.style.overflow = '';
      if (opener) opener.focus({ preventScroll: true });
    };
    if (reduce) { end(); return; }
    pop.classList.remove('full'); animateMask(bigSize(), origin.w, end);
  }

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
