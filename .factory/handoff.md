# Theory Playalong Sidecar — adversarial review 2 handoff

## Result

Review 2 was performed against production and the clean base commit
`84ccca86bbe7f021e5fa3b4c0af8ae4c53d2af4b`. The verdict is **FAIL** with seven
blocking and twelve minor findings. The full evidence and concrete fixes are in
`.factory/review-2.md`.

No product code was changed. This work order changes only the independent
review and this handoff.

## What was checked

- Cold first read at 390 × 844 and 1440 × 900.
- Complete landing/README copy audit, including headings, actions, word counts,
  terminology, conditional states, and proposed rewrites.
- One-click query demo, seeded sample, banner, Reset, Start for real, and real
  versus demo data isolation.
- Live request log and browser storage behavior.
- Every exact claim command in `.factory/claims.json`, separately.
- All earlier review/polish findings against both live output and source.
- Route titles/metadata, canonical/OG/Twitter data, deep links, Back/focus,
  designed HTTP 404, offline fallback, link crawl, header/footer, and visual
  identity.
- Mobile and desktop Axe scans, the worker `verify-url.sh`, console errors,
  overflow, reduced motion, and local quality gates.
- Brief-implied AI, import/export, and sync leverage.

## Verification results

- All ten declared claim commands exit successfully, but five tagged tests do
  not prove their complete registered claim. These are blocking findings in
  the review.
- `npm test`: 15/15 passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed through the build.
- `npm run build`: passed and produced `dist/`; app JavaScript is 8.47 kB gzip.
- `/opt/fleet/lib/verify-url.sh`: passed against production with no console
  errors.
- Live Axe at mobile and desktop: zero violations.
- Live product/internal link crawl: expected 200 responses; an unknown path
  returns the designed HTTP 404.
- Demo: four seeded notes, reset to four after interaction, real one-note state
  preserved, and no third-party requests.

## Known gaps / next steps

The prior name-consistency finding F-1-5 is reopened because the live offline
fallback and toast still use “Theory Sidecar” / “sidecar.” The other blockers
are partial claim proofs for selected key, chosen tempo, local audio/MIDI
privacy, saved settings, screen-key fallback, and the unsupported “any backing
track” wording.

Minor work remains for claim registration, plain headings and terms, README
jargon, 404/offline shells, consistent build identifiers, and internal copy and
design evidence. Resolve every item in `.factory/review-2.md`, then repeat the
entire review rather than checking only the diff.
