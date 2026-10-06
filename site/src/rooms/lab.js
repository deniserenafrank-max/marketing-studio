// The Lab: sliders, two beakers, the true monthly cost of owning next to rent. Estimates for
// learning only; the disclaimer sits beside the outputs and is wired with aria-describedby.
import { h, qs, qsa, formatUSD, clamp } from '../core/dom.js';
import { store } from '../core/store.js';
import { audio } from '../core/audio.js';
import { icon } from '../ui/icons.js';
import { LAB, MOVES, ROOMS } from '../content/copy.js';

const room = ROOMS.find((r) => r.id === 'lab');

export function compute(v) {
  const loan = v.price * (1 - v.down / 100);
  const r = v.rate / 100 / 12;
  const n = LAB.termYears * 12;
  const pi = r > 0 ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
  const taxes = (v.price * (v.tax / 100)) / 12;
  const ins = v.insurance / 12;
  const hoa = v.hoa;
  const pmi = v.down < 20 ? (loan * LAB.pmiRate) / 12 : 0;
  const upkeep = (v.price * LAB.upkeepRate) / 12;
  const total = pi + taxes + ins + hoa + pmi + upkeep;
  return { pi, taxes, ins, hoa, pmi, upkeep, total, rent: v.rent };
}

function beakerSVG(cls, id) {
  return `<svg viewBox="0 0 100 120" class="${cls}" aria-hidden="true" focusable="false">
    <defs><clipPath id="${id}"><path d="M34 8h32v34l22 56a6 6 0 0 1-5.6 8H17.6a6 6 0 0 1-5.6-8L34 42z"/></clipPath></defs>
    <rect class="beaker-fill" x="0" y="118" width="100" height="0" clip-path="url(#${id})"/>
    <path class="beaker-glass" d="M30 8h40M34 8v34L12 98a6 6 0 0 0 5.6 8h64.8a6 6 0 0 0 5.6-8L66 42V8"/>
    <path class="beaker-glass" d="M26 72h48" opacity="0.5"/>
  </svg>`;
}

