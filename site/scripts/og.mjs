// Renders the link-preview image (1200x630) from the Porch: headline, one line, the lit house
// clear of the type. Usage: node scripts/og.mjs
import { launch } from './browser.mjs';
import { serveDist } from './serve-dist.mjs';
const { url, close } = await serveDist(4184);
const browser = await launch();
const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1200, height: 630 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.addStyleTag({ content: '.hud-ring,.hud-skip,.hud-toggles,.scroll-cue,.hero-hurry,.hero-sub,.hero-actions,.site-header{display:none!important} .porch-copy{bottom:72px!important} .og-line{font-family:var(--font-body);font-size:34px;color:var(--c-ink2);margin:0;text-shadow:0 1px 12px rgb(var(--c-bg-rgb)/.9)}' });
await page.evaluate(() => {
  const line = document.createElement('p');
  line.className = 'og-line';
  line.textContent = 'Denise Frank, Broker and Realtor\u00ae, Houston-north';
  document.querySelector('.hero-title').after(line);
  window.__porch?.setPointer(-1, 0.15);
});
await page.waitForTimeout(2600);
await page.screenshot({ path: new URL('../public/og.jpg', import.meta.url).pathname, type: 'jpeg', quality: 82 });
await browser.close();
await close();
console.log('wrote public/og.jpg');
