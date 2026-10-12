// Scale the 1440px-wide design to the viewport width.
const stage = document.querySelector('.stage');
const DESIGN_WIDTH = 1440;

function fit() {
  stage.style.zoom = document.documentElement.clientWidth / DESIGN_WIDTH;
}

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
window.addEventListener('scroll', queueCheck, { passive: true });
window.addEventListener('resize', queueCheck);

// Sunset: as the section scrolls into view the sun travels from small on the
// right into its place behind the laptop, growing to full size.
const sun = document.getElementById('sun');
const SUN = { cx: 720.5, cy: 3126.5 };          // final centre (design px)
const SUN_START = { cx: 1010, cy: 2640, s: .22 }; // small, up on the right (clear of the leaf)
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function placeSun() {
  const zoom = parseFloat(stage.style.zoom) || 1;
  const viewH = window.innerHeight / zoom;                         // in design px
  const viewBottom = window.scrollY / zoom + viewH;
  // starts as the section comes into view, done once the sun sits just
  // above the middle of the screen
  const from = 2750, to = SUN.cy + viewH * .45;
  let p = reduceMotion ? 1 : Math.min(1, Math.max(0, (viewBottom - from) / (to - from)));
  p = p * p * (3 - 2 * p); // smoothstep
  const s = SUN_START.s + (1 - SUN_START.s) * p;
  const dx = (SUN_START.cx - SUN.cx) * (1 - p), dy = (SUN_START.cy - SUN.cy) * (1 - p);
  sun.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${s.toFixed(3)})`;
}
let sunQueued = false;
const queueSun = () => { if (!sunQueued) { sunQueued = true; requestAnimationFrame(() => { sunQueued = false; placeSun(); }); } };
placeSun();
window.addEventListener('scroll', queueSun, { passive: true });
window.addEventListener('resize', queueSun);
