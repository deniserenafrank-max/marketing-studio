# The Unusual Open House: build spec

Denise Frank's personal brand site. Synthesized 2026-10-06 from the five-role team briefs in
docs/team/ (creative director, UX, UI, accessibility and compliance; the developer owns this
file). Where the briefs disagreed, the decision and the reason are recorded here.

## The one idea

You do not read about Denise. You walk through her open house at night, room by room, and
leave holding a keyring you built yourself, with one hook left empty for the key she hands
you in person.

Name: The Unusual Open House. Headline: "Not your usual open house."

## Rooms, keys, verbs (CD arc, kept whole)

| # | Room (hash) | Verb | Key | Earned by |
|---|---|---|---|---|
| 1 | The Porch `#porch` | Knock | Porch Key | pressing Knock (first-ten-seconds onboarding: do a thing, get a key) |
| 2 | The Front Hall `#front-hall` | Choose | Hall Key | choosing a move: buy, sell, rent, own a rental |
| 3 | The Lab `#lab` | Run the numbers | Lab Key | pressing Run the numbers once |
| 4 | The Evidence Board `#evidence-board` | Tap | Case Key | finding all five hidden words in one listing |
| 5 | The Library `#library` | Flip | Library Key | flipping all five cards |
| 6 | The Map Room `#map-room` | Pin | Map Key | picking any town |
| 7 | The Backyard `#backyard` | Flip | Backyard Key | flipping both supervisors |
| 8 | The Closing Table `#closing-table` | Call | House Key (empty hook) | handed over in person |

Seven keys on the ring, an eighth hook always drawn empty. UX proposed six keys (no Porch
key) and the a11y brief counted eight; the CD's seven-plus-hook wins because the knock
teaches the mechanic before any copy is read and the empty hook is the whole pitch.

## Navigation model (UX vs UI resolved)

One document, DOM order = room order = tab order. Natural scrolling (Lenis smooth wheel on
fine pointers only; touch and keyboard stay native). Every room is a flowing section with a
hash, a "Next room" door button and a lamp that comes on when it enters the viewport. Only
the Porch is scrubbed: the WebGL dolly up the walk runs over the Porch's extra scroll height
and also plays on Knock. No interactive control ever sits inside a scrubbed scene (the UX
concern), and reduced motion removes the scrub entirely (the a11y rule). All rooms are open
from the start; order is suggested, never enforced (a landlord must not solve rent vs buy to
reach property management).

HUD: desktop top-right pill with the keyring and "Skip to the closing table"; sound and calm
mode bottom-left. Phone: 56px bottom bar, keyring left, toggles center, Skip bottom-right in
thumb reach. Skip is a real link to `#closing-table`, moves focus to the Closing Table
heading, never loses keys, and shows "Back to the tour".

## Interactions

- Porch: Knock button. Earns the Porch Key, brightens the porch light, dollies the camera
  (2.2s, crossfade under reduced motion), then scrolls to the Front Hall.
- Front Hall: radiogroup of four move cards; any choice earns the Hall Key and personalizes
  the Lab heading, the Map note and the Closing Table CTAs (UX mapping).
- Lab: native range sliders (price, down payment, rate, property tax rate, insurance, HOA,
  rent) with visible labels, outputs and aria-valuetext; "Run the numbers" fills two beakers
  (own vs rent) and earns the Lab Key. If owning costs more than rent, the Credit to Keys
  line appears (achievement: Not Yet Is a Plan). Estimates disclaimer beside the outputs.
- Evidence Board: one listing on a cream index card; five hidden words are buttons with
  aria-pressed; a find pushes a gold pin and swings in a Polaroid with the plain meaning on
  gold twine (not red string: red is the heart's and coral is caution only). Wrong taps
  wobble, no penalty, status text "Not quite. Try another word." All five: CASE CLOSED stamp,
  Case Key.
- Library: five flip cards (MUD, PMI, Homestead exemption, Escrow, Earnest money), each a
  button with aria-expanded controlling real DOM text. All five: Library Key.
- Map Room: inline SVG county map with seven pins mirrored by a chip radiogroup; one pick
  earns the Map Key. The field note is the same three questions for every town (flood zone,
  MUD, commute) plus one line keyed to the move; it describes places and process, never
  people. An off-map pin for College Station triggers the Whhhooop achievement. Visiting all
  seven towns: Local.
- Backyard: Rico and Cheeto as pinned cream Polaroids with "In real life" and "Real estate
  life" sides (buttons, aria-pressed). Photos load from `media/*.webp` when present; when
  missing, the same 4:5 frame shows a drawn linework portrait, so nothing shifts. Both
  flipped: Backyard Key. Pressing Rico five times: Tong Certified.
- Closing Table: the keys land on the table one by one (clink if sound is on), each named;
  the empty hook is tagged HOUSE KEY, HANDED OVER IN PERSON. Actions: phone as selectable
  text with Copy and a tel link, Book a time on HAR, Send a message, Search homes on HAR,
  socials. Compliance footer (a11y brief section 9, word for word).

## Progression and persistence

Keys reward participation, never correctness, and lock nothing. Achievements: Knocked
First, Straight to Business, Mad Scientist, Not Yet Is a Plan, Case Closed, Whhhooop, Local,
Tong Certified, Full Ring. localStorage `denise-journey-v1` (keys, achievements, move, town,
visited rooms, Lab inputs, prefs); restored on return with a polite announcement; Start over
is a two-step confirm. Storage failure is silent.

## Accessibility contract (a11y brief, all gates)

WCAG 2.2 AA. One polite live region. Keyboard model and roving tabindex per brief. Reduced
motion: no scrub, no parallax, still WebGL frame, crossfades under 200ms; in-page calm mode
overrides the OS both ways. 44px targets. Contrast table in docs/team/a11y.md governs which
token may carry text on which surface. axe runs over every room state in `npm test`.

## Visual system (UI brief)

Tokens generated from brands/hometown.json (scripts/build-tokens.mjs); derived shades
`--c-pine-1..4` and tints only. DM Serif Display titles with one italic gold word, DM Sans
body, JetBrains Mono labels and values. 4px house radius, pill only for HUD and slider thumb.
Film grade: grain 0.08 soft-light, vignette 0.15, halation as text-shadow and drop-shadow,
never a blur pass. Never: pure white, green or coral as decoration, a recolored heart, a
template card grid, an em dash.

## Sound

Off until the visitor turns it on. Procedural Web Audio cues (no files): crickets bed,
knock, pin push, twang, key clink, lamp click. Nothing carries information by sound alone.

## Performance

Three.js in its own chunk, imported after first paint; counts degrade (240/120/60 fireflies)
and a frame-time watchdog freezes the scene rather than stutter. Fonts from Google Fonts with
size-adjusted fallbacks. The static Porch SVG paints first.
