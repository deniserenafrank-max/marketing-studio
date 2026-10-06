// Wraps dist-artifact/artifact.html in a stand-in for the artifact host skeleton and screenshots it.
// Simulates the artifact host skeleton around the single-file page and screenshots it.
import { readFileSync, writeFileSync } from 'node:fs';
import { preview } from 'vite';
import { launch } from './browser.mjs';
const body = readFileSync('/home/user/marketing-studio/site/dist-artifact/artifact.html', 'utf8');
writeFileSync('/home/user/marketing-studio/site/dist-artifact/wrapped.html', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui;background:#f6f6f4}img{max-width:100%}[hidden]{display:none!important}</style></head><body>${body}</body></html>`);
const server = await preview({ root: '/home/user/marketing-studio/site', build: { outDir: 'dist-artifact' }, preview: { port: 4185, strictPort: true, host: '127.0.0.1', open: false }, logLevel: 'silent' });
const browser = await launch();
const errors = [];
for (const [label, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: vp });
  page.on('pageerror', (e) => errors.push(`${label}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_|net::/.test(m.text())) errors.push(`${label} console: ${m.text()}`); });
  await page.goto('http://127.0.0.1:4185/wrapped.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `/tmp/claude-0/-home-user-marketing-studio/778d8428-468d-5bc1-883c-c44bdff92002/scratchpad/shots/artifact-${label}.png` });
  await page.click('[data-knock]');
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `/tmp/claude-0/-home-user-marketing-studio/778d8428-468d-5bc1-883c-c44bdff92002/scratchpad/shots/artifact-${label}-knocked.png` });
  const keys = await page.evaluate(() => window.__journey.store.get().keys.length);
  console.log(label, 'keys after knock:', keys, 'webgl:', await page.evaluate(() => document.querySelector('.porch-scene').classList.contains('has-webgl')));
  await page.close();
}
await browser.close();
await new Promise((r) => server.httpServer.close(r));
console.log(errors.length ? 'errors:\n' + errors.join('\n') : 'artifact wrap ok');
