# UX spec: "Not your usual open house."

Eight screens, six keys. Copy lines are direction; final copy goes through the brief.

## 1. Journey map

Every room: one interaction, no timers, no drag-only mechanics; controls are native buttons, radio groups or range+number pairs, usable by click, tap and keyboard. Earning a key is one beat everywhere: slot fills, toast ("Key 2 of 6"), door button becomes primary. Wrong answers cost nothing. A revisited room opens completed (answers revealed, cards flipped, choice highlighted) with an "Earned" door tag; changing or replaying never loses the key.

**Porch (title, no key).** Arrive: night house, porch light, title "Not your usual open house.", one button "Ring the bell"; under it, "In a hurry? Call Denise (832) 928-3019" and "Book a time". HUD ring appears empty: "Six rooms. Six keys. Your pace." Do: press the bell. 10s. Exit: Front Hall door.

**Front Hall.** Arrive: Denise in one breath (Broker/Owner, Hometown Realtors of Texas, Conroe; Houston-raised Aggie, IT background; "friendly & down-to-earth"; HAR Platinum) and four doors. Do: radio group "What's your move?": Buy, Sell, Rent, Own a rental, large cards. Key: any choice; no wrong answer; changeable later. 20s. Exit: Lab door.

**Lab.** Arrive: bench, two beakers (Rent, Own), three sliders. Do: range+number pairs for monthly rent, home price, down payment %, plus an editable "Assumptions" disclosure. "Run it" fills the beakers: estimated monthly cost of owning (principal and interest, taxes, insurance, HOA, PMI under 20% down, upkeep) beside rent, labeled "Estimates only, not a quote", linking the brokerage calculator. Key: first run. 45s. Exit: Evidence door.

**Evidence Board.** Arrive: corkboard, red string, a pinned listing phrase. Do: three rounds of multiple choice (radio cards): a listing or HOA euphemism, three "reality" readings. Correct: string connects, SOLVED stamp. Wrong: strike on the card, "Not quite. Try again." Unlimited tries. Key: all three solved. 60s. Exit: Library door.

**Library.** Arrive: four books face-down: MUD tax, flood zone, homestead exemption, buyer agreement. Do: flip cards (buttons with aria-pressed) to plain-language definitions. Key: all four flipped. 40s. Exit: Map Room door.

**Map Room.** Arrive: Houston-north map, seven pins (Montgomery, Pinehurst, Magnolia, Spring, Conroe, Shenandoah, The Woodlands) plus "Somewhere else" (relocation; five other state licenses), also a chip list. Do: single select; the pick shows one local note on the topic set by the move, never who a place is "for". Key: any pick. 30s. Exit: Backyard door.

**Backyard.** Arrive: Rico and Cheeto in their "In Real Life" photos. Do: "Clock them in": press each pet to swap to the "Real Estate Life" photo (Rico, Head of Security; Cheeto, Chief Inspection Officer) with its one-liner. Key: both clocked in. 20s. Exit: Closing Table door.

**Closing Table.** Arrive: the ring on the table, Denise's closing line, the move-specific CTA block, direct phone, book, contact form, home search, socials, compliance footer per dossier (LLC name, license #0530671, office, TREC IABS and CPN links, Equal Housing, REALTOR(R)). Do: contact. No key; keys are spent here. Exit: "Back to the tour" (last room).

## 2. Progression

All rooms open from the Front Hall on; door order is the suggested path, the keyring menu jumps anywhere. Why: a landlord must not pass a rent-vs-buy exercise to reach property management; every room needs its own URL for search and reels, and a business site hides nothing behind a puzzle.

A key proves the visitor did a room's interaction: it fills a slot, unlocks that room's lesson card on the Closing Table, and counts toward achievements. No money value, no coupons.

Finale. Six keys: the ring turns, a deadbolt sound if sound is on, and a "Closing packet": move, town note, Lab result and badges on one card with "Copy my notes" (plain text to paste anywhere). Fewer keys: earned lesson cards show, empty slots read "Still in the house". None: same contact block; ring reads "You skipped the tour. The door's still open." with a "Take the tour" link. Contact never depends on keys.

Achievements (toast, badge in the keyring menu): Foot in the Door (first key), Grand Tour (six), Mad Scientist (three Lab runs), Case Closed (Evidence Board, no misses), Local (any town), Tong Service (press Rico five times: "Now fed with tongs").

Persistence: localStorage `df-openhouse-v1` holds version, move, town, keys, achievements, Lab inputs, last room, sound, motion, visits, contacted flag; restored on return (section 7). "Start over" is a two-step inline confirm that clears it. Storage failure is silent; the game runs in memory.

## 3. Navigation and HUD

