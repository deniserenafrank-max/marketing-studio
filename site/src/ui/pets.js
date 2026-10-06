// Linework portraits (4:5) used while a mascot photo is missing: two per supervisor, one per
// life. Cream 1.5px strokes in the logo's drawn-line language, nothing cute: Rico keeps his
// flat mouth and spikes, Cheeto keeps his inspection face.
const RICO_BASE = `
  <path d="M30 70c0-16 16-26 34-26 18 0 30 10 30 26 0 14-12 22-30 22S30 84 30 70z"/>
  <path d="M44 80h38"/>
  <circle cx="72" cy="62" r="3"/>
  <path d="M40 50l4-7 4 7M52 45l4-7 4 7M64 44l4-7 4 7"/>
  <path d="M34 86l5 8 5-8 5 8 5-8 5 8 5-8 5 8 5-8"/>
  <path d="M38 92c-6 16 2 34 22 38 20 4 36-8 36-26"/>
  <path d="M96 104c12 8 16 22 8 34"/>`;
const CHEETO_HEAD = `
  <path d="M38 62c0-12 10-20 22-20s22 8 22 20c0 16-10 28-22 28S38 78 38 62z"/>
  <path d="M60 68l-3 3h6zM60 71v4"/>
  <path d="M30 66h12M30 72h12M78 66h12M78 72h12"/>`;

const ART = {
  rico: {
    real: `${RICO_BASE}
  <circle cx="100" cy="20" r="2"/>
  <path d="M100 22l-16 26M100 22l16 26"/>
  <circle cx="100" cy="54" r="5"/>
  <path d="M94 48c4-3 8-3 12 0"/>`,
    work: `${RICO_BASE}
  <path d="M58 93h12M64 93l-5 9 5 28 5-28z"/>
  <rect x="12" y="112" width="30" height="22" rx="2"/>
  <path d="M22 112v-5h10v5M12 122h30"/>
  <rect x="88" y="100" width="24" height="32" rx="2"/>
  <path d="M94 100v-4h12v4M92 110h16M92 118h16M92 126h10"/>`,
  },
  cheeto: {
    real: `
  <rect x="20" y="14" width="80" height="70" rx="2"/>
  <path d="M60 14v70M20 49h80"/>
  <circle cx="38" cy="32" r="7"/>
  <path d="M38 20v-4M38 44v4M26 32h-4M50 32h4M30 24l-3-3M46 24l3-3M30 40l-3 3M46 40l3 3"/>
  <path d="M10 92h100M14 92v6h92v-6"/>
  <path d="M34 92c-2-16 10-26 26-26s28 10 26 26z"/>
  <path d="M42 70l-4-12 11 6M70 70l5-12-11 6"/>
  <path d="M46 76q3-3 6 0M60 76q3-3 6 0"/>
  <path d="M56 82l-2 2h4z"/>
  <path d="M28 80h12M28 85h12M78 80h12M78 85h12"/>
  <path d="M74 70l6-4M78 76l6-4"/>`,
    work: `${CHEETO_HEAD}
  <path d="M36 52c0-14 11-24 24-24s24 10 24 24z"/>
  <path d="M28 52h64M52 28h16v-6h-16z"/>
  <path d="M40 56l-8-6M80 56l8-6"/>
  <circle cx="52" cy="62" r="2.5"/><circle cx="68" cy="62" r="2.5"/>
  <path d="M42 88c-6 14-4 30 4 40h28c8-10 10-26 4-40"/>
  <rect x="46" y="98" width="28" height="30" rx="2"/>
  <path d="M54 98v-4h12v4M50 108h20M50 116h20M50 124h12"/>`,
  },
};

export function petPortrait(id, side = 'real') {
  const art = ART[id]?.[side] || ART.cheeto.real;
  return `<svg class="pet-portrait" viewBox="0 0 120 150" aria-hidden="true" focusable="false">${art}</svg>`;
}
