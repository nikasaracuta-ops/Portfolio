// Night to day, cloud to sea. Smooth scrolling (Lenis) drives GSAP's
// ScrollTrigger: the clouds drift, text rises in, the leaves part around the
// sun as it rises behind the laptop. The bar switches between night and day.
// Reduced motion gets the page still.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ok = !!(window.gsap && window.ScrollTrigger);

  // Behance profile: the laptop and the Behance icon link here.
  // TODO: paste the profile URL, e.g. 'https://www.behance.net/yourname'.
  const BEHANCE_URL = '';
  $$('[data-behance]').forEach(a => { if (BEHANCE_URL) a.href = BEHANCE_URL; else a.removeAttribute('target'); });

  /* ───── Day / night ───── */
  const themeBtn = $('#theme'), themeMeta = $('meta[name="theme-color"]');
  const showTheme = () => {
    const day = root.dataset.theme === 'day';
    themeBtn.setAttribute('aria-pressed', day);
    themeBtn.setAttribute('aria-label', day ? 'Switch to night mode' : 'Switch to day mode');
    $('.theme-txt', themeBtn).textContent = day ? 'Day' : 'Night';
    themeMeta.content = day ? '#f6f6f6' : '#000000';
  };
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'day' ? 'night' : 'day';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    showTheme();
  });
  showTheme();

  if (!ok) return;
  gsap.registerPlugin(ScrollTrigger);

  /* ───── Smooth scrolling ───── */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: .085, wheelMultiplier: .9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();   // until the loading screen has gone
  }
  const goTo = target => lenis ? lenis.scrollTo(target, { duration: 1.6 })
    : typeof target === 'number' ? window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' })
    : target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  $$('a[href^="#"]:not([data-about])').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (a.classList.contains('project') || a.hasAttribute('data-behance')) return;   // cards open their sheet
    const el = id === '#top' ? 0 : $(id);
    if (el === null) return;
    e.preventDefault(); goTo(el);
  }));
  // pause the smooth scrolling while the project sheet or the About pop-up is open
  const pauseFor = el => new MutationObserver(() => { if (!lenis) return; el.hidden ? lenis.start() : lenis.stop(); }).observe(el, { attributes: true, attributeFilter: ['hidden'] });
  pauseFor($('#sheet')); pauseFor($('#aboutPop'));

  /* ───── Bar: the section in view is marked ───── */
  const links = $$('.bar-nav a');
  [['.hero', 0], ['.hello', 1], ['.work', 2], ['.contact', 3]].forEach(([sel, i]) => ScrollTrigger.create({
    trigger: sel, start: 'top 45%', end: 'bottom 45%', onToggle: self => self.isActive && links.forEach((l, n) => l.classList.toggle('current', n === i))
  }));

  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());

  if (reduce) return;

  /* ───── Intro: after the loading screen ───── */
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .from('.hero-title .mask > span', { yPercent: 105, duration: 1.8 })
    .from('.hero-meta .mask > span', { yPercent: 110, duration: 1.2, stagger: .08 }, '-=1.3')
    .from('.cloud', { opacity: 0, x: (i) => i ? 120 : -120, duration: 2.4, ease: 'power2.out' }, '-=1.6')
    .from('.bar', { y: -30, opacity: 0, duration: 1.2 }, '-=2');
  const start = () => { intro.play(); lenis && lenis.start(); };
  if (root.classList.contains('is-loading')) addEventListener('site:loaded', start, { once: true });
  else start();

  /* ───── Hero: the clouds drift, the bird crosses ───── */
  gsap.to('.c1', { xPercent: -8, yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.c2', { xPercent: 10, yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-title', { yPercent: -30, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.fromTo('.bird', { x: 0, y: 0 }, { x: '70vw', y: '-25vh', rotate: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });

  /* ───── Text rises in ───── */
  $$('[data-reveal]').forEach(el => gsap.from(el, {
    y: 40, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' }
  }));
  gsap.from('.puff', { scale: .7, opacity: 0, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: '.hello', start: 'top 70%' } });
  gsap.from('.qbtn', { scale: .4, opacity: 0, rotate: -30, duration: 1.4, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.hello', start: 'top 55%' } });
  gsap.from('.project', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.work-list', start: 'top 85%' } });

  /* ───── Horizon: the leaves part, the sun rises, the laptop lands ───── */
  gsap.timeline({ scrollTrigger: { trigger: '.scene', start: 'top 85%', end: 'bottom bottom', scrub: 1 } })
    .from('.sun', { yPercent: 55, scale: .8, ease: 'none' }, 0)
    .fromTo('.leaf-l', { x: '14vw', rotate: 20 }, { x: 0, rotate: 0, ease: 'none' }, 0)
    .fromTo('.leaf-r', { x: '-14vw', rotate: -20 }, { x: 0, rotate: 0, ease: 'none' }, 0)
    .from('.laptop', { yPercent: 40, opacity: 0, ease: 'none' }, .3);

  /* ───── Contact: the fish swims across ───── */
  gsap.fromTo('.fish', { x: '-10vw' }, { x: '30vw', ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });

  /* ───── Sparkle cursor (mouse / trackpad only) ───── */
  const sparkle = $('#sparkle');
  if (sparkle && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const CLICKABLE = 'a, button, [role="tab"], .tool, .qbtn';
    let x = -100, y = -100, sx = x, sy = y, raf = 0;
    root.classList.add('sparkle-on');
    const move = () => {
      sx += (x - sx) * .3;
      sy += (y - sy) * .3;
      sparkle.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
      raf = Math.abs(x - sx) + Math.abs(y - sy) > .2 ? requestAnimationFrame(move) : 0;
    };
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      if (!sparkle.classList.contains('show')) { sx = x; sy = y; sparkle.classList.add('show'); }
      const view = !!e.target.closest('[data-cursor="view"]');
      sparkle.classList.toggle('view', view);
      sparkle.classList.toggle('big', !view && !!e.target.closest(CLICKABLE));
      if (!raf) raf = requestAnimationFrame(move);
    }, { passive: true });
    document.addEventListener('pointerleave', () => sparkle.classList.remove('show'));
    addEventListener('blur', () => sparkle.classList.remove('show'));
    addEventListener('pointerdown', () => sparkle.classList.add('press'));
    addEventListener('pointerup', () => sparkle.classList.remove('press'));
  }
})();
