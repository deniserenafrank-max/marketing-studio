// No-WebGL fallback (also what reduced-motion visitors and crawlers get before WebGL boots):
// the same pines as layered SVG, the porch light between the far and near layers, and a few
// still fireflies. Pure markup, no animation.
import { skyline, skylinePath, mulberry32 } from './treeline.js';

const LAYERS = [
  { seed: 11, color: 'var(--c-pine-4)', scale: 70, baseline: 0.62, min: 2.0, max: 3.4, spacing: 1.1 },
  { seed: 7, color: 'var(--c-pine-3)', scale: 90, baseline: 0.7, min: 1.8, max: 3.4, spacing: 1.0 },
  { seed: 5, color: 'var(--c-pine-2)', scale: 120, baseline: 0.8, min: 1.6, max: 3.6, spacing: 0.95 },
  { seed: 3, color: 'var(--c-pine-1)', scale: 165, baseline: 0.92, min: 1.4, max: 3.6, spacing: 0.9 },
];

export function porchStaticSVG({ width = 1600, height = 900 } = {}) {
  const paths = LAYERS.map((l) => {
    const pts = skyline({ width: width / l.scale + 2, seed: l.seed, minHeight: l.min, maxHeight: l.max, spacing: l.spacing, step: 0.04 });
    return `<path fill="${l.color}" d="${skylinePath(pts, { width, height, scaleX: l.scale, scaleY: l.scale, baseline: height * l.baseline })}"/>`;
  });
  const rnd = mulberry32(42);
  let flies = '';
  for (let i = 0; i < 26; i += 1) {
    const x = (rnd() * width).toFixed(0);
    const y = (height * (0.35 + rnd() * 0.55)).toFixed(0);
    const r = (1.2 + rnd() * 1.8).toFixed(1);
    const o = (0.35 + rnd() * 0.6).toFixed(2);
    flies += `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--c-profit)" opacity="${o}"/>`;
  }
  const lx = width * 0.58;
  const ly = height * 0.68;
  return `<svg class="porch-static" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="porch-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="var(--c-profit)" stop-opacity="0.85"/><stop offset="0.3" stop-color="var(--c-brand)" stop-opacity="0.3"/><stop offset="1" stop-color="var(--c-brand)" stop-opacity="0"/></radialGradient>
  </defs>
  ${paths[0]}${paths[1]}
  <circle cx="${lx}" cy="${ly}" r="${height * 0.2}" fill="url(#porch-glow)"/>
  <rect x="${lx - 8}" y="${ly - 11}" width="16" height="22" rx="2" fill="var(--c-profit)"/>
  ${paths[2]}${paths[3]}
  ${flies}
</svg>`;
}
