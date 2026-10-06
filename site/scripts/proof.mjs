// Rendered proof: drives the built journey in headless Chromium and screenshots every chapter at
// desktop and phone widths, plus a reduced-motion pass. Usage:
//   node scripts/proof.mjs [outDir] [--no-build]
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { launch } from './browser.mjs';
import { serveDist } from './serve-dist.mjs';

const args = process.argv.slice(2);
const outDir = args.find((a) => !a.startsWith('--')) || '.proof';
if (!args.includes('--no-build')) execSync('npx vite build', { stdio: 'inherit' });
mkdirSync(outDir, { recursive: true });

const { url, close } = await serveDist(4180);
const browser = await launch();
const errors = [];

async function run(label, viewport, { reducedMotion = false, hasTouch = false } = {}) {
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport, deviceScaleFactor: 1, hasTouch, reducedMotion: reducedMotion ? 'reduce' : 'no-preference' });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(`${label}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${label} console: ${m.text()}`); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(outDir, `${label}-00-load.png`) });
  const chapters = await page.$$eval('[data-chapter]', (els) => els.map((e) => e.dataset.chapter));
  let i = 1;
  for (const id of chapters) {
    await page.evaluate((cid) => {
      const el = document.querySelector(`[data-chapter="${cid}"]`);
      el?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }, id);
    await page.waitForTimeout(reducedMotion ? 400 : 1400);
    await page.screenshot({ path: join(outDir, `${label}-${String(i).padStart(2, '0')}-${id}.png`) });
    i += 1;
  }
  await context.close();
  return chapters;
}

const chapters = await run('desktop', { width: 1440, height: 900 });
await run('phone', { width: 390, height: 844 }, { hasTouch: true });
await run('reduced', { width: 1440, height: 900 }, { reducedMotion: true });

await browser.close();
await close();
console.log(`proof: ${chapters.length} chapters x 3 passes -> ${outDir}`);
if (errors.length) {
  console.error('page errors:\n' + errors.join('\n'));
  process.exit(1);
}
