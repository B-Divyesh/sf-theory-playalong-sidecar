# Theory Playalong Sidecar — verification handoff

## Verification verdict: FAIL

Independent verification of candidate
`f3e53956c7c633161b7b147fc7c3bd1f0e38150a` at
<https://theory-playalong-sidecar.sociobot.in> found a release blocker.

The initial clean required command
`npm test -- --grep @claim:beat-marker` failed: the second beat did not become
active within the test's 2.5-second window. A retry passed, but a ten-repeat
run failed again. The deployed JavaScript and CSS hash-identically match the
candidate build, so it is not deployment-only. Under the claims contract, an
intermittently failing required claim test is a **FAIL**.

Also fix the 30-second production caching of all static assets and the HTTP 200
response for an unknown route. Full evidence, successful checks, and exact
commands are in `.factory/verification.md`.

## What shipped

- A Vite and TypeScript PWA with Web MIDI note-on input.
- Local audio-file playback with a manual 30–240 BPM beat rail.
- A playable one-octave screen keyboard and A–K computer-key controls.
- Major and minor key selection, scale degrees, and diatonic chord suggestions.
- Non-judgmental in-key and outside-key note history.
- IndexedDB persistence for real settings and history. Audio files are not
  stored.
- CSV and JSON export, plus JSON import.
- A one-click `/demo` with an eight-second procedural C-major groove and four
  sample notes. Demo state stays in memory and does not open the real database.
- Install metadata, original icons, a cache-first service worker, offline
  fallback, and an update-ready notice.
- Real `/privacy`, `/terms`, `/demo`, and styled not-found routes.
- A product-specific pixel/demoscene visual system and original generated hero
  artwork. Source, prompt, review, and public WebP are included.

## Run and deploy

```sh
npm install
npm test
npm run build
```

The exact build command is `npm run build`. It writes the static site to
`dist/`, with `dist/index.html` at the root. Deploy that directory as-is.

## Verification

Verified on 2026-08-28 in headless Chromium 145.

- `npm test`: 11 passed. This includes all ten claim-tagged tests, an offline
  reload from the first visit, a synthetic MIDI message, exports, demo storage
  isolation, mobile width, route metadata, keyboard use, and axe scans.
- `npm run build`: passed. Initial output is 8.22 KB JavaScript gzip and 3.76 KB
  CSS gzip. The hero WebP is 57 KB.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/evidence`:
  passed with no console errors, one H1, `lang="en"`, a main landmark, and no
  missing image alt text.
- Axe 4.10 through Playwright: no serious or critical violations at 390×844.
- Lighthouse 12 mobile: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100. LCP 1.5 s, CLS 0, total blocking time 110 ms. Lab INP was not
  available; total blocking time is recorded as the interaction proxy.
- `npm audit --audit-level=high`: zero vulnerabilities.

Evidence is in `.factory/evidence/`: `lighthouse.json`, `verify.json`, and
desktop and mobile screenshots. Tested copy claims are mapped in
`.factory/claims.json`. The plain-language audit is in
`.factory/copy-audit.md`.

## Known gaps and honest boundaries

- Web MIDI requires a supporting browser, a secure deployed origin, and user
  permission. The screen and computer keys remain available elsewhere.
- The beat rail follows the tempo entered by the player. It does not detect a
  file's tempo or downbeat.
- The tool handles note-on messages only. It does not visualize pedals,
  aftertouch, or pitch bend.
- Usage analytics were intentionally omitted. The factory cannot measure the
  brief's weekly-session success metric without adding a privacy-reviewed,
  opt-in counter.

## Suggested next checks

1. Test two common USB MIDI keyboards on deployed Chrome and Edge.
2. Confirm the service-worker update notice through one production revision.
3. Compare the manual BPM control with backing tracks that begin after silence.
