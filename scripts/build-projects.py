"""Builds the project pages (dior.html, type01.html, moea.html, miles.html) from the
PROJECTS list below and one shared template, so they all share the same structure.
Edit the texts here, then run:  python3 scripts/build-projects.py && scripts/bump-versions.sh"""
import html, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent

TAB = re.search(r"const tabSvg = i => `(<svg[\s\S]*?</svg>)`", (ROOT / 'src/js/chameleon.js').read_text()).group(1)

PROJECTS = [
  dict(file='dior.html', name='Dior', tab='#E770B2',
       result_video=('src/assets/dior/site-scroll.mp4', 'src/assets/dior/site-scroll.webp', 1440, 778, 'Scrolling through the Dior story'),
       title_text='Dior',
       lede='MoMu – Dress to Impress: an interactive longread for MoMu – Fashion Museum Antwerp',
       subtitle=('MoMu – Dress to Impress', 'An interactive longread for MoMu – Fashion Museum Antwerp'),
       year='2026', client='MoMu – Fashion Museum Antwerp', url='https://nikasaracuta.github.io/Integration-3/',
       tags=['UI/UX', 'Visual design', 'Web design', 'Web development'],
       tools=[('src/assets/tools/photoshop.webp', 'Photoshop'), ('src/assets/tools/figma.webp', 'Figma'), ('src/assets/tools/procreate.webp', 'Procreate'),
              ('src/assets/tools/vscode.webp', 'VS Code'), ('src/assets/tools/gsap.webp', 'GSAP')],
       desktop=('src/assets/dior/site-desktop.webp', 2314, 1427, 'The Art of Dressmaking by Christian Dior, the homepage on desktop'),
       mobile=('src/assets/dior/site-mobile.webp', 729, 1253, 'The homepage on mobile'),
       lead='<b>MoMu</b>, the Fashion Museum of Antwerp, wants to launch its new digital marketing plan with a series of <b>six interactive online stories</b>, each about a fashion designer.',
       brief=['My task was to research, design and build the first one: a one-page <b>interactive longread</b> about Walter Van Beirendonk, Christian Dior or Dirk Bikkembergs, told from my own angle.<br>I chose <b>Christian Dior</b> and decided to write about the art of his dressmaking, turning his story into an interactive experience, from the first sketch to the finished gown.'],
       palettes=[('Styleboard', ['#FFF4DC', '#FFBCD1', '#B96E85', '#86A4AE', '#6D6D6D', '#3B3B3B']),
                 ('Final website', ['#F0F1ED', '#E5ECEC', '#8EB5C5', '#AE7284', '#303030'])],
       styleboard=('src/assets/dior/styleboard.webp', 2400, 1697, 'Styleboard for the Dior longread',
                   'Archive photography of Dior’s couture, fashion sketches and a soft, powdery palette. While designing, the colours changed towards cooler tones.'),
       cta=('See Prototype', 'https://nikasaracuta.github.io/Integration-3/')),
  dict(file='moea.html', name='Moea', tab='#3EBDCD',
       subtitle=('Moea – Mother Earth', 'An animated 3D website hero for a sustainable fashion brand'),
       year='2026', client='Moea', url='',
       tools=[('src/assets/tools/aftereffects.webp', 'After Effects'), ('src/assets/tools/figma.webp', 'Figma'), ('src/assets/tools/blender.webp', 'Blender')],
       desktop=('src/assets/moea/site.webp', 2000, 1240, 'The Moea homepage with its 3D hero'),
       mobile=('src/assets/moea/phone.webp', 667, 1159, 'The Moea homepage on mobile, with the 3D hero'), result_phone=True,
       lead='A client has heard that <b>3D is the next big thing on the web</b> and wants it on their website as a <b>promotional header</b>.',
       brief=['For this assignment, I could pick the brand myself, so I chose <b>Moea</b>, short for <b>Mother Earth</b>, a label that rethinks how fashion is made, with respect for the planet.<br>The hero had to tell a <b>visual concept</b>, a little world built around the product, and needed to be <b>animated</b> (the animation is coming soon!).'],
       palettes=None,
       palette_dots=['linear-gradient(160deg, #787D85, #B5B7B9 50%, #747C80)', '#BECD8D', '#AF9BE9', '#4796A4', 'linear-gradient(#142B2C, #106C81)'],
       styleboard=('src/assets/moea/styleboard.webp', 2000, 1413, 'Moea styleboard: chrome, stone, moss, flowers and water', 'I wanted to go for a chrome style in combination with natural elements: liquid metal next to stone, moss, flowers and water.'),
       zoom=True,
              title_text='MOEA',
       lede='An animated 3D website hero for Moea, a sustainable fashion brand',
       tags=['3D hero', 'Animation', 'Web design'],
       cta=None),
  dict(file='type01.html', name='Type01', tab='#E770B2',
       title_text='TYPE01',
       subtitle=('TYPE01 Conference', 'A conference website for desktop and mobile'),
       year='2025', client='TYPE01 Magazine', url='TYPE01 prototype',
       tools=[('src/assets/tools/photoshop.webp', 'Photoshop'), ('src/assets/tools/figma.webp', 'Figma')],
       desktop=('src/assets/type01/site.webp', 2000, 1280, 'The TYPE01 conference homepage'),
       mobile=('src/assets/type01/phone.webp', 670, 1149, 'The TYPE01 homepage on mobile'), result_phone=True,
       lead='<b>TYPE01 Magazine</b>, a publication for graphic designers and typographers, was hosting its first-ever <b>conference</b>: two days in London on typography in print, motion design and branding.',
       brief=['My task was to design a responsive <b>conference website</b> for desktop and mobile that fits TYPE01’s identity but takes a <b>bolder approach</b>. Text and photos of the speakers were already provided.'],
       palettes=None,
       palette_squares=['#262221', '#E6A2D9', '#2AA764', '#FFFFFF'],
       board_switch=('Light', 'Dark'),
       styleboard=('src/assets/type01/styleboard-light.webp', 2000, 1258, 'Styleboard, light version', 'I created two styleboards, one for a light and one for a dark mode, both mixing bold type with pixel and halftone patterns, collaged photography, pink and green. The final website uses the light mode.'),
       styleboard_b=('src/assets/type01/styleboard-dark.webp', 2000, 1246, 'Styleboard, dark version'),
       result_image=('src/assets/type01/tickets.webp', 1600, 1000, 'The TYPE01 tickets page'),
              lede='Conference website for desktop and mobile',
       tags=['UI', 'UX', 'Graphic design', 'Web design'],
       cta=('See Prototype', 'https://www.figma.com/proto/PsD6Cg8ngFq6yRWCCm5I9q/Type01?page-id=0%3A1&node-id=468-7480&viewport=-2609%2C-2191%2C0.15&t=KQAR1eAcC8Ls4MeP-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=580%3A48961')),
  dict(file='miles.html', name='Miles & Meals', tab='#1A5BA4',
       subtitle=('Miles &amp; Meals – food-box subscription', 'Brand identity and mobile app for a start-up'),
       year='2026', client='Miles &amp; Meals<br><span class="d-note">(fictional company)</span>', url='Miles &amp; Meals prototype',
       tools=[('src/assets/tools/illustrator.webp', 'Illustrator'), ('src/assets/tools/figma.webp', 'Figma'), ('src/assets/tools/photoshop.webp', 'Photoshop'), ('src/assets/tools/procreate.webp', 'Procreate')],
       desktop=('src/assets/miles/site.webp', 2000, 1288, 'Miles & Meals: brand photography and social media'),
       mobile=('src/assets/miles/phone.webp', 667, 1152, 'The Miles & Meals app: Discover the world in your kitchen'), result_mode='phone', title_html='Miles<span class="amp">&amp;</span>Meals',
       lead='<b>Miles &amp; Meals</b> is a food-box subscription that brings <b>iconic local dishes</b> from cities around the world to your kitchen.',
       brief=['Every box explores a different city through authentic recipes, inspired by how locals really eat. The audience: adults aged 25–50 with middle to upper-middle incomes, and four brand values to build on: <b>travel</b>, <b>warm &amp; welcoming</b>, <b>out &amp; social</b> and <b>authentic</b>.<br>First I had to create the <b>visual identity</b>, presented in a brandboard, then design the <b>app</b> where users could manage their box and cook the recipes.'],
       palettes=None,
       palette_squares=['#0C2968', '#FFC933', '#D42F25', '#D5F0FF'],
       palette_squares_b=['#0C2968', '#FFC933', '#D42F25', '#D5F0FF', '#BBD760'],
       board_switch=('Brandboard', 'App'),
       board_badge=('See brandboard', 'src/assets/miles/brandboard.webp', 'The Miles & Meals brandboard'),
       styleboard=('src/assets/miles/styleboard.webp', 2000, 1320, 'Miles & Meals styleboard: linocut fish and waves, tile patterns, navy and red', 'At first the style focused on linocut imagery and traditional patterns from different cultures, but during the app design process it became simpler.'),
              title_text='Miles &amp; Meals',
       lede='A world of flavours in every box — brand identity and app',
       
       tags=['UI', 'UX', 'Branding', 'App design'],
       cta=('See Prototype', 'https://www.figma.com/proto/JhFdOzlcgGCV38btM2Tumv/Miles---Meals?page-id=6817%3A1887&node-id=59585-34744&viewport=-13885%2C-407%2C0.32&t=BZlwAt149MrtAhmE-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=59585%3A34763&show-proto-sidebar=1')),
]

