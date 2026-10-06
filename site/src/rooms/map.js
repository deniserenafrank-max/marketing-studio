// The Map Room: pick your town, get the three questions. The note is the same for every town
// on purpose (describe places and process, never people), plus one line keyed to your move.
import { h, qs, qsa } from '../core/dom.js';
import { store } from '../core/store.js';
import { audio } from '../core/audio.js';
import { announce } from '../core/announce.js';
import { mapSVG } from '../ui/map-svg.js';
import { TOWNS, OFF_MAP, FIELD_NOTE, MOVES, ROOMS } from '../content/copy.js';
import { rovingGroup } from './roving.js';

const room = ROOMS.find((r) => r.id === 'map-room');

export function initMap() {
  const section = qs('#map-room');
  const host = qs('[data-map]', section);
  if (!host) return;
  const visited = new Set(store.get().answers.towns || []);
  let current = store.get().answers.town || null;

  const map = h('div', { class: 'map', html: mapSVG() });
  map.querySelector('svg').setAttribute('aria-hidden', 'true');
  map.querySelector('svg').removeAttribute('role');
  const chips = TOWNS.map((t) => {
    const c = h('button', { class: 'chip', type: 'button', role: 'radio', 'aria-checked': 'false', 'data-town': t.id, text: t.name });
    c.addEventListener('click', () => pick(t.id));
    return c;
  });
  const group = h('div', { class: 'towns', role: 'radiogroup', 'aria-label': 'Pick your town' }, ...chips);
  const off = h('button', { class: 'chip-sm', type: 'button', text: `Not on the map: ${OFF_MAP.name}` });
  off.addEventListener('click', () => whoop());
  const note = h('div', { class: 'field-note', role: 'region', 'aria-live': 'polite', 'aria-label': 'Field note' });
  const side = h('div', {}, h('p', { class: 'instruction', text: room.instruction }), group, h('p', { class: 'fine', style: { marginTop: '10px' } }, off), note);
  host.replaceWith(h('div', { class: 'maproom', 'data-map': '' }, map, side));

  qsa('.map-pin', map).forEach((pin) => {
    pin.addEventListener('click', () => (pin.dataset.pin === OFF_MAP.id ? whoop() : pick(pin.dataset.pin)));
  });

  function renderNote() {
    note.innerHTML = '';
    if (!current) {
      note.append(h('p', { class: 'fine', text: FIELD_NOTE.elsewhere }));
      return;
    }
    const town = TOWNS.find((t) => t.id === current);
    const move = MOVES.find((m) => m.id === store.get().move);
    note.append(h('h3', { text: FIELD_NOTE.title(town.name) }), h('ol', {}, ...FIELD_NOTE.lines.map((l) => h('li', { text: l }))));
    if (move) note.append(h('p', { class: 'move-line', text: move.mapLine }));
    note.append(h('p', { class: 'fine', text: FIELD_NOTE.elsewhere }));
  }
  function sync() {
    chips.forEach((c) => {
      c.setAttribute('aria-checked', c.dataset.town === current ? 'true' : 'false');
      c.classList.toggle('is-visited', visited.has(c.dataset.town));
    });
    qsa('.map-pin', map).forEach((p) => {
      p.classList.toggle('is-current', p.dataset.pin === current);
      p.classList.toggle('is-visited', visited.has(p.dataset.pin));
    });
    rovingGroup(chips, { selectedIndex: Math.max(0, chips.findIndex((c) => c.dataset.town === current)) });
    renderNote();
  }
  function pick(id) {
    current = id;
    visited.add(id);
    store.answer('town', id);
    store.answer('towns', [...visited]);
    audio.play('pin');
    sync();
    store.earnKey('map');
    if (visited.size === TOWNS.length) store.unlock('local');
  }
  function whoop() {
    audio.play('pop');
    note.innerHTML = '';
    note.append(h('h3', { text: FIELD_NOTE.title(OFF_MAP.name) }), h('p', { text: OFF_MAP.note }), h('p', { class: 'fine', text: FIELD_NOTE.elsewhere }));
    const pin = qs(`[data-pin="${OFF_MAP.id}"]`, map);
    pin?.classList.add('is-visited');
    if (!store.unlock('whoop')) announce(OFF_MAP.note);
  }
  sync();
  store.on('move', sync);
  store.on('reset', () => {
    visited.clear();
    current = null;
    sync();
  });
}
