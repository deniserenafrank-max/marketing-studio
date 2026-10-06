// Automated accessibility gate: axe-core over the built journey on load, after scrolling to
// every room, with every flip card open, with every key earned, at four widths, plus a
// reduced-motion pass and a forced-colors pass. Run: npm run build && npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { launch } from '../scripts/browser.mjs';
import { serveDist } from '../scripts/serve-dist.mjs';

const impactRank = { minor: 1, moderate: 2, serious: 3, critical: 4 };
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

function describe(violations) {
  return violations
    .map((v) => `${v.impact}: ${v.id} (${v.help})\n` + v.nodes.slice(0, 3).map((n) => `   ${n.target.join(' ')}`).join('\n'))
    .join('\n');
}

async function auditPage(page, label, findings) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).exclude('canvas').analyze();
  const serious = results.violations.filter((v) => impactRank[v.impact] >= impactRank.moderate);
  if (serious.length) findings.push(`[${label}]\n${describe(serious)}`);
}

async function runStates(page, label, findings, { full = true } = {}) {
  await page.goto(URL_, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await auditPage(page, `${label} load`, findings);
  if (!full) return;
  const chapters = await page.$$eval('[data-chapter]', (els) => els.map((e) => e.dataset.chapter));
  for (const id of chapters) {
    await page.evaluate((cid) => document.querySelector(`[data-chapter="${cid}"]`)?.scrollIntoView({ block: 'start', behavior: 'instant' }), id);
    await page.waitForTimeout(400);
    await auditPage(page, `${label} ${id}`, findings);
  }
  await page.evaluate(() => document.querySelectorAll('.flip-btn').forEach((b) => b.click()));
  await page.waitForTimeout(300);
  await auditPage(page, `${label} cards open`, findings);
  await page.evaluate(() => window.__journey?.debugEarnAll?.());
  await page.waitForTimeout(500);
  await auditPage(page, `${label} all keys`, findings);
}

let URL_ = '';

test('journey has no axe violations at any chapter state', { timeout: 420000 }, async () => {
  assert.ok(existsSync(new URL(`../${process.env.OUT_DIR || 'dist'}/index.html`, import.meta.url)), 'build first: npm run build');
  const { url, close } = await serveDist(4181);
  URL_ = url;
  const browser = await launch();
  const findings = [];
  try {
    for (const [w, h, full] of [[1440, 900, true], [390, 844, true], [320, 568, false], [640, 900, false]]) {
      const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: w, height: h } });
      const page = await context.newPage();
      await runStates(page, `${w}px`, findings, { full });
      await context.close();
    }
    const reduced = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await runStates(await reduced.newPage(), 'reduced-motion', findings, { full: true });
    await reduced.close();
    const forced = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 }, forcedColors: 'active' });
    await runStates(await forced.newPage(), 'forced-colors', findings, { full: false });
    await forced.close();
  } finally {
    await browser.close();
    await close();
  }
  assert.equal(findings.length, 0, `axe violations:\n${findings.join('\n\n')}`);
});
