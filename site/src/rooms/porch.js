// The Porch: the WebGL night, the Knock, the first key. The static SVG paints first; the
// Three.js scene loads after idle and fades in over it. Scrolling through the Porch is the
// dolly up the walk; Knock earns the key and scrolls you in.
import { qs, h } from '../core/dom.js';
import { store } from '../core/store.js';
import { audio } from '../core/audio.js';
import { reducedMotion, lowPower, webglAvailable, onMotionChange } from '../core/prefs.js';
import { setPorchScrub, goTo } from '../core/scroll.js';
import { showSoundHint } from '../ui/hud.js';
import { icon } from '../ui/icons.js';
import { FALLBACK } from '../content/copy.js';

let scene = null;

export function initPorch() {
  const section = qs('#porch');
  const wrap = qs('.porch-scene', section);
  const canvas = qs('.porch-canvas', section);
  const knock = qs('[data-knock]', section);
  if (!wrap || !canvas) return;

  const cue = h('div', { class: 'scroll-cue', 'aria-hidden': 'true' }, 'Scroll', h('span', { html: icon('arrow') }));
  cue.style.transform = 'rotate(90deg)';
  cue.style.transformOrigin = 'center';
  wrap.append(cue);

  const saveData = navigator.connection?.saveData;
  const canGL = webglAvailable() && !saveData;
  if (!canGL) {
    wrap.append(h('p', { class: 'porch-fallback-note', text: FALLBACK.noWebGL }));
  } else {
    const start = () => {
      import('../scenes/porch.js')
        .then(({ createPorchScene }) => {
          canvas.hidden = false;
          scene = createPorchScene(canvas, { reduced: reducedMotion(), lowPower: lowPower() });
          wrap.classList.add('has-webgl');
          setPorchScrub((p) => scene.setScroll(p));
          if (window.matchMedia('(pointer: fine)').matches) {
            window.addEventListener('pointermove', (e) => {
              scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
            }, { passive: true });
          }
          onMotionChange((reduced) => scene.setReduced(reduced));
        })
        .catch(() => {
          wrap.append(h('p', { class: 'porch-fallback-note', text: FALLBACK.noWebGL }));
        });
    };
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1500 });
    else window.setTimeout(start, 300);
  }

  if (knock) {
    knock.innerHTML = `${icon('knock')}<span>${knock.textContent.trim()}</span>`;
    knock.addEventListener('click', (e) => {
      e.preventDefault();
      wrap.classList.add('is-knocked');
      audio.play('knock');
      const first = store.earnKey('porch');
      if (first) store.unlock('knocked');
      showSoundHint();
      window.setTimeout(() => goTo('front-hall'), first ? 450 : 0);
    });
  }
}
