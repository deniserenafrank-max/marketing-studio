// The keyring HUD: progress, the keyring dialog (rooms, achievements, change your move, start
// over), the Skip exit, and the sound and calm-mode toggles. Identical in every room.
import { h, qs, qsa } from '../core/dom.js';
import { store } from '../core/store.js';
import { announce } from '../core/announce.js';
import { audio } from '../core/audio.js';
import { reducedMotion, applyMotionClass } from '../core/prefs.js';
import { keySVG, hookSVG, ringSVG } from './keys.js';
import { showToast } from './toast.js';
import { icon } from './icons.js';
import { KEYS, ROOMS, MOVES, HUD, ACHIEVEMENTS, ANNOUNCE, TOTAL_KEYS } from '../content/copy.js';
import { goTo } from '../core/scroll.js';

let dialog = null;
let lastRoomBeforeSkip = null;

export function renderKeys(container, { size = 18, glow = false } = {}) {
  const state = store.get();
  container.innerHTML = KEYS.map((k, i) => keySVG(i, { earned: state.keys.includes(k.id), size })).join('') + hookSVG({ size });
  if (glow) qsa('.key.is-earned', container).forEach((k) => k.classList.add('is-glow'));
}

function updateCount() {
  const n = store.get().keys.length;
  const count = qs('[data-hud-count]');
  if (count) count.textContent = HUD.progress(n, TOTAL_KEYS);
  const short = qs('[data-hud-count-short]');
  if (short) short.textContent = `${n}/${TOTAL_KEYS}`;
  const ring = qs('[data-hud-open]');
  if (ring) ring.setAttribute('aria-label', `${HUD.menu}. ${HUD.progress(n, TOTAL_KEYS)}`);
}

function toggleButton(btn, { on, iconOn, iconOff, labelOn, labelOff, slot, label }) {
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  const s = qs(slot, btn);
  if (s) s.innerHTML = icon(on ? iconOn : iconOff);
  const l = qs(label, btn);
  if (l) l.textContent = on ? labelOn : labelOff;
}

function syncToggles() {
  const soundBtn = qs('[data-toggle-sound]');
  const motionBtn = qs('[data-toggle-motion]');
  if (soundBtn) toggleButton(soundBtn, { on: audio.enabled, iconOn: 'soundOn', iconOff: 'soundOff', labelOn: HUD.soundOn, labelOff: HUD.soundOff, slot: '[data-ico-sound]', label: '[data-sound-label]' });
  if (motionBtn) toggleButton(motionBtn, { on: reducedMotion(), iconOn: 'motionOff', iconOff: 'motionOn', labelOn: HUD.calmOn, labelOff: HUD.calmOff, slot: '[data-ico-motion]', label: '[data-motion-label]' });
}

function buildDialog() {
  if (dialog) return dialog;
  dialog = h('dialog', { class: 'ring-dialog', 'aria-labelledby': 'ring-title' });
  const inner = h('div', { class: 'ring-dialog-inner' });
  const closeBtn = h('button', { class: 'ring-close', type: 'button', 'aria-label': 'Close keyring', html: icon('close') });
  inner.append(h('div', { class: 'ring-dialog-head' }, h('h2', { id: 'ring-title', text: HUD.menu }), closeBtn));
  inner.append(h('p', { class: 'label', 'data-ring-count': '' }));
  const list = h('ol', { class: 'ring-list', 'data-ring-list': '' });
  inner.append(list);
  const ach = h('div', { class: 'ring-section' }, h('h3', { text: 'Achievements' }), h('ul', { class: 'badges', 'data-badges': '' }));
  inner.append(ach);
  const moveWrap = h('div', { class: 'ring-section' }, h('h3', { text: 'Your move' }), h('div', { class: 'ring-move', role: 'group', 'aria-label': 'Change your move', 'data-ring-moves': '' }));
  inner.append(moveWrap);
  const foot = h('div', { class: 'ring-foot' });
  const restartWrap = h('div', { class: 'restart-confirm', 'data-restart': '' });
  foot.append(restartWrap);
  inner.append(foot);
  dialog.append(inner);
  document.body.append(dialog);
  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    qs('[data-hud-open]')?.setAttribute('aria-expanded', 'false');
    qs('[data-hud-open]')?.focus();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  renderRestart(restartWrap);
  return dialog;
}

function renderRestart(wrap) {
  wrap.innerHTML = '';
  const btn = h('button', { class: 'btn btn-ghost', type: 'button', text: HUD.restart });
  btn.addEventListener('click', () => {
    wrap.innerHTML = '';
    const q = h('span', { class: 'fine', text: HUD.restartConfirm });
    const yes = h('button', { class: 'btn btn-secondary', type: 'button', text: HUD.restartYes });
    const no = h('button', { class: 'btn btn-ghost', type: 'button', text: HUD.restartNo });
    yes.addEventListener('click', () => {
      store.reset();
      announce(ANNOUNCE.reset);
      renderRestart(wrap);
      dialog.close();
      goTo('porch');
    });
    no.addEventListener('click', () => renderRestart(wrap));
    wrap.append(q, yes, no);
    yes.focus();
  });
  wrap.append(btn);
}

