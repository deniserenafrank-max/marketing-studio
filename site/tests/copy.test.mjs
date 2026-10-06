import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { compute } from '../src/rooms/lab.js';
import { LAB } from '../src/content/copy.js';
import { skyline } from '../src/scenes/treeline.js';

test('copy passes the voice and Fair Housing gate', () => {
  const out = execFileSync(process.execPath, [new URL('../scripts/lint-copy.mjs', import.meta.url).pathname]).toString();
  assert.match(out, /clean/);
});

test('lab math: the brokerage example lands near its published figures', () => {
  // hometownrealtorsoftexas.com example (2026): $325,000, 5% down, 30 years, 2.5% tax,
  // $3,000 insurance, $50 HOA -> P&I $2,054, taxes $677, insurance $250, PMI $154, upkeep $271.
  const r = compute({ ...LAB.defaults });
  assert.ok(Math.abs(r.taxes - 677) < 1, `taxes ${r.taxes}`);
  assert.ok(Math.abs(r.ins - 250) < 1, `insurance ${r.ins}`);
  assert.ok(Math.abs(r.pmi - 154) < 1, `pmi ${r.pmi}`);
  assert.ok(Math.abs(r.upkeep - 271) < 1, `upkeep ${r.upkeep}`);
  assert.ok(r.pi > 1800 && r.pi < 2300, `p&i ${r.pi}`);
  assert.equal(compute({ ...LAB.defaults, down: 20 }).pmi, 0);
});

test('skyline is deterministic and never self-intersecting (monotonic x)', () => {
  const a = skyline({ width: 20, seed: 3 });
  const b = skyline({ width: 20, seed: 3 });
  assert.deepEqual(a, b);
  for (let i = 1; i < a.length; i += 1) assert.ok(a[i][0] > a[i - 1][0]);
});
