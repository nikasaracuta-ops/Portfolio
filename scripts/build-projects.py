#!/usr/bin/env python3
"""Builds the project pages (dior.html, type01.html, moea.html, miles.html) from the
PROJECTS list below and one shared template, so they all share the same structure.
Edit the texts here, then run:  python3 scripts/build-projects.py && scripts/bump-versions.sh"""
import html, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent

# The tab around the screenshots: the portfolio's browser tab (same as on the home page),
# drawn in the project's colour (currentColor).
TAB = re.search(r"const tabSvg = i => `(<svg[\s\S]*?</svg>)`", (ROOT / 'chameleon.js').read_text()).group(1)

PROJECTS = [
  dict(file='dior.html', name='Dior', tab='#E770B2', layout='dior',
       title=None, title_text='Dior',
       lede='MoMu – Dress to Impress: an interactive longread for MoMu – Fashion Museum Antwerp',
       subtitle=('MoMu – Dress to Impress', 'An interactive longread for MoMu – Fashion Museum Antwerp'),
       year='2026', client='MoMu – Fashion Museum Antwerp', url='https://nikasaracuta.github.io/Integration-3/',
       tags=['UI/UX', 'Visual design', 'Web design', 'Web development'],
       tools=[('assets/dior/icon-ps.svg', 'Photoshop'), ('assets/dior/icon-figma.svg', 'Figma'), ('assets/dior/icon-procreate.webp', 'Procreate'),
              ('assets/dior/icon-vscode.webp', 'Visual Studio Code'), ('assets/dior/icon-gsap.svg', 'GSAP')],
       desktop=('assets/dior/site-desktop.webp', 2314, 1427, 'The Art of Dressmaking by Christian Dior, the homepage on desktop'),
       mobile=('assets/dior/site-mobile-screen.webp', 696, 1209, 'The homepage on mobile'),
       lead='<b>MoMu</b>, the Fashion Museum of Antwerp, launched its new digital marketing plan with a series of <b>six interactive online stories</b>, each about a fashion designer.',
       brief=['My task was to research, design and build the first one: a one-page <b>interactive longread</b> about Walter Van Beirendonk, Christian Dior or Dirk Bikkembergs, told from my own angle. I chose <b>Christian Dior</b> and the art of his dressmaking, and turned his story into an immersive experience that teaches visitors about fashion and makes them want to visit the museum.'],
       # palettes: the styleboard's (also the fan in the intro) and the one the final website ended up with
       palettes=[('Styleboard', ['#FFF4DC', '#FFBCD1', '#B96E85', '#86A4AE', '#6D6D6D', '#3B3B3B']),
                 ('Final website', ['#F0F1ED', '#E5ECEC', '#8EB5C5', '#AE7284', '#303030'])],
       styleboard=('assets/dior/styleboard.webp', 2400, 1697, 'Styleboard for the Dior longread',
                   'Archive photography of Dior’s couture, fashion sketches and a soft, powdery palette set the tone of the story. While designing, the colours shifted a little towards a cooler, calmer final website.'),
       iterations=('assets/dior/iterations.webp', 2700, 1091, 'Iterations of the Dior longread, from photo research to the final pages',
                   'A sneak peek of the process: from the first photo research and desktop layouts to the scroll-driven chapters of the final story.'),
       # the result: screens of the story, shown one at a time in the tab: (image, w, h, alt, label)
       screens=[('assets/dior/screen-venus.webp', 2200, 1061, 'Venus and Junon: two of Dior’s gowns side by side, with a slider', 'Venus &amp; Junon'),
                ('assets/dior/screen-sketch.webp', 2200, 1192, 'Help Dior sketch one of his masterpieces', 'Sketch with Dior'),
                ('assets/dior/screen-dress.webp', 2200, 1265, 'Choose a fabric and drag accessories on the dress to design Dior’s look', 'Design Dior’s look'),
                ('assets/dior/screen-bobbin.webp', 2200, 1064, 'A sewing bobbin and its thread, from the story', 'Bobbin &amp; thread')],
       # unused by the Dior layout, kept so the shared template can still be built
       facts=[], steps=[], result=None, site=('assets/dior/site-desktop.webp', 2314, 1427, ''),
       cta=('See Prototype', 'https://nikasaracuta.github.io/Integration-3/')),
  dict(file='moea.html', name='Moea', tab='#3EBDCD',
       title=None, title_text='MOEA',
       lede='An animated 3D website hero for Moea, a sustainable fashion brand',
       facts=[('Made with', 'Blender'), ('Status', 'Case study in progress')],
       tags=['3D design', 'Animation', 'Web design'],
       site=('assets/moea/site.webp', 2000, 1240, 'The Moea homepage with its 3D hero'),
       brief=['Imagine working at a design agency for brands big and small: a client has heard that <b>3D is the next big thing on the web</b> and wants it on their website as a <b>promotional header</b>. I could pick the brand myself, so I chose a responsible one: <b>Moea</b>, short for <b>Mother Earth</b>, a label that rethinks how fashion is made, with respect for the planet.',
              'The hero had to tell a <b>visual concept</b>, a little world built around the product, didn’t need to be photorealistic, and <b>couldn’t be static</b>: animation brings it to life. I designed and animated it in <b>Blender</b>, starting from a mood and styleboard so the client could see where it was heading.'],
       steps=[], result=None, cta=None),
  dict(file='type01.html', name='Type01', tab='#E770B2',
       title=('assets/type01/type-type01.svg', 412, 92, 'TYPE01'),
       lede='Conference website for desktop and mobile',
       facts=[('Year', '2025'), ('Tools', '<img src="assets/type01/icon-ps.svg" width="56" height="53" alt="Photoshop" title="Photoshop"> <img src="assets/type01/icon-figma.svg" width="51" height="51" alt="Figma" title="Figma">')],
       tags=['UI', 'UX', 'Graphic design', 'Web design'],
       site=('assets/type01/site.webp', 2000, 1280, 'The TYPE01 conference homepage'),
       brief=['<b>TYPE01 Magazine</b>, a publication for graphic designers and typographers, was hosting its first-ever <b>conference</b>: <b>two days</b> in London on <b>typography in print</b>, <b>motion design</b> and <b>branding</b>.',
              'My task was to design a responsive conference website for desktop and mobile that fits TYPE01’s identity but takes a bolder approach. Text and photos of the speakers were already provided.'],
       steps=[('assets/type01/type-styleboard.svg', 229, 41, '1. Styleboard', 'I explored two identities, one for a light mode and one for a dark mode. Both mix bold grotesk display type with pixel and halftone patterns, collaged photography and a pink-and-green palette taken from TYPE01’s identity. The final website uses the light mode, and a switch to the dark mode could be added later as a feature.',
               [('assets/type01/styleboard-light.webp', 563, 361, 'Styleboard, light version', 'Light'), ('assets/type01/styleboard-dark.webp', 527, 338, 'Styleboard, dark version', 'Dark')]),
              ('assets/type01/type-iterations.svg', 214, 29, '2. Iterations', 'From the first wireframes to the light, dark and mobile versions of each page.', [('assets/type01/iterations.webp', 1194, 318, 'Iterations of the desktop and mobile pages')])],
       result=None,
       cta=('See Prototype', 'https://www.figma.com/proto/PsD6Cg8ngFq6yRWCCm5I9q/Type01?page-id=0%3A1&node-id=468-7480&viewport=-2609%2C-2191%2C0.15&t=KQAR1eAcC8Ls4MeP-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=580%3A48961')),
  dict(file='miles.html', name='Miles & Meals', tab='#1A5BA4',
       title=None, title_text='Miles &amp; Meals',
       lede='A world of flavours in every box — brand identity and app',
       facts=[('Type', 'Brand identity + mobile app'), ('Deliverables', 'Brandboard · app prototype')],
       tags=['UI', 'UX', 'Branding', 'App design'],
       site=('assets/miles/site.webp', 2000, 1288, 'Miles & Meals: brand photography and social media'),
       brief=['<b>Miles &amp; Meals</b> is a food-box subscription that brings <b>iconic local dishes</b> from cities around the world to your kitchen. Every box explores a different city through authentic recipes, inspired by how locals really eat. The founders want to launch in <b>Antwerp in summer 2026</b>, and grow to many more cities after that.',
              'As lead designer, I worked in two parts. First the <b>visual identity</b>: a brand that speaks to its audience and values, presented in a <b>brandboard</b> with its personality, tone of voice, logo, colours, typography, photography, icons, packaging and social media.',
              'Then the <b>app</b>, where users manage their box and cook the recipes. I started from the existing wireframes but approached them critically, looking for smarter solutions, clear hierarchy, helpful feedback and small interactions that make you smile, all finished in a <b>clickable prototype</b>.'],
       steps=[('assets/miles/type-brandboard.svg', 250, 33, '1. Brandboard', 'Bright, appetising food shots, a deep navy and coral palette with yellow accents, and a social-media look built around them.', [('assets/miles/brandboard.webp', 994, 594, 'Miles & Meals brandboard: brand photography and social media')])],
       result=('assets/miles/app.webp', 365, 656, 'The Miles & Meals app: Discover the world in your kitchen'),
       cta=('See Prototype', 'https://www.figma.com/proto/JhFdOzlcgGCV38btM2Tumv/Miles---Meals?page-id=6817%3A1887&node-id=59585-34744&viewport=-13885%2C-407%2C0.32&t=BZlwAt149MrtAhmE-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=59585%3A34763&show-proto-sidebar=1')),
]

