// Boot: preferences, the keyring HUD, every room, then scroll choreography. The static document
// is already readable before this runs; each room module enhances its section in place.
import { store } from './core/store.js';
import { applyMotionClass, reducedMotion } from './core/prefs.js';
import { announce } from './core/announce.js';
import { audio, resumeCricketsIfOn } from './core/audio.js';
import { initHud } from './ui/hud.js';
import { showToast } from './ui/toast.js';
import { initScroll } from './core/scroll.js';
import { initDoors } from './rooms/doors.js';
import { initPorch } from './rooms/porch.js';
import { initHall } from './rooms/hall.js';
import { initLab } from './rooms/lab.js';
import { initEvidence } from './rooms/evidence.js';
import { initLibrary } from './rooms/library.js';
import { initMap } from './rooms/map.js';
import { initBackyard } from './rooms/backyard.js';
import { initClosing } from './rooms/closing.js';
import { KEYS, ROOMS, ACHIEVEMENTS, ANNOUNCE, TOTAL_KEYS, HUD } from './content/copy.js';

applyMotionClass();
if (store.get().prefs.motion === 'full') document.documentElement.classList.add('motion-full');

function wireFeedback() {
  store.on('key', (id) => {
    const i = KEYS.findIndex((k) => k.id === id);
    const key = KEYS[i];
    const room = ROOMS.find((r) => r.key === id);
    const n = store.get().keys.length;
    showToast({ keyIndex: i, kicker: HUD.earned, text: room?.toast || key.name, count: `${n} of ${TOTAL_KEYS}` });
    announce(ANNOUNCE.key(key.name, n, TOTAL_KEYS));
    audio.play('clink');
    if (n === TOTAL_KEYS) {
      window.setTimeout(() => {
        announce(ANNOUNCE.allKeys);
        store.unlock('fullring');
      }, 1200);
    }
  });
  store.on('achievement', (id) => {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (!a) return;
    window.setTimeout(() => {
      showToast({ iconName: 'check', kicker: 'Achievement', text: `${a.name}. ${a.desc}` });
      announce(ANNOUNCE.achievement(a.name));
      audio.play('pop');
    }, 600);
  });
}

function restoreNotice() {
  const n = store.get().keys.length;
  if (n > 0) window.setTimeout(() => announce(ANNOUNCE.restored(n)), 1500);
}

function boot() {
  wireFeedback();
  initHud();
  initDoors();
  initHall();
  initLab();
  initEvidence();
  initLibrary();
  initMap();
  initBackyard();
  initClosing();
  initPorch();
  initScroll();
  restoreNotice();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) resumeCricketsIfOn();
  });
  if (audio.enabled) {
    // Sound was on last visit; browsers need a gesture before audio can resume.
    const resume = () => {
      audio.enable();
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
  }
  window.__journey = {
    store,
    reducedMotion,
    debugEarnAll() {
      KEYS.forEach((k) => store.earnKey(k.id));
    },
  };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
