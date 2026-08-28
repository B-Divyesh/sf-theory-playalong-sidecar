# Polish round 1 — review closure

**Base reviewed:** `2ca27e6b95befbfc7f46650fee4174bbe073aa44`  
**Review:** `5d8f04ce68ad2926ec67bb540b2ff8fef261f476` / `.factory/review-1.md`  
**Repair:** `980748b0c0d90986f28a165004fb8c3d10824d8c`  
**Live check:** <https://theory-playalong-sidecar.sociobot.in/?demo=1>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Root title is now `Theory Playalong Sidecar — play with a backing track`; the static 404 title is `Theory Playalong Sidecar — page not found`. | `npm test` regression `@regression:http-404`; live root and 404 values in `.factory/evidence/polish-1-live.json`; desktop capture `.factory/evidence/polish-1-desktop.png`. |
| F-1-2 | `setMetadata()` now updates Open Graph and Twitter title/description with every route change. The static 404 has matching metadata. | Browser regression `the direct query demo is isolated, resettable, and uses demo metadata`; live `/`, `/demo`, `/privacy`, and `/terms` title/OG/Twitter map in `.factory/evidence/polish-1-live.json`. |
| F-1-3 | Rewrote the eyebrow, explanation step, boundary heading, README intro, panel label, empty chord copy, and terms heading in beginner language. | `npm test`; `.factory/copy-audit.md`; live cold-page text check in `.factory/evidence/polish-1-live.json`; screenshots `polish-1-desktop.png` and `polish-1-mobile.png`. |
| F-1-4 | Removed the untestable “no score,” negative capability list, and artwork-provenance footer promises. Retained user-facing behavior claims are represented in `.factory/claims.json`. | Live copy scan in `.factory/evidence/polish-1-live.json` confirms stale jargon/promises and provenance footer are absent; all ten exact claim commands passed from a clean clone. |
| F-1-5 | Product references now use `Theory Playalong Sidecar`; the compact wordmark remains visual-only with accessible name `Theory Playalong Sidecar home`. | `npm test`; live route-title map in `.factory/evidence/polish-1-live.json`; desktop screenshot. |
| Controller requirement: direct demo | The first action now opens `/?demo=1`, which renders the isolated sample workspace with persistent banner, reset, and real-data exit. `/demo` remains a real routable alias. | Browser regression named above; live `?demo=1` returned 200, title `Demo — Theory Playalong Sidecar`, banner shown, and Reset demo restored four notes. |

No finding from `.factory/review-1.md` remains open. There were no earlier
`.factory/review-*.md` or `.factory/polish-*.md` files to carry forward.

Live Lighthouse mobile also scored Performance 100, Accessibility 100, Best
Practices 100, and SEO 100 (LCP 1.202 s, CLS 0, TBT 55 ms); see
`.factory/evidence/polish-1-lighthouse.json`.
