// The journey from sky to sea. Smooth scrolling (Lenis) drives GSAP's
// ScrollTrigger: the sky drifts, the introduction lights up word by word, the
// work gallery scrolls sideways, the sun rises behind the leaves.
// Phones get the same page without pinning; reduced motion gets it still.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ok = !!(window.gsap && window.ScrollTrigger);

  // Behance profile: the ring around the sun and the Behance button link here.
  // TODO: paste the profile URL, e.g. 'https://www.behance.net/yourname'.
  const BEHANCE_URL = '';
  $$('[data-behance]').forEach(a => { if (BEHANCE_URL) a.href = BEHANCE_URL; else a.removeAttribute('target'); });

  // local time in Antwerp, top right
  const clock = $('#clock');
  const tick = () => { clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Brussels' }).format(new Date()); };
  tick(); setInterval(tick, 15000);

  // the introduction, split into words so they can light up one by one
  const manifesto = $('#manifesto');
  manifesto.innerHTML = manifesto.innerHTML.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');

  if (!ok) { document.documentElement.classList.add('no-motion'); return; }
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
    if (id === '#work' && a.classList.contains('project')) return;   // panels open their sheet
    const el = id === '#top' ? 0 : $(id);
    if (el === null) return;
    e.preventDefault(); goTo(el);
  }));
  // pause the smooth scrolling while the project sheet or the About pop-up is open
  const pauseFor = el => new MutationObserver(() => { if (!lenis) return; el.hidden ? lenis.start() : lenis.stop(); }).observe(el, { attributes: true, attributeFilter: ['hidden'] });
  pauseFor($('#sheet')); pauseFor($('#aboutPop'));

  /* ───── Intro: after the loading screen ───── */
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .from('.hero-title img', { yPercent: 105, duration: 1.8 })
    .from('.hero-meta .mask > span', { yPercent: 110, duration: 1.2, stagger: .08 }, '-=1.3')
    .from('.hero-cue i', { scaleY: 0, duration: 1 }, '-=.8')
    .from('.bar', { y: -30, opacity: 0, duration: 1.2 }, '-=1.2');
  const start = () => { intro.play(); lenis && lenis.start(); };
  if (document.documentElement.classList.contains('is-loading')) addEventListener('site:loaded', start, { once: true });
  else start();

  const mm = gsap.matchMedia();

  // the bird belongs to the sky: it leaves before the gallery
  gsap.to('.bird', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.work', start: 'top bottom', end: 'top 30%', scrub: true } });

  /* ───── Desktop & tablet, with motion ───── */
  mm.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
    // the title floats away slower than the page, the bird crosses the sky
    gsap.to('.hero-title', { yPercent: -60, scale: 1.08, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-meta', { yPercent: -120, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true } });
    gsap.fromTo('.bird', { x: '-5vw', y: '0vh' }, { x: '55vw', y: '-30vh', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', endTrigger: '.about', end: 'bottom top', scrub: 1.5 } });

    // the introduction: pinned, words light up as you scroll
    const words = $$('.manifesto .w');
    gsap.timeline({ scrollTrigger: { trigger: '.about', start: 'top top', end: '+=140%', pin: true, scrub: .6 } })
      .to(words, { opacity: 1, stagger: .1, ease: 'none' })
      .from('.about-actions', { y: 30, opacity: 0, duration: 1.5 }, '-=1')
      .to({}, { duration: 1.5 });
    gsap.from('.qbtn', { scale: .4, opacity: 0, rotate: -30, duration: 1.4, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.about', start: 'top 70%' } });

    // work: the gallery scrolls sideways; the chameleon follows the project in view
    const track = $('#workTrack');
    const distance = () => Math.max(0, track.scrollWidth - innerWidth);
    gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: '.work-pin', start: 'top top', end: () => '+=' + distance(), pin: true, scrub: .8, invalidateOnRefresh: true,
        onUpdate: self => window.Work && Work.setActive(Math.round(self.progress * (Work.count - 1)))
      }
    });
    gsap.from('.work-title', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.work', start: 'top 75%' } });

    // sunset: held while the sun rises (sky.js); the title and the Behance ring arrive
    gsap.timeline({ scrollTrigger: { trigger: '.sunset-pin', start: 'top top', end: '+=110%', pin: true, scrub: .8 } })
      .from('.sunset-title', { yPercent: 60, opacity: 0, ease: 'power2.out', duration: .5 }, 0)
      .from('.badge', { scale: .6, opacity: 0, rotate: -40, ease: 'power3.out', duration: .7 }, .2)
      .to({}, { duration: .8 });

    // the sea: the headline rises in
    gsap.from('.contact-title', { yPercent: 30, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 65%' } });
    gsap.from('.contact-inner > :not(.contact-title)', { y: 30, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 55%' } });
  });

  /* ───── Phones, with motion: lighter touches, no pinning ───── */
  mm.add('(max-width: 760px) and (prefers-reduced-motion: no-preference)', () => {
    $$('.manifesto .w').forEach(w => { w.style.opacity = 1; });
    gsap.from('.badge', { scale: .6, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.sunset', start: 'top 80%', end: 'center center', scrub: .6 } });
  });

  /* ───── Reduced motion: everything in its resting place ───── */
  mm.add('(prefers-reduced-motion: reduce)', () => {});

  /* ───── Bar: dark type over the white parts, current section marked ───── */
  const bar = $('#bar'), links = $$('.bar-nav a');
  ScrollTrigger.create({ trigger: '.work', start: 'top 40px', endTrigger: '.sunset', end: 'bottom 40px', toggleClass: { targets: bar, className: 'on-light' } });
  [['.about', 0], ['.work', 1], ['.contact', 2]].forEach(([sel, i]) => ScrollTrigger.create({
    trigger: sel, start: 'top 45%', end: 'bottom 45%', onToggle: self => links[i].classList.toggle('current', self.isActive)
  }));

  // fonts and images change sizes: measure again once everything has loaded
  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());

  /* ───── Sparkle cursor (mouse / trackpad only) ───── */
  const sparkle = $('#sparkle');
  if (sparkle && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const CLICKABLE = 'a, button, [role="tab"], .tool, .qbtn';
    let x = -100, y = -100, sx = x, sy = y, raf = 0;
    document.documentElement.classList.add('sparkle-on');
    const move = () => {
      sx += (x - sx) * (reduce ? 1 : .3);
      sy += (y - sy) * (reduce ? 1 : .3);
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
