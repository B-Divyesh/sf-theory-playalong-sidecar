# Independent verification — FAIL

**Candidate:** `f3e53956c7c633161b7b147fc7c3bd1f0e38150a`
**Verified URL:** <https://theory-playalong-sidecar.sociobot.in>
**Date:** 2026-08-28
**Verdict:** **FAIL — release blocked by an unreliable required claim test.**

## Release decision

The deployed JavaScript and CSS byte-match the production build from the
candidate (`sha256` app.js `df8b45d7354fde92947fd01562c18366bc2249ee4429b86ce4867912ae1e989a`;
index.css `9fe1edcfcca17a4b076225fda7e5b00d307cf7ab8aec5efca82e38dac7ab7c8d`).
This is therefore not a deployment-only problem.

The cold live first screen passes the plain-words and demo gate. It says: play
notes against a backing track; it names beginning keyboard players; and its
first primary action is **Try it with sample data**, with the result explained
as a ready C-major practice set. `/demo` opens in one click with a persistent
“Demo — sample data, nothing is saved” banner, Reset demo, and Start for real.

## Required claim tests from a clean checkout

I ran `npm ci`, then every exact command in `.factory/claims.json` against the
project's production preview/demo entry point.

| Claim | Exact command | Result |
| --- | --- | --- |
| harmony-context | `npm test -- --grep @claim:harmony-context` | Pass |
| midi-input | `npm test -- --grep @claim:midi-input` | Pass |
| local-audio | `npm test -- --grep @claim:local-audio` | Pass |
| beat-marker | `npm test -- --grep @claim:beat-marker` | **Fail, then pass on retry** |
| csv-export | `npm test -- --grep @claim:csv-export` | Pass |
| history-portability | `npm test -- --grep @claim:history-portability` | Pass |
| local-history | `npm test -- --grep @claim:local-history` | Pass |
| offline-reload | `npm test -- --grep @claim:offline-reload` | Pass |
| free-use | `npm test -- --grep @claim:free-use` | Pass |
| keyboard-fallback | `npm test -- --grep @claim:keyboard-fallback` | Pass |

The initial beat-marker run timed out waiting for `[data-beat="1"]` to receive
the `active` class after pressing **Play sample groove**. The assertion has a
2.5 second timeout. A retry passed, but a subsequent
`npx playwright test --grep @claim:beat-marker --repeat-each=10 --workers=1`
failed again on its first repetition. That is sufficient fresh evidence of a
flaky required claim test. Per the claims contract, any failure is
release-blocking, even though an ordinary `npm test` run later passed all 11
tests.

## Independent product checks

- `npm test`: passed, 11/11 (after the failing exact claim run).
- `npm run build`: passed; `dist/` produced. Type checking is included in this
  command. No separate lint script exists.
- Build budget: 8.22 KB gzip JS and 3.76 KB gzip CSS; hero WebP is 57.4 KB.
- Live normal flow: E in C major showed degree 3 and matching chords; F-sharp
  showed outside-key feedback. Screen-key Enter/Space use worked. BPM boundary
  input recovered to 30 and 240. Invalid JSON showed the actionable import
  error. Unsupported/blocked MIDI reported the recovery message.
- Live PWA: a fresh context registered `/sw.js`, gained controller
  `sidecar-v4`, then reloaded `/demo` offline and still played C with
  “Degree 1 · in C major.” The worker has versioned precache and update
  handling; no second deployed revision was available to force an in-place
  production update event.
- Desktop and 390 px mobile: no horizontal overflow. Axe 4.10 found zero
  serious/critical violations at either size. Keyboard-only smoke test found
  the skip link first with a visible 3 px focus outline; route navigation moved
  focus to the new h1. Reduced-motion CSS reduced live-note transitions to
  `0.00001s`. No browser console or page errors were seen.
- Privacy/network: live demo made no third-party runtime requests. The local
  claim test verified demo uses neither localStorage nor the real IndexedDB
  database. There are no product server/API endpoints, accounts, or sign-in,
  so API rate-limit and Entra checks are not applicable.
- Links: all internal routes plus the explicit Sociobot external link returned
  200. CSP, HSTS, nosniff, Referrer-Policy, and restrictive Permissions-Policy
  headers are present. The static app has no runtime external scripts/fonts.
- Lighthouse mobile run: Performance 97, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.227 s, CLS 0, TBT 192.5 ms. Lighthouse emitted a final
  screenshot/target-crash warning after collecting results; these scores are
  recorded with that caveat.

## Defects

### High — required beat-marker claim test is flaky (release blocker)

`@claim:beat-marker` intermittently fails after a clean install because the
test can miss beat 2's short active interval. The first exact required command
failed, a rerun passed, and repeat testing failed again. Make the observable
beat progression deterministic (or assert a durable progression rather than a
single transient beat) and demonstrate repeated clean passes before release.

### Medium — production assets have only 30-second caching

Live `app.js`, `index.css`, the hero image, manifest, and service worker all
return `Cache-Control: public, must-revalidate, max-age=30`. This does not meet
the PWA/static-product contract for long-lived immutable caching of versioned
assets. Version/hash assets and deploy an appropriate immutable cache policy.

### Medium — unknown route returns HTTP 200

`/missing-page` returns the SPA shell with HTTP 200 rather than a real 404,
despite a styled client-side not-found view. Configure the static host/fallback
so unknown URLs return the documented `/404.html` with status 404 without
breaking legitimate SPA routes.

## Evidence locations

- First failing claim trace/screenshot: `test-results/app--claim-beat-marker-advances-with-the-backing-track-chromium/`.
- Repeat-failure artifacts: `test-results/app--claim-beat-marker-advances-with-the-backing-track-chromium-repeat7/`.
- Live desktop/mobile screenshots and Lighthouse JSON were collected under
  `/tmp/theory-live-*.png` and `/tmp/theory-lighthouse-live.json` in this
  disposable verification environment.
