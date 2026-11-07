// Project pages: scroll reveals, reading progress, the light/dark styleboard
// switch, a lightbox for the boards, and a slight tilt of the browser windows.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
const swatches = document.querySelectorAll('.d-swatches li, .d-squares li[data-a]');
if (sw && swatches.length) {
  swatches.forEach((li, k) => li.style.setProperty('--k', k));
  sw.addEventListener('pick', (e) => swatches.forEach((li) => {
    const c = li.dataset[e.detail];
    li.classList.toggle('off', !c);
    if (c) li.style.setProperty('--c', c);
  }));
}

// Dior: the live prototype loads in the browser window once the section comes near;
// visitors scroll it themselves.
const live = document.querySelector('.d-live');
if (live) {
  const load = () => {
    if (live.querySelector('iframe')) return;
    const f = document.createElement('iframe');
    f.src = live.dataset.src; f.title = 'The live Dior story'; f.loading = 'lazy';
    live.append(f);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { load(); io.disconnect(); } }, { rootMargin: '600px 0px' });
    io.observe(live);
  } else load();
}

// Back to the homepage: clouds drift in and cover the page, then it opens on the
// homepage, where they part again (index.html, loader.js)
document.querySelectorAll('a[href^="index.html"]').forEach((a) => a.addEventListener('click', (e) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  try { sessionStorage.setItem('cloudIn', '1'); } catch (err) { return; }
  if (reduced) return;
  e.preventDefault();
  const veil = document.createElement('div');
  veil.className = 'cloud-veil closing';
  veil.setAttribute('aria-hidden', 'true');
  veil.innerHTML = '<i class="cv cv1"></i><i class="cv cv2"></i><i class="cv cv3"></i><i class="cv cv4"></i><i class="cv cv5"></i>';
  document.body.appendChild(veil);
  requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add('shut')));
  setTimeout(() => { location.href = a.href; }, 750);
}));

// Focus rings only for keyboard users: a click or tap leaves no outline behind (styles.css)
addEventListener('pointerdown', () => document.documentElement.classList.add('pointer-nav'), true);
addEventListener('keydown', (e) => { if (e.key === 'Tab') document.documentElement.classList.remove('pointer-nav'); }, true);
