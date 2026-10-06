// Procedural sound: no files, nothing plays until the visitor turns sound on, and no
// information is carried by sound alone. Cues: knock, pin, twang, clink, lamp, flip, pop,
// plus a crickets bed.
import { store } from './store.js';

let ctx = null;
let master = null;
let cricketTimer = 0;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);
  return ctx;
}

export const audio = {
  get enabled() {
    return store.get().prefs.sound === 'on';
  },
  async enable() {
    const c = ensure();
    if (!c) return false;
    try {
      if (c.state === 'suspended') await c.resume();
    } catch {
      return false;
    }
    store.setPref('sound', 'on');
    crickets(true);
    return true;
  },
  disable() {
    store.setPref('sound', 'off');
    crickets(false);
  },
  play(name) {
    if (!audio.enabled) return;
    const c = ensure();
    if (!c || c.state !== 'running') return;
    const t = c.currentTime;
    const cue = CUES[name];
    if (cue) cue(c, t);
  },
};

function noiseBuffer(c, seconds = 0.3) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i += 1) d[i] = Math.random() * 2 - 1;
  return buf;
}

function thump(c, t, { freq = 90, decay = 0.18, gain = 0.9 }) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(freq * 1.6, t);
  o.frequency.exponentialRampToValueAtTime(freq, t + 0.03);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + decay);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + decay + 0.05);
}

function tone(c, t, { freq, decay = 0.6, gain = 0.25, type = 'sine', detune = 0 }) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.detune.value = detune;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + decay);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + decay + 0.05);
}

function burst(c, t, { decay = 0.08, gain = 0.4, hp = 1500 }) {
  const s = c.createBufferSource();
  s.buffer = noiseBuffer(c, decay + 0.05);
  const f = c.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = hp;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + decay);
  s.connect(f).connect(g).connect(master);
  s.start(t);
}

const CUES = {
  knock(c, t) {
    thump(c, t, { freq: 110, decay: 0.16 });
    burst(c, t, { decay: 0.05, gain: 0.25, hp: 800 });
    thump(c, t + 0.19, { freq: 100, decay: 0.16 });
    burst(c, t + 0.19, { decay: 0.05, gain: 0.25, hp: 800 });
    thump(c, t + 0.36, { freq: 105, decay: 0.2 });
    burst(c, t + 0.36, { decay: 0.05, gain: 0.25, hp: 800 });
  },
  pin(c, t) {
    burst(c, t, { decay: 0.04, gain: 0.35, hp: 2500 });
    thump(c, t, { freq: 240, decay: 0.08, gain: 0.5 });
  },
  twang(c, t) {
    tone(c, t, { freq: 660, decay: 0.35, gain: 0.12, type: 'triangle' });
    tone(c, t + 0.01, { freq: 990, decay: 0.25, gain: 0.06, type: 'triangle', detune: 8 });
  },
  clink(c, t) {
    tone(c, t, { freq: 2200, decay: 0.5, gain: 0.14, type: 'sine' });
    tone(c, t, { freq: 3300, decay: 0.3, gain: 0.08, type: 'sine', detune: 12 });
    burst(c, t, { decay: 0.02, gain: 0.2, hp: 4000 });
  },
  lamp(c, t) {
    burst(c, t, { decay: 0.03, gain: 0.3, hp: 3000 });
    tone(c, t + 0.02, { freq: 1200, decay: 0.08, gain: 0.08 });
  },
  flip(c, t) {
    burst(c, t, { decay: 0.12, gain: 0.18, hp: 1200 });
  },
  pop(c, t) {
    tone(c, t, { freq: 520, decay: 0.18, gain: 0.16, type: 'sine' });
    tone(c, t + 0.08, { freq: 780, decay: 0.3, gain: 0.14, type: 'sine' });
  },
};

function chirp(c, t) {
  for (let i = 0; i < 4; i += 1) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = 4200 + Math.random() * 300;
    const at = t + i * 0.055;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.03, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.04);
    o.connect(g).connect(master);
    o.start(at);
    o.stop(at + 0.05);
  }
}

function crickets(on) {
  window.clearTimeout(cricketTimer);
  if (!on) return;
  const loop = () => {
    const c = ensure();
    if (!c || !audio.enabled || c.state !== 'running' || document.hidden) {
      cricketTimer = window.setTimeout(loop, 800);
      return;
    }
    chirp(c, c.currentTime + 0.05);
    cricketTimer = window.setTimeout(loop, 380 + Math.random() * 900);
  };
  loop();
}

export function resumeCricketsIfOn() {
  if (!audio.enabled || !ctx) return;
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
  crickets(true);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', () => {
    if (audio.enabled && ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
  }, { passive: true });
}
