import { h, qs } from '../core/dom.js';
import { keySVG } from './keys.js';
import { icon } from './icons.js';

const HOLD = 4200;

export function showToast({ keyIndex = null, iconName = null, kicker, text, count = '' }) {
  const host = qs('[data-toasts]');
  if (!host) return;
  const visual = keyIndex !== null ? h('div', { html: keySVG(keyIndex, { earned: true, size: 32 }) }) : h('div', { html: icon(iconName || 'check') });
  const toast = h('div', { class: 'toast' }, visual, h('div', {}, h('div', { class: 'toast-kicker', text: kicker }), h('div', { class: 'toast-text', text }), count ? h('div', { class: 'toast-count num', text: count }) : null));
  host.appendChild(toast);
  while (host.children.length > 3) host.firstElementChild.remove();
  let timer = window.setTimeout(leave, HOLD);
  toast.addEventListener('mouseenter', () => window.clearTimeout(timer));
  toast.addEventListener('mouseleave', () => (timer = window.setTimeout(leave, 1600)));
  function leave() {
    toast.classList.add('is-leaving');
    window.setTimeout(() => toast.remove(), 360);
  }
}
