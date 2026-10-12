// Scale the 1440px-wide design to the viewport width.
const stage = document.querySelector('.stage');
const grain = document.querySelector('.grain');
const DESIGN_WIDTH = 1440;

// Figma's "Main" frame noise (white, 32% on half the cells) lifts colours by
// 16% on average; background.webp is pre-darkened by exactly that amount.
// Here we add that lift back as fine grain: each screen pixel gets white at a
// random 11–21% opacity (mean 16%), matching the grain strength in Figma.
const TILE = 256;
const MEAN = 0.16;
const SPREAD = 0.051;

function makeGrainTile() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TILE;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(TILE, TILE);
  for (let i = 0; i < img.data.length; i += 4) {
    img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
    img.data[i + 3] = Math.round(255 * (MEAN + (Math.random() * 2 - 1) * SPREAD));
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

grain.style.backgroundImage = `url(${makeGrainTile()})`;

function fit() {
  const zoom = document.documentElement.clientWidth / DESIGN_WIDTH;
  stage.style.zoom = zoom;
  // one grain dot per physical screen pixel, whatever the zoom and pixel ratio
  grain.style.backgroundSize = `${TILE / (zoom * window.devicePixelRatio)}px`;
}

fit();
window.addEventListener('resize', fit);
