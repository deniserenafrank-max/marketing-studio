// Dump one axe violation's node details under an emulation. Usage:
//   OUT_DIR=dist-next node scripts/axe-one.mjs color-contrast forced
import AxeBuilder from '@axe-core/playwright';
import { launch } from './browser.mjs';
import { serveDist } from './serve-dist.mjs';
const [ruleId = 'color-contrast', mode = ''] = process.argv.slice(2);
const { url, close } = await serveDist(4187);
const browser = await launch();
const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 }, forcedColors: mode === 'forced' ? 'active' : 'none' });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const r = await new AxeBuilder({ page }).withRules([ruleId]).analyze();
for (const v of r.violations) for (const n of v.nodes.slice(0, 4)) console.log(n.target.join(' '), '\n  ', n.any.map((a) => a.message).join(' | '), '\n  ', JSON.stringify(n.any[0]?.data));
console.log('violations:', r.violations.length);
const probe = await page.evaluate(() => {
  const p = document.querySelector('.footer-text > p:nth-child(2)');
  const cs = getComputedStyle(p);
  return { color: cs.color, bg: getComputedStyle(p.closest('.site-footer')).backgroundColor, forced: matchMedia('(forced-colors: active)').matches, adjust: cs.forcedColorAdjust };
});
console.log(probe);
await browser.close();
await close();
