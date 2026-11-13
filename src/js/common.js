(() => {
  const root = document.documentElement;

  const scaleUp = () => root.style.setProperty('--kb', Math.max(1, innerWidth / 1440).toFixed(4));
  scaleUp();
  addEventListener('resize', scaleUp);

  addEventListener('pointerdown', () => root.classList.add('pointer-nav'), true);
  addEventListener('keydown', (e) => { if (e.key === 'Tab') root.classList.remove('pointer-nav'); }, true);

  const pending = new Set(document.querySelectorAll('.reveal'));
  let queued = false;

  function reveal(el) {
    pending.delete(el);
    el.classList.add('in');
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
    setTimeout(() => el.classList.remove('reveal', 'in'), (delay + 1.2) * 1000);
  }

  function check() {
    queued = false;
    if (root.classList.contains('is-loading')) return;
    const line = innerHeight * 0.88;
    const atBottom = scrollY + innerHeight >= root.scrollHeight - 2;
    for (const el of pending) if (atBottom || el.getBoundingClientRect().top < line) reveal(el);
  }

  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };
  addEventListener('site:loaded', queue);
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  queue();

  const DREAM = 800;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const centre = () => document.querySelectorAll('body > :not(script)').forEach((el) => {
    el.style.transformOrigin = `50% ${innerHeight / 2 - el.getBoundingClientRect().top}px`;
  });

  window.goTo = (url) => {
    if (calm) { location.href = url; return; }
    try { sessionStorage.setItem('dreamIn', '1'); } catch (e) { }
    centre();
    root.classList.add('dream-out');
    setTimeout(() => { location.href = url; }, DREAM);
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || a.target || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('.html') || url.pathname === location.pathname) return;
    e.preventDefault();
    window.goTo(a.href);
  });

  if (root.classList.contains('dream-in')) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = location.hash && document.querySelector(location.hash);
      if (target) target.scrollIntoView({ behavior: 'instant' });
      centre();
      root.classList.add('dream-entering');
      root.classList.remove('dream-in');
      setTimeout(() => root.classList.remove('dream-entering'), DREAM + 50);
    }));
  }

  addEventListener('pageshow', (e) => { if (e.persisted) root.classList.remove('dream-out', 'dream-in', 'dream-entering'); });
})();
