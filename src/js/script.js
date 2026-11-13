const BEHANCE_URL = 'https://www.behance.net/nikasaracuta';
document.querySelectorAll('[data-behance]').forEach(a => { if (BEHANCE_URL) a.href = BEHANCE_URL; else a.removeAttribute('target'); });
const stage = document.querySelector('.stage');
const DESIGN_WIDTH = 1440;

const PHONE_WIDTH = 430;
const MOBILE = matchMedia('(max-width: 760px), (max-width: 1100px) and (orientation: portrait), (max-height: 500px)');

let K = 1;
function fit() {
  const w = document.documentElement.clientWidth;
  K = MOBILE.matches ? Math.max(1, Math.min(w / PHONE_WIDTH, 1 + (innerHeight - 390) / 330)) : w / DESIGN_WIDTH;
  document.documentElement.style.setProperty('--k', K.toFixed(4));
  stage.style.setProperty('--mz', (w / 840).toFixed(4));
  placeFooter();
}

const contact = document.getElementById('contact');
function placeFooter() {
  if (!contact) return;
  const shift = MOBILE.matches ? 0 : Math.max(0, Math.min(150, 866 - innerHeight / K));
  contact.style.top = MOBILE.matches ? '' : `${(5244 + shift) * K}px`;
}

const siteNav = document.getElementById('site-nav');

const heroTitle = document.querySelector('.ttl-portfolio');
function fitHero() {
  if (!heroTitle) return;
  heroTitle.style.removeProperty('--fit');
  if (MOBILE.matches) return;
  const room = (DESIGN_WIDTH - 45 - 20) * K, w = heroTitle.scrollWidth;
  if (w > room) heroTitle.style.setProperty('--fit', (room / w).toFixed(3));
}
fit();
fitHero();
window.addEventListener('resize', () => { fit(); fitHero(); });
if (document.fonts) document.fonts.ready.then(fitHero);

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
    const card = e.target.closest('#workList .work-card');
    sparkle.classList.toggle('sparkle--view', !!card);
    sparkle.classList.toggle('big', !card && !!e.target.closest(CLICKABLE));
    if (!raf) raf = requestAnimationFrame(move);
  }, { passive: true });
  document.addEventListener('pointerleave', () => sparkle.classList.remove('show'));
  addEventListener('blur', () => sparkle.classList.remove('show'));
  addEventListener('pointerdown', () => sparkle.classList.add('press'));
  addEventListener('pointerup', () => sparkle.classList.remove('press'));
}

