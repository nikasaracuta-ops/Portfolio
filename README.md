# Portfolio

Static one-page portfolio built from the Figma frame **Main** (node `315:133`) in the
`PORTFOLIO` file. Open `index.html` in a browser — no build step.

- `assets/` — images exported from Figma. Run `scripts/fetch-assets.sh` to download them.
- `fonts/` — drop the design's font files here (see the `@font-face` rules at the top of
  `styles.css` for expected file names). Until then, Google Fonts stand-ins are used.
- The 1440px design is scaled to the viewport width by `script.js`.
