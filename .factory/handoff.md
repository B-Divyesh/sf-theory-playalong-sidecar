# Theory Playalong Sidecar — polish round 1 handoff

## Result

Repair commit `980748b0c0d90986f28a165004fb8c3d10824d8c` is pushed to
`origin/main`. It closes every finding in `.factory/review-1.md` and preserves
the offline PWA and pocket-demoscene harmony-console design.

Deployment completed through the static work order as Azure Static Web Apps
deployment `57107557-07da-4ee9-9624-86b08460d159`.

- Production: <https://theory-playalong-sidecar.sociobot.in>
- Direct isolated sample: <https://theory-playalong-sidecar.sociobot.in/?demo=1>
- Legacy permanent demo route: <https://theory-playalong-sidecar.sociobot.in/demo>

## What changed

- Correct product-title title pattern on root and 404, plus per-route Open
  Graph and Twitter metadata updates.
- Plain beginner wording replaces unexplained theory and product jargon.
- Removed live promises that cannot be observably tested; refreshed the
  matching-chords claim language.
- Added the direct `?demo=1` sandbox entry. It is memory-only, shows the
  persistent demo banner, resets to four sample notes, and exits to real mode.
- Completed the styled static 404 skeleton with metadata, navigation, footer,
  legal links, skip link, focus target, and mobile styling.
- Updated README, demo contract, copy audit, catalog description, and browser
  regressions.

## Verification

From a fresh clone of repair commit `980748b0c0d90986f28a165004fb8c3d10824d8c`
at `/tmp/theory-sidecar-clean.i3tduQ`:

```sh
npm ci
# each exact command in .factory/claims.json, separately
npm test -- --grep @claim:harmony-context
npm test -- --grep @claim:midi-input
npm test -- --grep @claim:local-audio
npm test -- --grep @claim:beat-marker
npm test -- --grep @claim:csv-export
npm test -- --grep @claim:history-portability
npm test -- --grep @claim:local-history
npm test -- --grep @claim:offline-reload
npm test -- --grep @claim:free-use
npm test -- --grep @claim:keyboard-fallback
npm run lint
npm run typecheck
npm run build
```

All commands passed. In the repair worktree, `npm test` also passed all 15
Playwright tests; `npm run lint`, `npm run typecheck`, and `npm run build`
passed. Coverage includes claims, demo isolation/reset, query demo routing,
PWA offline reload, real/local history separation, exports/imports, MIDI
input, keyboard fallback, reduced motion, desktop/mobile layout, service
worker update, cache headers, route focus, and Axe serious/critical checks.

Cold production checks after deployment:

- `/?demo=1` returned 200 with the demo title and banner; Reset demo restored
  four notes.
- `/`, `/demo`, `/privacy`, and `/terms` had matching title, Open Graph, and
  Twitter title values. `/definitely-missing-polish-1` returned 404 with the
  revised 404 title and heading.
- Desktop and 390 px mobile Axe scans found zero serious or critical issues;
  no mobile horizontal overflow and no console errors occurred on root.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.202 s, CLS 0, TBT 55 ms.
- Evidence: `.factory/evidence/polish-1-live.json`,
  `.factory/evidence/polish-1-desktop.png`, and
  `.factory/evidence/polish-1-mobile.png`, plus
  `.factory/evidence/polish-1-lighthouse.json`.

## Run locally

```sh
npm ci
npm run dev
# visit http://localhost:5173/?demo=1
npm test
npm run build
```

## Known gaps / next steps

None from the cumulative review. As before, physical USB-MIDI hardware is not
available in this container; the shipped Web MIDI note-on path is covered by a
synthetic browser input test.
