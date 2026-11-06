#!/usr/bin/env python3
"""Builds the project pages (dior.html, type01.html, moea.html, miles.html) from the
PROJECTS list below and one shared template, so they all share the same structure.
Edit the texts here, then run:  python3 scripts/build-projects.py && scripts/bump-versions.sh"""
import html, pathlib, re
from urllib.parse import quote

ROOT = pathlib.Path(__file__).resolve().parent.parent

# The tab around the screenshots: the portfolio's browser tab (same as on the home page),
# drawn in the project's colour (currentColor).
TAB = re.search(r"const tabSvg = i => `(<svg[\s\S]*?</svg>)`", (ROOT / 'chameleon.js').read_text()).group(1)

PROJECTS = [
  dict(file='dior.html', name='Dior', tab='#E770B2', layout='dior', live='site', fields_rows=True,
       title=None, title_text='Dior',
       lede='MoMu – Dress to Impress: an interactive longread for MoMu – Fashion Museum Antwerp',
       subtitle=('MoMu – Dress to Impress', 'An interactive longread for MoMu – Fashion Museum Antwerp'),
       year='2026', client='MoMu – Fashion Museum Antwerp', url='https://nikasaracuta.github.io/Integration-3/',
       tags=['UI/UX', 'Visual design', 'Web design', 'Web development'],
       tools=[('assets/dior/icon-ps.svg', 'Photoshop'), ('assets/dior/icon-figma.svg', 'Figma'), ('assets/dior/icon-procreate.webp', 'Procreate'),
              ('assets/dior/icon-vscode.webp', 'VS Code'), ('assets/dior/icon-gsap.svg', 'GSAP')],
       desktop=('assets/dior/site-desktop.webp', 2314, 1427, 'The Art of Dressmaking by Christian Dior, the homepage on desktop'),
       mobile=('assets/dior/site-mobile.webp', 729, 1253, 'The homepage on mobile'),
       lead='<b>MoMu</b>, the Fashion Museum of Antwerp, wants to launch its new digital marketing plan with a series of <b>six interactive online stories</b>, each about a fashion designer.',
       brief=['My task was to research, design and build the first one: a one-page <b>interactive longread</b> about Walter Van Beirendonk, Christian Dior or Dirk Bikkembergs, told from my own angle.<br>I chose <b>Christian Dior</b> and decided to write about the art of his dressmaking, turning his story into an interactive experience, from the first sketch to the finished gown.'],
       # palettes: the styleboard's (also the fan in the intro) and the one the final website ended up with
       palettes=[('Styleboard', ['#FFF4DC', '#FFBCD1', '#B96E85', '#86A4AE', '#6D6D6D', '#3B3B3B']),
                 ('Final website', ['#F0F1ED', '#E5ECEC', '#8EB5C5', '#AE7284', '#303030'])],
       styleboard=('assets/dior/styleboard.webp', 2400, 1697, 'Styleboard for the Dior longread',
                   'Archive photography of Dior’s couture, fashion sketches and a soft, powdery palette. While designing, the colours changed towards cooler tones.'),
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
       layout='dior',
       subtitle=('Moea – Mother Earth', 'An animated 3D website hero for a sustainable fashion brand'),
       year='2026', client='Moea', url='',
       tools=[('assets/moea/icon-ae.svg', 'After Effects'), ('assets/type01/icon-figma.svg', 'Figma'), ('assets/moea/icon-blender.svg', 'Blender')],
       desktop=('assets/moea/site.webp', 2000, 1240, 'The Moea homepage with its 3D hero'),
       mobile=('assets/moea/site-mobile.webp', 1001, 1812, 'The Moea homepage on mobile, with the 3D hero'), mobile_screen=True, result_phone=True,
       lead='A client has heard that <b>3D is the next big thing on the web</b> and wants it on their website as a <b>promotional header</b>.',
       brief=['For this assignment, I could pick the brand myself, so I chose <b>Moea</b>, short for <b>Mother Earth</b>, a label that rethinks how fashion is made, with respect for the planet.<br>The hero had to tell a <b>visual concept</b>, a little world built around the product, and needed to be <b>animated</b> (the animation is coming soon!).'],
       palettes=None,
       # the palette as dots, as on the styleboard: chrome, sage, lavender, teal, deep teal
       palette_dots=['linear-gradient(160deg, #787D85, #B5B7B9 50%, #747C80)', '#BECD8D', '#AF9BE9', '#4796A4', 'linear-gradient(#142B2C, #106C81)'],
       styleboard=('assets/moea/styleboard.webp', 2000, 1413, 'Moea styleboard: chrome, stone, moss, flowers and water', 'I wanted to go for a chrome style in combination with natural elements: liquid metal next to stone, moss, flowers and water.'),
       live=None, zoom=True,   # no prototype yet: the result opens large instead
              title=None, title_text='MOEA',
       lede='An animated 3D website hero for Moea, a sustainable fashion brand',
       facts=[('Made with', 'Blender'), ('Status', 'Case study in progress')],
       tags=['3D hero', 'Animation', 'Web design'],
       site=('assets/moea/site.webp', 2000, 1240, 'The Moea homepage with its 3D hero'),
       steps=[], result=None, cta=None),
  dict(file='type01.html', name='Type01', tab='#E770B2',
       layout='dior', title_text='TYPE01',
       subtitle=('TYPE01 Conference', 'A conference website for desktop and mobile'),
       year='2025', client='TYPE01 Magazine', url='TYPE01 prototype',
       tools=[('assets/type01/icon-ps.svg', 'Photoshop'), ('assets/type01/icon-figma.svg', 'Figma')],
       desktop=('assets/type01/site.webp', 2000, 1280, 'The TYPE01 conference homepage'),
       mobile=('assets/type01/site-mobile.webp', 1118, 2000, 'The TYPE01 homepage on mobile'), mobile_screen=True, result_phone=True,
       lead='<b>TYPE01 Magazine</b>, a publication for graphic designers and typographers, was hosting its first-ever <b>conference</b>: two days in London on typography in print, motion design and branding.',
       brief=['My task was to design a responsive <b>conference website</b> for desktop and mobile that fits TYPE01’s identity but takes a <b>bolder approach</b>. Text and photos of the speakers were already provided.'],
       palettes=None,
       # the conference colours, the same in both modes: ink, pink, green, white
       palette_squares=['#262221', '#E6A2D9', '#2AA764', '#FFFFFF'],
       board_switch=('Light', 'Dark'),
       styleboard=('assets/type01/styleboard-light.webp', 2000, 1258, 'Styleboard, light version', 'I created two styleboards, one for a light and one for a dark mode, both mixing bold type with pixel and halftone patterns, collaged photography, pink and green. The final website uses the light mode.'),
       styleboard_b=('assets/type01/styleboard-dark.webp', 2000, 1246, 'Styleboard, dark version'),
       live='figma',
              title=('assets/type01/type-type01.svg', 412, 92, 'TYPE01'),
       lede='Conference website for desktop and mobile',
       facts=[('Year', '2025'), ('Tools', '<img src="assets/type01/icon-ps.svg" width="56" height="53" alt="Photoshop" title="Photoshop"> <img src="assets/type01/icon-figma.svg" width="51" height="51" alt="Figma" title="Figma">')],
       tags=['UI', 'UX', 'Graphic design', 'Web design'],
       site=('assets/type01/site.webp', 2000, 1280, 'The TYPE01 conference homepage'),
       steps=[('assets/type01/type-styleboard.svg', 229, 41, '1. Styleboard', 'I explored two identities, one for a light mode and one for a dark mode. Both mix bold grotesk display type with pixel and halftone patterns, collaged photography and a pink-and-green palette taken from TYPE01’s identity. The final website uses the light mode, and a switch to the dark mode could be added later as a feature.',
               [('assets/type01/styleboard-light.webp', 563, 361, 'Styleboard, light version', 'Light'), ('assets/type01/styleboard-dark.webp', 527, 338, 'Styleboard, dark version', 'Dark')]),
              ('assets/type01/type-iterations.svg', 214, 29, '2. Iterations', 'From the first wireframes to the light, dark and mobile versions of each page.', [('assets/type01/iterations.webp', 1194, 318, 'Iterations of the desktop and mobile pages')])],
       result=None,
       cta=('See Prototype', 'https://www.figma.com/proto/PsD6Cg8ngFq6yRWCCm5I9q/Type01?page-id=0%3A1&node-id=468-7480&viewport=-2609%2C-2191%2C0.15&t=KQAR1eAcC8Ls4MeP-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=580%3A48961')),
  dict(file='miles.html', name='Miles & Meals', tab='#1A5BA4',
       layout='dior',
       subtitle=('Miles &amp; Meals', 'A world of flavours in every box: brand identity and app'),
       year='2026', client='Miles &amp; Meals', url='Miles &amp; Meals prototype',   # TO CONFIRM: year
       tools=[('assets/type01/icon-figma.svg', 'Figma'), ('assets/type01/icon-ps.svg', 'Photoshop')],   # TO CONFIRM
       desktop=('assets/miles/site.webp', 2000, 1288, 'Miles & Meals: brand photography and social media'),
       mobile=('assets/miles/app.webp', 365, 656, 'The Miles & Meals app: Discover the world in your kitchen'), mobile_screen=True,
       lead='<b>Miles &amp; Meals</b> is a food-box subscription that brings <b>iconic local dishes</b> from cities around the world to your kitchen.',
       brief=['Every box explores a different city through authentic recipes, inspired by how locals really eat. As lead designer, I first created the <b>visual identity</b>, presented in a brandboard, then designed the <b>app</b> where users manage their box and cook the recipes, finished in a <b>clickable prototype</b>.'],
       palettes=[('Brandboard', ['#FFFFFF', '#F8E1B5', '#9D3B56', '#CE302F', '#112568']),
                 ('App', ['#FFFFFF', '#F9CA4D', '#777C9B', '#C73F2D', '#0F2366'])],
       styleboard=('assets/miles/brandboard.webp', 994, 594, 'Miles & Meals brandboard', 'Bright, appetising food shots, a deep navy and coral palette with yellow accents, and a social-media look built around them.'),
       live='figma',
              title=None, title_text='Miles &amp; Meals',
       lede='A world of flavours in every box — brand identity and app',
       facts=[('Type', 'Brand identity + mobile app'), ('Deliverables', 'Brandboard · app prototype')],
       tags=['UI', 'UX', 'Branding', 'App design'],
       site=('assets/miles/site.webp', 2000, 1288, 'Miles & Meals: brand photography and social media'),
       steps=[('assets/miles/type-brandboard.svg', 250, 33, '1. Brandboard', 'Bright, appetising food shots, a deep navy and coral palette with yellow accents, and a social-media look built around them.', [('assets/miles/brandboard.webp', 994, 594, 'Miles & Meals brandboard: brand photography and social media')])],
       result=('assets/miles/app.webp', 365, 656, 'The Miles & Meals app: Discover the world in your kitchen'),
       cta=('See Prototype', 'https://www.figma.com/proto/JhFdOzlcgGCV38btM2Tumv/Miles---Meals?page-id=6817%3A1887&node-id=59585-34744&viewport=-13885%2C-407%2C0.32&t=BZlwAt149MrtAhmE-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=59585%3A34763&show-proto-sidebar=1')),
]

