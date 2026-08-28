# Polish round 2 — cumulative review closure

**Candidate reviewed:** `84ccca86bbe7f021e5fa3b4c0af8ae4c53d2af4b`  
**Review commit:** `709c5c6a0ea39f3506e0b1678c848f348186f450`  
**Repair commit:** `157ee08`  
**Live URL:** <https://theory-playalong-sidecar.sociobot.in>  
**Cold live evidence:** `.factory/evidence/polish-2/live-verification.json`

Every earlier and current finding is mapped below. “Browser test” names refer
to `tests/app.spec.ts`; all passed from a clean clone and on the deployed app
where noted.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the required full-name root and 404 title patterns. | Browser test `landing has the required structure and clear first action`; `@regression:http-404`; live route and fallback titles in `live-verification.json`. |
| F-1-2 | Route changes update title, description, canonical, Open Graph, and Twitter metadata. | Browser test `route titles, metadata, focus, back navigation…`; live `/`, `/demo`, `/privacy`, and `/terms` metadata in `live-verification.json`. |
| F-1-3 | Kept the earlier beginner-language rewrites and replaced the new vague/jargon copy. | `npm run copycheck`; browser test `copy audit tracks the current plain-language landing strings`; mobile screenshot `live-mobile.png`. |
| F-1-4 | Removed unsupported capability/provenance copy; all retained functional promises are in the 12-entry claim registry. | All exact claim commands passed; `.factory/claims.json`; browser suite 19/19. |
| F-1-5 | Replaced fallback title/body and offline toast uses of “Theory Sidecar” or “sidecar” with the full product name or “practice tool.” | Browser tests `fallback documents…` and `@claim:offline-reload`; live `/offline.html` title in `live-verification.json`. |
| F-2-1 | The harmony test now switches from C major to E minor and asserts degree, scale summary, history key, and chord output change. | `@claim:harmony-context`; clean-clone exact command passed; selected-key live check in `live-verification.json`. |
| F-2-2 | The beat test sets 60 and 120 beats per minute and measures each first interval with bounded tolerances and a relative-speed assertion. | `@claim:beat-marker`; clean-clone exact command passed; repeat run passed 5/5. |
| F-2-3 | The privacy test uploads and plays a valid local WAV, sends a synthetic MIDI note, records every request, and inspects localStorage and IndexedDB. | `@claim:local-audio`; clean-clone exact command passed; live request log shows zero outside requests. |
| F-2-4 | Settings test changes and reloads key, scale, tempo, and history, while confirming audio is not restored. Saves are serialized to prevent write races. | `@claim:local-history`; clean-clone exact command passed. |
| F-2-5 | The fallback test clicks a screen key and presses a mapped computer key at 390 px without connecting MIDI. | `@claim:keyboard-fallback`; clean-clone exact command passed; `live-mobile.png`. |
| F-2-6 | Replaced “any backing track” with “your backing track” and metadata with “a local backing track.” | Browser copy-audit test; live root h1 in `live-verification.json`; `live-mobile.png`. |
| F-2-7 | Added the `demo-ready` registry entry and tagged proof for playable sample audio plus exactly C, E, F-sharp, and G. | `@claim:demo-ready`; clean-clone exact command passed; live query-demo/reset checks. |
| F-2-8 | Added a compound continuity claim that starts audio, then uses screen, computer, and synthetic MIDI inputs while time continues. | `@claim:playalong-continuity`; clean-clone exact command passed; live audio-continuity check. |
| F-2-9 | Removed `01 / PLAYALONG`, `02 / SIGNAL PATH`, `03 / BOUNDARIES`, and decorative legal/demo labels. | Browser copy-audit test asserts zero `.section-code` elements on landing; `live-mobile.png`. |
| F-2-10 | Renamed the workspace heading to “Play notes with a backing track.” | Browser copy-audit test; `live-mobile.png`. |
| F-2-11 | Rewrote step headings as “Choose a key and audio file,” “Play notes while audio continues,” and “See where each note fits.” | Browser copy-audit test; `npm run copycheck`; `live-mobile.png`. |
| F-2-12 | Expanded tempo to “beats per minute,” renamed the keyboard range, and changed JSON-facing actions/errors to “backup.” | Browser suite 19/19; `@claim:history-portability`; screenshots. |
| F-2-13 | Rewrote README privacy copy in user terms and moved the database name to an implementation note. | `npm run copycheck`; `.factory/copy-audit.md`; `@claim:local-audio` and `@claim:local-history`. |
| F-2-14 | Replaced both SPA and host 404 metaphors with “Page not found” and a direct explanation. | `@regression:http-404`; live `/missing-polish-2` returned 404 with matching title/h1 and zero serious Axe violations. |
| F-2-15 | Changed the Terms h1 to “Terms for Theory Playalong Sidecar.” | Browser route/focus test; live `/terms` route record and zero serious Axe violations. |
| F-2-16 | Added full metadata, icons, header/footer, Privacy/Terms links, external-site label, and build id to offline; completed the 404 footer. | Browser test `fallback documents…`; live fallback records show legal links, v1.0.3, correct status, and zero serious Axe violations. |
| F-2-17 | Unified package, manifest start URL, app footer, offline, and 404 at 1.0.3; the app value is injected from package metadata. | Browser tests `landing…` and `fallback documents…`; all live routes/fallbacks report v1.0.3. |
| F-2-18 | Corrected A–K in the design record and replaced the manual audit with verified counts from current strings. | `npm run copycheck` verified 49 sentences; browser copy-audit test; `.factory/design.md`. |

## Controller requirements

| Requirement | Evidence |
| --- | --- |
| First-screen wording | H1 is “Play notes with your backing track”; action and three facts are visible at 390 × 844 in `live-mobile.png`. |
| One-click isolated `?demo=1` | Live verifier entered the query route in one click, found the persistent banner, reset to four notes, and preserved the pre-demo real note. |
| Claims and every claim test | Twelve registered claims; all 12 exact commands passed separately from the fresh clone, followed by the 19/19 aggregate suite. |
| Titles, metadata, routing, focus, 404, legal links | Browser route/fallback tests and the live report cover each item; the unknown URL returns HTTP 404. |
| Mobile layout | 390 px test and cold live screenshot show no horizontal overflow, ≥44 px controls, stacked workspace, and visible first action. |
| Privacy and offline | Local-file/MIDI request logging, demo storage inspection, service-worker reload offline, and live outside-request log all pass. |

No finding remains unresolved.