export function initLab() {
  const section = qs('#lab');
  const host = qs('[data-lab]', section);
  if (!host) return;
  const saved = store.get().answers.lab || {};
  const values = { ...LAB.defaults, ...saved };
  const moved = new Set(store.get().answers.labMoved || []);

  const heading = h('h3', { id: 'lab-heading', text: MOVES[0].labHeading });
  const sliders = h('div', { class: 'lab-sliders' });
  const inputs = {};
  for (const s of LAB.sliders) {
    const id = `lab-${s.id}`;
    const out = h('output', { for: id, id: `${id}-out` });
    const input = h('input', { type: 'range', id, min: s.min, max: s.max, step: s.step, value: values[s.id], 'aria-describedby': s.hint ? `${id}-hint` : null });
    const wrap = h('div', { class: 'slider' }, h('label', { for: id, text: s.label }), out, input, s.hint ? h('span', { class: 'hint', id: `${id}-hint`, text: s.hint }) : null);
    const render = () => {
      const v = Number(input.value);
      values[s.id] = v;
      const unset = s.id === 'rate' && !moved.has('rate');
      out.textContent = unset ? LAB.rateUnset : s.unit === 'usd' ? formatUSD(v) : `${v}%`;
      out.classList.toggle('is-unset', unset);
      input.setAttribute('aria-valuetext', unset ? `${LAB.rateUnset}: move to set` : s.text(v));
      input.style.setProperty('--fill', `${((v - s.min) / (s.max - s.min)) * 100}%`);
    };
    input.addEventListener('input', () => {
      moved.add(s.id);
      render();
      live();
    });
    input.addEventListener('change', () => {
      store.answer('lab', { ...values });
      store.answer('labMoved', [...moved]);
    });
    render();
    input.__render = render;
    inputs[s.id] = input;
    sliders.append(wrap);
  }
  const renderAll = () => Object.values(inputs).forEach((i) => i.__render());
  const run = h('button', { class: 'btn btn-primary', type: 'button' }, h('span', { html: icon('beaker') }), LAB.run);
  const runHint = h('span', { class: 'instruction', role: 'status', text: room.instruction });
  const runWrap = h('div', { class: 'lab-run' }, run, runHint);

  const bench = h('div', { class: 'lab-bench', 'aria-describedby': 'lab-disclaimer' });
  const own = h('div', { class: 'beaker beaker-own' }, h('div', { html: beakerSVG('', 'beaker-clip-own') }), h('div', { class: 'beaker-amount num', 'data-own': '', text: '$ ?' }), h('div', { class: 'beaker-label', text: `${LAB.ownLabel}, ${LAB.perMonth}` }));
  const rent = h('div', { class: 'beaker beaker-rent' }, h('div', { html: beakerSVG('', 'beaker-clip-rent') }), h('div', { class: 'beaker-amount num', 'data-rent': '', text: '$ ?' }), h('div', { class: 'beaker-label', text: `${LAB.rentLabel}, per month` }));
  const beakers = h('div', { class: 'beakers' }, own, rent);
  const lines = h('ul', { class: 'lab-lines', 'aria-label': 'Monthly cost of owning, line by line' });
  const verdict = h('p', { class: 'lab-verdict', role: 'status', 'aria-live': 'off' });
  const notYet = h('div', { class: 'lab-notyet', hidden: true }, h('p', { text: room.notYet }), h('p', { class: 'fine', text: room.creditNote }));
  const plaque = h('p', { class: 'lab-plaque', id: 'lab-disclaimer', text: room.disclaimer });
  bench.append(beakers, lines, verdict, notYet, plaque);

  const lab = h('div', { class: 'lab' }, h('div', {}, sliders, runWrap), bench);
  host.replaceWith(h('div', { class: 'lab-wrap', 'data-lab': '' }, heading, lab));

  let ran = Boolean(store.hasKey('lab'));
  function fill(result, animate = true) {
    const max = Math.max(result.total, result.rent, 1);
    const setFill = (el, amount) => {
      const rect = qs('.beaker-fill', el);
      const hgt = clamp((amount / max) * 100, 4, 100);
      if (!animate) rect.style.transition = 'none';
      rect.setAttribute('y', String(118 - hgt));
      rect.setAttribute('height', String(hgt));
      if (!animate) window.requestAnimationFrame(() => (rect.style.transition = ''));
    };
    setFill(own, result.total);
    setFill(rent, result.rent);
    qs('[data-own]', own).textContent = formatUSD(result.total);
    qs('[data-rent]', rent).textContent = formatUSD(result.rent);
    const names = LAB.lines;
    const vals = [result.pi, result.taxes, result.ins, result.hoa, result.pmi, result.upkeep];
    lines.innerHTML = '';
    vals.forEach((v, i) => lines.append(h('li', {}, h('span', { text: names[i] }), h('span', { text: formatUSD(v) }))));
    lines.append(h('li', { class: 'is-total' }, h('span', { text: 'Total to own, per month' }), h('span', { text: formatUSD(result.total) })));
    const diff = result.total - result.rent;
    if (Math.abs(diff) < 50) verdict.textContent = 'Owning and renting land within a few dollars of each other here. Now it is about timing.';
    else if (diff > 0) verdict.textContent = `Owning runs about ${formatUSD(diff)} more per month than renting with these numbers.`;
    else verdict.textContent = `Owning runs about ${formatUSD(-diff)} less per month than renting with these numbers.`;
    notYet.hidden = !(diff > 0);
    return diff;
  }
  function live() {
    if (ran) fill(compute(values), true);
  }
  run.addEventListener('click', () => {
    if (!moved.has('rate')) {
      runHint.textContent = LAB.rateHint;
      inputs.rate.focus();
      return;
    }
    runHint.textContent = room.instruction;
    verdict.setAttribute('aria-live', 'polite');
    const result = compute(values);
    const diff = fill(result, true);
    ran = true;
    store.answer('lab', { ...values });
    audio.play('pop');
    store.earnKey('lab');
    if (diff > 0) store.unlock('notyet');
    if (moved.size >= LAB.sliders.length) store.unlock('scientist');
  });
  if (ran) fill(compute(values), false);

  const syncHeading = () => {
    const m = MOVES.find((x) => x.id === store.get().move) || MOVES[0];
    heading.textContent = m.labHeading;
  };
  syncHeading();
  store.on('move', syncHeading);
  store.on('reset', () => {
    ran = false;
    moved.clear();
    Object.assign(values, LAB.defaults);
    for (const s of LAB.sliders) inputs[s.id].value = String(LAB.defaults[s.id]);
    renderAll();
    lines.innerHTML = '';
    verdict.textContent = '';
    verdict.setAttribute('aria-live', 'off');
    notYet.hidden = true;
    qs('[data-own]', own).textContent = '$ ?';
    qs('[data-rent]', rent).textContent = '$ ?';
    for (const el of [own, rent]) {
      const rect = qs('.beaker-fill', el);
      rect.setAttribute('y', '118');
      rect.setAttribute('height', '0');
    }
    runHint.textContent = room.instruction;
    syncHeading();
  });
}
