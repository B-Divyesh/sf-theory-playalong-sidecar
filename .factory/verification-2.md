# Independent verification 2 — PASS

**Candidate:** `2ca27e6b95befbfc7f46650fee4174bbe073aa44`  
**Verified URL:** <https://theory-playalong-sidecar.sociobot.in>  
**Date:** 2026-08-28  
**Verdict:** **PASS — candidate is releasable.**

## Release decision

This is fresh evidence, not reliance on the prior repair report. The complete
published application matches this candidate: 16 of 16 public production files
in `dist/` byte-match the corresponding live response (HTML, JS, CSS, worker,
manifest, artwork, icons, offline page, and other public files). The only
non-comparable file is `staticwebapp.config.json`: the host deliberately serves
the designed 404 document at that public path.

Cold first read passed. The landing screen says it lets a player **play notes
against any backing track**, names **beginning keyboard players**, and makes
**Try it with sample data** the first action, explaining that it opens a ready
C-major practice set. One click opens `/demo` with four realistic notes, a
procedural sample groove, and the persistent “Demo — sample data, nothing is
saved” banner with Reset demo and Start for real.

## Clean-checkout quality gates

Fresh dependency installation succeeded with `npm ci` (0 vulnerabilities).

| Check | Result |
| --- | --- |
| Every exact command declared by `.factory/claims.json` | Pass — all 10 claim commands were run separately from the production-preview demo entry point |
| `npm test` | Pass — 14/14 Playwright tests |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; generated `dist/` |

The production build is 22.34 kB raw / 8.47 kB gzip JavaScript and 14.14 kB
raw / 3.77 kB gzip CSS, within the static PWA JS and CSS budgets.

### Required claims

| Claim id | Result | Fresh observable evidence |
| --- | --- | --- |
| `harmony-context` | Pass | E reports Degree 3 in C major; F-sharp reports outside C major and history labels it outside key. |
| `midi-input` | Pass | Synthetic Web MIDI note-on updates the live E note. |
| `local-audio` | Pass | Demo action sequence made only same-origin requests; demo had no localStorage entries or real IndexedDB database. |
| `beat-marker` | Pass | The 96 BPM sample reached durable beat 2, retained exactly one active marker, and remained playing. |
| `csv-export` | Pass | Download contains its header plus one row per visible demo note. |
| `history-portability` | Pass | The four-note JSON export imports successfully. |
| `local-history` | Pass | Real history survives reload while a chosen local audio file returns to NO AUDIO. |
| `offline-reload` | Pass | After service-worker control and `context.setOffline(true)`, `/demo` reloaded and C reported Degree 1 in C major. |
| `free-use` | Pass | Landing-to-demo path had no account, password, or payment gate. |
| `keyboard-fallback` | Pass | A on a 390 px viewport plays C; screen keys and A–K remain usable without MIDI. |

## Independent live exercise

- Desktop and 390×844 mobile: no horizontal overflow; sample banner, Reset
  demo, and Start for real were present. Reduced motion reduced the live-note
  transition to `0.00001s`.
- Normal flow: computer A produced C / “Degree 1 · in C major”; F-sharp
  produced plain outside-key feedback. The sample audio advanced the beat rail.
- Boundary/recovery: an out-of-range high BPM recovered to 240; malformed JSON
  announced “That JSON file did not contain note history. Choose an exported
  Sidecar file.”
- Accessibility: live Axe Playwright scans at desktop and 390 px had zero
  serious or critical violations. The skip link is first in tab order and has
  a visible 3 px cyan focus outline. Route navigation moved focus to the new
  h1. No console errors or page errors occurred.
- PWA: production registered `/sw.js` with cache `sidecar-05fabd29344c`.
  Offline reload of `/demo` returned 200 from the worker and playing C still
  showed the in-key result. The checked-in integration test also forces a new
  worker revision and verifies cache replacement and the update announcement.

## Privacy, hosting, and security

- A cold live page and the complete demo exercise requested only the product
  origin (document, local JS/CSS, and local artwork). No third-party request,
  analytics, runtime CDN, account, backend API, payment, or AI call exists.
  Server allowance/429 and Entra tenant checks are therefore not applicable.
- Live responses include CSP restricted to `'self'` (with only `data:`/`blob:`
  image/media allowances), HSTS, `X-Content-Type-Options: nosniff`,
  Referrer-Policy, and restrictive Permissions-Policy.
- Root and real app routes return 200; `/missing-page` returns HTTP 404. The
  content-hashed app bundle has `Cache-Control: public, max-age=31536000,
  immutable`; the service worker is no-store/no-cache.
- Manifest is valid for standalone use with local 192/512 maskable icons and
  dark palette splash colors.

## Defects by severity

No release defects found.

**Verification note (non-product):** the repository contains no
`verify-url.sh`, so that named helper could not be run. Equivalent direct live
checks were performed for title, language, main landmark, image alt text,
console/page errors, keyboard focus, response headers, and Axe findings. This
does not affect the product verdict.

## Remaining scope boundary

Synthetic Web MIDI validates the browser note-on path. A physical USB MIDI
keyboard/browser compatibility check remains useful but is not a release
blocker for this local-first browser product.