Discrete screens, one room per screen with its own hash; browser back works; `?move=rent` deep links set the move. Not a pinned scroll: sliders and radio cards inside scroll-jacked scenes fail on phones. A tall room scrolls normally; its door button sits after the content and turns sticky once the key is earned. Tab order: content, door, HUD. `[` and `]` change rooms.

Desktop: keyring top-left (six slots; it opens the room index dialog: rooms with earned state, change your move, phone, book, reset); "Skip to the closing table" top-right, gold, always visible; sound and motion toggles bottom-left, labeled on hover and focus. Phone: a 56px bottom bar: keyring left, sound and motion small in the center, Skip to closing bottom-right, the largest target.

Skip to the closing table: one press, no confirmation, routes to `#closing` in under 300ms (a cut under reduced motion), saves the current room, moves focus to the Closing Table heading, phone link next in tab order, and shows "Back to the tour" to the saved room. Skipping never loses keys. Sound defaults off; after the bell a chip offers "Sound on?". Motion follows the OS setting until toggled.

## 4. Onboarding, first 10 seconds

No overlay. The Porch teaches by shape: one title, one obviously pressable button (gentle pulse unless reduced motion), the empty six-slot ring captioned "Six rooms. Six keys. Your pace." The Front Hall teaches by doing: the first choice sends a key flying to the ring and the next door lights. Do the thing, get the key, the door opens: learned by second 20, never explained.

## 5. Personalization

`move` is set in the Front Hall, changeable anywhere. Call (832) 928-3019 is on every Closing Table; no email exists, so none is shown. Primary CTAs go to the contact form unless noted.

- Buy: Lab "What owning really costs each month"; Evidence: Listings Described vs Reality; Map note: MUD taxes and flood zones; Closing "Let's go find your keys."; primary Book a time (HAR appointment), secondary Search homes (HAR).
- Sell: Lab "What your buyer is weighing"; Evidence: same, seller's cut; Map note: homestead exemption and HOA; Closing "Let's find out what it's worth."; primary Ask for a CMA, secondary Book a time.
- Rent: Lab "Rent now, keys later" (Credit to Keys); Evidence: rental listings; Map note: commute routes; Closing "Rent now. Keys later."; primary Ask about Credit to Keys, secondary Join the "Houston Homes | Credit Help & Real Estate Advice" group.
- Own a rental: Lab "Will it ROI?"; Evidence: HOA Files; Map note: HOA rules and property management; Closing "Let's talk about your rental."; primary Ask about property management, secondary Book a time.

## 6. Mobile (390px)

Tap only; targets 44px or larger; swipe between rooms is a bonus, never required. Sliders gain a number field and minus/plus steppers. Evidence options stack full width; Library is a 2x2 grid; map pins become chips under a decorative map; pet photos stack. HUD is the bottom bar; the primary action (door, then Skip) sits bottom-right in thumb reach. Cut: the WebGL porch (2D plate instead), parallax, cursor effects, hover tooltips (tap to reveal), the string animation (a plain line).

## 7. The impatient path

Phone number in five seconds: the Porch's first paint is server-rendered HTML with the tel link and "Book a time" under the bell; Skip to closing is in the HUD; the keyring menu carries the number; the meta description includes it. A call is two taps from any room. Returning visitor: "Welcome back", restored ring, "Continue in the <room>" and "Start over"; with six keys the primary becomes "Go to the closing table"; with the contacted flag, the Closing Table leads with "Call Denise again".

## 8. Failure and degraded modes

WebGL unavailable: the Porch poster (static night house, CSS porch-light glow) stays; nothing else needs GL; no error shown. Reduced motion: door transitions become 150ms fades, key flight an instant fill plus toast, no pulse, parallax or shake on misses (border color and text only), beakers fill without animation. JS disabled: the document is the full tour as headed sections: bio, the four moves as links to `#closing?move=`, rent-vs-buy text linking the brokerage calculator, Evidence rounds as `<details>`, Library as a definition list, towns with notes, pet photos with captions, Closing Table with all contact links and the footer; "Skip to contact" is the first link; HUD hidden. Slow network: critical path is HTML, CSS and one font subset; the poster paints first; WebGL, textures, room images and audio load lazily, audio only once sound is on; ringing the bell early still enters the Hall.

## 9. Metrics and events

Optimize for: contact clicks per session (call, book, form); Closing Table reach rate by path (tour, skip, direct); keys per session and six-key rate; time to first contact click; return rate. Events: room_enter{room, move}; move_chosen{move}; key_earned{room, total, ms_in_room}; lab_run{n}; evidence_miss{round}; town_chosen{town}; achievement{id}; skip_to_closing{from, total}; closing_reached{total, move, path}; contact_click{type: call|book|form|search|social, total, move}; restore{total}; reset; sound_toggle{on}; motion_toggle{on}; degraded{mode: nowebgl|reduced_motion}.