def ink(src, w, h, alt):
    """An outlined Figma heading painted in the page's accent colour (a CSS mask)."""
    return f'<span class="p-ink" role="img" aria-label="{alt}" style="--src:url({src});aspect-ratio:{w}/{h}"></span>'

def window(src, w, h, alt, tab, extra='', lazy=False):
    svg = TAB.replace('${i}', 'x').replace('class="win-svg"', 'class="p-tab"')
    return f'''<figure class="p-window reveal{extra}" style="--tab:{tab}" data-tilt>
        <img class="p-shot" src="{src}" width="{w}" height="{h}" alt="{html.escape(alt)}"{' loading="lazy"' if lazy else ''}>
        {svg}
      </figure>'''

def step(s, i):
    src, w, h, alt, note, imgs = s
    head = f'<h3>{ink(src, w, h, alt)}</h3>'
    switch = ''
    if len(imgs) > 1:
        tabs = ''.join(f'<button role="tab" aria-selected="{"true" if k == 0 else "false"}" data-board="{im[4].lower()}">{im[4]}</button>' for k, im in enumerate(imgs))
        switch = f'''
            <div class="p-switch" role="tablist" aria-label="Version">
              {tabs}
              <span class="p-switch-pill" aria-hidden="true"></span>
            </div>'''
    pics = ''.join(f'''
            <img{' class="on"' if k == 0 else ''}{f' data-board="{im[4].lower()}"' if len(im) > 4 else ''} src="{im[0]}" width="{im[1]}" height="{im[2]}" alt="{html.escape(im[3])}" loading="lazy">''' for k, im in enumerate(imgs))
    return f'''
        <div class="p-step reveal">
          <div class="p-step-head">
            {head}{switch}
          </div>
          <p class="p-note">{note}</p>
          <button class="p-board" data-zoom aria-label="Enlarge the image">{pics}
            <span class="p-zoom-hint" aria-hidden="true">Click to enlarge</span>
          </button>
        </div>'''

