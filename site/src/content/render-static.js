// Renders the readable, no-JavaScript version of every room from copy.js. The Vite plugin in
// vite.config.js injects this HTML at build and dev time; the browser code then enhances each
// room in place. Crawlers, reader modes and visitors without JS get the whole tour as a document.
import { SITE, CONTACT, ROOMS, MOVES, LAB, EVIDENCE, LIBRARY, TOWNS, OFF_MAP, FIELD_NOTE, PETS, PET_SIDES, CLOSING, FOOTER, usd } from './copy.js';
import { porchStaticSVG } from '../scenes/porch-static.js';
import { petPortrait } from '../ui/pets.js';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const PUBLIC = resolve(dirname(fileURLToPath(import.meta.url)), '../../public');
const hasFile = (rel) => existsSync(resolve(PUBLIC, rel));

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const room = (id) => ROOMS.find((r) => r.id === id);

function head(r, { level = 2 } = {}) {
  return `<p class="eyebrow">${esc(r.eyebrow)}</p><h${level} id="${r.id}-title" class="room-title" tabindex="-1">${esc(r.title)}</h${level}>`;
}

export function renderPorch() {
  const r = room('porch');
  return `
    <div class="porch-scene" aria-hidden="true">${porchStaticSVG()}<canvas class="porch-canvas" hidden></canvas></div>
    <div class="porch-copy container">
      <p class="eyebrow porch-eyebrow">${esc(FOOTER.brokerage)}</p>
      <h1 id="porch-title" class="hero-title" tabindex="-1">${esc(SITE.headline.before)}<em>${esc(SITE.headline.italic)}</em>${esc(SITE.headline.after)}</h1>
      <p class="sr-only">${esc(SITE.heroAlt)}</p>
      <p class="lede hero-sub">${esc(SITE.sub)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary btn-hero" href="#front-hall" data-knock>${esc(r.verb)}</a>
        <p class="hero-hurry">In a hurry? <a href="tel:${CONTACT.direct.tel}">Call Denise ${CONTACT.direct.display}</a> or <a href="${CONTACT.book}" rel="noopener" target="_blank">book a time on HAR<span class="sr-only"> (opens in new tab)</span></a>.</p>
      </div>
    </div>`;
}

export function renderHall() {
  const r = room('front-hall');
  return `
    ${head(r)}
    <p class="room-intro">${esc(r.intro)}</p>
    <h3 class="room-question">${esc(r.question)}</h3>
    <div class="moves" data-moves>
      ${MOVES.map((m) => `<a class="move" href="#closing-table" data-move="${m.id}"><span class="move-label">${esc(m.label)}</span></a>`).join('')}
    </div>`;
}

export function renderLab() {
  const r = room('lab');
  const d = LAB.defaults;
  return `
    ${head(r)}
    <p class="room-intro">${esc(r.intro)}</p>
    <div class="lab-static" data-lab>
      <h3 id="lab-heading">${esc(MOVES[0].labHeading)}</h3>
      <p>Example: a ${usd(d.price)} home with ${d.down}% down at ${d.rate}% is one set of numbers. Your rent is another. The interactive sliders need JavaScript; the same calculator lives on <a href="${CONTACT.calculator}" rel="noopener" target="_blank">hometownrealtorsoftexas.com<span class="sr-only"> (opens in new tab)</span></a>.</p>
      <p class="fine" id="lab-disclaimer">${esc(r.disclaimer)}</p>
    </div>`;
}

export function renderEvidence() {
  const r = room('evidence-board');
  const text = EVIDENCE.listing.map((p) => (typeof p === 'string' ? esc(p) : `<strong>${esc(p.word)}</strong>`)).join('');
  const items = EVIDENCE.listing.filter((p) => typeof p !== 'string');
  return `
    ${head(r)}
    <p class="room-intro">${esc(r.intro)}</p>
    <div class="evidence-static" data-evidence>
      <p class="label">${esc(r.caseLabel)}</p>
      <p class="listing">${text}</p>
      ${items.map((p) => `<details><summary>${esc(p.word)}</summary><p>${esc(p.meaning)}</p></details>`).join('')}
    </div>`;
}

export function renderLibrary() {
  const r = room('library');
  return `
    ${head(r)}
    <p class="room-intro">${esc(r.intro)}</p>
    <dl class="library-static" data-library>
      ${LIBRARY.map((w) => `<dt>${esc(w.word)}</dt><dd>${esc(w.def)} <em>${esc(w.gloss)}</em></dd>`).join('')}
    </dl>`;
}

