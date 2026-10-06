// The Backyard: Rico and Cheeto as pinned Polaroids. Each is a button that flips between
// "In real life" and "Real estate life". Photos load when present; a drawn portrait holds the
// frame otherwise, so nothing shifts. Both flipped: Backyard Key.
import { h, qs } from '../core/dom.js';
import { store } from '../core/store.js';
import { audio } from '../core/audio.js';
import { petPortrait } from '../ui/pets.js';
import { PETS, PET_SIDES, ROOMS } from '../content/copy.js';

const room = ROOMS.find((r) => r.id === 'backyard');

export function initBackyard() {
  const section = qs('#backyard');
  const host = qs('[data-pets]', section);
  if (!host) return;
  const flipped = new Set();
  const presses = { rico: 0, cheeto: 0 };
  const grid = h('div', { class: 'pets' });
  PETS.forEach((p, i) => {
    let side = 'real';
    const img = h('img', { src: p.img.real, alt: p.altReal, width: 480, height: 600, loading: 'lazy', decoding: 'async' });
    const portrait = h('div', { html: petPortrait(p.id), hidden: true });
    const pending = h('span', { class: 'pet-pending', hidden: true, text: 'Photo pending' });
    img.addEventListener('error', () => {
      img.hidden = true;
      portrait.hidden = false;
      qs('svg', portrait).removeAttribute('hidden');
      pending.hidden = false;
    });
    const plaque = h('span', { class: 'pet-plaque', hidden: true, text: p.title });
    const frame = h('div', { class: 'pet-frame' }, img, portrait, pending, plaque);
    const sideLabel = h('span', { class: 'pet-side', text: PET_SIDES.real });
    const caption = h('div', { class: 'pet-caption' }, h('strong', { text: p.name }), sideLabel);
    const btn = h('button', { class: 'polaroid-btn', type: 'button', 'aria-pressed': 'false', style: { '--tilt': `${i === 0 ? -1.5 : 1.2}deg` }, 'aria-label': `${p.name}, ${PET_SIDES.real.toLowerCase()}. Press to see ${PET_SIDES.work.toLowerCase()}.` }, frame, caption);
    const line = h('p', { class: 'pet-line', text: p.real });
    const text = h('div', { class: 'pet-text' }, h('p', { class: 'pet-name', text: p.name }), h('p', { class: 'pet-species', text: `${p.species}, ${p.title}` }), line);
    btn.addEventListener('click', () => {
      side = side === 'real' ? 'work' : 'real';
      const work = side === 'work';
      btn.setAttribute('aria-pressed', work ? 'true' : 'false');
      btn.setAttribute('aria-label', `${p.name}, ${PET_SIDES[side].toLowerCase()}. Press to see ${PET_SIDES[work ? 'real' : 'work'].toLowerCase()}.`);
      img.src = work ? p.img.work : p.img.real;
      img.alt = work ? p.altWork : p.altReal;
      sideLabel.textContent = PET_SIDES[side];
      plaque.hidden = !work;
      line.textContent = work ? p.advice : p.real;
      line.className = work ? 'pet-advice' : 'pet-line';
      audio.play('flip');
      presses[p.id] += 1;
      if (p.id === 'rico' && presses.rico >= 5) store.unlock('tongs');
      if (work && !flipped.has(p.id)) {
        flipped.add(p.id);
        if (flipped.size === PETS.length) store.earnKey('backyard');
      }
    });
    grid.append(h('div', { class: 'pet' }, btn, text));
  });
  host.replaceWith(h('div', { 'data-pets': '' }, h('p', { class: 'instruction', text: room.instruction }), grid));
  store.on('reset', () => flipped.clear());
}