def dior_main(p):
    """Dior: an editorial layout. The title next to a fan of the styleboard's colours, the
    facts, the site on desktop and mobile, the brief as a lead, the styleboard with a
    palette that switches to the final website's, the iterations as a strip that pans
    while scrolling, and the result as a small carousel of the story's screens in the tab, whose address bar
    links to the site."""
    tools = ''.join(f'<li><img src="{src}" width="48" height="48" alt="{name}" title="{name}"></li>' for src, name in p['tools'])
    tags = ''.join(f'<li>{t}</li>' for t in p['tags'])
    facts = (f'<div><dt>Year</dt><dd>{p["year"]}</dd></div>'
             f'<div><dt>Client</dt><dd>{p["client"]}</dd></div>'
             f'<div><dt>Creative fields</dt><dd><ul class="p-tags">{tags}</ul></dd></div>'
             f'<div><dt>Built with</dt><dd><ul class="d-tools">{tools}</ul></dd></div>')
    fan = ''.join(f'<li style="--c:{c};--i:{k}"></li>' for k, c in enumerate(p['palettes'][0][1]))
    brief = ''.join(f'\n        <p class="d-text reveal">{t}</p>' for t in p['brief'])
    (pa_name, pa), (pb_name, pb) = p['palettes']
    pal = ''.join(f'<li style="--c:{pa[k]}" data-a="{pa[k]}" data-b="{pb[k] if k < len(pb) else ""}"></li>' for k in range(len(pa)))
    d, m, sb, it = p['desktop'], p['mobile'], p['styleboard'], p['iterations']
    shot = window(*d, p['tab']).replace('</figure>', f'  <span class="d-url" aria-hidden="true">{p["url"]}</span>\n      </figure>', 1)
    tab = TAB.replace('${i}', 'res').replace('class="win-svg"', 'class="p-tab"')
    shots = ''.join(f'''
          <img{' class="on"' if k == 0 else ''} src="{src}" width="{iw}" height="{ih}" alt="{html.escape(alt)}" loading="lazy">''' for k, (src, iw, ih, alt, lab) in enumerate(p['screens']))
    dots = ''.join(f'''<button role="tab" aria-selected="{'true' if k == 0 else 'false'}" aria-label="{lab}"></button>''' for k, (src, iw, ih, alt, lab) in enumerate(p['screens']))
    link = (ROOT / 'assets/dior/icon-link.svg').read_text().replace('fill="white"', 'fill="currentColor"').replace('<svg ', '<svg class="d-cta-icon" aria-hidden="true" ', 1)
    return f'''
    <!-- Intro -->
    <section class="d-intro">
      <div class="d-intro-text">
        <p class="p-eyebrow reveal">Case study</p>
        <h1 class="d-title reveal" style="--d:.05s"><span class="p-title-text">{p["title_text"]}</span></h1>
        <p class="d-sub reveal" style="--d:.1s"><b>{p["subtitle"][0]}</b>{p["subtitle"][1]}</p>
      </div>
      <ul class="d-fan reveal" style="--d:.2s" aria-hidden="true">{fan}</ul>
      <dl class="p-facts d-facts reveal" style="--d:.15s">{facts}</dl>

      <!-- the site on desktop, with the phone version leaning on it -->
      <div class="d-devices">
        {shot}
        <figure class="d-phone reveal" style="--d:.3s"><img src="{m[0]}" width="{m[1]}" height="{m[2]}" alt="{html.escape(m[3])}"></figure>
      </div>
    </section>

    <!-- The Brief -->
    <section class="d-brief" aria-labelledby="brief-h">
      <div class="d-head">
        <span class="p-num">01</span>
        <h2 class="p-h reveal" id="brief-h">{ink("assets/type01/type-brief.svg", 403, 79, "The Brief")}</h2>
      </div>
      <p class="d-lead reveal">{p["lead"]}</p>{brief}
    </section>

    <!-- The process -->
    <section class="d-process" aria-labelledby="process-h">
      <div class="d-head">
        <span class="p-num">02</span>
        <h2 class="p-h reveal" id="process-h">{ink("assets/type01/type-visual-process.svg", 616, 104, "Visual process")}</h2>
      </div>

      <div class="d-step d-style reveal">
        <div class="d-style-text">
          <h3>{ink("assets/type01/type-styleboard.svg", 229, 41, "1. Styleboard")}</h3>
          <p class="p-note">{sb[4]}</p>
          <div class="d-palette">
            <div class="p-switch" role="tablist" aria-label="Palette">
              <button role="tab" aria-selected="true" data-board="a">{pa_name}</button><button role="tab" aria-selected="false" data-board="b">{pb_name}</button>
              <span class="p-switch-pill" aria-hidden="true"></span>
            </div>
            <ul class="d-swatches" aria-label="Colour palette">{pal}</ul>
          </div>
        </div>
        <button class="p-board" data-zoom aria-label="Enlarge the styleboard">
          <img class="on" src="{sb[0]}" width="{sb[1]}" height="{sb[2]}" alt="{html.escape(sb[3])}" loading="lazy">
          <span class="p-zoom-hint" aria-hidden="true">Click to enlarge</span>
        </button>
      </div>

      <div class="d-step reveal">
        <div class="d-step-text">
          <h3>{ink("assets/type01/type-iterations.svg", 214, 29, "2. Iterations")}</h3>
          <p class="p-note">{it[4]}</p>
        </div>
        <button class="p-board d-pan" data-zoom aria-label="Enlarge the iterations">
          <img class="on" src="{it[0]}" width="{it[1]}" height="{it[2]}" alt="{html.escape(it[3])}" loading="lazy">
          <span class="p-zoom-hint" aria-hidden="true">Click to enlarge</span>
        </button>
      </div>
    </section>

    <!-- The Result -->
    <section class="p-result d-result" aria-labelledby="result-h">
      <span class="p-num">03</span>
      <h2 class="p-h reveal" id="result-h">{ink("assets/type01/type-result.svg", 443, 79, "The Result")}</h2>
      <div class="d-show reveal">
        <figure class="p-window d-show-win" style="--tab:{p["tab"]}">
          <button class="d-shots" data-zoom aria-label="Enlarge this screen">{shots}
          </button>
          {tab}
          <a class="d-url d-url-link" href="{html.escape(p["cta"][1])}" target="_blank" rel="noopener">{link}<span>{p["cta"][0]}</span></a>
        </figure>
        <div class="d-dots" role="tablist" aria-label="Screens of the story">{dots}</div>
      </div>
    </section>
'''

