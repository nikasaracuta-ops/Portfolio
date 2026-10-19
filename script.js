// Scale the 1440px-wide design to the viewport width.
const stage = document.querySelector('.stage');
const DESIGN_WIDTH = 1440;

// Phones get their own stacked layout (styles.css, max-width: 760px) instead of
// a shrunken desktop page; there only the sunset artwork is scaled.
const MOBILE = matchMedia('(max-width: 760px)');

function fit() {
  const w = document.documentElement.clientWidth;
  if (MOBILE.matches) {
    stage.style.zoom = '';
    stage.style.setProperty('--mz', (w / 840).toFixed(4));               // sunset artwork: 840px-wide crop
  } else {
    stage.style.zoom = w / DESIGN_WIDTH;
  }
  updateTopbar();
}

// Sticky menu: slides in once the menu at the top has scrolled away (always on phones)
const topbar = document.getElementById('topbar');
function updateTopbar() {
  if (topbar) topbar.classList.toggle('show', MOBILE.matches || window.scrollY > 260);
}
window.addEventListener('scroll', updateTopbar, { passive: true });

fit();
window.addEventListener('resize', fit);

// Scroll reveals: show each .reveal element once its top has scrolled above
// 88% of the screen height (this also catches anything jumped past), then drop
// the reveal classes once its staggered animation is over.
const pending = new Set();

function reveal(el) {
  pending.delete(el);
  el.classList.add('in');
  const delay = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
  setTimeout(() => el.classList.remove('reveal', 'in'), (delay + 1.2) * 1000);
}

let queued = false;
function checkReveals() {
  queued = false;
  if (document.documentElement.classList.contains('is-loading')) return;   // wait for the loader
  const line = window.innerHeight * 0.88;
  // at the very bottom of the page everything left is in view
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  for (const el of pending) if (atBottom || el.getBoundingClientRect().top < line) reveal(el);
}
function queueCheck() {
  if (!queued) { queued = true; requestAnimationFrame(checkReveals); }
}

window.observeReveals = (root = document) => {
  root.querySelectorAll('.reveal').forEach((el) => pending.add(el));
  queueCheck();
};
observeReveals();
window.addEventListener('site:loaded', queueCheck);
window.addEventListener('scroll', queueCheck, { passive: true });
window.addEventListener('resize', queueCheck);

// Sparkle cursor: only for a real mouse/trackpad (touch screens keep their own behaviour)
const sparkle = document.getElementById('sparkle');
if (sparkle && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CLICKABLE = 'a, button, [role="tab"], .words li, .pname, .card, .qbtn, .screen';
  let x = -100, y = -100, sx = x, sy = y, raf = 0;
  document.documentElement.classList.add('sparkle-on');
  const move = () => {
    sx += (x - sx) * (reduceMotion ? 1 : .35);
    sy += (y - sy) * (reduceMotion ? 1 : .35);
    sparkle.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
    raf = Math.abs(x - sx) + Math.abs(y - sy) > .2 ? requestAnimationFrame(move) : 0;
  };
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!sparkle.classList.contains('show')) { sx = x; sy = y; sparkle.classList.add('show'); }
    sparkle.classList.toggle('big', !!e.target.closest(CLICKABLE));
    if (!raf) raf = requestAnimationFrame(move);
  }, { passive: true });
  document.addEventListener('pointerleave', () => sparkle.classList.remove('show'));
  addEventListener('blur', () => sparkle.classList.remove('show'));
  addEventListener('pointerdown', () => sparkle.classList.add('press'));
  addEventListener('pointerup', () => sparkle.classList.remove('press'));
}

// About → Work transition: as About scrolls away, the white cloud shape (and the
// "?" sitting on it) glides to the centre and settles a little smaller, while the
// blue cloud bank parts to the sides, leaving a smooth edge above My work.
const puff = document.getElementById('skyPuff');
const cloudsL = document.getElementById('cloudsL'), cloudsR = document.getElementById('cloudsR');
const qbtn = document.querySelector('#about .qbtn');
const PUFF_CX = 661 + 695 / 2, PUFF_BOTTOM = 765 + 855;   // the shape's centre line and bottom on the stage
const Q = { x: 958.66 + 53, y: 859 + 131.37 + 98 };          // centre of the "?" on the stage
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let skyQueued = false;
function moveSky() {
  skyQueued = false;
  const off = MOBILE.matches || reduceMotion.matches;
  // progress: 0 while About fills the screen, 1 once My work reaches the upper part of it
  const z = parseFloat(stage.style.zoom) || 1;
  const top = -stage.getBoundingClientRect().top / z;        // stage y at the top of the screen
  const t = off ? 0 : Math.max(0, Math.min(1, (top - 700) / 750));
  const e = t * t * (3 - 2 * t);                              // ease in and out
  const s = 1 - .25 * e, dx = (720 - PUFF_CX) * e, dy = 70 * e;
  puff.style.transform = e ? `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${s.toFixed(3)})` : '';
  // the "?" rides along: same move, scaled around the shape's bottom centre
  const qx = PUFF_CX + (Q.x - PUFF_CX) * s + dx - Q.x, qy = PUFF_BOTTOM + (Q.y - PUFF_BOTTOM) * s + dy - Q.y;
  if (qbtn) qbtn.style.transform = e ? `translate(${qx.toFixed(1)}px, ${qy.toFixed(1)}px) scale(${s.toFixed(3)})` : '';
  const cx = 380 * e, cy = -170 * e, o = (1 - .85 * e).toFixed(3);
  cloudsL.style.transform = e ? `translate(${-cx}px, ${cy}px)` : '';
  cloudsR.style.transform = e ? `translate(${cx}px, ${cy}px)` : '';
  cloudsL.style.opacity = cloudsR.style.opacity = e ? o : '';
}
if (puff && cloudsL && cloudsR) {
  const queueSky = () => { if (!skyQueued) { skyQueued = true; requestAnimationFrame(moveSky); } };
  addEventListener('scroll', queueSky, { passive: true });
  addEventListener('resize', queueSky);
  moveSky();
}
