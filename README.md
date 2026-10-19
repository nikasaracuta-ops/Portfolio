# Portfolio — Nika Saracuta

A one-page portfolio that drifts from sky to sea. Static files, no build step:
serve the folder (GitHub Pages, or `python3 -m http.server`) and open `index.html`.
(CSS masks need http(s); opening the file directly won't show the chameleon.)

The previous version of the site is kept on the `archive/before-redesign` branch.

## The journey

1. **Sky** — the huge "Portfolio" title slides up after the loading screen; the sky
   (`assets/scenes/sky.webp`, fixed behind the first two scenes) drifts as you scroll and the
   bird crosses it.
2. **The cloud (About)** — pinned while the introduction lights up word by word. The "?",
   "More about me" and "About" in the menu open the About pop-up.
3. **Work** — pinned; the project panels scroll sideways. The lava-lamp chameleon takes on the
   colours of the project in view. Clicking a panel opens its project sheet.
4. **Sunset** — "More on the horizon": the leaves swing open, the sun rises out of the sea and the
   laptop links to Behance.
5. **The sea (Contact)** — email, LinkedIn, Behance, and a footer with the local time.

Phones get the same page without pinning (the gallery becomes a column); visitors who prefer
reduced motion get it without animation.

## Files

- `index.html` — the page, the project sheet and the About pop-up.
- `styles.css` — the page; `popups.css` — the project sheet and the About pop-up.
- `main.js` — smooth scrolling and all scroll animations (GSAP + ScrollTrigger + Lenis, bundled
  in `vendor/`), the menu, the clock, the sparkle cursor. **Set `BEHANCE_URL` here.**
- `work.js` — **the projects**: edit the `PROJECTS` list (name, wax colour `hex`, lamp colour
  `lava`, card label, image, brief, process, result, live link). Images go in `assets/projects/`.
- `about.js` — the About pop-up; set your photo with `ME_PHOTO = 'assets/me.jpg'`.
- `loader.js` — the loading screen.
- `assets/` — artwork from the Figma file (sky and sea scenes, sun, laptop, leaf, bird, fish,
  chameleon, "Portfolio" and "?" lettering, icons, sparkle cursor, logo).

Still to fill in: the Behance URL (`main.js`), the LinkedIn URL (`index.html`, contact section)
and your photo (`about.js`).

## Updating

After changing a `.css` or `.js` file, run `scripts/bump-versions.sh` before committing. It stamps
the links in `index.html` with a content hash (`?v=…`) so browsers load the new files.