def page(i, p):
    n = len(PROJECTS); prev, nxt = PROJECTS[(i - 1) % n], PROJECTS[(i + 1) % n]
    title = (ink(*p["title"]) if p['title']
             else f'<span class="p-title-text">{p["title_text"]}</span>')
    facts = ''.join(f'<div><dt>{k}</dt><dd{" class=\"p-tools\"" if k == "Tools" else ""}>{v}</dd></div>' for k, v in p['facts'][:1])
    facts += '<div><dt>Disciplines</dt><dd><ul class="p-tags">' + ''.join(f'<li>{t}</li>' for t in p['tags']) + '</ul></dd></div>'
    facts += ''.join(f'<div><dt>{k}</dt><dd{" class=\"p-tools\"" if k == "Tools" else ""}>{v}</dd></div>' for k, v in p['facts'][1:])
    brief = ''.join(f'\n        <p class="p-text reveal">{t}</p>' for t in p['brief'])
    num = 2
    process = ''
    if p['steps']:
        process = f'''
    <!-- Process -->
    <section class="p-section p-process" aria-labelledby="process-h">
      <div class="p-side">
        <span class="p-num">02</span>
        <h2 class="p-h reveal" id="process-h">{ink("assets/type01/type-visual-process.svg", 616, 104, "Visual process")}</h2>
      </div>
      <div class="p-body">{''.join(step(s, k) for k, s in enumerate(p['steps']))}
      </div>
    </section>
'''
        num = 3
    result = ''
    if p['cta'] or p['result']:
        if p['result'] and p['result'][2] > p['result'][1]:      # a phone screen
            shot = f'<figure class="p-phone reveal" style="--tab:{p["tab"]}"><img src="{p["result"][0]}" width="{p["result"][1]}" height="{p["result"][2]}" alt="{html.escape(p["result"][3])}" loading="lazy"></figure>'
        elif p['result']:
            shot = window(*p['result'], p['tab'], lazy=True)
        else:
            shot = window(*p['site'], p['tab'], lazy=True)
        cta = f'<a class="p-cta reveal" href="{html.escape(p["cta"][1])}" target="_blank" rel="noopener">{p["cta"][0]} <span aria-hidden="true">↗</span></a>' if p['cta'] else ''
        result = f'''
    <!-- The Result -->
    <section class="p-result" aria-labelledby="result-h">
      <span class="p-num">{num:02d}</span>
      <h2 class="p-h reveal" id="result-h">{ink("assets/type01/type-result.svg", 443, 79, "The Result")}</h2>
      {shot}
      {cta}
    </section>
'''
    GENERIC = f'''

    <!-- Intro -->
    <section class="p-intro">
      <p class="p-eyebrow reveal">Case study</p>
      <h1 class="p-title reveal" style="--d:.05s">{title}</h1>
      <p class="p-lede reveal" style="--d:.1s">{p["lede"]}</p>
      <dl class="p-facts reveal" style="--d:.15s">{facts}</dl>
      {window(*p["site"], p["tab"], extra=" p-hero")}
    </section>

    <!-- The Brief -->
    <section class="p-section p-brief" aria-labelledby="brief-h">
      <div class="p-side">
        <span class="p-num">01</span>
        <h2 class="p-h reveal" id="brief-h">{ink("assets/type01/type-brief.svg", 403, 79, "The Brief")}</h2>
      </div>
      <div class="p-body">{brief}
      </div>
    </section>
{process}{result}
'''
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{p["name"]} — Nika Saracuta</title>
  <meta name="description" content="{html.escape(re.sub('<[^>]+>', '', p["lede"]))} — a project by Nika Saracuta.">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
  <link rel="icon" type="image/png" sizes="192x192" href="assets/favicon-192.png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,400;125,700&amp;family=Gloock&amp;display=swap">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="project.css">
  <script>document.documentElement.classList.add('js')</script>
