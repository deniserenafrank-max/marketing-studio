// The Closing Table: the keys land on the table one by one, the empty hook is tagged, and the
// actions are real: phone as text with Copy and a tel link, Book, Message, Search, socials.
import { h, qs, qsa } from '../core/dom.js';
import { store } from '../core/store.js';
import { audio } from '../core/audio.js';
import { reducedMotion } from '../core/prefs.js';
import { goTo } from '../core/scroll.js';
import { keySVG, hookSVG } from '../ui/keys.js';
import { icon } from '../ui/icons.js';
import { KEYS, HOUSE_KEY, MOVES, ROOMS, CLOSING, HUD, TOTAL_KEYS } from '../content/copy.js';

const room = ROOMS.find((r) => r.id === 'closing-table');

export function initClosing() {
  const section = qs('#closing-table');
  const table = qs('[data-table]', section);
  const sub = qs('[data-closing-sub]', section);
  const title = qs('#closing-table-title', section);
  if (!table) return;
  table.removeAttribute('aria-hidden');
  table.setAttribute('role', 'list');
  table.setAttribute('aria-label', 'Your keyring on the table');
  let landed = false;
  let skippedFrom = null;

  function renderTable(animate) {
    const state = store.get();
    table.innerHTML = '';
    KEYS.forEach((k, i) => {
      const earned = state.keys.includes(k.id);
      const el = h('div', { class: `table-key ${earned ? 'is-earned' : 'is-missing'}`, role: 'listitem' }, h('span', { html: keySVG(i, { earned, size: 48 }) }), h('span', { class: 'table-key-name', text: earned ? k.name : `${k.name}: still in the house` }));
      if (animate && earned && !reducedMotion()) {
        el.classList.add('is-landing');
        el.style.animationDelay = `${i * 140}ms`;
        window.setTimeout(() => audio.play('clink'), i * 140 + 120);
      }
      table.append(el);
    });
    table.append(h('div', { class: 'table-key table-hook', role: 'listitem' }, h('span', { html: hookSVG({ size: 48 }) }), h('span', { class: 'table-hook-tag', text: `${HOUSE_KEY.name}. ${HOUSE_KEY.tag}.` })));
  }

  function renderCopy() {
    const state = store.get();
    const n = state.keys.length;
    const move = MOVES.find((m) => m.id === state.move);
    title.textContent = move ? move.closing : room.headline;
    if (n === TOTAL_KEYS) sub.textContent = room.full;
    else if (n === 0) sub.textContent = room.skipped;
    else sub.textContent = room.partial;
    const primary = qs('[data-cta-primary]', section);
    const secondary = qs('[data-cta-secondary]', section);
    if (move && primary && secondary) {
      primary.href = move.primary.href;
      primary.innerHTML = `${move.primary.label}<span class="sr-only"> (opens in new tab)</span>`;
      secondary.href = move.secondary.href;
      secondary.innerHTML = `${move.secondary.label}<span class="sr-only"> (opens in new tab)</span>`;
    }
    // Never show the same destination twice on the table.
    const actions = qsa('.contact-actions a', section);
    const seen = new Set();
    for (const a of actions) {
      const dup = seen.has(a.href);
      a.hidden = dup;
      if (!dup) seen.add(a.href);
    }
  }

  const copyBtn = qs('[data-copy]', section);
  if (copyBtn && navigator.clipboard) {
    copyBtn.hidden = false;
    copyBtn.innerHTML = `${icon('copy')}<span>${CLOSING.copy}</span>`;
    copyBtn.addEventListener('click', async () => {
      const num = copyBtn.dataset.copy;
      try {
        await navigator.clipboard.writeText(num);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(qs('#phone-direct', section));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      const label = qs('span', copyBtn);
      label.textContent = CLOSING.copied;
      window.setTimeout(() => (label.textContent = CLOSING.copy), 2000);
    });
  }

  qsa('.contact a', section).forEach((a) => a.addEventListener('click', () => store.patch({ contacted: true })));

  const back = h('p', { class: 'closing-back', hidden: true }, h('button', { class: 'btn btn-ghost', type: 'button' }, h('span', { html: icon('arrow') }), HUD.back));
  back.querySelector('button').addEventListener('click', () => goTo(skippedFrom || 'front-hall'));
  qs('.contact', section).after(back);
  document.addEventListener('journey:skip', (e) => {
    skippedFrom = e.detail;
    back.hidden = false;
  });

  function finale() {
    if (reducedMotion()) return;
    const host = h('div', { class: 'finale', 'aria-hidden': 'true' });
    for (let i = 0; i < 28; i += 1) {
      const fly = h('span', { class: 'finale-fly', style: { left: `${5 + Math.random() * 90}%`, top: `${55 + Math.random() * 40}%`, animationDelay: `${Math.random() * 900}ms`, '--dx': `${(Math.random() - 0.5) * 120}px` } });
      host.append(fly);
    }
    document.body.append(host);
    window.setTimeout(() => host.remove(), 3400);
  }

  document.addEventListener('room:enter', (e) => {
    if (e.detail !== 'closing-table') return;
    renderCopy();
    if (!landed) {
      landed = true;
      renderTable(true);
      if (store.get().keys.length === TOTAL_KEYS) window.setTimeout(finale, 1100);
    }
  });
  renderCopy();
  renderTable(false);
  store.on('key', () => {
    if (landed) renderTable(false);
    renderCopy();
  });
  store.on('move', renderCopy);
  store.on('reset', () => {
    landed = false;
    renderTable(false);
    renderCopy();
  });
}
