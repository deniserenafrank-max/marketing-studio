// The Front Hall: four doors, one choice, the Hall Key. The choice personalizes the Lab, the
// Map Room note and the Closing Table.
import { h, qs, qsa } from '../core/dom.js';
import { store } from '../core/store.js';
import { icon } from '../ui/icons.js';
import { MOVES } from '../content/copy.js';
import { rovingGroup } from './roving.js';
import { keyBoard } from '../ui/keyboard.js';

const ICONS = { buy: 'door', sell: 'stamp', rent: 'calendar', landlord: 'book' };

export function initHall() {
  const section = qs('#front-hall');
  const host = qs('[data-moves]', section);
  const question = qs('.room-question', section);
  if (!host) return;
  question.id = 'front-hall-question';
  const group = h('div', { class: 'moves', role: 'radiogroup', 'aria-labelledby': 'front-hall-question', 'data-moves': '' });
  const buttons = MOVES.map((m) => {
    const b = h('button', { class: 'move', type: 'button', role: 'radio', 'aria-checked': 'false', 'data-move': m.id }, h('span', { class: 'move-label', text: m.label }), h('span', { html: icon(ICONS[m.id] || 'door') }));
    b.addEventListener('click', () => choose(m.id));
    return b;
  });
  group.append(...buttons);
  host.replaceWith(group);
  qs('.room-inner', section).append(keyBoard());

  function sync() {
    const current = store.get().move;
    buttons.forEach((b) => b.setAttribute('aria-checked', b.dataset.move === current ? 'true' : 'false'));
    rovingGroup(buttons, { selectedIndex: Math.max(0, buttons.findIndex((b) => b.dataset.move === current)) });
  }
  function choose(id) {
    store.setMove(id);
    store.earnKey('hall');
    sync();
  }
  sync();
  store.on('move', sync);
  store.on('reset', sync);
}
