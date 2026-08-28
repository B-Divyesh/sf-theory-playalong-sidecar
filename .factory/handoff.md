# Theory Playalong Sidecar — polish round 2 handoff

## Result

All findings in `.factory/review-1.md` and `.factory/review-2.md` are closed.
The repaired application was committed as `157ee08`, pushed to `main`, deployed
with deployment id `5d72471b-63dc-48f5-9468-af5dd9dab804`, and cold-checked at
<https://theory-playalong-sidecar.sociobot.in> on 2026-08-28.

The release remains a static, local-first PWA. The pocket demoscene harmony
console, palette, typography, generated artwork, and asymmetric layout were
preserved.

## What changed

- Replaced the absolute “any backing track” wording and all remaining jargon,
  metaphor headings, decorative section codes, and JSON-facing labels.
- Kept `?demo=1` as the first-screen one-click path, with four seeded notes,
  generated local audio, a persistent sandbox banner, reset, and clean exit.
- Expanded `.factory/claims.json` to 12 claims. Every claim now has exactly one
  tagged browser test that proves the full sentence.
- Added selected-key and chord assertions, two-tempo interval measurement,
  valid local WAV playback, synthetic MIDI privacy coverage, complete settings
  persistence, both fallback input paths, and continuous playalong coverage.
- Serialized IndexedDB saves so rapid settings changes remain ordered.
- Completed the offline and 404 shells with metadata, icons, navigation, legal
  links, external-link labeling, build ids, plain headings, and mobile styles.
- Unified the version at `1.0.3`; the app footer is injected from
  `package.json`, while the manifest and static fallback checks enforce the
  same release value.
- Added a generated copy-count check and refreshed `.factory/copy-audit.md`.

The finding-by-finding map is in `.factory/polish-2.md`.

## Clean-clone verification

A new clone of commit `157ee08` was created at `/tmp/theory-clean-iyrDan/repo`,
then installed with `npm ci` (0 vulnerabilities).

- Every one of the 12 exact commands in `.factory/claims.json` passed
  separately: `harmony-context`, `midi-input`, `local-audio`, `beat-marker`,
  `csv-export`, `history-portability`, `local-history`, `offline-reload`,
  `free-use`, `keyboard-fallback`, `demo-ready`, and
  `playalong-continuity`.
- `npm test`: 19/19 passed, including production build, copy audit, browser,
  accessibility, privacy, routing, persistence, offline, and PWA update tests.
- `npm run lint`: passed.
- `npm run typecheck`: passed through the build.
- `npm run build`: produced `dist/` with 22.39 kB raw / 8.31 kB gzip initial
  JavaScript and 14.14 kB raw / 3.77 kB gzip CSS.
- `npm run copycheck`: verified 49 recorded sentences, all at 22 words or less
  and free of banned terms.

## Production evidence

- `/opt/fleet/lib/verify-url.sh`: passed on the custom domain; title, `lang`,
  one h1, main landmark, image alt text, button labels, and console checks all
  passed. See `.factory/evidence/polish-2/verify.json`.
- `node scripts/verify-live.mjs`: passed against the custom domain. It checked
  every route, social metadata, h1, route and Back focus, one-click query demo,
  reset, real/demo separation, note-key change, continuing audio, 390 px
  overflow, offline reload, HTTP 404, fallback shells, security headers, Axe,
  requests, and console output. See
  `.factory/evidence/polish-2/live-verification.json`.
- Live Axe: zero serious or critical violations on `/`, `/demo`, `/privacy`,
  `/terms`, `/offline.html`, and the HTTP 404 page.
- Live request log: zero third-party requests; console/page errors: zero on
  normal product routes.
- The live JavaScript SHA-256 equals the deployed `dist` file:
  `89ceeb9feb76aa808c4ea495cfb90bb7a9171e3037bc0d65d5a3abd5023ebef8`.
- The hashed JavaScript response has
  `Cache-Control: public, max-age=31536000, immutable`.
- Lighthouse against the production Azure hostname: Performance 100,
  Accessibility 100, Best Practices 100, SEO 100; LCP 1.210 s, CLS 0, TBT 62
  ms. See `.factory/evidence/polish-2/lighthouse-host.json`. A local production
  preview also scored 100 in all four categories with LCP 1.587 s, CLS 0, and
  TBT 0; see `lighthouse-local.json`.
- Screenshots: `.factory/evidence/polish-2/live-mobile.png`,
  `live-demo-desktop.png`, `screenshot-mobile.png`, and
  `screenshot-desktop.png`.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
node scripts/verify-live.mjs https://theory-playalong-sidecar.sociobot.in .factory/evidence/polish-2
```

## Known gaps and next steps

None. Physical MIDI hardware remains a device-compatibility check rather than
a product defect; the browser MIDI path is covered with a synthetic input.