function fillDialog(currentRoom) {
  const state = store.get();
  qs('[data-ring-count]', dialog).textContent = HUD.progress(state.keys.length, TOTAL_KEYS);
  const list = qs('[data-ring-list]', dialog);
  list.innerHTML = '';
  ROOMS.forEach((room, i) => {
    const key = KEYS.find((k) => k.room === room.id);
    const earned = key ? state.keys.includes(key.id) : false;
    const row = h('a', { class: `ring-row ${earned ? 'is-earned' : ''}`, href: `#${room.id}`, 'aria-current': currentRoom === room.id ? 'true' : null });
    row.append(
      h('span', { html: key ? keySVG(KEYS.indexOf(key), { earned, size: 32 }) : hookSVG({ size: 32 }) }),
      h('span', {}, h('span', { class: 'ring-row-name', text: room.title }), h('br'), h('span', { class: 'ring-row-sub', text: key ? key.name : 'House Key, in person' })),
      h('span', { class: 'ring-row-state', text: key ? (earned ? HUD.earned : HUD.locked) : '' }),
    );
    row.addEventListener('click', () => dialog.close());
    list.append(h('li', {}, row));
  });
  const badges = qs('[data-badges]', dialog);
  badges.innerHTML = '';
  for (const a of ACHIEVEMENTS) {
    const on = state.achievements.includes(a.id);
    badges.append(h('li', { class: `badge ${on ? 'is-unlocked' : ''}` }, h('span', { html: icon(on ? 'check' : 'lock') }), h('span', {}, h('span', { class: 'badge-name', text: a.name }), h('br'), h('span', { class: 'badge-desc', text: on ? a.desc : HUD.locked }))));
  }
  const moves = qs('[data-ring-moves]', dialog);
  moves.innerHTML = '';
  for (const m of MOVES) {
    const b = h('button', { class: 'chip-sm', type: 'button', 'aria-pressed': state.move === m.id ? 'true' : 'false', text: m.label });
    b.addEventListener('click', () => {
      store.setMove(m.id);
      fillDialog(currentRoom);
    });
    moves.append(b);
  }
}

export function initHud() {
  const hud = qs('[data-hud]');
  if (!hud) return;
  const keysEl = qs('[data-hud-keys]');
  keysEl.insertAdjacentHTML('beforebegin', ringSVG({ size: 22 }).replace('class="key-ring"', 'class="key-ring hud-ring-icon"'));
  renderKeys(keysEl);
  updateCount();
  syncToggles();

  qs('[data-hud-open]')?.addEventListener('click', (e) => {
    const d = buildDialog();
    const current = document.querySelector('.room.is-lit:last-of-type')?.dataset.chapter || null;
    fillDialog(current);
    e.currentTarget.setAttribute('aria-expanded', 'true');
    d.showModal();
  });

  initSkipSwap();
  qs('[data-skip]')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.currentTarget.dataset.mode === 'back') {
      goTo(e.currentTarget.getAttribute('href').slice(1));
      return;
    }
    const lit = qsa('.room.is-lit');
    lastRoomBeforeSkip = lit.length ? lit[lit.length - 1].dataset.chapter : 'porch';
    if (store.get().keys.length < TOTAL_KEYS) store.unlock('straight');
    document.dispatchEvent(new CustomEvent('journey:skip', { detail: lastRoomBeforeSkip }));
    goTo('closing-table', { immediate: true });
  });

  qs('[data-toggle-sound]')?.addEventListener('click', async () => {
    if (audio.enabled) {
      audio.disable();
      announce(ANNOUNCE.soundOff);
    } else {
      const ok = await audio.enable();
      announce(ok ? ANNOUNCE.soundOn : ANNOUNCE.soundOff);
      if (ok) audio.play('pop');
    }
    syncToggles();
    qs('.hud-hint')?.remove();
  });

  qs('[data-toggle-motion]')?.addEventListener('click', () => {
    const next = reducedMotion() ? 'full' : 'reduced';
    store.setPref('motion', next);
    applyMotionClass();
    document.documentElement.classList.toggle('motion-full', next === 'full');
    announce(next === 'reduced' ? ANNOUNCE.calmOn : ANNOUNCE.calmOff);
    syncToggles();
  });

  store.on('key', (id) => {
    renderKeys(keysEl);
    const i = KEYS.findIndex((k) => k.id === id);
    const svg = keysEl.children[i];
    if (svg) svg.classList.add('just-earned');
    updateCount();
  });
  store.on('reset', () => {
    renderKeys(keysEl);
    updateCount();
  });
  store.on('change', updateCount);
}

export function lastSkipOrigin() {
  return lastRoomBeforeSkip;
}

let hinted = false;
export function showSoundHint() {
  if (audio.enabled || hinted) return;
  hinted = true;
  showToast({ iconName: 'soundOff', kicker: HUD.soundKicker, text: HUD.soundHint });
}

function initSkipSwap() {
  const skip = qs('[data-skip]');
  if (!skip) return;
  const long = qs('.hud-skip-long', skip);
  const short = qs('.hud-skip-short', skip);
  let lastRoom = 'front-hall';
  document.addEventListener('room:enter', (e) => {
    const id = e.detail;
    if (id === 'closing-table') {
      skip.dataset.mode = 'back';
      skip.setAttribute('href', `#${lastRoom}`);
      skip.setAttribute('aria-label', HUD.back);
      if (long) long.textContent = HUD.back;
      if (short) short.textContent = HUD.back;
    } else {
      if (id !== 'porch') lastRoom = id;
      skip.dataset.mode = 'skip';
      skip.setAttribute('href', '#closing-table');
      skip.setAttribute('aria-label', HUD.skip);
      if (long) long.textContent = HUD.skip;
      if (short) short.textContent = HUD.skipShort;
    }
  });
}
