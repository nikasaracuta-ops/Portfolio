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

// Parallax: the bank of blue clouds between About and Work drifts slower than
// the page (75% of the scroll speed), so the Work section slides up over the sky.
const clouds = document.getElementById('cloudsPx');
const CLOUDS_MID = 1190 + 350;   // the layer's centre on the 1440px stage
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let cloudsQueued = false;
function moveClouds() {
  cloudsQueued = false;
  if (MOBILE.matches || reduceMotion.matches) { clouds.style.transform = ''; return; }
  const z = parseFloat(stage.style.zoom) || 1;
  // distance of the layer's centre from the middle of the screen, in screen px
  const d = stage.getBoundingClientRect().top + CLOUDS_MID * z - innerHeight / 2;
  const ty = Math.max(-140, Math.min(140, -.25 * d / z));
  clouds.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0)`;
}
if (clouds) {
  const queueClouds = () => { if (!cloudsQueued) { cloudsQueued = true; requestAnimationFrame(moveClouds); } };
  addEventListener('scroll', queueClouds, { passive: true });
  addEventListener('resize', queueClouds);
  moveClouds();
}
