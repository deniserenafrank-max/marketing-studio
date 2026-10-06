// Seven distinct keys in cream linework (24 grid, 1.5px strokes), gold when earned, plus the
// empty hook and the ring. Same paths at every size.
const BOWS = [
  '<circle cx="7" cy="12" r="3.75"/>',
  '<rect x="3.25" y="8.25" width="7.5" height="7.5" rx="2"/>',
  '<path d="M7 7.5a2.4 2.4 0 0 1 2.4 2.4 2.4 2.4 0 0 1 2.1 2.1A2.4 2.4 0 0 1 9.4 14.1 2.4 2.4 0 0 1 7 16.5a2.4 2.4 0 0 1-2.4-2.4A2.4 2.4 0 0 1 2.5 12a2.4 2.4 0 0 1 2.1-2.1A2.4 2.4 0 0 1 7 7.5z"/>',
  '<path d="M7 7.75 11.25 12 7 16.25 2.75 12z"/>',
  '<ellipse cx="7" cy="12" rx="3.25" ry="4.25"/>',
  '<path d="M7 7.75 10.7 9.9v4.2L7 16.25 3.3 14.1V9.9z"/>',
  '<path d="M3.5 12a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0zM7 12v3.75"/>',
];
const BITS = [
  '<path d="M10.75 12H21M18 12v3M21 12v3.5"/>',
  '<path d="M10.75 12H21M17 12v2.5M21 12v3"/>',
  '<path d="M11.1 12H21M19 12v3.5M16 12v2"/>',
  '<path d="M11.25 12H21M20 12v3M17.5 12v2M15 12v2.5"/>',
  '<path d="M10.25 12H21M18.5 12v3.5M21 12v2"/>',
  '<path d="M10.7 12H21M16.5 12v3M19.5 12v3"/>',
  '<path d="M10.5 12H21M19 12v2.5M21 12v3.5M15.5 12v1.5"/>',
];

export function keySVG(index, { earned = false, size = 24, label = '' } = {}) {
  const i = ((index % BOWS.length) + BOWS.length) % BOWS.length;
  const hole = '<circle cx="7" cy="12" r="1.25" class="key-hole"/>';
  return `<svg class="key ${earned ? 'is-earned' : ''}" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="${label ? 'false' : 'true'}" ${label ? `role="img" aria-label="${label}"` : 'focusable="false"'}>${label ? `<title>${label}</title>` : ''}<g class="key-bow">${BOWS[i]}</g>${hole}<g class="key-bit">${BITS[i]}</g></svg>`;
}

export function hookSVG({ size = 24 } = {}) {
  return `<svg class="key key-hook" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false"><path d="M12 3v5"/><path d="M12 8a4 4 0 1 1-4 4"/><circle cx="12" cy="3" r="1"/></svg>`;
}

export function ringSVG({ size = 20 } = {}) {
  return `<svg class="key-ring" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v4"/></svg>`;
}