def slug(p):
    return p['file'].removesuffix('.html')

def colours(p):
    page = f'.project-page--{slug(p)}'
    rules = [f'{page} {{ --accent: {p["tab"]}; }}']
    if p.get('palette_squares'):
        qa, qb = p['palette_squares'], p.get('palette_squares_b') or p['palette_squares']
        cs, ul = [(qa + [None] * 9)[k] or qb[k] for k in range(max(len(qa), len(qb)))], 'd-dots-pal'
    elif p.get('palette_dots'):
        cs, ul = p['palette_dots'], 'd-dots-pal'
    else:
        cs, ul = p['palettes'][0][1], 'd-dots-pal'
    rules += [f'{page} .{ul} li:nth-child({k + 1}) {{ --c: {c}; }}' for k, c in enumerate(cs)]
    return '\n'.join(rules)

def ink(alt):
    """A heading set live in The Seasons (Adobe Fonts), in the page's accent colour."""
    return f'<span class="p-ink">{html.escape(alt)}</span>'

def window(src, w, h, alt, tab, extra='', lazy=False):
    svg = TAB.replace('${i}', 'x').replace('class="work-card__svg"', 'class="p-tab"')
    return f'''<figure class="p-window reveal{extra}" data-tilt>
        <img class="p-shot" src="{src}" width="{w}" height="{h}" alt="{html.escape(alt)}"{' loading="lazy"' if lazy else ''}>
        {svg}
      </figure>'''

