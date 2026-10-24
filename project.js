// Project pages: scale the 1440px stage to the window (phones get the stacked
// layout from project.css), and fade elements in as they scroll into view.
const pstage = document.getElementById('pstage');
const PHONE = matchMedia('(max-width: 760px)');
function fitProject() {
  pstage.style.zoom = PHONE.matches ? '' : document.documentElement.clientWidth / 1440;
}
fitProject();
addEventListener('resize', fitProject);

const pending = new Set(document.querySelectorAll('.reveal'));
function reveal() {
  // at the very bottom nothing can scroll higher, so show whatever is left
  const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
  for (const el of pending) {
    if (atBottom || el.getBoundingClientRect().top < innerHeight * .88) {
      el.classList.add('in'); pending.delete(el);
    }
  }
}
addEventListener('scroll', reveal, { passive: true });
addEventListener('resize', reveal);
reveal();
