# Theory Playalong Sidecar — polish round 3 handoff

## Result

Release `v1.0.4` closes every finding in reviews 1–3. The repair keeps the
existing offline PWA architecture and its pocket-demoscene visual identity.
Production is live at <https://theory-playalong-sidecar.sociobot.in>, with the
one-click isolated demo at
<https://theory-playalong-sidecar.sociobot.in/?demo=1>.

## What changed

- Strengthened `demo-ready` to prove the sample audio starts, advances, stays
  unpaused, and reports `SAMPLE PLAYING`.
- Strengthened backup coverage by mutating note history before import, checking
  exact restored notes/order/key labels, and proving malformed data changes
  nothing. The importer now validates the complete backup shape.
- Added registered `no-third-party-requests` and `history-deletion` claims with
  end-to-end tests across real practice, demo practice, local audio, MIDI,
  exports, persistence, deletion, and reload.
- Standardized the user-facing list name to “note history.” Rewrote README
  references to the demo, MIDI keyboard support, and build output in plain
  words. `.factory/copy-audit.md` now verifies 88 current items.
- Updated the catalog line to a verb-first 80-character description.
- Released package, manifest, app shell, offline page, and 404 consistently as
  `v1.0.4`.

The complete finding-by-finding record is in `.factory/polish-3.md`.

## Verification

Final clean clone: `/tmp/theory-polish3-final-6QorBc/repo` at
`e0148cec2413198e0c4e11f9863b009d67866dfc`.

- `npm ci`: 106 packages, 0 vulnerabilities.
- `npm test`: 23/23 passed, including browser, accessibility, routing, mobile,
  privacy, backup, service-worker update, and offline coverage.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/index.html` exists.
- `npm run copycheck`: 88 current items passed.
- Every command in `.factory/claims.json` ran separately and passed: all 14.
- Build assets: JavaScript 22.91 kB raw / 8.52 kB gzip; CSS 14.14 kB raw /
  3.77 kB gzip; largest product image 57.41 kB.
- Local Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.6 s, CLS 0, TBT 0 ms.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.2 s, CLS 0, TBT 50 ms.
- `/opt/fleet/lib/verify-url.sh` passed the live direct-demo URL: HTTP 200,
  correct title/lang/h1/main, no missing alt text, no unlabeled buttons, and no
  console errors.
- The cold live verifier checked all app routes, per-route metadata, canonical
  URLs, focus restoration, 390 px layout, the first viewport, query demo,
  reset, real-data isolation, sample playback, backup restoration/rejection,
  deletion persistence, offline reload, security headers, and Axe. It observed
  49 requests, all same-origin/local and GET-only with no request bodies.
- Live HTTP results: `/`, `/demo`, `/privacy`, `/terms`, `/offline.html`,
  `/manifest.webmanifest`, `/robots.txt`, and `/sitemap.xml` returned 200;
  `/missing-polish-3` returned 404.

Evidence:

- `.factory/evidence/polish-3/live-verification.json`
- `.factory/evidence/polish-3/live-mobile.png`
- `.factory/evidence/polish-3/live-demo-desktop.png`
- `.factory/evidence/polish-3/verify.json`
- `.factory/evidence/polish-3/lighthouse.json`
- `.factory/evidence/polish-3-local/`

## Deployment

- Work order: `theory-playalong-sidecar-polish-3`
- Build command: `npm ci && npm test && npm run build`
- Artifact: static `dist/` PWA
- Azure Static Web Apps deployment id:
  `8dad991c-58f9-4326-aeb2-baa7a360414b`
- Production TLS and custom domain returned HTTP 200 after deployment.

## Known gaps and next steps

None. No review finding remains unresolved, and no follow-up is required for
this work order.