const about = document.getElementById('about');
const puff = document.getElementById('skyPuff');
const cloudsL = document.getElementById('cloudsL'), cloudsR = document.getElementById('cloudsR'), fog = document.getElementById('pinFog'), qmark = document.querySelector('#about .qbtn');
const PIN_TOP = 459, PIN_BOTTOM = 1720, HOLD = 380;
const LEAD = 150;
const PUFF_CX = 631.4 + 763 / 2;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const ramp = (t, a, b) => { const x = Math.max(0, Math.min(1, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
let skyQueued = false;
function moveSky() {
  skyQueued = false;
  const z = K, vh = innerHeight / z;
  stage.style.setProperty('--pin-top', ((vh - (PIN_BOTTOM - PIN_TOP)) * z).toFixed(1) + 'px');
  if (MOBILE.matches) {
    for (const el of [about, puff]) { el.style.transform = el.style.opacity = el.style.visibility = ''; }
    about.style.setProperty('--sink', reduceMotion.matches ? 0 : ramp(scrollY / (innerHeight * .7), 0, 1).toFixed(3));
    const open = ramp((innerHeight * .5 - cloudsL.getBoundingClientRect().top) / (innerHeight * .45), 0, 1);
    const dx = reduceMotion.matches ? 0 : stage.offsetWidth * .55 * open;
    cloudsL.style.transform = dx ? `translateX(${-dx.toFixed(1)}px)` : '';
    cloudsR.style.transform = dx ? `translateX(${-dx.toFixed(1)}px)` : '';
    cloudsL.style.opacity = cloudsR.style.opacity = open ? (1 - open).toFixed(3) : '';
    return;
  }
  const t = Math.max(0, Math.min(1, (-stage.getBoundingClientRect().top / z - (PIN_BOTTOM - vh - LEAD)) / (HOLD + LEAD)));
  const fade = ramp(t, .3, .58), part = ramp(t, .3, .65), glide = ramp(t, .35, .7), sink = ramp(t, .62, 1);
  about.style.opacity = fade ? (1 - fade).toFixed(3) : '';
  about.style.transform = !reduceMotion.matches && t ? `translateY(${(-260 * ramp(t, 0, .58) * z).toFixed(1)}px)` : '';
  about.style.visibility = fade >= 1 ? 'hidden' : '';
  if (qmark) qmark.style.opacity = t > .2 ? (1 - ramp(t, .2, .34)).toFixed(3) : '';
  const move = !reduceMotion.matches;
  const cx = 420 * part * z, cy = -200 * part * z;
  cloudsL.style.transform = move && part ? `translate(${-cx}px, ${cy}px)` : '';
  cloudsR.style.transform = move && part ? `translate(${cx}px, ${cy}px)` : '';
  cloudsL.style.opacity = cloudsR.style.opacity = part ? (1 - part).toFixed(3) : '';
  const g = move ? glide : 0, dy = 180 * g + (move ? 500 * sink : 0);
  puff.style.transform = g ? `translate(${((720 - PUFF_CX) * g * z).toFixed(1)}px, ${(dy * z).toFixed(1)}px) scale(${(1 - .2 * g).toFixed(3)})` : '';
  const gone = move ? dy / 680 : ramp(t, .85, 1);
  puff.style.opacity = gone ? (1 - gone).toFixed(3) : '';
  if (fog) {
    const end = (PIN_BOTTOM - PIN_TOP) - vh * 1.05, k = ramp(t, .42, 1);
    fog.style.transform = `translateY(${((1500 - (1500 - end) * k) * z).toFixed(1)}px)`;
  }
}
if (about && puff && cloudsL && cloudsR) {
  const queueSky = () => { if (!skyQueued) { skyQueued = true; requestAnimationFrame(moveSky); } };
  addEventListener('scroll', queueSky, { passive: true });
  addEventListener('resize', queueSky);
  moveSky();
}

const intro = document.querySelector('.t-intro');
if (intro) {
  const walker = document.createTreeWalker(intro, NodeFilter.SHOW_TEXT), texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  for (const node of texts) {
    const frag = document.createDocumentFragment();
    for (const part of node.textContent.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) { frag.append(part); continue; }
      const word = document.createElement('span');
      word.className = 't-intro__word';
      word.textContent = part;
      frag.append(word);
    }
    node.replaceWith(frag);
  }
}

const fishSwimmer = document.getElementById('fishSwimmer');
const ocean = fishSwimmer && fishSwimmer.closest('.ocean'), coral = document.querySelector('.stage > .coral');
const coralHome = coral && coral.nextElementSibling;
function placeOcean() {
  if (!ocean || !coral || !contact) return;
  if (MOBILE.matches && ocean.parentElement !== contact) contact.append(ocean, coral);
  else if (!MOBILE.matches && ocean.parentElement === contact) { stage.insertBefore(coral, coralHome); stage.insertBefore(ocean, coral); }
}
placeOcean();
MOBILE.addEventListener('change', placeOcean);
if (fishSwimmer) {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let START = -380, END = 1500, SLOW = 70, FAST = 620;
  const sizeSea = () => { [START, END, SLOW, FAST] = MOBILE.matches ? [-160, stage.offsetWidth / K + 30, 38, 340] : [-380, 1500, 70, 620]; };
  sizeSea(); addEventListener('resize', sizeSea);
  let x = 420, y = 0, vy = 0, speed = SLOW, last = performance.now(), px = -1e4, py = -1e4;
  addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
  addEventListener('pointerleave', () => { px = py = -1e4; });
  function swim(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const r = fishSwimmer.getBoundingClientRect();
    if (r.bottom > -100 && r.top < innerHeight + 100 && !calm) {
      const z = K;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const d = Math.hypot(px - cx, py - cy) / z;
      const scared = d < (MOBILE.matches ? 120 : 260);
      speed += ((scared ? FAST : SLOW) - speed) * Math.min(1, dt * (scared ? 6 : 1.2));
      const dodge = MOBILE.matches ? 30 : 90;
      vy += ((scared ? (cy > py ? dodge : -dodge) : 0) - y) * dt * 2.5 - vy * dt * 3;
      y += vy * dt;
      x += speed * dt;
      if (x > END) { x = START; y = vy = 0; }
      fishSwimmer.style.setProperty('--fx', `${(x * z).toFixed(1)}px`);
      fishSwimmer.style.setProperty('--fy', `${(y * z).toFixed(1)}px`);
      const beat = speed > 300 ? '.22s' : '.7s';
      if (beat !== fishSwimmer.dataset.beat) { fishSwimmer.dataset.beat = beat; fishSwimmer.style.setProperty('--beat', beat); }
    }
    requestAnimationFrame(swim);
  }
  if (calm) fishSwimmer.style.setProperty('--fx', (MOBILE.matches ? 40 : 560) * K + 'px');
  requestAnimationFrame(swim);
}

const sunsetArt = document.querySelector('.sunset-art');

const work = document.getElementById('work');
const navLinks = siteNav ? [...siteNav.querySelectorAll('.site-nav__links > a')] : [];
const navSections = [about, work, sunsetArt];
let navQueued = false;
function toneNav() {
  navQueued = false;
  const r = siteNav.getBoundingClientRect(), y = r.top + r.height / 2;
  const art = sunsetArt.getBoundingClientRect();
  const lead = (MOBILE.matches ? -40 : 420) * K;
  siteNav.classList.toggle('site-nav--light', work.getBoundingClientRect().top - lead <= y && art.top + art.height * .64 > y);
  let cur = -1;
  navSections.forEach((el, i) => { if (el && el.getBoundingClientRect().top <= innerHeight * .4) cur = i; });
  navLinks.forEach((a, i) => i === cur ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
}
if (siteNav && work && sunsetArt) {
  const queueNav = () => { if (!navQueued) { navQueued = true; requestAnimationFrame(toneNav); } };
  addEventListener('scroll', queueNav, { passive: true });
  addEventListener('resize', queueNav);
  toneNav();
}

const burger = document.getElementById('navBurger');
if (siteNav && burger) {
  const setMenu = (open) => {
    siteNav.classList.toggle('site-nav--open', open);
    document.documentElement.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close the menu' : 'Open the menu');
  };
  burger.addEventListener('click', () => setMenu(!siteNav.classList.contains('site-nav--open')));
  siteNav.querySelectorAll('.site-nav__links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && siteNav.classList.contains('site-nav--open')) { setMenu(false); burger.focus(); } });
  MOBILE.addEventListener('change', () => setMenu(false));
}


const deskNote = document.getElementById('deskNote');
if (deskNote && MOBILE.matches) {
  let seen = false;
  try { seen = !!sessionStorage.getItem('deskNoteSeen'); } catch (e) { }
  if (!seen) {
    let shown = false;
    const show = () => {
      if (shown) return; shown = true;
      deskNote.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => deskNote.classList.add('show')));
    };
    const hide = () => {
      deskNote.classList.remove('show');
      try { sessionStorage.setItem('deskNoteSeen', '1'); } catch (e) { }
      setTimeout(() => { deskNote.hidden = true; }, 500);
    };
    addEventListener('site:loaded', () => setTimeout(show, 900));
    setTimeout(show, 4500);
    document.getElementById('deskNoteClose').addEventListener('click', hide);
  }
}