def pills(tags, rows=False):
    """Tags as filled pills in the page's colour with a small star between them: on one
    line, or two per row (Dior, whose four pills don't fit on one line)."""
    star = '<span class="d-dot" aria-hidden="true"></span>'
    pill = lambda t: f'<span class="pill">{t}</span>'
    if not rows:
        return f'<span class="pill-row">{star.join(pill(t) for t in tags)}</span>'
    return ''.join(f'<span class="pill-row">{star.join(pill(t) for t in tags[i:i + 2])}</span>' for i in range(0, len(tags), 2))

def ink(src, w, h, alt):
    """A heading set live in The Seasons (Adobe Fonts), in the page's accent colour.
    (src, w, h are the old outlined Figma exports, kept in the data for reference.)"""
    return f'<span class="p-ink">{html.escape(alt)}</span>'

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
    """Dior, after the Figma frame 846:133: the title with the site on desktop and mobile,
    the facts, the brief, the visual style (styleboard + palette switch) and the result:
    the live prototype in a browser window."""
    star = '<svg class="d-star" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50.0,2.0 58.7,12.0 70.8,6.8 74.3,19.5 87.5,20.1 85.1,33.1 96.8,39.3 89.0,50.0 96.8,60.7 85.1,66.9 87.5,79.9 74.3,80.5 70.8,93.2 58.7,88.0 50.0,98.0 41.3,88.0 29.2,93.2 25.7,80.5 12.5,79.9 14.9,66.9 3.2,60.7 11.0,50.0 3.2,39.3 14.9,33.1 12.5,20.1 25.7,19.5 29.2,6.8 41.3,12.0"/></svg>'
    tools = ''.join(f'<li title="{name}">{star}<img src="{src}" width="48" height="48" alt="{name}"></li>' for src, name in p['tools'])
    facts = (f'<div><dt>Year</dt><dd class="d-year">{p["year"]}</dd></div>'
             f'<div><dt>Client</dt><dd>{p["client"]}</dd></div>'
             f'<div><dt>Creative fields</dt><dd class="d-fields">{pills(p["tags"], p.get("fields_rows"))}</dd></div>'
             f'<div><dt>Built with</dt><dd><ul class="d-tools">{tools}</ul></dd></div>')
    brief = ''.join(f'\n        <p class="d-text reveal">{t}</p>' for t in p['brief'])
    if p.get('palette_squares'):
        sa, sb_ = p['board_switch']
        palette = (f'<div class="p-switch" role="tablist" aria-label="Styleboard">'
                   f'<button role="tab" aria-selected="true" data-board="a">{sa}</button><button role="tab" aria-selected="false" data-board="b">{sb_}</button>'
                   f'<span class="p-switch-pill" aria-hidden="true"></span></div>'
                   '<ul class="d-squares" aria-label="Colour palette">' + ''.join(f'<li style="--c:{c}" title="{c}"></li>' for c in p['palette_squares']) + '</ul>')
    elif p.get('palette_dots'):
        palette = '<ul class="d-dots-pal" aria-label="Colour palette">' + ''.join(f'<li style="--c:{c}"></li>' for c in p['palette_dots']) + '</ul>'
    else:
        (pa_name, pa), (pb_name, pb) = p['palettes']
        pal = ''.join(f'<li style="--c:{pa[k]}" data-a="{pa[k]}" data-b="{pb[k] if k < len(pb) else ""}"></li>' for k in range(len(pa)))
        palette = (f'<div class="p-switch" role="tablist" aria-label="Palette">'
                   f'<button role="tab" aria-selected="true" data-board="a">{pa_name}</button><button role="tab" aria-selected="false" data-board="b">{pb_name}</button>'
                   f'<span class="p-switch-pill" aria-hidden="true"></span></div><ul class="d-swatches" aria-label="Colour palette">{pal}</ul>')
    d, m, sb = p['desktop'], p['mobile'], p['styleboard']
    url, cta = p['url'], p['cta']
    # the styleboard, and a second board when the palette switch has one (TYPE01: light / dark)
    if p.get('styleboard_b'):
        b2 = p['styleboard_b']
        boards = (f'<img class="on" data-board="a" src="{sb[0]}" width="{sb[1]}" height="{sb[2]}" alt="{html.escape(sb[3])}" loading="lazy">'
                  f'<img data-board="b" src="{b2[0]}" width="{b2[1]}" height="{b2[2]}" alt="{html.escape(b2[3])}" loading="lazy">')
    else:
        boards = f'<img class="on" src="{sb[0]}" width="{sb[1]}" height="{sb[2]}" alt="{html.escape(sb[3])}" loading="lazy">'
    # the result: the live site, the Figma prototype (embedded), or the site's screenshot
    rphone = (f'<button class="d-result-phone" data-zoom aria-label="Enlarge the mobile version"><img class="on" src="{m[0]}" width="{m[1]}" height="{m[2]}" alt="{html.escape(m[3])}" loading="lazy"></button>'
              if p.get('result_phone') else '')
    if p.get('live') == 'site':
        result = f'<div class="d-panes d-live" data-src="{html.escape(cta[1])}"></div>'
    elif p.get('live') == 'figma':
        emb = 'https://www.figma.com/embed?embed_host=share&url=' + quote(cta[1], safe='')
        result = f'<div class="d-panes d-live" data-src="{html.escape(emb)}"></div>' + rphone
    else:
        result = (f'<button class="d-panes d-zoomable" data-zoom aria-label="Enlarge the website"><img class="d-still on" src="{d[0]}" width="{d[1]}" height="{d[2]}" alt="{html.escape(d[3])}" loading="lazy"></button>'
                  + rphone)
    shot = window(*d, p['tab']).replace('</figure>', f'  <span class="d-url" aria-hidden="true">{p["url"]}</span>\n      </figure>', 1)
    link = (ROOT / 'assets/dior/icon-link.svg').read_text().replace('fill="white"', 'fill="currentColor"').replace('<svg ', '<svg class="d-cta-icon" aria-hidden="true" ', 1)
    zoom_icon = '<svg class="d-cta-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6"/></svg>'
    zoom_badge = (f'<button class="d-badge" data-zoom aria-label="Click to zoom in"><img class="on" src="{d[0]}" alt="{html.escape(d[3])}" hidden>'
                  '<svg class="d-badge-ring" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="badgeRing" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs>'
                  f'<text><textPath href="#badgeRing" textLength="272">CLICK TO ZOOM IN • CLICK TO ZOOM IN •</textPath></text></svg>{zoom_icon}</button>')
    badge = zoom_badge if p.get('zoom') else '' if not cta else (f'<a class="d-badge" href="{html.escape(cta[1])}" target="_blank" rel="noopener" aria-label="{cta[0]} (opens the website)">'
             f'<svg class="d-badge-ring" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="badgeRing" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs>'
             f'<text><textPath href="#badgeRing" textLength="272">{cta[0].upper()} • {cta[0].upper()} •</textPath></text></svg>{link}</a>')
    return f"""
    <!-- Intro -->
    <section class="d-intro">
      <div class="d-intro-text">
        <h1 class="d-title{" d-title-long" if len(html.unescape(p["title_text"])) > 6 else ""} reveal" style="--d:.05s"><span class="p-title-text">{p["title_text"]}</span></h1>
        <p class="d-sub reveal" style="--d:.1s"><b>{p["subtitle"][0]}</b>{p["subtitle"][1]}</p>
      </div>
      <!-- the site on desktop, with the phone version leaning on it -->
      <div class="d-devices reveal" style="--d:.2s">
        {shot}
        <figure class="d-phone{' d-phone-screen' if p.get('mobile_screen') else ''}{' d-phone-right' if p.get('phone_right') else ''}"><img src="{m[0]}" width="{m[1]}" height="{m[2]}" alt="{html.escape(m[3])}"></figure>
      </div>
      <dl class="d-facts reveal" style="--d:.15s">{facts}</dl>
    </section>

    <!-- The Brief -->
    <section class="d-brief" aria-labelledby="brief-h">
      <h2 class="p-h d-head reveal" id="brief-h">{ink("", 0, 0, "The Brief")}</h2>
      <p class="d-lead reveal">{p["lead"]}</p>{brief}
    </section>

    <!-- Visual style -->
    <section class="d-process" aria-labelledby="process-h">
      <h2 class="p-h d-head reveal" id="process-h">{ink("", 0, 0, "Visual Style")}</h2>
      <div class="d-step d-style reveal">
        <div class="d-style-text">
          <p class="p-note">{sb[4]}</p>
          <div class="d-palette">
            {palette}
          </div>
        </div>
        <button class="p-board" data-zoom aria-label="Enlarge the styleboard">
          {boards}
          <span class="p-zoom-hint" aria-hidden="true">Click to enlarge</span>
        </button>
      </div>
    </section>

    <!-- The Result: a browser window with a tab per part of the story, and one with the live site -->
    <section class="p-result d-result" aria-labelledby="result-h">
      <h2 class="p-h reveal" id="result-h">{ink("", 0, 0, "The Result")}</h2>
      <!-- the live prototype in a browser window; it loads when the section comes near -->
      <div class="d-browser reveal" style="--tab:{p["tab"]}">
        <div class="d-browser-bar">
          <span class="d-lights" aria-hidden="true"><i></i><i></i><i></i></span>
          <div class="d-browser-addr"><span class="d-addr">{url}</span></div>
        </div>
        {result}
        {badge}
      </div>
    </section>
"""

