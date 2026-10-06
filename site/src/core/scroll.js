// Scroll choreography: Lenis for wheel smoothing on fine pointers, GSAP ScrollTrigger for the
// Porch scrub only, IntersectionObserver for room lamps and visits, and hash navigation that
// moves focus to the room title so keyboard and screen-reader users land where the eye does.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa, focusWithoutScroll } from './dom.js';
import { reducedMotion, onMotionChange } from './prefs.js';
import { store } from './store.js';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let porchTrigger = null;
let porchScrub = () => {};

export function setPorchScrub(fn) {
  porchScrub = fn;
}

export function scrollEnabled() {
  return !reducedMotion();
}

async function initLenis() {
  if (lenis || reducedMotion()) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const { default: Lenis } = await import('lenis');
  lenis = new Lenis({ smoothWheel: true, syncTouch: false, lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function destroyLenis() {
  if (!lenis) return;
  lenis.destroy();
  lenis = null;
}

function initPorchScrub() {
  const porch = qs('#porch');
  if (!porch || reducedMotion()) return;
  porchTrigger = ScrollTrigger.create({
    trigger: porch,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    onUpdate: (self) => porchScrub(self.progress),
  });
}

function killPorchScrub() {
  porchTrigger?.kill();
  porchTrigger = null;
  porchScrub(0);
}

export function currentOffset() {
  return window.matchMedia('(max-width: 767px)').matches ? 0 : 0;
}

export function goTo(id, { focus = true, immediate = false } = {}) {
  const target = document.getElementById(id);
  if (!target) return;
  const behavior = immediate || reducedMotion() ? 'instant' : 'smooth';
  if (lenis && behavior === 'smooth') {
    lenis.scrollTo(target, { offset: 0, duration: 1.1, onComplete: () => focus && focusTitle(target) });
  } else {
    target.scrollIntoView({ behavior, block: 'start' });
    if (focus) window.setTimeout(() => focusTitle(target), behavior === 'instant' ? 0 : 700);
  }
  if (history.state?.room !== id) history.pushState({ room: id }, '', `#${id}`);
}

export function focusTitle(section) {
  const title = section.querySelector('.room-title, .hero-title');
  focusWithoutScroll(title);
}

function initLamps() {
  const rooms = qsa('.room');
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-lit');
          store.visit(e.target.dataset.chapter);
          document.dispatchEvent(new CustomEvent('room:enter', { detail: e.target.dataset.chapter }));
        }
      }
    },
    { threshold: 0.25 },
  );
  rooms.forEach((r) => io.observe(r));
}

function initReveals() {
  for (const title of qsa('.room-title, .hero-title')) {
    if (title.querySelector('.reveal-word')) continue;
    const nodes = Array.from(title.childNodes);
    title.textContent = '';
    let i = 0;
    for (const node of nodes) {
      const isEm = node.nodeName === 'EM';
      const words = (node.textContent || '').split(/(\s+)/);
      for (const w of words) {
        if (!w) continue;
        if (/^\s+$/.test(w)) {
          title.append(document.createTextNode(' '));
          continue;
        }
        const span = document.createElement('span');
        span.className = 'reveal-word';
        span.style.setProperty('--i', String(i));
        span.textContent = w;
        i += 1;
        if (isEm) {
          const em = document.createElement('em');
          em.append(span);
          title.append(em);
        } else title.append(span);
      }
    }
    title.classList.add('reveal');
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add('is-in');
    },
    { threshold: 0.4 },
  );
  qsa('.reveal').forEach((t) => io.observe(t));
}

function initHashNav() {
  history.scrollRestoration = 'auto';
  window.addEventListener('popstate', () => {
    const id = location.hash.slice(1);
    if (id && document.getElementById(id)) {
      const target = document.getElementById(id);
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      focusTitle(target);
    }
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    goTo(id);
  });
}

export function initScroll() {
  initReveals();
  initLamps();
  initHashNav();
  initLenis();
  initPorchScrub();
  onMotionChange((reduced) => {
    if (reduced) {
      destroyLenis();
      killPorchScrub();
      qsa('.reveal').forEach((t) => t.classList.add('is-in'));
    } else {
      initLenis();
      initPorchScrub();
    }
  });
  if (reducedMotion()) qsa('.reveal').forEach((t) => t.classList.add('is-in'));
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) window.setTimeout(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }), 0);
  }
}

export { gsap, ScrollTrigger };
