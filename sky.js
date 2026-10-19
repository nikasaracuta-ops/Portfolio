// The world behind the page: one full-screen WebGL shader that paints the sky,
// clouds, sun and sea. As you scroll it moves through five scenes — deep sky,
// the cloud bank, airy haze (work), sunset over the sea, underwater (contact) —
// following the section in the middle of the screen. No images needed.
// Without WebGL the CSS gradient on .world stays; with reduced motion the
// clouds stand still and the scene only changes as you scroll.
(() => {
  const canvas = document.getElementById('sky');
  const gl = canvas && (canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false }) || canvas.getContext('experimental-webgl'));
  if (!gl) return;
  document.documentElement.classList.add('has-sky');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const vert = 'attribute vec2 p; void main() { gl_Position = vec4(p, 0., 1.); }';
  const frag = `
precision highp float;
uniform vec2 R;      // canvas size
uniform float T;     // time (s)
uniform float S;     // scene: 0 sky, 1 cloud bank, 2 haze, 3 sunset, 4 underwater
uniform vec2 M;      // pointer, -1..1

float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0., a = .5;
  for (int i = 0; i < 5; i++) { v += a * n(p); p = p * 2.03 + vec2(1.7, 9.2); a *= .5; }
  return v;
}
// one value per scene, blended by S
vec3 pick(vec3 a, vec3 b, vec3 c, vec3 d, vec3 e) {
  return S < 1. ? mix(a, b, S) : S < 2. ? mix(b, c, S - 1.) : S < 3. ? mix(c, d, S - 2.) : mix(d, e, S - 3.);
}
float pickf(float a, float b, float c, float d, float e) {
  return S < 1. ? mix(a, b, S) : S < 2. ? mix(b, c, S - 1.) : S < 3. ? mix(c, d, S - 2.) : mix(d, e, S - 3.);
}

void main() {
  vec2 uv = gl_FragCoord.xy / R;
  vec2 p = (uv - .5) * vec2(R.x / R.y, 1.);
  float t = T;

  // sky gradient
  vec3 top = pick(vec3(.03, .18, .47), vec3(.16, .38, .72), vec3(.93, .95, 1.), vec3(.98, .72, .82), vec3(.02, .28, .38));
  vec3 low = pick(vec3(.30, .55, .88), vec3(.86, .92, 1.), vec3(1., 1., 1.), vec3(1., .86, .62), vec3(.07, .55, .63));
  vec3 col = mix(low, top, smoothstep(-.1, 1.05, uv.y));

  // clouds: domain-warped noise drifting sideways, nudged by the pointer
  vec2 q = p * 1.5 + vec2(t * .018, 0.) + M * .04;
  float w = fbm(q * .9 + vec2(t * .01, -t * .006));
  float c = fbm(q + 1.6 * vec2(w, fbm(q + 3.1)));
  float cover = pickf(.56, .42, .6, .6, 1.2);
  float bank = pickf(0., .35, 0., 0., 0.) * smoothstep(.65, 0., uv.y);     // the cloud bank rises from below
  float cl = smoothstep(cover, cover + .28, c + bank);
  vec3 cloudCol = pick(vec3(1.), vec3(1.), vec3(.95, .93, 1.), vec3(1., .9, .95), vec3(.6, .95, 1.));
  col = mix(col, cloudCol, cl * pickf(.85, .95, .35, .55, 0.));

  // sun and sea (sunset), rising together
  float sunset = smoothstep(2.2, 3., S) * (1. - smoothstep(3.3, 3.9, S));
  float horizon = mix(-.62, -.18, smoothstep(2.3, 3., S)) + smoothstep(3.2, 4., S) * 1.4;   // water rises over everything underwater
  vec2 sc = vec2(0., horizon + mix(-.2, .17, smoothstep(2.4, 3.1, S)));
  float d = length(p - sc);
  vec3 sunCol = mix(vec3(1., .36, .67), vec3(.84, 1., .35), smoothstep(-.18, .2, p.y - sc.y));
  col += sunset * vec3(1., .75, .6) * exp(-d * 3.2) * .55;
  col = mix(col, sunCol, sunset * smoothstep(.215, .2, d));

  // sea below the horizon: depth, ripples, the sun's reflection
  float sea = smoothstep(horizon + .004, horizon - .004, p.y);
  float depth = clamp((horizon - p.y) * 1.4, 0., 1.);
  vec3 water = mix(vec3(.28, .78, .84), vec3(.02, .3, .42), depth);
  float rip = fbm(vec2(p.x * 3., (p.y - t * .05) * 22.) + w);
  water += smoothstep(.62, .8, rip) * .12 * (1. - depth);
  float glint = sunset * exp(-abs(p.x - sc.x) * 9.) * smoothstep(.5, .75, n(vec2(p.x * 40., p.y * 90. + t * 2.)));
  water += glint * vec3(1., .85, .7) * .6;
  // underwater: light ripples (caustics) and rays from the surface
  float under = smoothstep(3.3, 4., S);
  float ca = fbm(p * 3.2 + vec2(t * .05, t * .08) + w);
  water += under * pow(abs(sin(ca * 14.)), 10.) * .22;
  water += under * .12 * smoothstep(.3, 1., uv.y) * pow(max(0., sin(p.x * 7. + t * .3 + fbm(p * 2.) * 3.)), 6.);
  col = mix(col, water, sea);

  // soft vignette
  col *= 1. - .18 * dot(uv - .5, uv - .5);
  gl_FragColor = vec4(col, 1.);
}`;

  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  try {
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) { console.warn('sky shader:', e); document.documentElement.classList.remove('has-sky'); return; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = name => gl.getUniformLocation(prog, name);
  const uR = U('R'), uT = U('T'), uS = U('S'), uM = U('M');

  // the shader is soft and blurry by design: render small and let CSS scale it up
  const SCALE = .5;
  function resize() {
    const w = Math.max(1, Math.round(innerWidth * SCALE)), h = Math.max(1, Math.round(innerHeight * SCALE));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  }
  addEventListener('resize', resize); resize();

  // scene from the section in the middle of the screen: hold inside a section,
  // blend into the next one over its last stretch
  const sections = ['.hero', '.about', '.work', '.sunset', '.contact'].map(s => document.querySelector(s));
  const box = el => (el.parentElement && el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el).getBoundingClientRect();
  function scene() {
    const mid = innerHeight * .5;
    let s = 0;
    sections.forEach((el, i) => {
      if (!el) return;
      const r = box(el);
      if (r.top <= mid) s = i + Math.min(1, Math.max(0, ((mid - r.top) / r.height - .7) / .3));
    });
    return Math.min(4, s);
  }

  let mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener('pointermove', e => { tmx = e.clientX / innerWidth * 2 - 1; tmy = 1 - e.clientY / innerHeight * 2; }, { passive: true });

  let s = scene(), t0 = performance.now(), last = -1, raf = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const target = scene();
    s += (target - s) * (reduce ? 1 : .08);
    mx += (tmx - mx) * .03; my += (tmy - my) * .03;
    const t = reduce ? 20 : (now - t0) / 1000;
    if (reduce && Math.abs(s - last) < .0005) return;   // still image: draw only when the scene changes
    last = s;
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, t);
    gl.uniform1f(uS, s);
    gl.uniform2f(uM, reduce ? 0 : mx, reduce ? 0 : my);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  raf = requestAnimationFrame(frame);
  window.Sky = { scene: () => s };
})();
