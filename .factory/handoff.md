# Theory Playalong Sidecar — repair handoff

## Independent QA verification — PASS

**Verified candidate:** `2ca27e6b95befbfc7f46650fee4174bbe073aa44`
**Live URL:** <https://theory-playalong-sidecar.sociobot.in>
**Verification report:** `.factory/verification-2.md`

Fresh independent QA passed: clean `npm ci`; all ten exact claim commands;
`npm test` (14/14); lint; typecheck; and the production build. The deployed
HTML, JS, CSS, worker, manifest, imagery, icons, and remaining public build
files byte-match this candidate (16/16 comparable files). Cold first-read,
one-click demo, desktop and 390 px mobile, keyboard/focus/reduced motion, Axe,
privacy request logging, headers/caching, 404 behavior, PWA offline reload,
and service-worker update regression all passed.

There are **no release defects**. No backend, sign-in, payment, analytics, or
server endpoint is present, so API rate-limit and Entra checks do not apply.
The only remaining practical check is optional physical USB-MIDI hardware
coverage; synthetic Web MIDI covers the shipped browser note-on path.

`verify-url.sh` is not present in this repository. The verifier instead ran
the corresponding direct live semantic, accessibility, console, and header
checks; this is documented as a verification-tooling note, not a product
defect.

## Result

Release blockers reported in verifier commit
`8c3c465ba207052ae848fef1d82bcdb4359ebb19` are repaired for candidate
`f3e53956c7c633161b7b147fc7c3bd1f0e38150a`.

- Beat progression no longer depends on a sparse `timeupdate` event or a test
  catching one short active class. Playback now samples `currentTime` while it
  runs and records a durable highest-beat milestone. The visible marker still
  follows the current beat.
- Vite now emits content-hashed JavaScript and CSS. The existing hero and
  social images use the first eight characters of their SHA-256. Azure Static
  Web Apps gives `/assets/*` a one-year immutable cache policy.
- Only `/`, `/demo`, `/privacy`, and `/terms` rewrite to the SPA entry point.
  Unknown paths fall through to the host's 404 response override and
  `/404.html`.
- The service-worker cache name is derived from the built asset list. Its
  precache is stamped after every build, so an asset revision always produces
  a new shell cache.

The brief, visual thesis, local-first storage, one-click demo, MIDI path,
screen/computer keys, exports, privacy behavior, and offline deployment class
are unchanged.

## Regression coverage

`tests/app.spec.ts` contains one named regression for each verifier finding:

- `@regression:beat-marker` checks the durable progression milestone, the
  single visible active marker, and continuing audio playback.
- `@regression:immutable-assets` checks content-hashed JS/CSS, SHA-versioned
  images, the one-year immutable host policy, and exact service-worker
  precache entries.
- `@regression:http-404` checks that wildcard SPA fallback is absent, only the
  four real app routes rewrite, and the 404 override targets the designed
  page.
- `@regression:service-worker-update` changes the served worker revision in an
  isolated browser context, then verifies activation, cache replacement, and
  the in-app update notice.

The ten entries in `.factory/claims.json` still map one-to-one to their
`@claim:<id>` browser tests.

## Verification evidence — 2026-08-28

Clean release matrix:

```sh
npm ci
npm run lint
npm test
npm run build
npm audit --audit-level=high
```

Results: clean install passed; ESLint passed; TypeScript passed; Playwright
passed 14/14 in Chromium 145; the production build passed; npm audit reported
zero vulnerabilities. Each of the ten exact test commands from
`.factory/claims.json` was also run separately and passed.

The beat regression passed 20 consecutive single-worker repetitions:

```sh
npm test -- --grep @claim:beat-marker --repeat-each=20 --workers=1
```

Browser coverage includes desktop and 390×844 mobile, pointer and computer-key
input, route focus, visible keyboard focus, reduced motion, demo isolation,
outgoing-request capture, IndexedDB behavior, offline reload, and a forced
service-worker update. Axe found no serious or critical issues on desktop or
mobile. The factory URL verifier found no console/page errors, one h1,
`lang="en"`, a main landmark, and no missing image alt text.

Live Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best
Practices 100, SEO 100; LCP 1.209 s, CLS 0, TBT 83 ms. Production output is
22.34 KB raw JavaScript (8.47 KB gzip), 14.14 KB raw CSS (3.77 KB gzip), and a
57.41 KB hero image. Evidence and refreshed desktop/mobile screenshots are in
`.factory/evidence/`.

Before deployment, live reproduction confirmed `/missing-page` returned HTTP
200 and `/assets/app.js` returned `Cache-Control: public, must-revalidate,
max-age=30`. The verifier report contains the original beat-marker failure and
repeat failure artifacts.

## Deployment and live identity

Repair commit `8b48219` was pushed to `origin/main`. The static upload completed
as Azure deployment `aaecf218-f329-4dbe-accd-9711e75ca1ea`, using the work
order's `dist/` directory. The custom production URL is
<https://theory-playalong-sidecar.sociobot.in>.

- `/`, `/demo`, `/privacy`, `/terms`, the manifest, and service worker return
  HTTP 200.
- `/missing-page` returns HTTP 404 with the title “Not found — Theory Sidecar”
  and the designed “This bar is empty” heading.
- The root returns `Cache-Control: no-cache`; `sw.js` returns `no-cache,
  no-store, must-revalidate`; `app-CQEv2SUC.js` returns `public,
  max-age=31536000, immutable`.
- The live JS SHA-256 is
  `94867e66c3bd4d4b0f16a11cf6ce5c3f17452b28d457a7d5b3142a4613185b85`.
  The live worker SHA-256 is
  `966f60cee49edce05aca7ddd20092d5d709d4a103201321fa2ff81b33fbf85b7`.
  Both byte-match the deployed `dist/` files.
- CSP, HSTS, `nosniff`, Referrer-Policy, and restrictive Permissions-Policy are
  present on production responses.
- A fresh production browser registered the worker, reloaded `/demo` offline,
  and played C with “Degree 1 · in C major.” It made no third-party request.

The production URL verifier recorded no console or page errors, one h1,
`lang="en"`, a main landmark, and complete image alt text. Live desktop and
390×844 Axe scans again found zero serious or critical issues; there was no
mobile horizontal overflow, and the skip link received first keyboard focus.

## Honest boundaries

- Web MIDI requires a supporting browser, a secure origin, and permission.
  Screen and computer keys remain available without it.
- The beat rail follows the tempo entered by the player. It does not detect an
  audio file's tempo or downbeat.
- The app handles note-on messages. It does not visualize pedals, aftertouch,
  or pitch bend.
- There is no package/consumer surface, backend, account, payment, API,
  analytics, or AI call. Package-consumer, auth, API-rate-limit, billing, and
  live-model checks do not apply.

## Next hardware check

Test two common USB MIDI keyboards on deployed Chrome and Edge. Synthetic Web
MIDI covers the same note-on path in CI, but it cannot verify device drivers.
