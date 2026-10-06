// Automated accessibility gate: axe-core over the built journey on load, after scrolling to
// every chapter, and with every key earned. Run: npm run build && npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { launch } from '../scripts/browser.mjs';
import { serveDist } from '../scripts/serve-dist.mjs';

const impactRank = { minor: 1, moderate: 2, serious: 3, critical: 4 };

function describe(violations) {
  return violations
    .map((v) => `${v.impact}: ${v.id} (${v.help})\n` + v.nodes.slice(0, 3).map((n) => `   ${n.target.join(' ')}`).join('\n'))
    .join('\n');
}

test('journey has no axe violations at any chapter state', { timeout: 180000 }, async () => {
  assert.ok(existsSync(new URL('../dist/index.html', import.meta.url)), 'build first: npm run build');
  const { url, close } = await serveDist(4181);
  const browser = await launch();
  try {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport });
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      const states = ['load'];
      const chapters = await page.$$eval('[data-chapter]', (els) => els.map((e) => e.dataset.chapter));
      const findings = [];
      const audit = async (label) => {
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).exclude('canvas').analyze();
        const serious = results.violations.filter((v) => impactRank[v.impact] >= impactRank.moderate);
        if (serious.length) findings.push(`[${viewport.width}px ${label}]\n${describe(serious)}`);
      };
      await audit('load');
      for (const id of chapters) {
        await page.evaluate((cid) => document.querySelector(`[data-chapter="${cid}"]`)?.scrollIntoView({ block: 'start', behavior: 'instant' }), id);
        await page.waitForTimeout(500);
        await audit(id);
        states.push(id);
      }
      await page.evaluate(() => window.__journey?.debugEarnAll?.());
      await page.waitForTimeout(500);
      await audit('all-keys');
      await context.close();
      assert.equal(findings.length, 0, `axe violations:\n${findings.join('\n\n')}`);
    }
  } finally {
    await browser.close();
    await close();
  }
});
