// Loading screen: counts up while the page's images load, reaches 100% on
// window load, then fades out and lets the scroll reveals start.
(() => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const num = document.getElementById('loaderNum');
  const root = document.documentElement;
  const imgs = [...document.images].filter((img) => img.loading !== 'lazy');
  const MIN_TIME = 900;                 // keep the logo up long enough to read
  const start = performance.now();
  let shown = 0, loaded = false;

  function finish() {
    root.classList.remove('is-loading');
    loader.classList.add('done');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    setTimeout(() => loader.remove(), 1500);      // in case transitionend never fires
    window.dispatchEvent(new Event('site:loaded'));
  }

  function tick(now) {
    const ready = imgs.filter((img) => img.complete).length;
    // images take the bar to 90%; the rest waits for fonts, CSS and scripts
    let target = loaded ? 100 : 90 * (imgs.length ? ready / imgs.length : 1);
    // never outrun the minimum display time
    target = Math.min(target, ((now - start) / MIN_TIME) * 100);
    shown += Math.max((target - shown) * 0.12, target > shown ? 0.4 : 0);
    shown = Math.min(shown, target);
    const n = Math.round(shown);
    num.textContent = n;
    loader.setAttribute('aria-valuenow', n);
    if (n >= 100) finish(); else requestAnimationFrame(tick);
  }

  window.addEventListener('load', () => { loaded = true; });
  setTimeout(() => { loaded = true; }, 8000);     // slow connection: don't hold the page forever
  requestAnimationFrame(tick);
})();
