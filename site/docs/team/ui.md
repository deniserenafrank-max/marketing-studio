# UI spec: Denise Frank, "Not your usual open house"

Night in the pines: near-square geometry, drawn cream line, one gold light source per scene. Nothing is pure white; nothing is a template card. Contrast ratios are measured against the tokens.

## 1. Tokens

```css
:root{
  --bg:#072018;--surface:#0d2a20;--surface2:#133a2c;--line:#1f4a39;
  --ink:#f4ebdd;--ink2:#c8c1b0;--ink3:#9c9a8a;
  --brand:#d4a843;--profit:#e8c874;--safe:#4cc38a;--loss:#e36a55;--info:#7fb2d0;--rare:#e08a4a;
  --bg-deep:#04160f;--bg-void:#020c08; /* the only derived shades */
  --bg-rgb:7 32 24;--void-rgb:2 12 8;--ink-rgb:244 235 221;--brand-rgb:212 168 67;--profit-rgb:232 200 116;--info-rgb:127 178 208;
  --gold-12:rgb(var(--brand-rgb)/.12);--gold-24:rgb(var(--brand-rgb)/.24);--gold-40:rgb(var(--brand-rgb)/.4);--gold-60:rgb(var(--brand-rgb)/.6);
  --ink-06:rgb(var(--ink-rgb)/.06);--ink-12:rgb(var(--ink-rgb)/.12);--ink-35:rgb(var(--ink-rgb)/.35);--ink-72:rgb(var(--ink-rgb)/.72);
  --light-18:rgb(var(--profit-rgb)/.18); /* heart #e12d32 lives only inside the SVG, not a token */

  --font-display:"DM Serif Display",Georgia,"Times New Roman",serif;
  --font-body:"DM Sans","Helvetica Neue",Arial,sans-serif;
  --font-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
  --fs-d1:clamp(2.75rem,1.6rem + 5.5vw,6.5rem);--fs-d2:clamp(2.125rem,1.35rem + 3.6vw,4.25rem);
  --fs-d3:clamp(1.625rem,1.2rem + 2vw,2.75rem);--fs-d4:clamp(1.25rem,1.05rem + 1vw,1.75rem);
  --fs-body:clamp(1rem,.95rem + .25vw,1.125rem);--fs-small:.875rem;--fs-fine:.8125rem;--fs-label:.75rem;
  --lh-display:1.02;--lh-body:1.55;--track-label:.14em;--track-d1:-.01em;--measure:62ch;
  /* weights: serif 400 only; DM Sans 400/500/600; mono 400 */

  --sp-1:4px;--sp-2:8px;--sp-3:12px;--sp-4:16px;--sp-5:24px;--sp-6:32px;--sp-7:48px;--sp-8:64px;--sp-9:96px;--sp-10:128px;
  --sp-section:clamp(4rem,2rem + 8vw,10rem);
  --r-1:2px;--r-2:4px;--r-pill:999px; /* 4px is the house radius; pill only for slider thumb and HUD */
  --bw:1px;--bw-icon:1.5px;--border:1px solid var(--line);--border-gold:1px solid var(--gold-40);

  --shadow-1:0 1px 2px rgb(0 0 0/.45),0 8px 24px -12px rgb(0 0 0/.6);
  --shadow-2:0 2px 4px rgb(0 0 0/.5),0 16px 40px -16px rgb(0 0 0/.7);
  --glow-gold:0 0 0 1px var(--gold-40),0 0 24px -6px var(--gold-40);
  --halation:0 0 24px var(--light-18); /* text-shadow on gold display text = halation .1 */

  --z-scene:0;--z-content:10;--z-grade:20;--z-hud:30;--z-toast:40;--z-tray:50;--z-dialog:60;--z-skip:100;

  --dur-1:120ms;--dur-2:240ms;--dur-3:480ms;--dur-4:900ms;--dur-5:1600ms;--stagger:60ms;--parallax:.2;
  --ease-out:cubic-bezier(.22,1,.36,1);--ease-in-out:cubic-bezier(.65,0,.35,1);
  --ease-spring:cubic-bezier(.32,1.2,.44,1); /* overshoot .2 = GSAP back.out(1.2) */
}
@media (prefers-reduced-motion:reduce){:root{--dur-1:1ms;--dur-2:1ms;--dur-3:1ms;--dur-4:1ms;--dur-5:1ms;--parallax:0;--ease-spring:var(--ease-out)}}
```

Honor these: `--ink3` and `--loss` fail 4.5:1 on `--surface2` (4.43, 3.87), so they sit only on `--bg` or `--surface`. `--bg` on `--brand` is 7.72:1; `--ink-72` is 7.98:1.