</head>
<body class="project-page" style="--accent:{p["tab"]}">
  <!-- Generated by scripts/build-projects.py: edit the texts there, not here. -->
  <div class="p-progress" id="progress" aria-hidden="true"></div>

  <header class="p-top">
    <a class="p-back" href="index.html#work">
      <span class="p-back-dot" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 12H5M11 5l-7 7 7 7"/></svg></span>
      <span>All projects</span>
    </a>
    <span class="p-count">Project {i + 1:02d} / {n:02d}</span>
  </header>

  <main class="p-main{" d-main" if p.get("layout") == "dior" else ""}">{dior_main(p) if p.get("layout") == "dior" else GENERIC}    <!-- Previous / next project -->
    <nav class="p-next reveal" aria-label="More projects">
      <a class="p-prev-link" href="{prev["file"]}">
        <span class="p-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 12H5M11 5l-7 7 7 7"/></svg></span>
        <span class="p-dir">previous</span>
        <span class="p-name">{prev["name"].replace("&", "&amp;")}</span>
      </a>
      <a class="p-next-link" href="{nxt["file"]}">
        <span class="p-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 5l7 7-7 7"/></svg></span>
        <span class="p-dir">next</span>
        <span class="p-name">{nxt["name"].replace("&", "&amp;")}</span>
      </a>
    </nav>
  </main>

  <dialog class="p-lightbox" id="lightbox" aria-label="Enlarged image">
    <button class="p-lb-close" aria-label="Close">×</button>
    <img alt="">
  </dialog>

  <script src="project.js"></script>
</body>
</html>
'''

for i, p in enumerate(PROJECTS):
    (ROOT / p['file']).write_text(page(i, p))
    print('wrote', p['file'])
