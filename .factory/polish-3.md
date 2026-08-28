# Polish round 3 — cumulative finding closure

**Candidate reviewed:** `e6957f0678bd13569627ed687bf29a88c2c1d90e`  
**Review commit:** `1796fc2cca66d41c2bede614201fd549eb5c5ebf`  
**Repair commits:** `73357c0159145c61b7cf715bfd6ab49c3e32b747`, `e0148cec2413198e0c4e11f9863b009d67866dfc`  
**Repair release:** `v1.0.4`  
**Live URL:** <https://theory-playalong-sidecar.sociobot.in>  
**Direct demo:** <https://theory-playalong-sidecar.sociobot.in/?demo=1>

The test names below are in `tests/app.spec.ts`. Live assertions are recorded
in `.factory/evidence/polish-3/live-verification.json`. Visual evidence is in
`.factory/evidence/polish-3/live-mobile.png` and
`.factory/evidence/polish-3/live-demo-desktop.png`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved the full product-name title pattern on the root and designed 404. | `landing has the required structure and clear first action`; `@regression:http-404`; live route/fallback records. |
| F-1-2 | Preserved per-route title, description, canonical, Open Graph, and Twitter updates. | `route titles, metadata, focus, back navigation…`; live metadata records for `/`, `/demo`, `/privacy`, and `/terms`. |
| F-1-3 | Preserved the beginner-language landing rewrite and audited every current landing sentence. | `copy audit tracks the current plain-language landing strings`; `npm run copycheck`; mobile screenshot. |
| F-1-4 | Kept the unsupported capability and artwork claims out of the page; the registry now contains every retained product promise. | `claim registry and tagged browser proofs match one-to-one`; all 14 exact claim commands. |
| F-1-5 | Preserved the full product name in metadata and fallback copy; the compact wordmark keeps the full accessible name. | `fallback documents have complete metadata…`; live route/fallback records. |
| F-2-1 | Preserved the selected-key proof that changes C major to E minor and checks degree, key, history label, and chords. | `@claim:harmony-context`; live selected-key check. |
| F-2-2 | Preserved measured beat timing at 60 and 120 beats per minute. | `@claim:beat-marker`; clean-clone exact claim run. |
| F-2-3 | Preserved the local-file and synthetic-MIDI privacy exercise with storage and request inspection. | `@claim:local-audio`; live request record. |
| F-2-4 | Preserved reload proof for key, scale, tempo, note history, and absent audio. | `@claim:local-history`; clean-clone exact claim run. |
| F-2-5 | Preserved screen-key and computer-key input at 390 px without MIDI hardware. | `@claim:keyboard-fallback`; mobile screenshot. |
| F-2-6 | Preserved “your backing track” copy and the truthful “local backing track” metadata. | Landing copy test; live root metadata and mobile screenshot. |
| F-2-7 | The only `demo-ready` test now starts the groove, waits past 0.2 seconds, and asserts it is unpaused with `SAMPLE PLAYING`; it still checks exact seed notes and reset. | `@claim:demo-ready`; live demo playback and reset checks; demo screenshot. |
| F-2-8 | Preserved the compound playalong proof across screen, computer, and MIDI inputs while audio advances. | `@claim:playalong-continuity`; live audio-continuity check. |
| F-2-9 | Preserved removal of decorative section labels and metaphor labels. | Landing copy test asserts no `.section-code`; mobile screenshot. |
| F-2-10 | Preserved the direct workspace heading “Play notes with a backing track.” | Landing copy test; live mobile screenshot. |
| F-2-11 | Preserved the three specific how-it-works headings. | Landing copy test; `npm run copycheck`; live mobile screenshot. |
| F-2-12 | Preserved “beats per minute,” “Notes from C to C,” and backup terminology. | `@claim:history-portability`; live demo screenshot. |
| F-2-13 | Preserved plain privacy wording and kept the database name in a developer note. | `@claim:local-audio`; `@claim:local-history`; README copy audit. |
| F-2-14 | Preserved the plain “Page not found” static and SPA 404 with a route home. | `@regression:http-404`; live `/missing-polish-3` returns 404. |
| F-2-15 | Preserved “Terms for Theory Playalong Sidecar” as the legal-page h1. | Route/focus test; live `/terms` record. |
| F-2-16 | Preserved complete offline/404 metadata, shell, legal links, external label, and build id. | `fallback documents have complete metadata…`; live fallback records and Axe scans. |
| F-2-17 | Updated package, manifest, app footer, offline page, and 404 to the same `v1.0.4` release. | Version assertions in landing/fallback tests; live route/fallback records. |
| F-2-18 | Preserved A–K in the design source and expanded the generated-count audit to 88 current items. | `npm run copycheck`; landing copy test. |
| F-3-1 | The backup test now adds a fifth note, restores the exact original four in order with key labels, and proves malformed data changes nothing. Import validation now rejects malformed entries. | `@claim:history-portability`; live backup restoration and malformed-file checks. |
| F-3-2 | Added `no-third-party-requests` to the registry. Its single test records cold load, real/demo notes, local audio, MIDI, exports, and reloads, rejecting outside origins, uploads, and request bodies. | `@claim:no-third-party-requests`; live privacy request record. |
| F-3-3 | Added `history-deletion`. Its single real-mode test clears saved notes, inspects IndexedDB, reloads, and confirms settings remain. | `@claim:history-deletion`; live deletion/reload check. |
| F-3-4 | README now uses “demo” for both query and path entry points. | `npm run copycheck`; README audit. |
| F-3-5 | README now says notes are read from a MIDI keyboard and uses “MIDI keyboard support.” | `npm run copycheck`; `@claim:midi-input`. |
| F-3-6 | README now says the build writes files to `dist/`. | `npm run copycheck`; clean-clone `npm run build`. |
| F-3-7 | Standardized the heading, empty state, explanation, privacy text, README, demo notes, and confirmation on “note history.” | Landing copy test; `npm run copycheck`; live copy assertions and both screenshots. |

## Controller acceptance checks

- First screen: the 390 × 844 live check keeps the job, audience, primary
  action, and all three facts inside the first viewport.
- Demo: the first action opens isolated `?demo=1`; the persistent banner,
  exact four-note sample, playable audio, reset, and real-data return all pass.
- Claims: `.factory/claims.json` has 14 unique ids and exactly one matching
  tagged test per id. Every listed command passed independently in a clean
  clone.
- Structure: all routes have correct titles and metadata; History API focus
  restoration passes; an unknown path returns a styled HTTP 404; fallback and
  app shells include Privacy and Terms.
- Mobile and accessibility: 390 px has no document overflow, focus treatment
  and reduced motion pass, and Axe reports no serious or critical violations.
- Privacy and offline: no third-party or upload request occurs in the complete
  practice flow, and the cached direct demo reloads and plays while offline.

No finding from reviews 1–3 remains unresolved.

Cold production verification completed at `2026-08-28T22:28:01.935Z`.