**Grade, cheap.** One fixed `div.grade` (`pointer-events:none`, z-grade: over content, under the HUD). `::before` grain: a 256px SVG `feTurbulence baseFrequency=.8 numOctaves=2` data-URI tile, element 200% wide offset -50%, `opacity:.08`, `mix-blend-mode:soft-light`, `animation:grain .8s steps(6) infinite` on `transform` only (compositor, no repaint). `::after` vignette: `radial-gradient(120% 90% at 50% 45%,transparent 50%,rgb(var(--void-rgb)/.15) 78%,rgb(var(--void-rgb)/.32) 100%)`. Halation is never a full-screen blur: gold display text gets `text-shadow:var(--halation)`; lamp and earned keys get `filter:drop-shadow(0 0 12px var(--light-18))`. Reduced motion or low tier: static grain.

## 2. Grid

Container 72rem; wide 88rem (Evidence Board, Map Room); prose `max-width:var(--measure)`. Gutter `clamp(16px,4vw,48px)`. Columns 4 under 768, 6 under 1024, 12 above; gap 16px phone, 24px desktop. Breakpoints 480, 768, 1024, 1280. Pinned scenes `min-height:100svh`. Interactions stack under the title on phone; the key materializes centered on the interaction, then flies to the HUD.

| Room | Mode | Title | Interaction (1024+) | Key when |
|---|---|---|---|---|
| Porch | pinned, scrub 150vh | bottom-left, cols 1-7, d1 | door CTA, scroll cue | none (arrival) |
| Front Hall | flowing | top-left, d2 | three door tags on a rail, cols 7-12 | a move is chosen |
| Lab | pinned at 1024+ | top-left | sliders cols 1-5, readout 7-12 | two sliders moved |
| Evidence Board | flowing, full-bleed surface2 | top-center case label | 5 cards scattered on 12 cols | 3 euphemisms found |
| Library | flowing | top-left | shelf 3-up, scroll-snap on phone | 3 cards flipped |
| Map Room | pinned at 1024+ | top-left | map cols 1-7, chips 9-12 | 3 towns visited |
| Backyard | flowing | top-left | two pair cards side by side | both pairs toggled |
| Closing Table | flowing, centered | centered d2 | ring completes, contact, footer | ring closes |

## 3. Components

Global: hover `--dur-2 --ease-out`; focus-visible `outline:2px solid var(--brand);outline-offset:3px` (cream outline on gold); disabled `cursor:not-allowed`; locked = disabled + lock icon + tooltip naming the key; earned = gold fill + halation.

**HUD keyring.** Fixed top-right (desktop), bottom-center above the safe area (phone). 40px pill (44 phone), `rgb(var(--bg-rgb)/.72)`, `backdrop-filter:blur(8px)`, border `--ink-12`: a 20px cream ring, six 18px keys overlapping 6px like real keys, mono `3 / 6`. Earned: gold bow, cream line. Unearned: `--ink-35` line, no fill, shape kept so slots count at a glance. A seventh smaller tag-key appears only when the hidden key is found. One `button` opens the tray; hover tooltip lists rooms. Earn: new key scales .6 to 1 on `--ease-spring` `--dur-3`; ring rotates 4° and settles.

**Key glyph (24 grid).** `stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;fill:none`. Bow `circle cx7 cy12 r3.75`, hole `circle cx7 cy12 r1.25`, shaft `M10.75 12H21`, bit `M18 12v3` and `M21 12v3.5`. Earned: bow `fill:var(--brand)`, hole `fill:var(--bg)`, shaft `--profit`. Same paths at 32 (toast) and 48 (tray, closing table).

**Eyebrow + title.** Eyebrow: mono `--fs-label` uppercase `--track-label` `--brand`, after a 24px gold rule. Title: display `--fs-d2` (hero `--fs-d1`, `--track-d1`), `--ink`, `--lh-display`, max 20ch (14ch hero); exactly one word italic in `--brand`: "Not your *usual* open house." Reveal: words rise 24px on `--ease-spring`, `--stagger` apart.

**Body.** `--fs-body` `--lh-body`, `--ink2` running text, `--ink` leads, `max-width:var(--measure)`. Links cream, `underline 1px var(--brand)`, offset .18em; hover `--brand`.

**Buttons.** 48px (36 sm, 56 hero), padding 0 24, `--r-2`, DM Sans 600 15px, `letter-spacing:.02em`. Primary `--brand`/`--bg`; hover `--profit`, `translateY(-1px)`, `--glow-gold`; active scale .98; disabled `--gold-12`/`--ink-35`, border `--gold-24`. Secondary transparent, border `--ink-35`, text `--ink`; hover border `--ink`, bg `--ink-06`; active `--ink-12`; disabled border `--ink-12`, text `--ink-35`.

