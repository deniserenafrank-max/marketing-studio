// Screenshot one URL: node scripts/shot.mjs <url> <out.png> [width] [height] [--reduced] [--wait=ms]
import { launch } from './browser.mjs';
import { serveDist } from './serve-dist.mjs';
const [target, out, w = '1440', h = '900'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
// A path (e.g. "/#lab") is served from the built site (OUT_DIR or dist); a full URL is used as is.
const served = target.startsWith('/') ? await serveDist(4186) : null;
const url = served ? served.url.replace(/\/$/, '') + target : target;
const flags = process.argv.slice(2).filter((a) => a.startsWith('--'));
const wait = Number((flags.find((f) => f.startsWith('--wait=')) || '--wait=1500').split('=')[1]);
const browser = await launch();
const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: Number(w), height: Number(h) }, reducedMotion: flags.includes('--reduced') ? 'reduce' : 'no-preference' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(wait);
await page.screenshot({ path: out });
await browser.close();
if (served) await served.close();
console.log('wrote', out, errors.length ? '\nconsole:\n' + errors.join('\n') : '');
