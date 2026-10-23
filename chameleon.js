// One chameleon, four projects (ported from the work-page artifact).
// The chameleon stays put while the project list scrolls past; it catches the
// project in the middle of the screen with its tongue and takes on its colour.
// Click a project to open its sheet.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);

  /* ───── Projects: edit here ───── */
  // To add a project, copy one block. 'tab' is the colour of the browser tab
  // around the preview, and of the chameleon while that project is in focus;
  // 'hex' colours the project sheet, 'tint' (optional) the placeholder when there
  // is no 'img' (the card then says "Coming soon").
  const PROJECTS = [
    {
      id: 'dior', name: 'Dior', hex: '#FB72BE', tab: '#E770B2', kind: 'UI · UX · Web design', img: 'assets/projects/p-dior.webp',
      title: 'The Art of Dressmaking', tagline: 'by Christian Dior — an interactive longread for MoMu',
      tags: ['UI', 'UX', 'Web-design', 'Web-development'],
      brief: [
        'MoMu, the Fashion Museum of Antwerp, launched its new digital marketing plan with a series of interactive online stories — a way to spark curiosity, teach something before the visit, and reach people who don’t have the museum on their list yet.',
        'My task: take a static designer story and turn it into an immersive, interactive experience that stays true to MoMu’s identity. I chose Christian Dior and the craft of dressmaking.'
      ],
      facts: [['Client', 'MoMu – Fashion Museum Antwerp'], ['Kick-off', 'Briefing 5 January · museum visit 6 January'], ['Scope', 'Research, visual design, front-end development'], ['Role', 'Solo — design & build']],
      process: [['Styleboard', 'Archive photography, couture sketches and a soft, powdery palette to set the tone of the story.'], ['Iterations', 'From a wall of wireframes to a scroll-driven prototype, chapter by chapter.']],
      result: 'A responsive, mobile-first long-scroll story, animated with GSAP & ScrollTrigger and deployed online.',
      art: ['The Art of Dressmaking by Christian Dior', 'MoMu · interactive story'],
      link: 'https://nikasaracuta.github.io/Integration-3/'
    },
    {
      id: 'type01', name: 'Type01', hex: '#1A5BA4', tab: '#E770B2', tint: '#6f9bd4', kind: 'UI · UX · Web design', img: 'assets/projects/p-type01.webp',
      title: 'TYPE01 Conference', tagline: 'Typography in print, motion design and branding',
      tags: ['UI', 'UX', 'Web-design'],
      brief: [
        'TYPE01 Magazine, a bi-annual publication for graphic designers and typographers, was hosting its first-ever conference: two days in London on typography in print, motion design and branding.',
        'Day one offers workshops; day two brings seven speakers and ends with a conference dinner. My task was to design a responsive conference website for desktop and mobile that fits TYPE01’s identity but takes a bolder approach.'
      ],
      facts: [['Client', 'TYPE01 Magazine'], ['Where', 'London · two-day conference'], ['Deliverable', 'Responsive website, desktop + mobile']],
      process: [['Styleboard', 'Two directions — a loud pink-and-green editorial grid and a dark, poster-like variant.'], ['Iterations', 'Programme, speakers and ticket flows tested across breakpoints until the type could carry the page.']],
      result: 'A bold, type-led prototype for the TYPE01 conference — typography in print, motion design and branding, all on one stage.',
      art: ['TYPE01 MAGAZINE', 'Conference prototype'],
      link: 'https://www.figma.com/proto/PsD6Cg8ngFq6yRWCCm5I9q/Type01?page-id=0%3A1&node-id=468-7480&viewport=-2609%2C-2191%2C0.15&t=KQAR1eAcC8Ls4MeP-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=580%3A48961'
    },
    {
      id: 'moea', name: 'Moea', hex: '#3BBDCC', tab: '#3EBDCD', kind: 'UI · UX · Web design', img: 'assets/projects/p-moea.webp',
      title: 'MOEA', tagline: 'Moea stands for Mother Earth — case study in progress',
      tags: ['UI', 'UX', 'Web-design'],
      brief: ['This chameleon is still changing colour. The full Moea case study — brief, styleboard and iterations — lands here soon.'],
      facts: [['Status', 'Case study in progress']],
      process: [['Styleboard', 'Coming soon.'], ['Iterations', 'Coming soon.']],
      result: 'Final designs will be published here once the case study is ready.',
      art: ['MOEA stands for Mother Earth', 'Coming soon'],
      link: ''   // paste the live URL here when it's ready
    },
    {
      id: 'miles', name: 'Miles & Meals', hex: '#D5FF59', tab: '#1A5BA4', kind: 'App · Demo', img: 'assets/projects/p-miles.webp',
      title: 'Miles & Meals', tagline: 'Discover the world in your kitchen',
      tags: ['UI', 'UX', 'App-design'],
      brief: ['An app that brings iconic local dishes and street food from cities around the world straight to your kitchen — so you can travel by recipe.'],
      facts: [['Type', 'Mobile app'], ['Deliverables', 'Brandboard, social media, app screens']],
      process: [['Brandboard', 'Brand photography and a social-media look built around bright, appetising food shots.'], ['Iterations', 'From onboarding to recipe screens, refined into a navy-and-coral app with yellow accents.']],
      result: 'An app prototype that invites you to “Discover the world in your kitchen”.',
      art: ['Discover the world in your kitchen', 'App prototype'],
      link: 'https://www.figma.com/proto/JhFdOzlcgGCV38btM2Tumv/Miles---Meals?page-id=6817%3A1887&node-id=59585-34744&viewport=-13885%2C-407%2C0.32&t=BZlwAt149MrtAhmE-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=59585%3A34763&show-proto-sidebar=1'
    }
  ];

  const page = $('.stage');
  const list = $('#workList'), workStage = $('.work-stage'), nowName = $('#nowName');
  const mouth = $('#mouth'), tongue = $('#tongue'), tip = $('#tongueTip');
  // the tongue layer cuts out the chameleon's shape, so the tongue starts behind it
  const chamBody = $('.cham-body'), chamCut = $('#tongueMaskCham');
  chamCut.setAttribute('d', chamBody.querySelector('path').getAttribute('d'));

  // one card per project
  // tab.svg from Figma, unchanged except that its pink (#E770B2) is currentColor
  const tabSvg = i => `<svg class="win-svg" viewBox="0 0 742 497" fill="none" aria-hidden="true">
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
    b.className = 'wcard'; b.style.setProperty('--c', p.tint || p.hex); b.style.setProperty('--tab', p.tab || '#E770B2');
    b.setAttribute('aria-label', `Open project ${i + 1}: ${p.name}`);
    // the preview sits in the browser-window tab from Figma (tab.svg), its pink swapped for the project's colour
    b.innerHTML = `<span class="win"><span class="thumb">${p.img ? `<img src="${p.img}" alt="" loading="lazy" decoding="async">` : 'Coming soon'}</span>${tabSvg(i)}</span>`;
    b.addEventListener('click', () => openProject(i, b));
    b.addEventListener('mouseenter', () => activate(i));
    b.addEventListener('focus', () => activate(i));
    li.appendChild(b); list.appendChild(li);
    return b;
  });

  // switching project: pull the tongue back first, then shoot it at the new one
  let target = -1, pending = -1, ext = 0, goal = 0;
  function activate(i) {
    if (i === pending || (i === target && pending < 0)) return;
    cards.forEach((c, j) => c.classList.toggle('active', j === i));
    if (target >= 0) cards[target].classList.remove('stuck');
    // the chameleon, its branch and tongue take the colour of the project's tab
    document.documentElement.style.setProperty('--cham', PROJECTS[i].tab);
    nowName.textContent = `Now viewing: ${PROJECTS[i].name}`;
    pending = i; goal = 0;
  }
  activate(0);

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) activate(cards.indexOf(e.target)); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  cards.forEach(c => io.observe(c));

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
      // let go when the project leaves the screen (or before the chameleon has appeared)
      goal = r.bottom > 0 && r.top < innerHeight && !hidden() ? 1 : 0;
    }
    if (reduce) ext = goal;
    else if (goal > ext) ext = Math.min(1, ext + dt / .2);
    else if (goal < ext) ext = Math.max(0, ext - dt / .12);

    if (target >= 0) {
      const z = parseFloat(page.style.zoom) || 1;        // tongue thickness follows the page zoom
      const m = centre(mouth), r = cards[target].querySelector('.thumb').getBoundingClientRect();
      const t = { x: clamp(m.x, r.left + 28 * z, r.right - 28 * z), y: clamp(m.y, r.top + 28 * z, r.bottom - 28 * z) };
      const k = easeOut(ext), x = m.x + (t.x - m.x) * k, y = m.y + (t.y - m.y) * k;
      const dist = Math.hypot(x - m.x, y - m.y);
      const sag = ext >= 1 ? dist * .08 + Math.sin(now / 350) * 3 * z : 0;
      tongue.setAttribute('d', dist > 2 ? `M${m.x},${m.y} Q${(m.x + x) / 2},${(m.y + y) / 2 + sag} ${x},${y}` : '');
      const cb = chamBody.getBoundingClientRect();
      chamCut.setAttribute('transform', `translate(${cb.left} ${cb.top}) scale(${cb.width / 361} ${cb.height / 308})`);
      tongue.setAttribute('stroke-width', 5 * z);
      tip.setAttribute('cx', x); tip.setAttribute('cy', y); tip.setAttribute('r', dist > 2 ? 13 * z : 0);
      cards[target].classList.toggle('stuck', ext >= 1);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ───── Project sheet ───── */
  const sheet = $('#sheet'), panel = $('#panel'), pane = $('#pane');
  let cur = 0, tab = 'brief', opener = null;
  const tabs = { brief: $('#t-brief'), process: $('#t-process'), result: $('#t-result') };
  function renderPane() {
    const p = PROJECTS[cur];
    Object.entries(tabs).forEach(([key, el]) => el.setAttribute('aria-selected', key === tab));
    pane.setAttribute('aria-labelledby', 't-' + tab);
    if (tab === 'brief') {
      pane.innerHTML = `<div><h4>The Brief</h4>${p.brief.map(t => `<p>${t}</p>`).join('')}</div>
        <dl class="facts">${p.facts.map(([key, v]) => `<div><dt>${key}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
    } else if (tab === 'process') {
      pane.innerHTML = `<div><h4>The Process</h4><ol class="steps">${p.process.map(([t, d], i) => `<li><span class="n">${i + 1}.</span><span><b>${t}</b>${d}</span></li>`).join('')}</ol></div>
        <div class="result-art" aria-hidden="true"><div><span class="big">${p.process[0][0]}</span><span class="small">${p.name} · step 1</span></div></div>`;
    } else {
      pane.innerHTML = `<div><h4>The Result</h4><p>${p.result}</p>${p.link ? `<p><a class="p-live" href="${p.link}" target="_blank" rel="noopener">See it live <span>→</span></a></p>` : `<p class="soon">Live link coming soon.</p>`}</div>
        <div class="result-art"><div><span class="big">${p.art[0]}</span><span class="small">${p.art[1]}</span></div></div>`;
    }
  }
  function render() {
    const p = PROJECTS[cur];
    panel.style.setProperty('--c', p.hex);
    $('#pCount').textContent = `${String(cur + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}`;
    $('#pTitle').textContent = p.title;
    $('#pTag').textContent = p.tagline;
    $('#pPills').innerHTML = p.tags.map(t => `<li>${t}</li>`).join('');
    renderPane();
  }
  function openProject(i, from) {
    cur = i; tab = 'brief'; opener = from || null; render();
    sheet.hidden = false; document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { sheet.classList.add('show'); panel.scrollTop = 0; panel.focus(); });
  }
  function closeProject() {
    sheet.classList.remove('show'); document.body.style.overflow = '';
    setTimeout(() => { sheet.hidden = true; }, reduce ? 0 : 350);
    if (opener) opener.focus({ preventScroll: true });
  }
  const step = d => { cur = (cur + d + PROJECTS.length) % PROJECTS.length; tab = 'brief'; render(); panel.scrollTop = 0; };
  $('#pClose').onclick = closeProject;
  $('#pPrev').onclick = () => step(-1);
  $('#pNext').onclick = () => step(1);
  sheet.addEventListener('click', e => { if (e.target === sheet) closeProject(); });
  Object.entries(tabs).forEach(([key, el]) => el.addEventListener('click', () => { tab = key; renderPane(); }));
  document.addEventListener('keydown', e => {
    if (sheet.hidden) return;
    if (e.key === 'Escape') closeProject();
    if (e.key === 'ArrowRight' && !e.target.closest('.tabs')) step(1);
    if (e.key === 'ArrowLeft' && !e.target.closest('.tabs')) step(-1);
    if (e.key === 'Tab') { // keep focus inside the sheet
      const f = [...panel.querySelectorAll('button, a[href]')]; if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { f[f.length - 1].focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { f[0].focus(); e.preventDefault(); }
    }
  });
})();
