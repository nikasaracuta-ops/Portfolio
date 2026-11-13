(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PHONE = matchMedia('(max-width: 760px), (max-width: 1100px) and (orientation: portrait)');
  const $ = s => document.querySelector(s);

  const PROJECTS = [
    { page: 'dior.html', name: 'Dior', tab: '#E770B2', bg: '#FB72BE', img: 'src/assets/projects/p-dior.webp' },
    { page: 'moea.html', name: 'Moea', tab: '#3EBDCD', bg: '#3BBDCC', img: 'src/assets/projects/p-moea.webp' },
    { page: 'type01.html', name: 'Type01', tab: '#E770B2', bg: '#6f9bd4', img: 'src/assets/projects/p-type01.webp' },
    { page: 'miles.html', name: 'Miles & Meals', tab: '#1A5BA4', bg: '#D5FF59', img: 'src/assets/projects/p-miles.webp' }
  ];

  const list = $('#workList'), workStage = $('.work__stage'), nowName = $('#nowName');
  const mouth = $('#mouth'), tongue = $('#tongue'), tip = $('#tongueTip');
  // the tongue is drawn on its own sticky layer, the twin of the chameleon's (same cell, same height),
  // above the projects; the chameleon's shape is cut out of it so it comes out of the mouth
  const layer = $('#workTongue'), chamBody = $('.cham-body'), chamCut = $('#tongueMaskCham');
  chamCut.setAttribute('d', chamBody.querySelector('path').getAttribute('d'));
  const syncLayer = () => { layer.style.height = workStage.offsetHeight + 'px'; };
  new ResizeObserver(syncLayer).observe(workStage);
  syncLayer();

  const tabSvg = i => `<svg class="work-card__svg" viewBox="0 0 742 497" fill="none" aria-hidden="true">
<path d="M0 13.7C0 6.13367 6.13368 0 13.7 0H727.344C734.91 0 741.044 6.13368 741.044 13.7V48.5726H0V13.7Z" fill="currentColor"/>
<mask id="tabM0-${i}" fill="white"><path d="M0 13.7C0 6.13367 6.13368 0 13.7 0H727.344C734.91 0 741.044 6.13368 741.044 13.7V48.5726H0V13.7Z"/></mask>
<path d="M741.044 48.5726V13.7C741.044 6.13368 734.91 0 727.344 0H13.7C6.13368 0 0 6.13367 0 13.7V48.5726H741.044Z" stroke-width="2.4909" stroke="currentColor" mask="url(#tabM0-${i})"/>
<rect x="31.6227" y="15.568" width="676.876" height="18.6818" fill="currentColor"/>
<rect x="31.6227" y="15.568" width="676.876" height="18.6818" stroke="currentColor" stroke-width="1.24545"/>
<circle cx="38.7144" cy="24.9089" r="6.46831" fill="#F28FFD"/>
<circle cx="60.8902" cy="24.9089" r="6.46831" fill="#FFEE00"/>
<circle cx="83.0699" cy="24.9089" r="6.46831" fill="#50F85E"/>
<rect x="119.426" y="11.8317" width="534.299" height="26.1545" rx="13.0772" fill="white"/>
<path d="M634.767 18.059C637.36 18.059 639.471 20.1708 639.476 22.7675L639.47 22.9906C639.419 24.0816 638.992 25.0695 638.32 25.8443L641.27 28.8534L641.275 28.8575V28.8582L641.24 28.8927L641.236 28.8967H641.235L641.27 28.9319L640.969 29.2287L640.93 29.268L640.891 29.2281L637.945 26.225C637.108 26.9968 635.992 27.4719 634.767 27.4719C632.17 27.4719 630.059 25.3643 630.059 22.7675C630.059 20.1707 632.175 18.059 634.767 18.059ZM634.767 18.5938C632.465 18.5939 630.593 20.4694 630.593 22.7675C630.593 25.0655 632.465 26.9371 634.767 26.9371C637.07 26.9371 638.941 25.0697 638.941 22.7675C638.941 20.4652 637.069 18.5938 634.767 18.5938Z" fill="#414141" stroke-width="0.692449" stroke="#D2D2D2"/>
<circle cx="705.709" cy="17.1111" r="2.16606" fill="white"/>
<circle cx="705.709" cy="24.909" r="2.16606" fill="white"/>
<circle cx="705.709" cy="32.7067" r="2.16606" fill="white"/>
<mask id="tabM1-${i}" fill="white"><path d="M0 48H741V477C741 488.046 732.046 497 721 497H20C8.95429 497 0 488.046 0 477V48Z"/></mask>
<path d="M0 48H741V477C741 488.046 732.046 497 721 497H20C8.95429 497 0 488.046 0 477V48Z" stroke-width="20" stroke="currentColor" mask="url(#tabM1-${i})"/>
</svg>`;

  const cards = PROJECTS.map((p, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.className = `work-card work-card--${p.page.replace('.html', '')}`; b.style.setProperty('--c', p.bg); b.style.setProperty('--tab', p.tab || '#E770B2');
    b.setAttribute('aria-label', `Open project ${i + 1}: ${p.name}`);
    b.innerHTML = `<span class="work-card__window"><span class="work-card__thumb"><img src="${p.img}" alt="" loading="lazy" decoding="async"></span>${tabSvg(i)}<span class="work-card__cta" aria-hidden="true"><svg class="work-card__ring" viewBox="0 0 120 120"><defs><path id="ctaRing${i}" d="M60 60m-42 0a42 42 0 1 1 84 0a42 42 0 1 1-84 0"/></defs><text><textPath href="#ctaRing${i}" textLength="262">VIEW PROJECT • VIEW PROJECT •</textPath></text></svg><svg class="work-card__arrow" viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></svg></span></span>`;
    b.addEventListener('click', () => window.goTo(p.page));
    b.addEventListener('mouseenter', () => activate(i));
    b.addEventListener('focus', () => activate(i));
    li.appendChild(b); list.appendChild(li);
    return b;
  });

  let target = -1, pending = -1, ext = 0, goal = 0, dotBtns = [];
  function activate(i) {
    if (i === pending || (i === target && pending < 0)) return;
    cards.forEach((c, j) => c.classList.toggle('work-card--active', j === i));
    dotBtns.forEach((d, j) => d.setAttribute('aria-current', j === i));
    if (target >= 0) cards[target].classList.remove('work-card--stuck');
    document.documentElement.style.setProperty('--cham', PROJECTS[i].tab);
    nowName.textContent = `Now viewing: ${PROJECTS[i].name}`;
    pending = i; goal = 0;
  }
  activate(0);

  const middleCard = () => {
    let best = -1, d = 1e9;
    const lr = list.getBoundingClientRect();
    cards.forEach((c, j) => {
      const r = c.getBoundingClientRect();
      const dd = PHONE.matches ? Math.abs(r.left + r.width / 2 - (lr.left + lr.width / 2)) : Math.abs(r.top + r.height / 2 - innerHeight / 2);
      if (dd < d) { d = dd; best = j; }
    });
    return best;
  };
  const io = new IntersectionObserver(entries => {
    if (PHONE.matches) return;
    entries.forEach(e => { if (e.isIntersecting) activate(cards.indexOf(e.target)); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  cards.forEach(c => io.observe(c));

  const dots = document.createElement('div');
  dots.className = 'work__dots';
  dots.innerHTML = PROJECTS.map(p => `<button type="button" aria-label="Show ${p.name}"></button>`).join('');
  list.after(dots);
  dotBtns = [...dots.children];
  dotBtns[Math.max(0, pending)].setAttribute('aria-current', true);
  dotBtns.forEach((d, i) => d.addEventListener('click', () => {
    const li = cards[i].parentElement;
    list.scrollTo({ left: li.offsetLeft - (list.clientWidth - li.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  }));
  let swipeQueued = false;
  const onSwipe = () => {
    swipeQueued = false;
    if (!PHONE.matches) return;
    const m = middleCard();
    if (m >= 0) activate(m);
  };
  list.addEventListener('scroll', () => { if (!swipeQueued) { swipeQueued = true; requestAnimationFrame(onSwipe); } }, { passive: true });

  const centre = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const hidden = () => workStage.classList.contains('reveal') && !workStage.classList.contains('in');

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (goal === 0 && ext <= 0 && pending >= 0) { target = pending; pending = -1; goal = 1; }
    if (target >= 0 && pending < 0) {
      const r = cards[target].getBoundingClientRect();
      const my = centre(mouth).y, th = cards[target].querySelector('.work-card__thumb').getBoundingClientRect();
      const level = PHONE.matches || (my > th.top + 20 && my < th.bottom - 20);
      goal = r.bottom > 0 && r.top < innerHeight && level && !hidden() && !cards[target].classList.contains('work-card--flying') ? 1 : 0;
    }
    if (reduce) ext = goal;
    else if (goal > ext) ext = Math.min(1, ext + dt / .2);
    else if (goal < ext) ext = Math.max(0, ext - dt / .12);

    if (target >= 0 && !PHONE.matches) {
      const lr = layer.getBoundingClientRect(), z = lr.width / parseFloat(getComputedStyle(layer).width);
      const local = (px, py) => ({ x: (px - lr.left) / z, y: (py - lr.top) / z });
      const mc = centre(mouth), r = cards[target].querySelector('.work-card__thumb').getBoundingClientRect();
      const m = local(mc.x, mc.y), t = local(clamp(mc.x, r.left + 28 * z, r.right - 28 * z), mc.y);
      const cb = chamBody.getBoundingClientRect(), o = local(cb.left, cb.top);
      chamCut.setAttribute('transform', `translate(${o.x} ${o.y}) scale(${cb.width / z / 361} ${cb.height / z / 308})`);
      const k = easeOut(ext), x = m.x + (t.x - m.x) * k, y = m.y + (t.y - m.y) * k;
      const dist = Math.hypot(x - m.x, y - m.y);
      tongue.setAttribute('d', dist > 2 ? `M${m.x},${m.y} L${x},${y}` : '');
      tongue.setAttribute('stroke-width', 5);
      tip.setAttribute('cx', x); tip.setAttribute('cy', y); tip.setAttribute('r', dist > 2 ? 13 : 0);
      cards[target].classList.toggle('work-card--stuck', ext >= 1);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  const laptop = $('#laptop'), screenLink = $('#screen'), art = $('.sunset-art');
  if (laptop && screenLink && art) {
    const LAST = PROJECTS[PROJECTS.length - 1];
    const last = cards[cards.length - 1];
    const S = 1;
    const O = { x: 381 + 376, y: 180 + 470 };
    const GLASS = { x: 29.55 - 376, y: 115.05 - 470, w: 449, rot: -10.57 };
    const HOVER = -70, REST = 0;
    const TEAL = [62, 189, 205], WHITE = [246, 250, 252];
    const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const mix = (a, b, t) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
    const smooth = t => t * t * (3 - 2 * t);
    const wave = (x, t) => 7 * Math.sin(x / 150 + t * 1.25) + 4 * Math.sin(x / 61 - t * .85);

    const screenTab = document.createElement('span');
    screenTab.className = 'work-card work-card--active work-card--laptop';
    screenTab.setAttribute('aria-hidden', 'true');
    screenTab.style.setProperty('--tab', `rgb(${TEAL})`); screenTab.style.setProperty('--c', `rgb(${TEAL})`);
    const lapSvg = tabSvg('lap').replace(/currentColor/g, 'url(#lapGrad)')
      .replace('<path', '<defs><linearGradient id="lapGrad" x1="0" y1="0" x2="0" y2="497" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3EBDCD"/><stop offset="1" stop-color="#1A5BA4"/></linearGradient></defs><path');
    screenTab.innerHTML = `<span class="work-card__window"><span class="work-card__thumb"></span>${lapSvg}</span>`;
    last.querySelector('.work-card__window').insertAdjacentHTML('beforeend', lapSvg.replace(/lapGrad/g, 'lapGrad2').replace('class="work-card__svg"', 'class="work-card__frame"').replace(/tabM(\d)-lap/g, 'tabM$1-lap2'));
    laptop.insertBefore(screenTab, screenLink);

    let y = HOVER, v = 0, tilt = 0, bob = 0, landed = false, lastT = performance.now();
    function glass() {
      const r = tilt * Math.PI / 180, gx = GLASS.x * S, gy = GLASS.y * S;
      return { x: O.x + gx * Math.cos(r) - gy * Math.sin(r), y: O.y + gx * Math.sin(r) + gy * Math.cos(r) + y + bob,
               rot: GLASS.rot + tilt, w: GLASS.w * S };
    }

    const drop = document.createElement('span');
    drop.className = 'work-card work-card--active work-card--flying work-card--drop'; drop.setAttribute('aria-hidden', 'true'); drop.hidden = true;
    $('#work').appendChild(drop);
    drop.addEventListener('click', () => { if (dropIdx >= 0) window.goTo(PROJECTS[dropIdx].page); });
    let dropIdx = -1;

    function flight() {
      const phone = PHONE.matches;
      if (phone && drop.hidden) dropIdx = Math.max(0, middleCard());
      const src = phone ? cards[dropIdx] : last, P = phone ? PROJECTS[dropIdx] : LAST;
      const home = src.parentElement;
      const z = home.getBoundingClientRect(), a = art.getBoundingClientRect(), k = a.width / 1440, g = glass();
      const from = z.top + z.height / 2 - innerHeight * .5;
      const to = a.top + (O.y + HOVER + GLASS.y * S + 120 * S) * k - innerHeight * .5;
      const p = reduce ? 0 : clamp(from / (from - to || 1), 0, 1);
      let fly = last;
      if (phone) {
        fly = drop;
        if (p > 0 && drop.hidden) {
          const w = $('#work').getBoundingClientRect();
          drop.innerHTML = src.querySelector('.work-card__window').outerHTML;
          if (!drop.querySelector('.work-card__frame')) drop.querySelector('.work-card__window').insertAdjacentHTML('beforeend', last.querySelector('.work-card__frame').outerHTML);
          drop.style.left = (z.left - w.left) + 'px'; drop.style.top = (z.top - w.top) + 'px'; drop.style.width = z.width + 'px';
          drop.hidden = false; src.style.visibility = 'hidden';
        }
        if (p <= 0 && !drop.hidden) { drop.hidden = true; src.style.visibility = ''; dropIdx = -1; }
      } else {
        last.classList.toggle('work-card--flying', p > 0);
        if (!drop.hidden) { drop.hidden = true; cards.forEach(c => { c.style.visibility = ''; }); dropIdx = -1; }
      }
      const img = fly.querySelector('.work-card__thumb img'), cta = fly.querySelector('.work-card__cta');
      if (p <= 0) {
        fly.style.transform = fly.style.opacity = ''; fly.style.setProperty('--deep', 0);
        fly.style.setProperty('--tab', P.tab); fly.style.setProperty('--c', P.bg);
        if (img) img.style.opacity = '';
        if (cta) cta.style.opacity = '';
      } else {
        const e = smooth(p), unit = z.width / (phone ? z.width : home.offsetWidth);
        const dx = (a.left + g.x * k - z.left) / unit, dy = (a.top + g.y * k - z.top) / unit;
        const sc = 1 + ((g.w * k) / z.width - 1) * e;
        const rot = g.rot * e + 5 * Math.sin(Math.PI * p);
        fly.style.transform = `translate(${dx * e}px, ${dy * e}px) rotate(${rot}deg) scale(${sc})`;
        if (img) img.style.opacity = 1 - clamp(p / .12, 0, 1);
        if (cta) cta.style.opacity = 1 - clamp(p / .06, 0, 1);
        const c = clamp((p - .2) / .6, 0, 1);
        fly.style.setProperty('--tab', mix(hex(P.tab), TEAL, c));
        fly.style.setProperty('--c', mix(WHITE, TEAL, c));
        fly.style.setProperty('--deep', c.toFixed(3));
        fly.style.opacity = 1 - clamp((p - .94) / .04, 0, 1);
      }
      screenTab.style.opacity = reduce ? 1 : clamp((p - .94) / .04, 0, 1);
      landed = p >= .98;
      screenLink.classList.toggle('off', !landed && !reduce);
    }

    function sea(now) {
      const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
      const t = now / 1000;
      const goal = landed || reduce ? REST : HOVER;
      v += ((goal - y) * 70 - v * 7) * dt; y += v * dt;
      const settle = clamp(1 - Math.abs(v) / 120, 0, 1);
      bob = landed || reduce ? wave(O.x, t) * settle : 0;
      tilt = landed || reduce ? (wave(O.x + 60, t) - wave(O.x - 60, t)) / 120 * 57.3 * .8 * settle : 0;
      laptop.style.transform = `translateY(${(y + bob).toFixed(2)}px) rotate(${tilt.toFixed(2)}deg) scale(${S})`;
    }

    function tick(now) {
      const a = art.getBoundingClientRect();
      if (a.bottom > -200 && a.top < innerHeight + 2000) sea(now); else lastT = now;
      flight();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
