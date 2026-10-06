import { h, qs } from '../core/dom.js';
import { keySVG } from './keys.js';
import { icon } from './icons.js';

// One toast at a time (3.5s hold, hover pauses). An achievement that lands within a beat of a
// key toast folds into it as a second line instead of stacking.
const HOLD = 3500;
const FOLD_WINDOW = 2600;
const queue = [];
let current = null;

export function showToast({ keyIndex = null, iconName = null, kicker, text, count = '', foldable = false }) {
  if (foldable && current && current.keyIndex !== null && Date.now() - current.shownAt < FOLD_WINDOW) {
    const line = h('div', { class: 'toast-also', text: `Also: ${text}` });
    qs('.toast-body', current.el).append(line);
    current.extend();
    return;
  }
  queue.push({ keyIndex, iconName, kicker, text, count });
  drain();
}

function drain() {
  if (current || queue.length === 0) return;
  const host = qs('[data-toasts]');
  if (!host) return;
  const t = queue.shift();
  const visual = t.keyIndex !== null ? h('div', { html: keySVG(t.keyIndex, { earned: true, size: 32 }) }) : h('div', { html: icon(t.iconName || 'check') });
  const body = h('div', { class: 'toast-body' }, h('div', { class: 'toast-kicker', text: t.kicker }), h('div', { class: 'toast-text', text: t.text }), t.count ? h('div', { class: 'toast-count num', text: t.count }) : null);
  const el = h('div', { class: 'toast' }, visual, body);
  host.appendChild(el);
  let timer = window.setTimeout(leave, HOLD);
  const extend = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(leave, HOLD);
  };
  el.addEventListener('mouseenter', () => window.clearTimeout(timer));
  el.addEventListener('mouseleave', () => (timer = window.setTimeout(leave, 1400)));
  current = { el, keyIndex: t.keyIndex, shownAt: Date.now(), extend };
  function leave() {
    el.classList.add('is-leaving');
    window.setTimeout(() => {
      el.remove();
      current = null;
      drain();
    }, 360);
  }
}