**Slider (Lab).** Native range input. Track 4px `--line`, fill `--brand`; thumb 20px (28 touch) cream, 2px `--bg` border, `--shadow-1`; hover scale 1.1; dragging `--profit` + mono value bubble; disabled track `--surface2`, thumb `--ink3`. Label DM Sans 500 `--ink` left, mono `--profit` value right; readout `--fs-d3` `--profit`.

**Pinboard card.** The only cream surface: bg `--ink`, text `--bg`, mono 13px, padding 20, 280 to 320 wide, `--r-1`, `--shadow-2`, rotations -2, 1.5, -1, 2.5, -1.5°, 10px gold pin top center, gold twine (`--gold-60` 1px SVG) between related cards, never red string. Euphemism spans: rest `1px dotted rgb(var(--bg-rgb)/.4)` underline; hover `--gold-24`; found `--brand` highlighter; wrong tap coral underline 600ms, nothing persists; focus-visible `outline:2px solid var(--bg)`. All found: a surface2 index card with the plain-English reality slides out beneath.

**Flip card (Library).** `button[aria-pressed]`, 3:4, 240 to 300 wide, `perspective:1000px`. Front `--surface` + `--border`, mono "WORD · 12", word in `--fs-d3`, book icon; back `--surface2`, definition `--ink`, Denise's gloss italic `--ink2`. Hover `translateY(-2px)`, border `--gold-40`; flipped rotateY 180 over `--dur-3 --ease-out`; earned gold pin dot top-right; reduced motion crossfades.

**Map + chips.** Inline SVG: county outline, I-45, 105, 249, 1488 at 1px `--ink-35`; Lake Conroe `rgb(var(--info-rgb)/.18)`; Houston a cream dot, never a heart. Pins: map-pin icon, cream; hover scale 1.15; visited gold. Chips: 36px, padding 0 14, `--r-1` (not pill), border `--ink-35`, mono uppercase; hover border `--ink`; visited `--gold-12` bg, `--brand` border and text, 6px gold dot. Chips and pins share one `aria-pressed` group.

**Photo pair card.** Two 4:5 frames per animal: mount `--surface`, 8px padding, `--border`, `--r-2`; photo `--r-1`. Captions mono label: IN REAL LIFE `--ink2`, REAL ESTATE LIFE `--brand`. Plaque bottom-left of frame two: `--surface2`, `--border-gold`, mono 11px uppercase HEAD OF SECURITY. Phone: a two-segment toggle swaps frames; desktop shows both. Missing photo: same frame, `aspect-ratio:4/5` (no shift), `--surface2`, 48px paw icon, name in display italic, mono PHOTO PENDING; `img.onerror` adds `.is-missing`.

**Toast, key earned.** `role=status aria-live=polite`; top-right under the HUD on desktop, above it on phone. 280 to 360 wide, `--surface`, `--border-gold`, `--r-2`, padding 12 16 12 12, `--shadow-1`: 32px earned key, mono KEY EARNED `--brand`, DM Sans 15 `--ink` "The Lab key. You ran the numbers.", mono `3 of 6` `--ink2`. Enter 12px rise + fade on `--ease-spring`; hold 4s (hover pauses); then the key FLIPs to its HUD slot over `--dur-4 --ease-in-out`. Focus never moves.

**Achievements tray.** `dialog`: right sheet 360px at 1024+, bottom sheet `max-height:80dvh` on phone; `--surface`, `border-left:var(--border)`, backdrop `rgb(var(--bg-rgb)/.6)`. Header "Your keyring" `--fs-d4`. Rows: 48px key, room DM Sans 500, lesson `--fs-small` `--ink2`, mono EARNED or LOCKED (locked rows `--ink3`, 5.41:1 on surface). Footer: secondary "Keep exploring"; when complete, primary "Go to the closing table". Esc closes, focus trapped and returned.

**Contact actions.** Phone as selectable text, `--fs-d3` display `--profit`: (832) 928-3019, with a secondary "Copy" (reads "Copied" for 2s) and a secondary "Call" (`tel:`) as the second route, never the only one. Office line `--fs-small`. Primary "Book a time on HAR"; secondary "Send a message" (contact form). Socials as mono labels. No email anywhere.

**Compliance footer.** `--bg-deep`, padding-top `--sp-8`, `--fs-fine`, `--ink-72`, `line-height:1.6`; mark 56px, heart red; brokerage name, license 0530671, TREC IABS and Consumer Protection Notice links (gold 1px underline), Equal Housing Opportunity with a 1.5px cream house-and-equals icon, REALTOR with ®.

## 4. Hero scene (Three.js)

