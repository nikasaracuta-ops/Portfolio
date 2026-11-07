// The bird, drawn from scratch: a body with a fanned tail and two wings, built as a
// tiny 3D model and projected at a three-quarter view from below. The wings beat in
// bursts, bend at the tips on each stroke and then hold out in a glide, while the bird
// follows the original GIF's flight path up across the sky. It fades out at the end
// of the path and comes back from the start. When the cursor comes close it beats
// harder and flies off faster.
(() => {
  const svg = document.getElementById('birdSvg');
  if (!svg) return;   // phones too: there it crosses the hero at a smaller size (styles.css)
  const [farEl, bodyEl, nearEl] = ['birdFar', 'birdBody', 'birdNear'].map((id) => document.getElementById(id));

  // flight path on the 692 x 291 canvas (the GIF's own route), left low to right high
  // it starts and ends well outside the screen, so it never fades in or out where you can see it
  const P = [[-150, 300], [-40, 268], [71, 241], [151, 245], [222, 216], [303, 159], [404, 153], [517, 82], [634, 102], [740, 62], [860, 20]];
  const cr = (a, b, c, d, t) => .5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t);
  function route(u) { // u in 0..1 over the whole path
    const s = u * (P.length - 1), i = Math.min(P.length - 2, Math.floor(s)), t = s - i;
    const q = (k) => P[Math.max(0, Math.min(P.length - 1, k))];
    return [0, 1].map((j) => cr(q(i - 1)[j], q(i)[j], q(i + 1)[j], q(i + 2)[j], t));
  }

  // shapes, in bird space: x forward (beak to the right), y down, z = span (towards us)
  const SCALE = 1.35;
  // plump body with a round head and a short beak; a narrow waist, then a long
  // fanned tail that ends in a notched, slightly forked edge of feathers
  const BODY = [[45, 1], [40, -2], [36, -7], [30, -10], [23, -10], [12, -11], [0, -10], [-12, -8], [-21, -5],
    [-27, -3], [-36, -6], [-46, -10], [-53, -12], [-57, -8], [-53, -5], [-58, -2], [-54, 1], [-59, 5], [-50, 6],
    [-38, 5], [-27, 3], [-19, 7], [-7, 12], [7, 14], [19, 12], [29, 8], [36, 4], [41, 2]];
  const L = 60; // wing length
  // wing outline: [chord x, span s]: leading edge out to the swept tip, feathered trailing edge back
  const WING = [[14, 0], [15, .15], [11, .35], [4, .6], [-6, .82], [-16, .97], [-23, 1], [-19, .92], [-20, .84],
    [-16, .76], [-17, .66], [-13, .56], [-14, .44], [-11, .3], [-11, .14], [-10, 0]];

  // view: turn the bird a little towards us and look at it slightly from below
  const yaw = .45, pitch = -.38, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const project = (x, y, z) => {
    const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
    return [x1, y * cp - z1 * sp];
  };

  function wingPoints(side, flap, bend) {
    return WING.map(([x, s]) => {
      const a = flap + bend * s * s; // the outer wing lags the stroke
      const r = s * L;
      return project((x - 6 * s) * SCALE, (-3 - r * Math.sin(a)) * SCALE, side * r * Math.cos(a) * SCALE);
    });
  }
  function d(pts, ox, oy, rot) {
    const c = Math.cos(rot), s = Math.sin(rot);
    const q = pts.map(([x, y]) => [ox + x * c - y * s, oy + x * s + y * c]);
    // smooth closed outline through the midpoints
    const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    let out = `M${m(q[q.length - 1], q[0]).map((v) => v.toFixed(1)).join(' ')}`;
    for (let i = 0; i < q.length; i++) {
      const p = q[i], n = m(p, q[(i + 1) % q.length]);
      out += `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${n[0].toFixed(1)} ${n[1].toFixed(1)}`;
    }
    return out + 'Z';
  }

  function draw(u, phase, glide, alpha) {
    // wing angle: a full stroke while flapping, a gentle raised hold while gliding
    const beat = Math.sin(phase);
    const flap = (1 - glide) * (.35 + .75 * beat) + glide * .18;
    const bend = (1 - glide) * -.55 * Math.cos(phase) + glide * -.12;
    const [x, y] = route(u);
    const [x2, y2] = route(Math.min(1, u + .01));
    const rot = Math.max(-.45, Math.min(.3, Math.atan2(y2 - y, x2 - x))) * .45;
    const lift = (1 - glide) * 3 * Math.cos(phase); // body bobs with each stroke
    const body = BODY.map(([bx, by]) => project(bx * SCALE, by * SCALE, 0));
    farEl.setAttribute('d', d(wingPoints(-1, flap, bend), x, y + lift, rot));
    bodyEl.setAttribute('d', d(body, x, y + lift, rot));
    nearEl.setAttribute('d', d(wingPoints(1, flap, bend), x, y + lift, rot));
    svg.style.setProperty('--a', alpha.toFixed(3));
    return [x, y];
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(.45, .6, 1, 1); return; }

  const FLIGHT = 14;   // seconds to cross at calm speed
  const REST = 1.2;    // pause off-screen before the next pass
  const FLAPS = 4, GLIDE = 1.1; // beats per burst, seconds of glide between bursts
  let u = 0, phase = -Math.PI / 2, glide = 0, glideLeft = 0, flaps = 0, rest = 0;
  let speed = 1, last = performance.now(), mx = -1e4, my = -1e4, pos = [0, 0];
  addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function tick(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    // is the cursor near the bird? (canvas -> screen)
    const r = svg.getBoundingClientRect(), k = r.width / 692;
    const near = Math.hypot(r.left + pos[0] * k - mx, r.top + pos[1] * k - my) < 220;
    speed += ((near ? 2.8 : 1) - speed) * Math.min(1, dt * 3);

    if (rest > 0) { rest -= dt; svg.style.setProperty('--a', 0); requestAnimationFrame(tick); return; }
    u += dt * speed / FLIGHT;
    if (u >= 1) { u = 0; rest = REST; flaps = 0; glide = 0; glideLeft = 0; phase = -Math.PI / 2; }

    if (glideLeft > 0 && !near) {
      glideLeft -= dt;
      glide = Math.min(1, glide + dt * 2.5);
      if (glideLeft <= 0) { flaps = 0; phase = -Math.PI / 2 + .01; }
    } else {
      glideLeft = 0;
      glide = Math.max(0, glide - dt * 4);
      const before = phase;
      phase += dt * Math.PI * 2 * (near ? 4.2 : 2.3);
      // a beat ends each time the wing passes the top of the stroke
      if (Math.floor((before + Math.PI / 2) / (Math.PI * 2)) !== Math.floor((phase + Math.PI / 2) / (Math.PI * 2))) {
        if (++flaps >= FLAPS && !near) glideLeft = GLIDE;
      }
    }
    const alpha = 1;   // the path's ends are off screen
    pos = draw(u, phase, glide, Math.max(0, alpha));
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
