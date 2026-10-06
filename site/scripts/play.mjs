// Plays the whole journey in headless Chromium (knock, choose, run the numbers, close the
// case, flip the cards, pin a town, flip the pets, reach the table) and screenshots each
// earned state. Usage: node scripts/play.mjs <outDir> [phone]
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { launch } from './browser.mjs';
import { serveDist } from './serve-dist.mjs';

const outDir = process.argv[2] || '.proof/play';
const phone = process.argv.includes('phone');
mkdirSync(outDir, { recursive: true });
const { url, close } = await serveDist(4182);
const browser = await launch();
const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: phone ? { width: 390, height: 844 } : { width: 1440, height: 900 }, hasTouch: phone });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/ERR_|net::/.test(m.text())) errors.push(m.text()); });
const shot = (name) => page.screenshot({ path: join(outDir, `${phone ? 'phone' : 'desktop'}-${name}.png`) });
const settle = (ms) => page.waitForTimeout(ms);
const scrollTo = async (id) => { await page.evaluate((cid) => document.getElementById(cid).scrollIntoView({ behavior: 'instant', block: 'start' }), id); await settle(900); };

await page.goto(url, { waitUntil: 'networkidle' });
await settle(1500);
await page.click('[data-knock]');
await settle(1600);
await shot('01-knocked');
await settle(1600);
await scrollTo('front-hall');
await page.click('.move[data-move="buy"]');
await settle(900);
await shot('02-hall-chosen');
await scrollTo('lab');
for (const id of ['lab-price', 'lab-down', 'lab-rate', 'lab-tax', 'lab-insurance', 'lab-hoa', 'lab-rent']) {
  await page.focus(`#${id}`);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
}
await page.focus('#lab-price');
for (let i = 0; i < 6; i += 1) await page.keyboard.press('ArrowRight');
await page.click('text=Run the numbers');
await settle(1300);
await shot('03-lab-run');
await scrollTo('evidence-board');
await page.click('.word:not(.word-target) >> nth=0');
await settle(300);
for (const w of ['cozy', 'Needs TLC', 'Motivated seller', 'Investor special', 'partial lake view']) {
  await page.click(`.word-target[data-word="${w}"]`);
  await settle(450);
}
await settle(900);
await shot('04-case-closed');
await scrollTo('library');
for (let i = 0; i < 5; i += 1) {
  await page.click(`.flip-btn >> nth=${i}`);
  await settle(250);
}
await settle(900);
await shot('05-library-flipped');
await scrollTo('map-room');
await page.click('.chip[data-town="conroe"]');
await settle(600);
await page.click('.chip[data-town="magnolia"]');
await settle(700);
await shot('06-map-pinned');
await scrollTo('backyard');
await page.click('.polaroid-btn >> nth=0');
await settle(300);
await page.click('.polaroid-btn >> nth=1');
await settle(900);
await shot('07-backyard-flipped');
await scrollTo('closing-table');
await settle(2600);
await shot('08-closing-full-ring');
await page.click('[data-hud-open]');
await settle(600);
await shot('09-keyring-dialog');
await page.keyboard.press('Escape');
const state = await page.evaluate(() => window.__journey.store.get());
console.log('keys', state.keys.length, state.keys.join(','), '| achievements', state.achievements.join(','), '| move', state.move);
await context.close();
await browser.close();
await close();
if (errors.length) { console.error('errors:\n' + errors.join('\n')); process.exit(1); }
console.log('play ok ->', outDir);
