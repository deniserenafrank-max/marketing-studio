// Pure skyline math shared by the WebGL porch scene and the static SVG fallback, so both show
// the same pines. A skyline is a sampled max() over tiered pine profiles; sampling (not unions
// of polygons) keeps the outline non-self-intersecting so it triangulates cleanly.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pineProfile(dx, height, halfWidth) {
  const t = Math.abs(dx) / halfWidth;
  if (t >= 1) return 0;
  const tiers = 3;
  const tier = Math.floor(t * tiers);
  const within = t * tiers - tier;
  // Each tier is a triangle that starts wider than the one above it (the notch).
  const notch = 0.22;
  const envelope = 1 - t;
  const jag = 1 - notch * within;
  return height * Math.max(0, envelope * jag + (tier === 0 ? 0 : 0));
}

/**
 * @param {object} o
 * @param {number} o.width total width of the skyline in scene units
 * @param {number} o.seed
 * @param {number} o.minHeight
 * @param {number} o.maxHeight
 * @param {number} o.spacing average distance between trunks
 * @param {number} o.step sample step
 * @returns {Array<[number, number]>} points along the top edge from left to right
 */
export function skyline({ width, seed = 1, minHeight = 1.2, maxHeight = 3.2, spacing = 0.9, step = 0.05, clearing = null }) {
  const rnd = mulberry32(seed);
  const trees = [];
  for (let x = -width / 2 - spacing; x <= width / 2 + spacing; x += spacing * (0.55 + rnd() * 0.9)) {
    let height = minHeight + rnd() * (maxHeight - minHeight);
    const tx = x + (rnd() - 0.5) * spacing * 0.4;
    if (clearing) {
      // A soft dip in the treeline so the house and its light are framed, not buried.
      const d = (tx - clearing.x) / clearing.width;
      height *= 1 - clearing.depth * Math.exp(-d * d * 2.2);
    }
    trees.push({ x: tx, height, halfWidth: height * (0.16 + rnd() * 0.12) });
  }
  const pts = [];
  for (let x = -width / 2; x <= width / 2 + 1e-6; x += step) {
    let h = 0;
    for (const t of trees) {
      if (Math.abs(x - t.x) < t.halfWidth) h = Math.max(h, pineProfile(x - t.x, t.height, t.halfWidth));
    }
    pts.push([Number(x.toFixed(3)), Number(h.toFixed(3))]);
  }
  return pts;
}

/** SVG path for a filled skyline in a box of the given size (y down), used by the static fallback. */
export function skylinePath(points, { width, height, scaleX, scaleY, baseline }) {
  let d = `M0 ${height} `;
  for (const [x, y] of points) {
    const sx = ((x * scaleX + width / 2)).toFixed(1);
    const sy = (baseline - y * scaleY).toFixed(1);
    d += `L${sx} ${sy} `;
  }
  d += `L${width} ${height} Z`;
  return d;
}
