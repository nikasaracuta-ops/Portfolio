// Project pages: scroll reveals, reading progress, the light/dark styleboard
// switch, a lightbox for the boards, and a slight tilt of the browser windows.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Dior's iterations strip pans sideways while it scrolls through the screen
const pan = document.querySelector('.d-pan');
function panStrip() {
  const img = pan.querySelector('img'), r = pan.getBoundingClientRect();
  const t = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
  const over = Math.max(0, img.offsetWidth - pan.clientWidth);
  img.style.setProperty('--pan', `${(reduced ? -over / 2 : -over * t).toFixed(1)}px`);
}

// reveals: fade in once an element's top passes 88% of the screen
const pending = new Set(document.querySelectorAll('.reveal'));
const progress = document.getElementById('progress'), topBar = document.querySelector('.p-top');
function onScroll() {
  // at the very bottom nothing can scroll higher, so show whatever is left
  const max = document.documentElement.scrollHeight - innerHeight;
  const atBottom = scrollY >= max - 4;
  for (const el of pending) {
    if (atBottom || el.getBoundingClientRect().top < innerHeight * .88) { el.classList.add('in'); pending.delete(el); }
  }
  if (pan) panStrip();
  progress.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
  topBar.style.setProperty('--solid', scrollY > 20 ? 1 : 0);
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

// light / dark styleboard
const sw = document.querySelector('.p-switch');
if (sw) {
  const pill = sw.querySelector('.p-switch-pill'), tabs = [...sw.querySelectorAll('button')];
  const boards = document.querySelectorAll('.p-board img[data-board]');
  const current = () => tabs.find(t => t.getAttribute('aria-selected') === 'true');
  const place = btn => { pill.style.setProperty('--px', (btn.offsetLeft - 4) + 'px'); pill.style.setProperty('--pw', btn.offsetWidth + 'px'); };
  const pick = btn => {
    tabs.forEach(t => t.setAttribute('aria-selected', t === btn));
    boards.forEach(img => img.classList.toggle('on', img.dataset.board === btn.dataset.board));
    place(btn);
    sw.dispatchEvent(new CustomEvent('pick', { detail: btn.dataset.board }));
  };
  tabs.forEach(t => t.addEventListener('click', () => pick(t)));
  sw.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const i = tabs.indexOf(current());
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    next.focus(); pick(next);
  });
  place(tabs[0]);
  addEventListener('resize', () => place(current()));
  if (document.fonts) document.fonts.ready.then(() => place(current()));
}

// lightbox
const lb = document.getElementById('lightbox');
if (lb && lb.showModal) {
  const big = lb.querySelector('img');
  document.querySelectorAll('[data-zoom]').forEach(btn => btn.addEventListener('click', () => {
    const img = btn.querySelector('img.on'); big.src = img.src; big.alt = img.alt; lb.showModal();
  }));
  lb.querySelector('.p-lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
}

// browser windows lean slightly towards the pointer
if (!reduced && matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg'); el.style.setProperty('--rx', (-y * 4).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); });
  });
}

// Dior: the palette switches between the styleboard's colours and the final website's
const swatches = document.querySelectorAll('.d-swatches li');
if (sw && swatches.length) {
  swatches.forEach((li, k) => li.style.setProperty('--k', k));
  sw.addEventListener('pick', (e) => swatches.forEach((li) => {
    const c = li.dataset[e.detail];
    li.classList.toggle('off', !c);
    if (c) li.style.setProperty('--c', c);
  }));
}

// Dior: the result is a small carousel; it changes by itself and pauses under the pointer
const show = document.querySelector('.d-show');
if (show) {
  const shots = [...show.querySelectorAll('.d-shots img')], dots = [...show.querySelectorAll('.d-dots button')];
  let cur = 0, timer = null, hover = false;
  const go = (i) => {
    cur = (i + shots.length) % shots.length;
    shots.forEach((im, k) => im.classList.toggle('on', k === cur));
    dots.forEach((d, k) => d.setAttribute('aria-selected', k === cur));
  };
  const start = () => { clearInterval(timer); if (!reduced && !hover) timer = setInterval(() => go(cur + 1), 4500); };
  dots.forEach((d, k) => d.addEventListener('click', () => { go(k); start(); }));
  show.querySelector('.d-dots').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    go(cur + (e.key === 'ArrowRight' ? 1 : -1)); dots[cur].focus(); start();
  });
  show.addEventListener('pointerenter', () => { hover = true; clearInterval(timer); });
  show.addEventListener('pointerleave', () => { hover = false; start(); });
  start();
}
