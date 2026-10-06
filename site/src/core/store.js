// Journey state: keys earned, achievements, the visitor's chosen move, visited rooms and
// preferences. Persisted to localStorage (per-viewer convenience only; every read and write is
// wrapped because storage can be absent, full or throwing in private windows and previews).
const STORAGE_KEY = 'denise-journey-v1';

const defaults = () => ({
  v: 1,
  keys: [],
  achievements: [],
  move: null,
  visited: [],
  answers: {},
  prefs: { motion: 'auto', sound: 'off' },
  startedAt: null,
  finishedAt: null,
});

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== 1) return defaults();
    return { ...defaults(), ...parsed, prefs: { ...defaults().prefs, ...(parsed.prefs || {}) } };
  } catch {
    return defaults();
  }
}

function persist(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: the journey still works for this visit */
  }
}

export function createStore() {
  let state = load();
  const listeners = new Map();

  const emit = (event, payload) => {
    for (const fn of listeners.get(event) || []) fn(payload, state);
    for (const fn of listeners.get('*') || []) fn({ event, payload }, state);
  };

  const api = {
    get: () => state,
    on(event, fn) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(fn);
      return () => listeners.get(event).delete(fn);
    },
    patch(partial) {
      state = { ...state, ...partial };
      persist(state);
      emit('change', state);
    },
    hasKey: (id) => state.keys.includes(id),
    earnKey(id) {
      if (state.keys.includes(id)) return false;
      api.patch({ keys: [...state.keys, id], startedAt: state.startedAt || Date.now() });
      emit('key', id);
      return true;
    },
    unlock(id) {
      if (state.achievements.includes(id)) return false;
      api.patch({ achievements: [...state.achievements, id] });
      emit('achievement', id);
      return true;
    },
    hasAchievement: (id) => state.achievements.includes(id),
    setMove(move) {
      api.patch({ move });
      emit('move', move);
    },
    answer(id, value) {
      api.patch({ answers: { ...state.answers, [id]: value } });
    },
    visit(id) {
      if (state.visited.includes(id)) return;
      api.patch({ visited: [...state.visited, id], startedAt: state.startedAt || Date.now() });
      emit('visit', id);
    },
    setPref(key, value) {
      api.patch({ prefs: { ...state.prefs, [key]: value } });
      emit('pref', { key, value });
    },
    finish() {
      if (state.finishedAt) return;
      api.patch({ finishedAt: Date.now() });
      emit('finish', state);
    },
    reset() {
      const prefs = state.prefs;
      state = { ...defaults(), prefs };
      persist(state);
      emit('reset', state);
      emit('change', state);
    },
  };
  return api;
}

export const store = createStore();
