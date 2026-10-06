// Builds dist-artifact/artifact.html: the journey as a self-contained page body (inline CSS and
// JS, Google Fonts links kept, brand SVG and OG image published alongside). Usage:
//   node scripts/build-artifact.mjs
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const out = 'dist-artifact';
rmSync(out, { recursive: true, force: true });
execSync('npx vite build --config vite.artifact.config.js', { stdio: 'inherit' });
let html = readFileSync(join(out, 'index.html'), 'utf8');
const assets = readdirSync(join(out, 'assets'));
const css = assets.find((f) => f.endsWith('.css'));
const js = assets.find((f) => f.endsWith('.js'));
const cssText = readFileSync(join(out, 'assets', css), 'utf8');
const jsText = readFileSync(join(out, 'assets', js), 'utf8').replace(/<\/script/gi, '<\\/script');

// Keep only what belongs inside the host's skeleton: title, metas, font links, style, body content.
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const keep = head
  .split('\n')
  .filter((l) => /<title>|<meta name="description"|<meta property="og|<meta name="twitter|<link rel="preconnect"|<link rel="stylesheet" href="https:\/\/fonts/.test(l))
  .join('\n');
const page = `${keep}
<style>${cssText}</style>
${body.replace(/<script type="module"[^>]*><\/script>\s*/g, '')}
<script type="module">${jsText}</script>
`;
writeFileSync(join(out, 'artifact.html'), page);
console.log(`wrote ${out}/artifact.html (${(page.length / 1024).toFixed(0)} KB)`);
