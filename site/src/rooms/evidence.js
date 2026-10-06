// The Evidence Board: one listing on an index card, five hidden words, gold twine to a
// Polaroid with the plain meaning. Wrong taps cost nothing. Five finds: CASE CLOSED.
import { h, qs, qsa } from '../core/dom.js';
import { store } from '../core/store.js';
import { audio } from '../core/audio.js';
import { announce } from '../core/announce.js';
import { EVIDENCE, ROOMS } from '../content/copy.js';
import { rovingGroup } from './roving.js';

const room = ROOMS.find((r) => r.id === 'evidence-board');
const TILTS = [-1.5, 1, -0.8, 1.8, -1.2];

export function initEvidence() {
  const section = qs('#evidence-board');
  const host = qs('[data-evidence]', section);
  if (!host) return;
  const targets = EVIDENCE.listing.filter((p) => typeof p !== 'string');
  const found = new Set();
  let misses = 0;

  const listing = h('p', { class: 'listing', role: 'group', 'aria-label': 'The listing. Each word is a button.' });
  const words = [];
  for (const part of EVIDENCE.listing) {
    if (typeof part === 'string') {
      const tokens = part.split(/(\s+)/);
      for (const t of tokens) {
        if (!t) continue;
        if (/^\s+$/.test(t)) {
          listing.append(' ');
          continue;
        }
        const b = h('button', { class: 'word', type: 'button', 'aria-pressed': 'false', text: t });
        b.addEventListener('click', () => miss(b));
        words.push(b);
        listing.append(b);
      }
    } else {
      const b = h('button', { class: 'word word-target', type: 'button', 'aria-pressed': 'false', text: part.word, 'data-word': part.word });
      b.addEventListener('click', () => hit(b, part));
      words.push(b);
      listing.append(b);
    }
  }
  rovingGroup(words, { orientation: 'horizontal' });

  const stamp = h('div', { class: 'stamp', 'aria-hidden': 'true', text: room.stamp });
  const card = h('div', { class: 'index-card' }, h('p', { class: 'label', text: room.caseLabel }), listing, stamp);
  const count = h('p', { class: 'board-count', text: EVIDENCE.found(0) });
  const status = h('p', { class: 'status', role: 'status' });
  const polaroids = h('div', { class: 'polaroids', 'aria-live': 'off' });
  const twine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  twine.setAttribute('class', 'board-twine');
  twine.setAttribute('aria-hidden', 'true');
  const inner = h('div', { class: 'board-inner' }, h('div', {}, card, count, status), polaroids);
  const board = h('div', { class: 'board' }, twine, inner);
  host.replaceWith(h('div', { 'data-evidence': '' }, room.instruction ? h('p', { class: 'instruction', text: room.instruction }) : null, board));

  const lines = new Map();
  function drawTwine() {
    const br = board.getBoundingClientRect();
    for (const [btn, pol] of lines) {
      const a = btn.getBoundingClientRect();
      const b = pol.getBoundingClientRect();
      const line = pol.__line;
      line.setAttribute('x1', String(a.left + a.width / 2 - br.left));
      line.setAttribute('y1', String(a.bottom - br.top));
      line.setAttribute('x2', String(b.left + 24 - br.left));
      line.setAttribute('y2', String(b.top - br.top));
    }
  }
  window.addEventListener('resize', drawTwine);

  function hit(btn, part) {
    if (found.has(part.word)) return;
    found.add(part.word);
    btn.setAttribute('aria-pressed', 'true');
    audio.play('pin');
    const pol = h('div', { class: 'polaroid', style: { '--tilt': `${TILTS[found.size % TILTS.length]}deg` } }, h('p', { class: 'polaroid-word', text: part.word }), h('p', { class: 'polaroid-meaning', text: part.meaning }));
    polaroids.append(pol);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    pol.__line = line;
    twine.append(line);
    lines.set(btn, pol);
    window.requestAnimationFrame(drawTwine);
    pol.addEventListener('animationend', drawTwine, { once: true });
    window.setTimeout(() => audio.play('twang'), 180);
    count.textContent = EVIDENCE.found(found.size);
    status.textContent = EVIDENCE.correct(part.word, part.meaning);
    status.classList.add('is-good');
    if (found.size === targets.length) closeCase();
  }
  function miss(btn) {
    misses += 1;
    btn.classList.remove('is-wrong');
    void btn.offsetWidth;
    btn.classList.add('is-wrong');
    status.classList.remove('is-good');
    status.textContent = room.wrong;
  }
  function closeCase(restoring = false) {
    stamp.classList.add('is-on');
    card.classList.add('is-closed');
    if (!restoring) {
      audio.play('pin');
      store.earnKey('case');
      if (misses === 0) store.unlock('caseclosed');
      announce(`${room.stamp}. All five found.`);
    }
  }
  if (store.hasKey('case')) {
    for (const part of targets) {
      const btn = words.find((w) => w.dataset.word === part.word);
      if (btn) hitSilent(btn, part);
    }
    closeCase(true);
    count.textContent = EVIDENCE.found(found.size);
  }
  function hitSilent(btn, part) {
    found.add(part.word);
    btn.setAttribute('aria-pressed', 'true');
    const pol = h('div', { class: 'polaroid', style: { '--tilt': `${TILTS[found.size % TILTS.length]}deg` } }, h('p', { class: 'polaroid-word', text: part.word }), h('p', { class: 'polaroid-meaning', text: part.meaning }));
    polaroids.append(pol);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    pol.__line = line;
    twine.append(line);
    lines.set(btn, pol);
    window.requestAnimationFrame(drawTwine);
  }
  document.addEventListener('room:enter', (e) => {
    if (e.detail === 'evidence-board') window.setTimeout(drawTwine, 300);
  });
  document.fonts?.ready?.then(drawTwine);
  store.on('reset', () => {
    found.clear();
    lines.clear();
    misses = 0;
    polaroids.innerHTML = '';
    twine.innerHTML = '';
    words.forEach((w) => {
      w.setAttribute('aria-pressed', 'false');
      w.classList.remove('is-wrong');
    });
    stamp.classList.remove('is-on');
    card.classList.remove('is-closed');
    count.textContent = EVIDENCE.found(0);
    status.textContent = '';
    status.classList.remove('is-good');
  });
}