export function renderMap() {
  const r = room('map-room');
  return `
    ${head(r)}
    <p class="room-intro">${esc(r.intro)}</p>
    <div class="map-static" data-map>
      <ul class="towns-static">${TOWNS.map((t) => `<li>${esc(t.name)}</li>`).join('')}</ul>
      <h3>${esc(FIELD_NOTE.title('every town'))}</h3>
      <ul>${FIELD_NOTE.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
      <p>${esc(FIELD_NOTE.elsewhere)}</p>
      <p class="fine">${esc(OFF_MAP.name)}: ${esc(OFF_MAP.note)}</p>
    </div>`;
}

export function renderBackyard() {
  const r = room('backyard');
  return `
    ${head(r)}
    <p class="room-intro">${esc(r.intro)}</p>
    <div class="pets-static" data-pets>
      ${PETS.map((p) => `
      <figure class="pet-static">
        ${hasFile(p.img.real) ? `<img src="${p.img.real}" alt="${esc(p.altReal)}" width="480" height="600" loading="lazy" decoding="async">` : `<div class="pet-static-portrait" role="img" aria-label="${esc(p.altReal)}">${petPortrait(p.id, 'real')}</div>`}
        <figcaption><strong>${esc(p.name)}</strong>, ${esc(p.species.toLowerCase())}, ${esc(p.title)}. ${esc(PET_SIDES.real)}: ${esc(p.real)} ${esc(PET_SIDES.work)}: ${esc(p.advice)}</figcaption>
      </figure>`).join('')}
    </div>`;
}

export function renderClosing() {
  const r = room('closing-table');
  return `
    <p class="eyebrow">${esc(r.eyebrow)}</p>
    <h2 id="closing-table-title" class="room-title closing-title" tabindex="-1">${esc(r.headline)}</h2>
    <p class="lede closing-sub" data-closing-sub>${esc(r.sub)}</p>
    <div class="table" data-table aria-hidden="true"></div>
    <div class="contact" data-contact>
      <div class="contact-phone">
        <p class="label">${esc(CONTACT.direct.label)}</p>
        <p class="phone num" id="phone-direct">${CONTACT.direct.display}</p>
        <div class="contact-phone-actions">
          <a class="btn btn-secondary" href="tel:${CONTACT.direct.tel}">${esc(CLOSING.call)}</a>
          <button class="btn btn-ghost" type="button" data-copy="${CONTACT.direct.display}" hidden>${esc(CLOSING.copy)}</button>
        </div>
        <p class="fine">${esc(CONTACT.office.label)} <a href="tel:${CONTACT.office.tel}">${CONTACT.office.display}</a></p>
      </div>
      <div class="contact-actions">
        <a class="btn btn-primary" data-cta-primary href="${CONTACT.book}" rel="noopener" target="_blank">${esc(CLOSING.book)}<span class="sr-only"> (opens in new tab)</span></a>
        <a class="btn btn-secondary" data-cta-secondary href="${CONTACT.message}" rel="noopener" target="_blank">${esc(CLOSING.message)}<span class="sr-only"> (opens in new tab)</span></a>
        <a class="btn btn-secondary" href="${CONTACT.search}" rel="noopener" target="_blank">${esc(CLOSING.search)}<span class="sr-only"> (opens in new tab)</span></a>
      </div>
      <ul class="socials">
        ${CLOSING.socials.map((s) => `<li><a href="${s.href}" rel="noopener" target="_blank">${esc(s.label)}<span class="sr-only"> (opens in new tab)</span></a></li>`).join('')}
      </ul>
      <p class="fine">${esc(CLOSING.reviews)}</p>
    </div>`;
}

export function renderFooter() {
  return `
    <div class="container footer-grid">
      <div class="footer-mark"><img src="brand/hometown-mark.svg" alt="Hometown Realtors of Texas" width="56" height="56"></div>
      <div class="footer-text">
        <p><strong>${esc(FOOTER.brokerage)}</strong></p>
        <p>${esc(FOOTER.line1)}</p>
        <p>${esc(FOOTER.line2)}</p>
        <p><a href="${CONTACT.iabs}" rel="noopener" target="_blank">${esc(FOOTER.iabs)}<span class="sr-only"> (opens in new tab)</span></a></p>
        <p><a href="${CONTACT.cpn}" rel="noopener" target="_blank">${esc(FOOTER.cpn)}<span class="sr-only"> (opens in new tab)</span></a></p>
        <p class="footer-eho"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M9 14h6M9 17h6"/></svg><span>${esc(FOOTER.fair)}</span></p>
        <p>${esc(FOOTER.trademark)}</p>
        <p>${esc(FOOTER.estimates)}</p>
        <p class="footer-built">${esc(FOOTER.built)}</p>
      </div>
    </div>`;
}

export function renderAll() {
  return {
    porch: renderPorch(),
    'front-hall': renderHall(),
    lab: renderLab(),
    'evidence-board': renderEvidence(),
    library: renderLibrary(),
    'map-room': renderMap(),
    backyard: renderBackyard(),
    'closing-table': renderClosing(),
    footer: renderFooter(),
  };
}
