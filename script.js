// Scale the 1440px-wide design to the viewport width.
const stage = document.querySelector('.stage');
const DESIGN_WIDTH = 1440;

function fit() {
  stage.style.zoom = document.documentElement.clientWidth / DESIGN_WIDTH;
}

fit();
window.addEventListener('resize', fit);

// Headings marked with data-fit-width keep the width they have in the design,
// whichever font ends up rendering them (the original or a fallback).
document.fonts.ready.then(() => {
  document.querySelectorAll('[data-fit-width]').forEach((el) => {
    const target = Number(el.dataset.fitWidth);
    const size = parseFloat(getComputedStyle(el).fontSize);
    el.style.fontSize = `${size * (target / el.offsetWidth)}px`;
  });
});
