(() => {
  const root = document.documentElement;

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
})();