def page(i, p):
    n = len(PROJECTS); prev, nxt = PROJECTS[(i - 1) % n], PROJECTS[(i + 1) % n]
    title = f'<span class="p-title-text">{p["title"][3] if p["title"] else p["title_text"]}</span>'
    facts = ''.join(f'<div><dt>{k}</dt><dd{" class=\"p-tools\"" if k == "Tools" else ""}>{v}</dd></div>' for k, v in p['facts'][:1])
    facts += f'<div><dt>Disciplines</dt><dd class="d-fields">{pills(p["tags"])}</dd></div>'
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
  <link rel="preconnect" href="https://use.typekit.net" crossorigin>
  <link rel="stylesheet" href="https://use.typekit.net/gfn8yzd.css">
  <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/wasted-vindey">
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
      <span>Back</span>
    </a>
  </header>

  <main class="p-main{" d-main" if p.get("layout") == "dior" else ""}">{dior_main(p) if p.get("layout") == "dior" else GENERIC}    <!-- Previous / next project -->
    <nav class="p-next reveal" aria-label="More projects">
      <a class="p-prev-link" href="{prev["file"]}">
        <span class="p-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 12H5M11 5l-7 7 7 7"/></svg></span>
        <span class="p-dir">project</span>
        <span class="p-name">{prev["name"].replace("&", "&amp;")}</span>
      </a>
      <a class="p-next-link" href="{nxt["file"]}">
        <span class="p-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 5l7 7-7 7"/></svg></span>
        <span class="p-dir">project</span>
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
