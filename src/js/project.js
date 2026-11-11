const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const progress = document.getElementById('progress');
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

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

const lb = document.getElementById('lightbox');
if (lb && lb.showModal) {
  const big = lb.querySelector('img');
  document.querySelectorAll('[data-zoom]').forEach(btn => btn.addEventListener('click', () => {
    const img = btn.querySelector('img.on'); big.src = img.src; big.alt = img.alt; lb.showModal();
  }));
  lb.querySelector('.p-lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
}

if (!reduced && matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg'); el.style.setProperty('--rx', (-y * 4).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); });
  });
}

const swatches = document.querySelectorAll('.d-dots-pal li[data-a]');
if (sw && swatches.length) {
  swatches.forEach((li, k) => li.style.setProperty('--k', k));
  sw.addEventListener('pick', (e) => swatches.forEach((li) => {
    const c = li.dataset[e.detail];
    li.classList.toggle('off', !c);
    if (c) li.style.setProperty('--c', c);
  }));
}

document.querySelectorAll('.d-video').forEach((video) => {
  if (reduced) { video.controls = true; video.preload = 'metadata'; return; }
  new IntersectionObserver(([e]) => { if (e.isIntersecting) video.play().catch(() => {}); else video.pause(); }, { threshold: 0.25 }).observe(video);
});
