// Every room (but the last) gets a door: "Next room: X" plus a tag showing this room's key
// state. The door turns primary once the key is earned, so the next step is always obvious.
import { h, qs, qsa } from '../core/dom.js';
import { store } from '../core/store.js';
import { goTo } from '../core/scroll.js';
import { keySVG } from '../ui/keys.js';
import { icon } from '../ui/icons.js';
import { ROOMS, KEYS, HUD } from '../content/copy.js';

export function initDoors() {
  for (const section of qsa('.room')) {
    const slot = qs('[data-door]', section);
    if (!slot) continue;
    const room = ROOMS.find((r) => r.id === section.dataset.chapter);
    if (!room || !room.next) continue;
    const nextRoom = ROOMS.find((r) => r.id === room.next);
    const btn = h('button', { class: 'btn btn-secondary', type: 'button' }, HUD.nextRoom(nextRoom.title), h('span', { html: icon('arrow') }));
    btn.addEventListener('click', () => goTo(nextRoom.id));
    const tag = h('span', { class: 'door-tag', 'data-door-tag': '' });
    slot.append(btn, tag);
    const update = () => {
      const i = KEYS.findIndex((k) => k.id === room.key);
      const earned = store.hasKey(room.key);
      tag.innerHTML = keySVG(i, { earned, size: 20 }) + `<span>${earned ? `${KEYS[i].name}: earned` : `${KEYS[i].name}: ${room.verb.toLowerCase()} to earn it`}</span>`;
      tag.classList.toggle('is-earned', earned);
      btn.classList.toggle('btn-primary', earned);
      btn.classList.toggle('btn-secondary', !earned);
    };
    update();
    store.on('key', update);
    store.on('reset', update);
  }
}
