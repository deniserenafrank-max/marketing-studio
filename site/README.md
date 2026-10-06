# The Unusual Open House

Denise Frank's personal brand site: a six-minute night walk through her open house in the
Houston-north pines. Every room teaches one real estate lesson and hands you one key; the
eighth hook stays empty for the house key she hands over in person. Built as a progressive
game, readable as a plain document, WCAG 2.2 AA, no tracking.

Brand: Hometown Realtors of Texas (`brands/hometown.json` is the single source of color and
type tokens; `scripts/build-tokens.mjs` turns it into CSS). Spec: `docs/SPEC.md`. The five
team briefs it was synthesized from: `docs/team/`.

## Run

```sh
cd site
npm ci
npm run dev        # http://127.0.0.1:5173
npm run build      # dist/ (relative paths, deploys from any folder)
npm test           # copy gate, lab math, skyline, then axe over every room state (needs a build)
node scripts/proof.mjs .proof        # screenshots: every room, desktop, phone, reduced motion
node scripts/play.mjs .proof/play     # scripted play-through with earned states
node scripts/lint-copy.mjs            # no em dashes, no hype, Fair Housing banned list
```

Node 22. Playwright uses the preinstalled Chromium when `PLAYWRIGHT_BROWSERS_PATH` points at
one (see `scripts/browser.mjs`); otherwise run `npx playwright install chromium` once.

## Deploy

`dist/` is static. Upload it anywhere (the brokerage host, Netlify, GitHub Pages). The HTML
loads DM Serif Display, DM Sans and JetBrains Mono from Google Fonts; to self-host, drop
woff2 files in `public/fonts/` and replace the `<link>` in `index.html` with `@font-face`
rules.

## Photos

The Backyard shows Rico and Cheeto. The site looks for these four files and falls back to
drawn linework portraits while they are missing (the frames never shift):

- `public/media/rico-real-life.webp`
- `public/media/rico-real-estate-life.webp`
- `public/media/cheeto-real-life.webp`
- `public/media/cheeto-real-estate-life.webp`

They are the photo pairs already published on hometownrealtorsoftexas.com (the "In Real
Life" and "Real Estate Life" images in the mascots section). Copy them in at 4:5 or any
ratio; they are cropped to 4:5 with the subject centered. A portrait of Denise is not yet
on the site on purpose: nothing was invented, and none was available to the build.

## Where things live

- `index.html`: the shell. `<!--@room:id-->` markers are replaced at build time with the
  readable no-JS version of each room, rendered from `src/content/copy.js`.
- `src/content/copy.js`: every word on the site. Edit copy here only, then run the lint.
- `src/rooms/*.js`: one module per room, each enhancing its section in place.
- `src/scenes/porch.js`: the Three.js opening; `porch-static.js` the SVG fallback; both share
  `treeline.js`.
- `src/core/`: state and persistence (`store.js`), motion and power preferences, the one live
  region (`announce.js`), scroll choreography (`scroll.js`), procedural sound (`audio.js`).
- `src/ui/`: HUD, keys, icons, toasts, the drawn map, the pet portraits.
- `tests/`: `copy.test.mjs` (unit) and `a11y.test.mjs` (axe over every room state).

## Compliance

The footer carries the TREC Information About Brokerage Services and Consumer Protection
Notice links, the brokerage name, license #0530671, the Equal Housing statement and the
REALTOR® mark. The Lab shows its "estimates, not advice" plaque beside the outputs. Map Room
notes describe places and process, never people. `scripts/lint-copy.mjs` enforces the
banned list from `docs/team/a11y.md`.
