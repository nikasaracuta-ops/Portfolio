// One chameleon, five projects (ported from the portfolio artifact).
// Bring the cursor near a project name: the chameleon takes its colour, the eye
// follows, a preview floats beside the name. Click a name to open its sheet.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);

  /* ───── Projects: edit here ───── */
  // To add a project, copy one block. 'hex' and 'img' are optional: without
  // 'hex' it takes the next palette colour, without 'img' the preview says "Coming soon".
  const PROJECTS = [
    {
      id: 'dior', name: 'Dior', hex: '#3BBDCC', img: 'assets/projects/p-dior.webp',
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
      link: ''   // paste the live URL here
    },
    {
      id: 'type01', name: 'Type01', hex: '#00FF59', img: 'assets/projects/p-type01.webp',
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
      link: ''
    },
    {
      id: 'antwerp', name: 'Antwerp', hex: '#FB72BE', img: '',
      title: 'Antwerp', tagline: 'A web project about the city — case study in progress',
      tags: ['UI', 'UX', 'Web-design'],
      brief: ['This chameleon is still changing colour. The full Antwerp case study — brief, styleboard and iterations — lands here soon.'],
      facts: [['Status', 'Case study in progress']],
      process: [['Styleboard', 'Coming soon.'], ['Iterations', 'Coming soon.']],
      result: 'Final designs will be published here once the case study is ready.',
      art: ['Antwerp', 'Coming soon'],
      link: ''
    },
    {
      id: 'miles', name: 'Miles & meals', hex: '#D5FF59', img: 'assets/projects/p-miles.webp',
      title: 'Miles & Meals', tagline: 'Discover the world in your kitchen',
      tags: ['UI', 'UX', 'App-design'],
      brief: ['An app that brings iconic local dishes and street food from cities around the world straight to your kitchen — so you can travel by recipe.'],
      facts: [['Type', 'Mobile app'], ['Deliverables', 'Brandboard, social media, app screens']],
      process: [['Brandboard', 'Brand photography and a social-media look built around bright, appetising food shots.'], ['Iterations', 'From onboarding to recipe screens, refined into a navy-and-coral app with yellow accents.']],
      result: 'An app prototype that invites you to “Discover the world in your kitchen”.',
      art: ['Discover the world in your kitchen', 'App prototype'],
      link: ''
    },
    {
      id: 'thrive', name: 'Thrive', hex: '#1A5BA4', img: 'assets/projects/p-thrive.webp',
      title: 'Thrive', tagline: 'Taste the sound of harmony',
      tags: ['Branding', 'Packaging', 'Web-design'],
      brief: ['A drink brand built around balance and calm: low-calorie cans with added magnesium, and a visual world that feels like sound turned into colour.'],
      facts: [['Type', 'Drink branding'], ['Deliverables', 'Visual style, cans, landing page']],
      process: [['Styleboard', 'Liquid 3D shapes, deep teal gradients, gold accents and a light-to-heavy type scale.']],
      result: 'A can range “in Harmony” and a landing page that asks you to taste the sound of harmony.',
      art: ['TASTE the sound OF HARMONY', 'Branding · cans · web'],
      link: ''
    }
  ];

  const PALETTE = ['#3BBDCC', '#00FF59', '#FB72BE', '#D5FF59', '#1A5BA4'];
  PROJECTS.forEach((p, i) => { if (!p.hex) p.hex = PALETTE[i % PALETTE.length]; });

  const rgb = h => [1, 3, 5].map(k => parseInt(h.slice(k, k + 2), 16));
  const mix = (a, b, t) => a.map((v, k) => Math.round(v + (b[k] - v) * t));
  const css = c => `rgb(${c.join(',')})`;
  const IDLE = [183, 230, 236], BLUE = rgb('#1A5BA4');

  const page = $('.stage'), work = $('#work');
  const stage = $('#chamStage'), cham = $('#bigcham'), chamBody = $('#chamBody'), eye = $('#eye'), pupil = $('#pupil');
  const peek = $('#peek'), peekImg = $('#peekImg'), peekCap = $('#peekCap');
  // the page is scaled with CSS zoom; rects come back in screen pixels, so
  // positions written back inside the stage are divided by the zoom
  const zoom = () => parseFloat(page.style.zoom) || 1;

  const names = PROJECTS.map((p, i) => {
    const b = document.createElement('button');
    b.className = 'pname'; b.style.setProperty('--pc', p.hex);
    b.setAttribute('aria-label', `Open project ${i + 1}: ${p.name}`);
    b.innerHTML = `<span class="num">${String(i + 1).padStart(2, '0')}</span><span class="nm">${p.name}</span><span class="tg">${p.tags.slice(0, 3).join(' · ')}</span>`;
    b.addEventListener('click', () => { lick(); openProject(i, b); });
    b.addEventListener('focus', () => { focusIdx = i; });
    b.addEventListener('blur', () => { if (focusIdx === i) focusIdx = -1; });
    stage.appendChild(b);
    return b;
  });
  // names on an ellipse around the chameleon, first one at the top
  names.forEach((b, i) => {
    const ang = -Math.PI / 2 + i * 2 * Math.PI / names.length, x = Math.cos(ang), y = Math.sin(ang);
    b.style.left = (50 + 42 * x).toFixed(2) + '%';
    b.style.top = (50 + 44 * y).toFixed(2) + '%';
    b.classList.toggle('side-l', x < -.25);
    b.classList.toggle('side-c', Math.abs(x) <= .25);
  });

  let mouse = null, active = -1, focusIdx = -1, k = 0, col = IDLE.slice(), lickT;
  function lick() {
    if (reduce) return;
    cham.classList.add('lick'); clearTimeout(lickT);
    lickT = setTimeout(() => cham.classList.remove('lick'), 380);
  }
  addEventListener('pointermove', e => { mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });
  stage.addEventListener('pointerleave', () => { if (mouse) mouse.out = true; });

  function setActive(i) {
    if (i === active) return;
    names.forEach((n, j) => n.classList.toggle('on', j === i));
    active = i;
    work.style.setProperty('--tint', i < 0 ? 'transparent' : PROJECTS[i].hex);
    if (i < 0) { peek.classList.remove('show'); return; }
    const p = PROJECTS[i];
    peek.style.setProperty('--pc', p.hex);
    if (p.img) { peekImg.style.backgroundImage = `url("${p.img}")`; peekImg.textContent = ''; }
    else { peekImg.style.backgroundImage = 'none'; peekImg.textContent = 'Coming soon'; }
    peekCap.textContent = `${p.name} — ${p.tagline.split('—')[0].trim()}`;
    peek.classList.add('show');
    lick();
  }

  function tick() {
    const z = zoom();
    let best = -1, bestD = 1e9;
    if (focusIdx >= 0) { best = focusIdx; bestD = 0; }
    else if (mouse && !mouse.out) {
      names.forEach((n, i) => {
        const r = n.getBoundingClientRect();
        const dx = Math.max(r.left - mouse.x, 0, mouse.x - r.right), dy = Math.max(r.top - mouse.y, 0, mouse.y - r.bottom);
        const d = Math.hypot(dx, dy);
        if (d < bestD) { bestD = d; best = i; }
      });
    }
    const R = 200 * z, near = best >= 0 && bestD < R;
    setActive(near ? best : -1);
    const target = near ? Math.min(1, 1.15 - bestD / R) : 0;
    k += (target - k) * (reduce ? 1 : .12);
    const goal = near ? mix(IDLE, rgb(PROJECTS[best].hex), k) : IDLE;
    col = mix(col, goal, reduce ? 1 : .14);
    cham.style.setProperty('--cham', css(col));
    cham.style.setProperty('--cham-dark', css(mix(col, BLUE, .28)));

    // the eye follows the cursor (or the focused name)
    const er = eye.getBoundingClientRect(), ex = er.left + er.width / 2, ey = er.top + er.height / 2;
    let tx = mouse ? mouse.x : ex - 100, ty = mouse ? mouse.y : ey;
    if (focusIdx >= 0) { const r = names[focusIdx].getBoundingClientRect(); tx = r.left + r.width / 2; ty = r.top + r.height / 2; }
    const a = Math.atan2(ty - ey, tx - ex), dist = Math.min(1, Math.hypot(tx - ex, ty - ey) / (160 * z)), m = er.width * .28 * dist / z;
    pupil.style.setProperty('--px', (Math.cos(a) * m).toFixed(1) + 'px');
    pupil.style.setProperty('--py', (Math.sin(a) * m).toFixed(1) + 'px');

    // the preview floats beside the active name
    if (active >= 0) {
      const sr = stage.getBoundingClientRect(), r = names[active].getBoundingClientRect(), pr = peek.getBoundingClientRect();
      const w = pr.width, h = pr.height, cx = r.left + r.width / 2 - sr.left;
      let px, py;
      if (Math.abs(cx - sr.width / 2) < sr.width * .15) { px = cx - w / 2; py = r.top - sr.top - h - 18 * z; }      // centre name: above it
      else if (cx < sr.width / 2) { px = r.right - sr.left + 24 * z; py = r.top - sr.top + r.height / 2 - h / 2; } // left names: to the right
      else { px = r.left - sr.left - w - 24 * z; py = r.top - sr.top + r.height / 2 - h / 2; }                      // right names: to the left
      if (mouse && focusIdx < 0) { // drift a little with the cursor
        px += Math.max(-18 * z, Math.min(18 * z, (mouse.x - (r.left + r.width / 2)) * .12));
        py += Math.max(-18 * z, Math.min(18 * z, (mouse.y - (r.top + r.height / 2)) * .12));
      }
      px = Math.min(Math.max(px, 0), sr.width - w); py = Math.min(Math.max(py, 0), sr.height - h);
      peek.style.setProperty('--x', px / z + 'px');
      peek.style.setProperty('--y', py / z + 'px');
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

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
