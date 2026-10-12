// Scale the 1440px-wide design to the viewport width.
const stage = document.querySelector('.stage');
const DESIGN_WIDTH = 1440;

function fit() {
  stage.style.zoom = document.documentElement.clientWidth / DESIGN_WIDTH;
}

fit();
window.addEventListener('resize', fit);