Frame: eye height 1.6m, looking slightly up a rise to a porch 12m away. Sky: CanvasTexture gradient `--bg-void` to `--surface` at the horizon. Pines: two planes sharing one 1024×512 alpha silhouette, near z-20 `--bg-void`, far z-40 `--surface` at 70%. House: Lambert silhouette `--bg-deep`, doorway `--surface2`; lamp = PointLight `--profit` plus two additive sprites (core .3 units alpha 1, halo 2.2 units alpha .3), which is the halation, no bloom pass. Porch floor: `--brand` gradient plane at .5. `FogExp2(--bg-void,.045)` plus three drifting radial-alpha sprite planes at ground level. Fireflies: one `THREE.Points`, additive ShaderMaterial, per-point phase, blink `sin(t*f+phase)`, soft disc by smoothstep in the fragment shader (no texture), sin/cos drift amplitude .3m, `--profit` core to `--brand` edge.

Camera: 35° fov (45° portrait), position (0,1.6,0), lookAt (0,2.2,-12). Scroll scrub 0 to 1 over the 150vh pin: z 0 to -6, fov 35 to 32, lamp 1 to 1.6, firefly alpha ×(1-.6p), fog .045 to .03, title parallax `--parallax`; at p=1 the door fills 60% of frame height and the Front Hall crossfades over it. Pointer: yaw ±1.5°, pitch ±.8°, lerp .06 per frame; on touch a 12s ±.6° autonomous drift instead.

Budget: 60fps on a Pixel 6a class phone. Fireflies 240 desktop, 120 mid phone, 60 low. DPR capped 1.5 phone, 2 desktop; no post-processing, no shadows; ≤12 draw calls, <20k triangles, 4 textures, <16MB GPU. A 2s rAF watchdog degrades in order: fireflies 240→120→60; DPR 1; drop far pines and two fog planes; stop pointer parallax; render one frame and freeze. Pause off-screen or `document.hidden`. Reduced motion: blink without drift, dolly becomes a crossfade, no parallax.

Fallback (no WebGL), CSS only: `linear-gradient(180deg,#020c08 0%,#072018 55%,#0d2a20 100%)` sky, `radial-gradient(60% 40% at 50% 62%,var(--light-18),transparent 70%)` porch glow, inline SVG pines bottom-anchored, 12 CSS fireflies (3px `--profit` dots, opacity keyframes, static under reduced motion). No JPEG dependency.

## 5. Imagery

Rico and Cheeto: 4:5 crops, subject centered, 10% headroom, no grading beyond the global grain; the bio line ("Once mistook a finger for a blueberry") sits under the pair, `--fs-small` italic `--ink2`. Logo: top-left home link, 40px desktop, 32px phone (the floor; below 32 the heart becomes a dot); 96px on the Closing Table, 56px in the footer. Container `color:var(--ink)` drives the linework; no CSS `path{fill}` rule may reach the heart. Clear space half the diameter; never on gold, never shadowed, never rotated.

## 6. Icons

24 grid, `stroke:currentColor` 1.5px, round caps and joins, fill none, 20px live area.
- key: above.
- lock: `rect x5 y11 w14 h10 rx1.5`; shackle `M8 11V8a4 4 0 0 1 8 0v3`; `circle cx12 cy16 r1`. Open: right leg lifted to y6.
- map pin: `M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z`; `circle cx12 cy11 r2`.
- paw: `ellipse cx12 cy15.5 rx4 ry3`; toes r1.6 at (6.5,10.5) (10,7.5) (14,7.5) (17.5,10.5).
- beaker: `M9 3h6`; `M10 3v6l-5.5 9.5a1.5 1.5 0 0 0 1.3 2.3h12.4a1.5 1.5 0 0 0 1.3-2.3L14 9V3`; fill line `M7.5 15h9`.
- magnifier: `circle cx10.5 cy10.5 r6`; `M15 15l5.5 5.5`.
- book: `M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z`; `M5 19.5V4.5`; `M8 7h8`.
- sound on: `M4 9v6h3l5 4V5L7 9z`; `M15.5 9.5a3.5 3.5 0 0 1 0 5`; `M18 7a7 7 0 0 1 0 10`. Off: speaker plus `M16 9.5l5 5M21 9.5l-5 5`.
- motion on: `circle cx14 cy12 r3.5`; `M3 8h5 M2 12h6 M3 16h5`. Off: plus `M4 4l16 16`.

## 7. Never

1. Pure white: no #fff text, borders or icons; cream is the lightest value on the site.
2. Safe green or coral as decoration: no green hover rings or glows, no coral accents; green announces good news, coral announces caution, nothing else.
3. Touching the heart or restyling the mark: no recolor, no opacity, no gold linework, no gold behind it.
4. Template tells: equal rounded-card grids (radius over 4px, icon-title-body), glass panels, gradient text, gold hairlines on everything.
5. Exceeding the brand's exuberance: bouncing CTAs, parallax above .2, reveals over 480ms per element, autoplaying sound; reduced motion is a full equivalent, not a lesser site.
