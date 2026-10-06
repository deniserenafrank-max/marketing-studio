// Dump one axe violation's node details under an emulation. Usage:
//   OUT_DIR=dist-next node scripts/axe-one.mjs color-contrast forced|reduced [#chapter]
import AxeBuilder from '@axe-core/playwright';
import { launch } from './browser.mjs';
import { serveDist } from './serve-dist.mjs';
const [ruleId = 'color-contrast', mode = '', chapter = ''] = process.argv.slice(2);
const { url, close } = await serveDist(4187);
const browser = await launch();
const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 }, forcedColors: mode === 'forced' ? 'active' : 'none', reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
if (chapter) { await page.evaluate((c) => document.querySelector(c)?.scrollIntoView({ block: 'start', behavior: 'instant' }), chapter); await page.waitForTimeout(500); }
const r = await new AxeBuilder({ page }).withRules([ruleId]).analyze();
for (const v of r.violations) for (const n of v.nodes.slice(0, 4)) console.log(n.target.join(' '), '\n  ', n.any.map((a) => a.message).join(' | '), '\n  ', JSON.stringify(n.any[0]?.data));
console.log('violations:', r.violations.length);
await browser.close();
await close();
