# Theory Playalong Sidecar — adversarial review 3 handoff

## Result

Review 3 is recorded in `.factory/review-3.md` with verdict **FAIL**: two
blocking and six minor findings remain. No product code was modified.

The live product passes cold first-read, demo behavior, privacy request-log,
offline, routing, accessibility, visual-identity, and build checks. The two
blockers concern insufficient tagged claim tests: `demo-ready` never starts
the claimed playable groove, and `history-portability` imports into an
unchanged state that lets a no-op importer pass.

## Verification performed

- Opened the live site in fresh 390 × 844 and 1440 × 900 Chromium contexts
  before scrolling.
- Entered `/?demo=1` in one click; checked seeded notes, playable sample,
  persistent banner, reset, exit, real-data preservation, storage, and request
  isolation.
- Read all prior reviews, polish reports, verification reports, and the prior
  handoff; checked every earlier finding in live output and source/tests.
- Created clean clone `/tmp/theory-review3-clean-xMOVS8/repo` at candidate
  `e6957f0`, ran `npm ci`, then all 12 exact claim commands separately.
- Ran aggregate `npm test` (19/19), `npm run lint`, build/copy checks, live route
  and link crawl, browser Back/focus, unknown-route HTTP status, offline reload,
  request/console logging, Axe integration, and
  `/opt/fleet/lib/verify-url.sh`.
- Audited every landing/README sentence, heading, and landing action with word
  counts in the review.

## Known gaps and next steps

Implement the concrete fixes for reopened F-2-7 and F-3-1 through F-3-7, then
repeat every exact claim command and the full cold/live checklist. The current
green suite is not sufficient for acceptance until the two false-positive
claim tests and the unlisted privacy promises are corrected.
