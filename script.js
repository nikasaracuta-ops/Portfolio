// Scale the 1440px-wide design to the viewport width.

// Behance profile: the laptop screen and the Behance button link here.
// TODO: paste the profile URL, e.g. 'https://www.behance.net/yourname'.
const BEHANCE_URL = '';
document.querySelectorAll('[data-behance]').forEach(a => { if (BEHANCE_URL) a.href = BEHANCE_URL; else a.removeAttribute('target'); });
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
  placeFooter();
}

// The footer (title down to the sand) is 866px tall with room for the menu, as in
// Figma. On shorter screens the text block moves down towards the sand, so at the
// bottom of the page the title still clears the menu.
const contact = document.getElementById('contact');
function placeFooter() {
  if (!contact) return;
  const z = parseFloat(stage.style.zoom) || 1;
  const shift = MOBILE.matches ? 0 : Math.max(0, Math.min(150, 866 - innerHeight / z));
  contact.style.top = MOBILE.matches ? '' : `${5632 + shift}px`;
}

// Sticky menu: slides in once the menu at the top has scrolled away (always on phones)
const topbar = document.getElementById('topbar');
function updateTopbar() {
  // the menu scales with the page on desktop (styles.css)
  if (topbar) topbar.style.setProperty('--z', MOBILE.matches ? 1 : (document.documentElement.clientWidth / DESIGN_WIDTH).toFixed(4));
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

// About, pinned. The scene (stage y 459–1959) sticks once the screen's bottom edge
// reaches stage y 1720 and stays for the next HOLD px of scrolling (styles.css).
// Over that stretch: the About text and "?" fade, the blue cloud bank parts to
// the sides, the white cloud shape glides to the centre and sinks until only the
// sky's straight bottom edge is left — which holds for a moment before the scene
// lets go and Work scrolls up.
const about = document.getElementById('about');
const puff = document.getElementById('skyPuff');
const cloudsL = document.getElementById('cloudsL'), cloudsR = document.getElementById('cloudsR');
const PIN_TOP = 459, PIN_BOTTOM = 1720, HOLD = 700;
const LEAD = 150;   // the transition starts this much scrolling before the scene pins
const PUFF_CX = 661 + 695 / 2;                        // the shape's centre line on the stage
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const ramp = (t, a, b) => { const x = Math.max(0, Math.min(1, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
let skyQueued = false;
function moveSky() {
  skyQueued = false;
  const z = parseFloat(stage.style.zoom) || 1, vh = innerHeight / z;   // screen height in stage px
  stage.style.setProperty('--pin-top', (vh - (PIN_BOTTOM - PIN_TOP)).toFixed(1) + 'px');
  if (MOBILE.matches) {
    for (const el of [about, puff, cloudsL, cloudsR]) { el.style.transform = el.style.opacity = el.style.visibility = ''; }
    return;
  }
  // 0 just before the scene pins (LEAD px earlier), 1 when it lets go
  const t = Math.max(0, Math.min(1, (-stage.getBoundingClientRect().top / z - (PIN_BOTTOM - vh - LEAD)) / (HOLD + LEAD)));
  const fade = ramp(t, 0, .25), part = ramp(t, .05, .45), glide = ramp(t, .1, .45), sink = ramp(t, .45, .78);
  about.style.opacity = fade ? (1 - fade).toFixed(3) : '';
  about.style.visibility = fade >= 1 ? 'hidden' : '';
  const move = !reduceMotion.matches;
  const cx = 420 * part, cy = -200 * part;
  cloudsL.style.transform = move && part ? `translate(${-cx}px, ${cy}px)` : '';
  cloudsR.style.transform = move && part ? `translate(${cx}px, ${cy}px)` : '';
  cloudsL.style.opacity = cloudsR.style.opacity = part ? (1 - part).toFixed(3) : '';
  // the shape glides to the centre (a little smaller and lower), then sinks below the
  // sky's edge into the white, leaving just a horizontal line
  const g = move ? glide : 0, dy = 289 * g + (move ? 500 * sink : 0);
  puff.style.transform = g ? `translate(${((720 - PUFF_CX) * g).toFixed(1)}px, ${dy.toFixed(1)}px) scale(${(1 - .2 * g).toFixed(3)})` : '';
  puff.style.opacity = sink ? (1 - ramp(t, .62, .78)).toFixed(3) : '';
}
if (about && puff && cloudsL && cloudsR) {
  const queueSky = () => { if (!skyQueued) { skyQueued = true; requestAnimationFrame(moveSky); } };
  addEventListener('scroll', queueSky, { passive: true });
  addEventListener('resize', queueSky);
  moveSky();
}

const sunsetArt = document.querySelector('.sunset-art');

// Menu: white over the sky and the sea, blue with the colour logo over the white
// stretch from where the sky fades out above Work down to the sea; the pink pill sits on the section you are in
// (none over the opening hero).
const work = document.getElementById('work');
const navLinks = topbar ? [...topbar.querySelectorAll('.topbar-links a')] : [];
const navPill = topbar && topbar.querySelector('.topbar-pill');
const navSections = [about, work, sunsetArt];   // About me, Work, Contact
let navQueued = false, navPlaced = false;
function toneNav() {
  navQueued = false;
  const r = topbar.getBoundingClientRect(), y = r.top + r.height / 2;   // the menu's line on screen
  const art = sunsetArt.getBoundingClientRect();
  const z = MOBILE.matches ? 1 : parseFloat(stage.style.zoom) || 1;
  topbar.classList.toggle('on-light', work.getBoundingClientRect().top - 280 * z <= y && art.top + art.height * .64 > y);
  // current section: the last one whose top has passed 40% of the screen
  let cur = -1;
  navSections.forEach((el, i) => { if (el && el.getBoundingClientRect().top <= innerHeight * .4) cur = i; });
  navLinks.forEach((a, i) => a.classList.toggle('current', i === cur));
  if (!navPill) return;
  navPill.classList.toggle('on', cur >= 0);
  if (cur < 0) return;
  // the first placement (and placements while hidden) jump; after that the pill slides
  navPill.classList.toggle('instant', !navPlaced);
  navPill.style.setProperty('--px', navLinks[cur].offsetLeft + 'px');
  navPill.style.setProperty('--pw', navLinks[cur].offsetWidth + 'px');
  if (!navPlaced) { navPlaced = true; requestAnimationFrame(() => navPill.classList.remove('instant')); }
}
if (topbar && work && sunsetArt) {
  const queueNav = () => { if (!navQueued) { navQueued = true; requestAnimationFrame(toneNav); } };
  addEventListener('scroll', queueNav, { passive: true });
  addEventListener('resize', queueNav);
  toneNav();
}
