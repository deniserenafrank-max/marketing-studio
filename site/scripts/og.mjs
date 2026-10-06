// Renders the link-preview image (1200x630) from the Porch at rest. Usage: node scripts/og.mjs
import { launch } from './browser.mjs';
import { serveDist } from './serve-dist.mjs';
const { url, close } = await serveDist(4184);
const browser = await launch();
const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1200, height: 630 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.addStyleTag({ content: '.hud-ring,.hud-skip,.hud-toggles,.scroll-cue,.hero-hurry{display:none!important}' });
await page.screenshot({ path: new URL('../public/og.png', import.meta.url).pathname });
await browser.close();
await close();
console.log('wrote public/og.png');
