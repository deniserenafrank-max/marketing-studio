// Shared headless Chromium launcher for proof scripts. The sandbox pre-installs Chromium at
// PLAYWRIGHT_BROWSERS_PATH (chromium-1194) while the npm playwright build may expect a newer
// revision, so we resolve the executable ourselves instead of calling "playwright install".
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function chromiumExecutable() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (!existsSync(root)) return undefined;
  const dirs = readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort();
  for (const d of dirs.reverse()) {
    for (const rel of ['chrome-linux64/chrome', 'chrome-linux/chrome', 'chrome-linux/headless_shell']) {
      const p = join(root, d, rel);
      if (existsSync(p)) return p;
    }
  }
  return undefined;
}

export async function launch(opts = {}) {
  const executablePath = chromiumExecutable();
  return chromium.launch({ executablePath, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'], ...opts });
}
