// Copy gate for the journey: no em or en dashes, no hype or guarantees, and the ten Fair
// Housing rules from docs/team/a11y.md as a banned-phrase list. Runs over every string in
// src/content/copy.js. Exit 1 on any hit. Usage: node scripts/lint-copy.mjs
import * as copy from '../src/content/copy.js';

const BANNED = [
  /—|–/, // em and en dashes
  /\bfamily[- ]friendly\b/i, /\bperfect for (families|couples|singles|professionals|retirees|empty nesters)\b/i, /\bideal for\b/i, /\bbachelor pad\b/i,
  /\bsafe (neighborhood|area|street)\b/i, /\blow crime\b/i, /\bquiet\b/i, /\bdesirable area\b/i,
  /\b(good|great|top|best) schools?\b/i, /\bfor your kids\b/i,
  /\bexclusive\b/i, /\bupscale neighbors\b/i, /\bpeople like you\b/i,
  /\bchurch(es)?\b/i, /\bethnic\b/i, /\bdiverse (area|neighborhood)\b/i,
  /\bhandicap\b/i, /\bnot suitable for\b/i,
  /\bno kids\b/i, /\badults only\b/i, /\bmature (community|neighborhood)\b/i, /\bnursery\b/i,
  /\bideal tenant\b/i, /\bwe prefer\b/i,
  /\bdream home\b/i, /\bluxury lifestyle\b/i, /\bguarantee/i, /\bboost your (credit|score)\b/i, /\bfix your credit\b/i,
];

const hits = [];
function walk(v, path) {
  if (typeof v === 'string') {
    for (const re of BANNED) if (re.test(v)) hits.push(`${path}: ${re} in "${v.slice(0, 80)}"`);
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
}
for (const [k, v] of Object.entries(copy)) if (typeof v !== 'function') walk(v, k);

if (hits.length) {
  console.error('lint-copy: ' + hits.length + ' problem(s)\n' + hits.join('\n'));
  process.exit(1);
}
console.log('lint-copy: clean (' + BANNED.length + ' rules, every string in src/content/copy.js)');
