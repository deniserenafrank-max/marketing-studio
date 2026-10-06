// 24-grid line icons from the UI brief: currentColor, 1.5px, round caps and joins, no fill.
const PATHS = {
  lock: '<rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="16" r="1"/>',
  pin: '<path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2"/>',
  paw: '<ellipse cx="12" cy="15.5" rx="4" ry="3"/><circle cx="6.5" cy="10.5" r="1.6"/><circle cx="10" cy="7.5" r="1.6"/><circle cx="14" cy="7.5" r="1.6"/><circle cx="17.5" cy="10.5" r="1.6"/>',
  beaker: '<path d="M9 3h6"/><path d="M10 3v6l-5.5 9.5a1.5 1.5 0 0 0 1.3 2.3h12.4a1.5 1.5 0 0 0 1.3-2.3L14 9V3"/><path d="M7.5 15h9"/>',
  magnifier: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/>',
  book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5V4.5"/><path d="M8 7h8"/>',
  soundOn: '<path d="M4 9v6h3l5 4V5L7 9z"/><path d="M15.5 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18 7a7 7 0 0 1 0 10"/>',
  soundOff: '<path d="M4 9v6h3l5 4V5L7 9z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  motionOn: '<circle cx="14" cy="12" r="3.5"/><path d="M3 8h5M2 12h6M3 16h5"/>',
  motionOff: '<circle cx="14" cy="12" r="3.5"/><path d="M3 8h5M2 12h6M3 16h5"/><path d="M4 4l16 16"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 13v6H5V5h6"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="1.5"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  message: '<path d="M4 6h16v10H9l-5 4z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/>',
  door: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"/><path d="M4 21h16"/><circle cx="14.5" cy="12" r="1"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  knock: '<path d="M8 13l-3 3 3 3 3-3"/><path d="M9 9l6-6 6 6-6 6z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  stamp: '<path d="M9 10V6a3 3 0 0 1 6 0v4"/><path d="M5 14a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5z"/><path d="M6 19h12"/>',
};

export function icon(name, cls = '') {
  const d = PATHS[name] || '';
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${d}</svg>`;
}
