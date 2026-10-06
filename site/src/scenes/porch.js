// The signature opening: a night in the Houston-north pines, one porch light on, fireflies.
// Four parallax treelines (ShapeGeometry), one Points draw call for the fireflies, sprites for
// the light and ground mist. Renders only while visible; under reduced motion it draws a
// single still frame. All colors come from CSS tokens so the brand JSON stays the source.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Points, PointsMaterial, BufferGeometry,
  Float32BufferAttribute, ShaderMaterial, AdditiveBlending, Shape, ShapeGeometry, Mesh,
  MeshBasicMaterial, Sprite, SpriteMaterial, CanvasTexture, SRGBColorSpace,
} from 'three';
import { skyline, mulberry32 } from './treeline.js';

const FOV = 52;

function token(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function radialTexture(size = 256, stops = [[0, 'rgba(255,255,255,1)'], [0.25, 'rgba(255,255,255,0.45)'], [0.6, 'rgba(255,255,255,0.08)'], [1, 'rgba(255,255,255,0)']]) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) g.addColorStop(o, col);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function visibleWidthAt(depth, aspect) {
  return 2 * depth * Math.tan((FOV * Math.PI) / 360) * aspect;
}

function treeline({ z, baseY, color, seed, min, max, spacing, clearing = null }) {
  const width = visibleWidthAt(Math.abs(z), 2.4) * 1.6;
  const pts = skyline({ width, seed, minHeight: min, maxHeight: max, spacing, step: Math.max(0.03, width / 900), clearing });
  const shape = new Shape();
  shape.moveTo(-width / 2, -12);
  for (const [x, y] of pts) shape.lineTo(x, y);
  shape.lineTo(width / 2, -12);
  shape.closePath();
  const mesh = new Mesh(new ShapeGeometry(shape), new MeshBasicMaterial({ color: new Color(color) }));
  mesh.position.set(0, baseY, z);
  return mesh;
}

function house({ x, z, baseY, wall, window: win, spillTexture, spillColor }) {
  const parts = [];
  const wallMat = new MeshBasicMaterial({ color: new Color(wall) });
  const winMat = new MeshBasicMaterial({ color: new Color(win) });
  const poly = (pts) => {
    const g = new Shape();
    g.moveTo(pts[0][0], pts[0][1]);
    for (const [px, py] of pts.slice(1)) g.lineTo(px, py);
    g.closePath();
    return new ShapeGeometry(g);
  };
  const rect = (rw, rh) => poly([[-rw / 2, 0], [rw / 2, 0], [rw / 2, rh], [-rw / 2, rh]]);
  const add = (geo, mat, px, py, pz) => {
    const m = new Mesh(geo, mat);
    m.position.set(px, py, pz);
    parts.push(m);
    return m;
  };
  const w = 2.1;
  const hgt = 1.0;
  // Body with gable, eave overhangs and a chimney on the left slope.
  add(poly([[-w / 2, 0], [w / 2, 0], [w / 2, hgt], [w / 2 + 0.22, hgt], [0, hgt + 0.78], [-0.42, hgt + 0.47], [-0.42, hgt + 0.72], [-0.6, hgt + 0.72], [-0.6, hgt + 0.33], [-w / 2 - 0.22, hgt], [-w / 2, hgt]]), wallMat, x, baseY, z);
  // Porch awning and a step under the door.
  add(rect(0.9, 0.06), wallMat, x + 0.45, baseY + 0.76, z + 0.03);
  add(rect(0.7, 0.07), wallMat, x + 0.45, baseY - 0.07, z + 0.03);
  // Four-pane window: two columns, two rows, with a mullion gap.
  const pane = rect(0.13, 0.15);
  for (const [dx, dy] of [[-0.075, 0.17], [0.075, 0.17], [-0.075, 0], [0.075, 0]]) add(pane, winMat, x - 0.62 + dx, baseY + 0.4 + dy, z + 0.02);
  // Door, lit from inside, narrower than before.
  add(rect(0.22, 0.58), winMat, x + 0.45, baseY, z + 0.02);
  // Warm spill on the ground under the porch.
  if (spillTexture) {
    const spill = new Sprite(new SpriteMaterial({ map: spillTexture, color: new Color(spillColor), transparent: true, opacity: 0.22, blending: AdditiveBlending, depthWrite: false }));
    spill.position.set(x + 0.5, baseY - 0.18, z + 0.4);
    spill.scale.set(3.4, 0.9, 1);
    parts.push(spill);
  }
  return parts;
}

