// Motion and power preferences. The visitor's in-page choice wins over the OS setting; "auto"
// follows prefers-reduced-motion. Low-power detection only ever reduces work, never adds it.
import { store } from './store.js';

const mq = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener() {} });
const reducedMq = mq('(prefers-reduced-motion: reduce)');
const coarseMq = mq('(pointer: coarse)');

export function reducedMotion() {
  const pref = store.get().prefs.motion;
  if (pref === 'reduced') return true;
  if (pref === 'full') return false;
  return reducedMq.matches;
}

export function lowPower() {
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const conn = nav.connection || {};
  if (conn.saveData) return true;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return true;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4 && coarseMq.matches) return true;
  return false;
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function onMotionChange(fn) {
  reducedMq.addEventListener?.('change', () => fn(reducedMotion()));
  store.on('pref', ({ key }) => {
    if (key === 'motion') fn(reducedMotion());
  });
}

export function applyMotionClass() {
  const root = document.documentElement;
  root.classList.toggle('reduced-motion', reducedMotion());
  root.classList.toggle('low-power', lowPower());
}