def dior_main(p):
    """Dior, after the Figma frame 846:133: the title with the site on desktop and mobile,
    the facts, the brief, the visual style (styleboard + palette switch) and the result:
    the live prototype in a browser window."""
    burst = '<span class="d-burst" aria-hidden="true"></span>'
    tools = ''.join(f'<li title="{name}">{burst}<img class="d-icon" src="{src}" width="64" height="64" alt="{name}"></li>' for src, name in p['tools'])
    stamp = f'<span class="d-stamp"><span class="d-stamp-k">Year</span>{p["year"]}</span>'
    spec = ('<dl class="d-spec reveal">'
            f'<div><dt>Client</dt><dd>{p["client"]}</dd></div>'
            '<div><dt>Creative fields</dt><dd class="d-fields">' + ''.join(f'<span class="d-pill">{t}</span>' for t in p['tags']) + '</dd></div>'
            f'<div><dt>Built with</dt><dd><ul class="d-tools">{tools}</ul></dd></div></dl>')
    brief = ''.join(f'\n        <p class="d-text reveal">{t}</p>' for t in p['brief'])
    if p.get('palette_squares'):
        sa, sb_ = p['board_switch']
        qa, qb = p['palette_squares'], p.get('palette_squares_b') or p['palette_squares']
        squares = ''.join(f'<li{"" if k < len(qa) else ' class="off"'} data-a="{qa[k] if k < len(qa) else ""}" data-b="{qb[k] if k < len(qb) else ""}"></li>' for k in range(max(len(qa), len(qb))))
        palette = (f'<div class="p-switch" role="tablist" aria-label="Styleboard">'
                   f'<button role="tab" aria-selected="true" data-board="a">{sa}</button><button role="tab" aria-selected="false" data-board="b">{sb_}</button>'
                   f'<span class="p-switch-pill" aria-hidden="true"></span></div>'
                   '<ul class="d-dots-pal" aria-label="Colour palette">' + squares + '</ul>')
    elif p.get('palette_dots'):
        palette = '<ul class="d-dots-pal" aria-label="Colour palette">' + '<li></li>' * len(p['palette_dots']) + '</ul>'
    else:
        (pa_name, pa), (pb_name, pb) = p['palettes']
        pal = ''.join(f'<li data-a="{pa[k]}" data-b="{pb[k] if k < len(pb) else ""}"></li>' for k in range(len(pa)))
        palette = (f'<div class="p-switch" role="tablist" aria-label="Palette">'
                   f'<button role="tab" aria-selected="true" data-board="a">{pa_name}</button><button role="tab" aria-selected="false" data-board="b">{pb_name}</button>'
                   f'<span class="p-switch-pill" aria-hidden="true"></span></div><ul class="d-dots-pal" aria-label="Colour palette">{pal}</ul>')
    d, m, sb = p['desktop'], p['mobile'], p['styleboard']
    url, cta = p['url'], p['cta']
    if p.get('styleboard_b'):
        b2 = p['styleboard_b']
        boards = (f'<img class="on" data-board="a" src="{sb[0]}" width="{sb[1]}" height="{sb[2]}" alt="{html.escape(sb[3])}" loading="lazy">'
                  f'<img data-board="b" src="{b2[0]}" width="{b2[1]}" height="{b2[2]}" alt="{html.escape(b2[3])}" loading="lazy">')
    else:
        boards = f'<img class="on" src="{sb[0]}" width="{sb[1]}" height="{sb[2]}" alt="{html.escape(sb[3])}" loading="lazy">'
    rphone = (f'<button class="phone phone--overlay" data-zoom aria-label="Enlarge the mobile version"><img class="phone__image on" src="{m[0]}" width="{m[1]}" height="{m[2]}" alt="{html.escape(m[3])}" loading="lazy"></button>'
              if p.get('result_phone') else '')
    if p.get('result_video'):
        v = p['result_video']
        result = (f'<video class="d-panes d-video" poster="{v[1]}" width="{v[2]}" height="{v[3]}" muted loop playsinline preload="none" aria-label="{html.escape(v[4])}">'
                  f'<source src="{v[0].replace(".mp4", ".webm")}" type="video/webm"><source src="{v[0]}" type="video/mp4"></video>'
                  + rphone)
    else:
        still = p.get('result_image') or d
        result = (f'<button class="d-panes d-zoomable" data-zoom aria-label="Enlarge the website"><img class="d-still on" src="{still[0]}" width="{still[1]}" height="{still[2]}" alt="{html.escape(still[3])}" loading="lazy"></button>'
                  + rphone)
    shot = window(*d, p['tab']).replace('</figure>', f'  <span class="d-url" aria-hidden="true">{p["url"]}</span>\n      </figure>', 1)
    link = (ROOT / 'src/assets/dior/icon-link.svg').read_text().replace('fill="white"', 'fill="currentColor"').replace('<svg ', '<svg class="d-cta-icon" aria-hidden="true" ', 1)
    phone_result = (f'<div class="app-result reveal"><button class="phone phone--app" data-zoom aria-label="Enlarge the app screen"><img class="phone__image on" src="{m[0]}" width="{m[1]}" height="{m[2]}" alt="{html.escape(m[3])}" loading="lazy"></button>'
                    + (f'<a class="d-badge" href="{html.escape(cta[1])}" target="_blank" rel="noopener" aria-label="{cta[0]} (opens the prototype)">'
                       '<svg class="d-badge-ring" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="prRing" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs>'
                       f'<text><textPath href="#prRing" textLength="272">{cta[0].upper()} • {cta[0].upper()} •</textPath></text></svg>{link}</a>' if cta else '') + '</div>')
    bb = p.get('board_badge')
    board_badge = '' if not bb else (f'<button class="d-badge d-board-badge" data-zoom aria-label="{bb[0]}"><img class="on" src="{bb[1]}" alt="{html.escape(bb[2])}" hidden>'
        '<svg class="d-badge-ring" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="bbRing" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs>'
        f'<text><textPath href="#bbRing" textLength="272">{bb[0].upper()} • {bb[0].upper()} •</textPath></text></svg>'
        '<svg class="d-cta-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6"/></svg></button>')
    zoom_icon = '<svg class="d-cta-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6"/></svg>'
    zoom_badge = (f'<button class="d-badge" data-zoom aria-label="Click to zoom in"><img class="on" src="{d[0]}" alt="{html.escape(d[3])}" hidden>'
                  '<svg class="d-badge-ring" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="badgeRing" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs>'
                  f'<text><textPath href="#badgeRing" textLength="272">CLICK TO ZOOM IN • CLICK TO ZOOM IN •</textPath></text></svg>{zoom_icon}</button>')
    badge = zoom_badge if p.get('zoom') else '' if not cta else (f'<a class="d-badge" href="{html.escape(cta[1])}" target="_blank" rel="noopener" aria-label="{cta[0]} (opens the website)">'
             f'<svg class="d-badge-ring" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="badgeRing" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs>'
             f'<text><textPath href="#badgeRing" textLength="272">{cta[0].upper()} • {cta[0].upper()} •</textPath></text></svg>{link}</a>')
    browser = f'''<div class="d-browser reveal">
        <div class="d-browser-bar">
          <span class="d-lights" aria-hidden="true"><i></i><i></i><i></i></span>
          <div class="d-browser-addr"><span class="d-addr">{url}</span></div>
        </div>
        {result}
        {badge}
      </div>'''
    return f"""
    <section class="d-intro">
      <div class="d-intro-text">
        <h1 class="d-title{" d-title-long" if len(html.unescape(p["title_text"])) > 6 else ""} reveal"><span class="p-title-text">{p.get("title_html") or p["title_text"]}</span>{stamp}</h1>
        <p class="d-sub reveal"><b>{p["subtitle"][0]}</b>{p["subtitle"][1]}</p>
        {spec}
      </div>
      <div class="d-devices reveal">
        {shot}
        <figure class="phone phone--intro"><img class="phone__image" src="{m[0]}" width="{m[1]}" height="{m[2]}" alt="{html.escape(m[3])}"></figure>
      </div>
    </section>

    <section class="d-brief" aria-labelledby="brief-h">
      <h2 class="p-h d-head reveal" id="brief-h">{ink("The Brief")}</h2>
      <p class="d-lead reveal">{p["lead"]}</p>{brief}
    </section>

    <section class="d-process" aria-labelledby="process-h">
      <h2 class="p-h d-head reveal" id="process-h">{ink("Visual Style")}</h2>
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
        {board_badge}
      </div>
    </section>

    <section class="p-result d-result" aria-labelledby="result-h">
      <h2 class="p-h reveal" id="result-h">{ink("The Result")}</h2>
      {phone_result if p.get('result_mode') == 'phone' else browser}
    </section>
"""