function fireflies(count, { colorA, colorB, seed = 9 }) {
  const rnd = mulberry32(seed);
  const pos = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const speed = new Float32Array(count);
  const size = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    pos[i * 3] = (rnd() - 0.5) * 26;
    pos[i * 3 + 1] = -2.4 + rnd() * 4.2;
    pos[i * 3 + 2] = -2.2 - rnd() * 7;
    phase[i] = rnd() * Math.PI * 2;
    speed[i] = 0.35 + rnd() * 0.75;
    size[i] = 10 + rnd() * 20;
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setAttribute('aPhase', new Float32BufferAttribute(phase, 1));
  geo.setAttribute('aSpeed', new Float32BufferAttribute(speed, 1));
  geo.setAttribute('aSize', new Float32BufferAttribute(size, 1));
  const mat = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uColorA: { value: new Color(colorA) },
      uColorB: { value: new Color(colorB) },
    },
    vertexShader: `
      uniform float uTime; uniform float uPixelRatio;
      attribute float aPhase; attribute float aSpeed; attribute float aSize;
      varying float vBlink;
      void main() {
        vec3 p = position;
        p.x += sin(uTime * aSpeed * 0.55 + aPhase) * 0.5;
        p.y += sin(uTime * aSpeed * 0.85 + aPhase * 1.7) * 0.32;
        p.z += cos(uTime * aSpeed * 0.45 + aPhase) * 0.3;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float blink = 0.5 + 0.5 * sin(uTime * (0.7 + aSpeed) + aPhase * 3.0);
        blink = smoothstep(0.3, 1.0, blink);
        vBlink = blink;
        gl_PointSize = aSize * uPixelRatio * (7.0 / max(1.0, -mv.z)) * (0.55 + 0.45 * blink);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColorA; uniform vec3 uColorB; varying float vBlink;
      void main() {
        vec2 uv = gl_PointCoord - 0.5; float d = length(uv);
        float core = smoothstep(0.16, 0.0, d);
        float halo = smoothstep(0.5, 0.04, d) * 0.3;
        float a = (core + halo) * (0.12 + 0.88 * vBlink);
        vec3 c = mix(uColorA, uColorB, vBlink);
        gl_FragColor = vec4(c * a, a);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: AdditiveBlending,
  });
  return new Points(geo, mat);
}

function stars(count, color) {
  const rnd = mulberry32(21);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    pos[i * 3] = (rnd() - 0.5) * 120;
    pos[i * 3 + 1] = 4 + rnd() * 30;
    pos[i * 3 + 2] = -60;
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  return new Points(geo, new PointsMaterial({ color: new Color(color), size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.45, depthWrite: false }));
}

export function createPorchScene(canvas, { reduced = false, lowPower = false } = {}) {
  const colors = {
    pine1: token('--c-pine-1', '#03110c'),
    pine2: token('--c-pine-2', '#061a13'),
    pine3: token('--c-pine-3', '#0c2a1f'),
    pine4: token('--c-pine-4', '#143a2d'),
    gold: token('--c-brand', '#d4a843'),
    lightGold: token('--c-profit', '#e8c874'),
    ink: token('--c-ink', '#f4ebdd'),
    mist: token('--c-ink2', '#c8c1b0'),
  };

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !lowPower, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 2, 0.1, 200);
  const camBase = { x: 0, y: 0.5, z: 0 };
  camera.position.set(camBase.x, camBase.y, camBase.z);

  const HOUSE = { x: 1.15, z: -7.4, baseY: -1.85 };
  scene.add(stars(lowPower ? 80 : 160, colors.ink));
  scene.add(treeline({ z: -24, baseY: -0.2, color: colors.pine4, seed: 11, min: 3.2, max: 6.2, spacing: 1.5 }));
  scene.add(treeline({ z: -14, baseY: -0.9, color: colors.pine3, seed: 7, min: 2.4, max: 4.6, spacing: 1.15 }));
  scene.add(treeline({ z: -9, baseY: -1.55, color: colors.pine2, seed: 5, min: 1.9, max: 3.9, spacing: 1.0, clearing: { x: 1.5, width: 2.6, depth: 0.55 } }));
  const glowTex = radialTexture();
  scene.add(...house({ x: HOUSE.x, z: HOUSE.z, baseY: HOUSE.baseY, wall: colors.pine1, window: colors.lightGold, spillTexture: glowTex, spillColor: colors.gold }));
  scene.add(treeline({ z: -5, baseY: -2.7, color: colors.pine1, seed: 3, min: 1.4, max: 3.3, spacing: 0.9, clearing: { x: 0.9, width: 2.4, depth: 0.9 } }));

  const glow = new Sprite(new SpriteMaterial({ map: glowTex, color: new Color(colors.gold), transparent: true, opacity: 0.55, blending: AdditiveBlending, depthWrite: false }));
  glow.position.set(HOUSE.x + 0.45, HOUSE.baseY + 0.78, HOUSE.z + 0.08);
  glow.scale.set(3.6, 3.6, 1);
  const halation = new Sprite(new SpriteMaterial({ map: glowTex, color: new Color(colors.gold), transparent: true, opacity: 0.14, blending: AdditiveBlending, depthWrite: false }));
  halation.position.copy(glow.position);
  halation.scale.set(9, 9, 1);
  const core = new Sprite(new SpriteMaterial({ map: glowTex, color: new Color(colors.lightGold), transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false }));
  core.position.set(HOUSE.x + 0.45, HOUSE.baseY + 0.78, HOUSE.z + 0.1);
  core.scale.set(0.55, 0.55, 1);
  scene.add(halation, glow, core);

  const mistTex = radialTexture(256, [[0, 'rgba(255,255,255,0.5)'], [0.5, 'rgba(255,255,255,0.12)'], [1, 'rgba(255,255,255,0)']]);
  const mists = [];
  for (let i = 0; i < (lowPower ? 2 : 4); i += 1) {
    const s = new Sprite(new SpriteMaterial({ map: mistTex, color: new Color(colors.mist), transparent: true, opacity: 0.07, depthWrite: false }));
    s.position.set(-6 + i * 4.5, -2.1 + (i % 2) * 0.4, -6.5 - i * 1.8);
    s.scale.set(13, 3.2, 1);
    s.userData.x0 = s.position.x;
    mists.push(s);
    scene.add(s);
  }

  const flies = fireflies(lowPower ? 70 : 190, { colorA: colors.gold, colorB: colors.lightGold });
  scene.add(flies);

  const state = { reduced, running: false, visible: true, scroll: 0, pointer: { x: 0, y: 0 }, pointerSmooth: { x: 0, y: 0 }, raf: 0, t0: performance.now(), time: 0 };
  const STILL_TIME = 7.3;

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const hgt = canvas.clientHeight || window.innerHeight;
    const pr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5);
    renderer.setPixelRatio(pr);
    renderer.setSize(w, hgt, false);
    camera.aspect = w / hgt;
    camera.updateProjectionMatrix();
    flies.material.uniforms.uPixelRatio.value = pr;
    if (state.reduced || !state.running) renderOnce();
  }

  function applyCamera() {
    const p = state.reduced ? { x: 0, y: 0 } : state.pointerSmooth;
    const t = state.scroll;
    // Portrait screens: pull back and look up so the house sits small in the lower third,
    // under the copy, with its ridge near 68vh.
    const portrait = camera.aspect < 0.8 ? 1 : camera.aspect < 1.1 ? 0.5 : 0;
    camera.position.x = camBase.x + p.x * 0.4 + t * 0.5 - portrait * 0.2;
    camera.position.y = camBase.y + p.y * 0.2 - t * 0.35 + portrait * 0.3;
    camera.position.z = camBase.z - t * 1.9 + portrait * 1.6;
    camera.lookAt(camera.position.x * 0.5 + 0.5 + portrait * 0.3, camBase.y - 0.45 - t * 0.5 + portrait * 1.35, -12);
    glow.material.opacity = 0.55 + t * 0.3;
    core.material.opacity = 0.95;
  }

  function renderOnce() {
    const t = state.reduced ? STILL_TIME : state.time;
    flies.material.uniforms.uTime.value = t;
    mists.forEach((m, i) => {
      m.position.x = m.userData.x0 + Math.sin(t * 0.05 + i) * 1.2;
    });
    applyCamera();
    renderer.render(scene, camera);
  }

  function tick(now) {
    if (!state.running) return;
    state.time = (now - state.t0) / 1000;
    state.pointerSmooth.x += (state.pointer.x - state.pointerSmooth.x) * 0.045;
    state.pointerSmooth.y += (state.pointer.y - state.pointerSmooth.y) * 0.045;
    renderOnce();
    state.raf = requestAnimationFrame(tick);
  }

  function start() {
    if (state.running || state.reduced || !state.visible || document.hidden) return;
    state.running = true;
    state.t0 = performance.now() - state.time * 1000;
    state.raf = requestAnimationFrame(tick);
  }

  function stop() {
    state.running = false;
    cancelAnimationFrame(state.raf);
  }

  const io = new IntersectionObserver((entries) => {
    state.visible = entries.some((e) => e.isIntersecting);
    if (state.visible) start();
    else stop();
  });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('resize', resize);

  resize();
  renderOnce();
  start();

  return {
    setScroll(t) {
      state.scroll = Math.max(0, Math.min(1, t));
      if (!state.running) renderOnce();
    },
    setPointer(x, y) {
      state.pointer.x = Math.max(-1, Math.min(1, x));
      state.pointer.y = Math.max(-1, Math.min(1, y));
    },
    setReduced(v) {
      state.reduced = Boolean(v);
      if (state.reduced) {
        stop();
        renderOnce();
      } else start();
    },
    resize,
    renderOnce,
    dispose() {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', resize);
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        if (o.material) {
          o.material.map?.dispose?.();
          o.material.dispose?.();
        }
      });
      renderer.dispose();
    },
  };
}
