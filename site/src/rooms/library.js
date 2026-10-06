// The Library: five flip cards. Each is a button with aria-expanded controlling real text, so
// the definition is read, not just shown. All five flipped: Library Key.
import { h, qs, qsa } from '../core/dom.js';
import { store } from '../core/store.js';
import { audio } from '../core/audio.js';
import { icon } from '../ui/icons.js';
import { LIBRARY, ROOMS } from '../content/copy.js';

const room = ROOMS.find((r) => r.id === 'library');

export function initLibrary() {
  const section = qs('#library');
  const host = qs('[data-library]', section);
  if (!host) return;
  const flipped = new Set(store.get().answers.library || []);
  const shelf = h('div', { class: 'shelf', role: 'group', 'aria-label': 'Word of the day cards' });
  LIBRARY.forEach((w, i) => {
    const defId = `def-${w.id}`;
    const back = h('div', { class: 'flip-face flip-back', id: defId }, h('p', { class: 'flip-def', text: w.def }), h('p', { class: 'flip-gloss', text: w.gloss }));
    const front = h('div', { class: 'flip-face flip-front' }, h('div', { class: 'flip-num' }, h('span', { text: `Word ${String(i + 1).padStart(2, '0')} of ${String(LIBRARY.length).padStart(2, '0')}` })), h('div', { class: 'flip-word', text: w.word }), h('div', { html: icon('book') }));
    const btn = h('button', { class: 'flip-btn', type: 'button', 'aria-expanded': 'false', 'aria-controls': defId }, h('div', { class: 'flip-card' }, front, back));
    const wrap = h('div', { class: 'flip' }, btn);
    const setOpen = (open) => {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      back.setAttribute('aria-hidden', open ? 'false' : 'true');
      front.setAttribute('aria-hidden', open ? 'true' : 'false');
    };
    setOpen(false);
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
      audio.play('flip');
      if (open && !flipped.has(w.id)) {
        flipped.add(w.id);
        wrap.classList.add('is-earned');
        store.answer('library', [...flipped]);
        if (flipped.size === LIBRARY.length) store.earnKey('library');
      }
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        setOpen(false);
      }
    });
    if (flipped.has(w.id)) wrap.classList.add('is-earned');
    shelf.append(wrap);
  });
  host.replaceWith(h('div', { 'data-library': '' }, h('p', { class: 'instruction', text: room.instruction }), shelf));
  store.on('reset', () => {
    flipped.clear();
    qsa('.flip', shelf).forEach((f) => f.classList.remove('is-earned'));
  });
}
