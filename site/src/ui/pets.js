// Linework portraits (4:5) used when a mascot photo is missing. Cream 1.5px strokes, the same
// drawn-line language as the logo, so an empty frame never reads as broken.
export function petPortrait(id) {
  if (id === 'rico') {
    return `<svg class="pet-portrait" viewBox="0 0 120 150" aria-hidden="true" focusable="false">
      <path d="M28 78c0-18 14-30 34-30 16 0 30 8 34 20 2 6 0 12-6 14l-10 2"/>
      <path d="M34 90c-6 12-2 26 10 30 10 3 24 2 34-4 8-5 12-14 8-22"/>
      <path d="M86 92l6 6-8 2 6 6-8 1 5 6-9 0 4 6"/>
      <path d="M42 62l4-6 4 6 4-6 4 6"/>
      <circle cx="78" cy="62" r="3"/>
      <path d="M62 76c8 2 16 1 24-4"/>
      <path d="M48 92l6 6 6-6 6 6 6-6 6 6"/>
      <path d="M56 100v12l-4 6M64 100v12l4 6"/>
      <path d="M52 118l10 8 10-8"/>
      <path d="M62 126v10"/>
      <path d="M30 104c-10 2-16 10-14 20 2 6 8 8 14 6"/>
    </svg>`;
  }
  return `<svg class="pet-portrait" viewBox="0 0 120 150" aria-hidden="true" focusable="false">
      <path d="M36 60l-6-24 20 12"/>
      <path d="M84 60l6-24-20 12"/>
      <path d="M30 60c0-14 14-22 30-22s30 8 30 22c0 18-12 36-30 36S30 78 30 60z"/>
      <path d="M46 62q4-4 8 0M66 62q4-4 8 0"/>
      <path d="M57 74h6l-3 3z"/>
      <path d="M60 77v4M60 81q-6 5-10 0M60 81q6 5 10 0"/>
      <path d="M12 72h26M12 80l26-3M12 64l26 3"/>
      <path d="M108 72H82M108 80l-26-3M108 64l-26 3"/>
      <path d="M40 92c-12 10-14 28-6 40h52c8-12 6-30-6-40"/>
      <path d="M54 104l6-6 6 6-6 4z"/>
      <path d="M42 112h36"/>
    </svg>`;
}