def page(i, p):
    n = len(PROJECTS); prev, nxt = PROJECTS[(i - 1) % n], PROJECTS[(i + 1) % n]
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{p["name"]} — Nika Saracuta</title>
  <meta name="description" content="{html.escape(re.sub('<[^>]+>', '', p["lede"]))} — a project by Nika Saracuta.">
  <link rel="icon" type="image/png" sizes="32x32" href="src/assets/favicon-32.png">
  <link rel="icon" type="image/png" sizes="192x192" href="src/assets/favicon-192.png">
  <link rel="apple-touch-icon" href="src/assets/apple-touch-icon.png">
  <link rel="preconnect" href="https://use.typekit.net" crossorigin>
  <link rel="stylesheet" href="https://use.typekit.net/gfn8yzd.css">
  <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/wasted-vindey">
  <link rel="stylesheet" href="src/css/reset.css">
  <link rel="stylesheet" href="src/css/styles.css">
  <link rel="stylesheet" href="src/css/project.css">
  <script>document.documentElement.classList.add('js'); try {{ if (sessionStorage.getItem('dreamIn')) {{ sessionStorage.removeItem('dreamIn'); document.documentElement.classList.add('dream-in'); }} }} catch (e) {{}}</script>
</head>
<body class="project-page project-page--{slug(p)}">
  <div class="p-progress" id="progress" aria-hidden="true"></div>

  <header class="p-top">
    <a class="p-back" href="index.html#work">
      <span class="p-back-dot" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 12H5M11 5l-7 7 7 7"/></svg></span>
      <span>Back</span>
    </a>
  </header>

  <main class="p-main d-main">{dior_main(p)}
    <footer>
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
    </footer>
  </main>

  <dialog class="p-lightbox" id="lightbox" aria-label="Enlarged image">
    <button class="p-lb-close" aria-label="Close">×</button>
    <img alt="">
  </dialog>

  <script src="src/js/common.js"></script>
  <script src="src/js/project.js"></script>
</body>
</html>
'''

for i, p in enumerate(PROJECTS):
    (ROOT / p['file']).write_text(page(i, p))
    print('wrote', p['file'])

MARK = '/* project colours: written by scripts/build-projects.py */'
css = ROOT / 'src/css/project.css'
base = css.read_text().split(MARK)[0].rstrip()
css.write_text(base + '\n\n' + MARK + '\n' + '\n'.join(colours(p) for p in PROJECTS) + '\n')
print('wrote project colours into', css.name)
