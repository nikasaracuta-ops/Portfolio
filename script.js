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
  for (const el of pending) if (el.getBoundingClientRect().top < line) reveal(el);
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
