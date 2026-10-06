// The key board that hangs in the Front Hall: seven hooks and the keys you have earned so far,
// a decorative mirror of the HUD (aria-hidden) that fills in as the house is played.
import { h } from '../core/dom.js';
import { store } from '../core/store.js';
import { keySVG, hookSVG } from './keys.js';
import { KEYS } from '../content/copy.js';

export function keyBoard() {
  const board = h('aside', { class: 'key-board', 'aria-hidden': 'true' });
  const title = h('p', { class: 'key-board-title', text: 'Your keyring, so far' });
  const row = h('div', { class: 'key-board-row' });
  const render = () => {
    const state = store.get();
    row.innerHTML = '';
    KEYS.forEach((k, i) => {
      const earned = state.keys.includes(k.id);
      row.append(h('div', { class: `key-board-hook ${earned ? 'is-earned' : ''}` }, h('span', { class: 'key-board-peg', html: hookSVG({ size: 22 }) }), earned ? h('span', { class: 'key-board-key', html: keySVG(i, { earned: true, size: 40 }) }) : h('span', { class: 'key-board-key key-board-key-empty' })));
    });
  };
  render();
  store.on('key', render);
  store.on('reset', render);
  board.append(title, row);
  return board;
}
