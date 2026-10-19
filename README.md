# Portfolio — Nika Saracuta

A one-page portfolio in black, white and hot pink. Static files, no build step:
serve the folder (GitHub Pages, or `python3 -m http.server`) and open `index.html`.
(CSS masks need http(s); opening the file directly won't show the lettering or the chameleon.)

The previous version of the site is kept on the `archive/before-redesign` branch.

## The page

Night (black, glowing pink) is the default; the switch in the top right turns the page to day
(off-white and black, pink only in the details). The choice is remembered per browser.

1. **Portfolio** — the huge lettering slides up after the loading screen, over blurry night clouds;
   the bird crosses them.
2. **Hello** — the introduction and an "About me" button; the "?" in the glowing cloud opens the
   About pop-up too.
3. **My work** — a list of project cards beside a sticky chameleon that takes on the colour of the
   card in view (a pink glow at night, black with coloured wax by day). Clicking a card opens its sheet.
4. **The horizon** — monstera leaves part around a pink sun as you scroll; the laptop links to Behance.
5. **Contact** — "Open for new projects", email, LinkedIn, Behance, a fish and a swaying coral.

Visitors who prefer reduced motion get the page without animation.

## Files

- `index.html` — the page, the project sheet and the About pop-up.
- `styles.css` — the page; `popups.css` — the project sheet and the About pop-up.
- `main.js` — smooth scrolling and all scroll animations (GSAP + ScrollTrigger + Lenis, bundled
  in `vendor/`), the menu, the day/night switch, the sparkle cursor. **Set `BEHANCE_URL` here.**
- `work.js` — **the projects**: edit the `PROJECTS` list (name, chameleon colour `hex`, card label, image, brief, process, result, live link). Images go in `assets/projects/`.
- `about.js` — the About pop-up; set your photo with `ME_PHOTO = 'assets/me.jpg'`.
- `loader.js` — the loading screen.
- `assets/` — clouds, bird, leaf, laptop, coral, fish, chameleon, "Portfolio" and "?" lettering, icons, sparkle cursor, logo,
  project images.

Still to fill in: the Behance URL (`main.js`), the LinkedIn URL (`index.html`, contact section)
and your photo (`about.js`).

## Updating

After changing a `.css` or `.js` file, run `scripts/bump-versions.sh` before committing. It stamps
the links in `index.html` with a content hash (`?v=…`) so browsers load the new files.
