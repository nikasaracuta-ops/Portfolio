# Portfolio

Static one-page portfolio built from the Figma frame **Main** (node `315:133`) in the
`PORTFOLIO` file. Open `index.html` in a browser — no build step.

- `assets/sky.webp` — the Figma sky (gradient 1751px tall and hero clouds), rendered from `sky.svg`;
  `clouds.webp` (from `clouds-bank.svg`, Figma colours) is the cloud bank that parts while About is pinned, `sky-puff.webp` the white
  figure behind the "?" (Figma group 286).
- The sea is drawn in code (`.sea` in `styles.css`, Figma colour #3EBDCD); the caustics, coral and seabed
  are Figma vectors (`caustics.svg`, `coral.svg`, `coral-small.svg`, `seabed.svg`), the laptop is
  `laptop.svg`.
- `assets/type-*.svg` — display headings exported from Figma as outlined SVGs (exact letterforms).
- `assets/icon-*.svg` — LinkedIn / Behance icons.
- `fonts/` — drop the Roc Grotesk Wide and Area Inktrap Extended `.woff2` files here (names in
  `styles.css`) for the nav and body text. Until then, Archivo is used as a stand-in.
- On screens wider than 760px the 1440px design is scaled to the window by `script.js`; on phones the
  sections stack instead (see the "Phones" block at the end of `styles.css`).
- **Projects** (the chameleon, the project cards, the laptop screen and the project sheet) live in `chameleon.js`:
  edit the `PROJECTS` list there (name, colour, card label, preview image, brief, process, result, live link).
  Preview images go in `assets/projects/`.
- **Project pages**: `type01.html` (content from Figma frame `599:1734`), a responsive case study styled
  by `project.css`, with its interactions in `project.js`; its images and outlined headings are in
  `assets/type01/`. A project with `page` set in
  `chameleon.js` opens its page instead of the project sheet.
- **About pop-up** ("About me" link/button or the "?"): content is in `index.html` (`#aboutPop`);
  set your photo in `about.js` (`ME_PHOTO = 'assets/me.jpg'`).
- CSS masks (chameleon, coral) need the page served over http(s) — e.g. GitHub Pages or
  `python3 -m http.server` — not opened as a local file.

## Updating

After changing `styles.css` or any `.js` file, run `scripts/bump-versions.sh` before committing.
It stamps the links in `index.html` with a content hash (`?v=…`) so visitors' browsers load the
new files instead of mixing the new page with old cached ones.
