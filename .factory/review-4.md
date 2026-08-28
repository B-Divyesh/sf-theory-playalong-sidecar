# Adversarial first-read review 4

**Product:** Theory Playalong Sidecar  
**URL checked:** <https://theory-playalong-sidecar.sociobot.in>  
**Date:** 2026-08-28  
**Clean clone:** `8c6eb02dfb77a0d69dcb508c111b90333831e339`  
**Verdict:** **PASS** — zero findings.

## First 30 seconds

Fresh Chromium contexts at 390 × 844 and 1440 × 900, with no stored browser
state, answered the three questions before scrolling.

- **What it does:** “Play notes with your backing track.” It shows whether the
  note fits the selected key.
- **Who it is for:** “For beginning keyboard players who want to see why each
  note fits while the music keeps moving.”
- **What to click first:** **Try it with sample data**. Its adjacent outcome is
  “Opens a ready C-major practice set.”

The action and all three facts were inside the 390 px first viewport. The
pixel/demoscene music-console treatment is product-specific rather than a
generic SaaS shell. No first-read blocker was found.

## Copy audit

Counts use whitespace-separated rendered words; hyphenated terms count as one.
These are all landing-page prose sentences, headings, and meaningful image
text. State readouts, note names, form labels, keyboard shortcuts, navigation,
and action labels are audited separately because they are not sentences.

| Words | Landing copy |
| ---: | --- |
| 6 | See each note in the key. |
| 6 | Play notes with your backing track |
| 17 | For beginning keyboard players who want to see why each note fits while the music keeps moving. |
| 6 | Opens a ready C-major practice set. |
| 3 | Free to use. |
| 5 | Audio stays on your device. |
| 6 | Works offline after your first visit. |
| 11 | A pixel keyboard sends glowing notes into a twelve-note harmony wheel. *(image alt)* |
| 3 | Play a note. |
| 6 | See its place in the key. |
| 6 | Play notes with a backing track |
| 2 | Backing track |
| 4 | Note in the key |
| 3 | No MIDI keyboard? |
| 6 | Use the screen keys or A–K. |
| 2 | LIVE NOTE |
| 7 | Play a note to see its place. |
| 4 | Chords that include it |
| 6 | Chord names appear after you play. |
| 5 | Notes from C to C |
| 15 | Computer keys: A W S E D F T G Y H U J K |
| 2 | Note history |
| 8 | Played notes will appear in your note history. |
| 3 | How it works |
| 6 | Choose a key and audio file |
| 9 | Pick a key, then load your own audio file. |
| 5 | Play notes while audio continues |
| 10 | Use MIDI or the screen keys while the audio continues. |
| 5 | See where each note fits |
| 12 | See the note number in the key, matching chords, and note history. |
| 3 | Your practice data |
| 9 | Your settings and note history stay in this browser. |
| 5 | Audio files are not stored. |
| 8 | See each note inside the key you choose. |

| Words | README copy |
| ---: | --- |
| 3 | Theory Playalong Sidecar |
| 18 | Play a MIDI keyboard with a local backing track and see each note inside the key you choose. |
| 13 | It is for beginning instrumentalists who want to play notes while audio continues. |
| 16 | It shows each note’s number in the key, matching chords, an eight-beat marker, and note history. |
| 10 | Try the demo at `?demo=1` or `/demo`, or at <https://theory-playalong-sidecar.sociobot.in/?demo=1>. |
| 14 | The demo includes a local C-major groove and four notes in its note history. |
| 8 | It does not write to real practice data. |
| 3 | What it does |
| 9 | Reads notes you play on a connected MIDI keyboard. |
| 11 | Accepts a local audio file and does not store the file. |
| 11 | Keeps your key, scale, tempo, and note history in this browser. |
| 13 | Exports note history as CSV or a backup file, and imports that backup. |
| 7 | Works offline after the first online visit. |
| 8 | Runs free, without an account or payment gate. |
| 9 | MIDI keyboard support depends on your browser and device. |
| 12 | The screen keys and the computer keys A–K work without MIDI hardware. |
| 2 | Run locally |
| 5 | Requirements: Node.js 20 or newer. |
| 2 | Open <http://localhost:5173>. |
| 5 | For the demo, open <http://localhost:5173/?demo=1>. |
| 3 | Test and build |
| 17 | `npm test` builds the production site and runs the Playwright claim, accessibility, routing, mobile, and offline checks. |
| 8 | The exact deploy command is `npm run build`. |
| 9 | The build writes static files to `dist/`, including `dist/index.html`. |
| 3 | Privacy and data |
| 4 | There is no account. |
| 11 | Your key, scale, tempo, and note history stay in this browser. |
| 5 | Audio files are not stored. |
| 8 | The app makes no third-party requests during practice. |
| 10 | Demo changes stay separate and are discarded when you leave. |
| 10 | Implementation note: real practice data uses the `theory-sidecar-v1` browser database. |
| 5 | Demo data stays in memory. |
| 7 | Read the in-app privacy page and terms. |
| 2 | Project notes |
| 3 | Product brief: `.factory/brief.json` |
| 6 | Visual system and image provenance: `.factory/design.md` |
| 3 | Demo contract: `.factory/demo.md` |
| 3 | Tested claims: `.factory/claims.json` |
| 2 | Handoff: `.factory/handoff.md` |
| 2 | MIT licensed. |
| 4 | Built by Param Factory. |

Every audited item is at most 22 words. No banned marketing adjective,
unexplained jargon, inconsistent term, context-free heading, mood heading, or
informationally empty slogan was found. “MIDI” names the required hardware,
and the immediately adjacent copy states what it does. **Try it with sample data**, **Choose an audio file**,
**Play sample groove**, **Connect MIDI**, **Clear history**, **Export CSV**,
**Export backup**, **Import backup**, and **Reset demo** are result-naming
actions. No copy finding is raised.

## Demo and sandbox

The primary landing action entered `?demo=1` in one click. The first view was
already an active practice workspace with a C-major procedural groove and the
four realistic history notes C, E, F♯, and G. The persistent banner read
“Demo — sample data, nothing is saved” and supplied **Reset demo** and
**Start for real**. Playing A added a fifth sample note; Reset restored exactly
the original four. Returning to real mode preserved the real-mode history.

A fresh direct `/demo` context had no localStorage entries and did not open the
real `theory-sidecar-v1` IndexedDB database. The sample is generated locally.
The deployed request log during real and demo audio, screen input, synthetic
MIDI, downloads, reloads, and the offline exercise contained only same-origin
GETs and local `blob:` media. No third-party request or upload occurred.

## Claims and quality gates

From a clean clone, `npm ci` completed successfully. Every exact command in
`.factory/claims.json` passed independently:

| Claim id | Result |
| --- | --- |
| harmony-context | Pass |
| midi-input | Pass |
| local-audio | Pass |
| beat-marker | Pass |
| csv-export | Pass |
| history-portability | Pass |
| local-history | Pass |
| offline-reload | Pass |
| free-use | Pass |
| keyboard-fallback | Pass |
| demo-ready | Pass |
| playalong-continuity | Pass |
| no-third-party-requests | Pass |
| history-deletion | Pass |

`npm test` passed 23/23. `npm run lint` and `npm run build` passed; the build
produced `dist/`. The claim registry has one tagged browser proof per listed
claim. The route copy and README promises map to the registry; no unlisted
visitor-facing functional claim was found.

## Structure, accessibility, and routing

Verified live on `/`, `/demo`, `/privacy`, `/terms`, `/offline.html`, a missing
route, `robots.txt`, `sitemap.xml`, the manifest, and the linked external
Param Factory site. Normal routes returned 200; the unknown route returned a
designed HTTP 404. Internal links and the external link returned 200; mail
links are explicit.

Each normal route has its route-specific title, one h1, description, canonical,
Open Graph/Twitter title and description, language, main landmark, favicon,
and product-derived social image. Header/footer legal navigation is consistent.
Back navigation and link navigation move focus to the new h1. Axe found zero
serious or critical violations on desktop and 390 px. No console or page error
occurred. The skip link, visible focus styling, reduced-motion path, no mobile
overflow, and first-screen touch targets passed the included browser checks.

The deployed CSP is response-header based and restricts connections to self;
the other inspected security headers are present. Offline reload after service
worker activation loaded `/demo` from cache and still analysed a played C.

## Earlier findings: live and code confirmation

Every earlier review and polish document was read. The following confirms the
actual current implementation, not only its closure note.

| Earlier id(s) | Current confirmation |
| --- | --- |
| F-1-1 | Live root and 404 titles use the full product name and required order. |
| F-1-2 | Live navigation updates title, description, canonical, OG, and Twitter metadata on all four app routes. |
| F-1-3 | Cold copy now uses direct beginner language; the full audit above confirms it. |
| F-1-4 | Removed unsupported/provenance promises remain absent; retained promises have claim entries. |
| F-1-5 | Fallbacks, metadata, and accessibility labels use the full product name; only the compact visual wordmark is abbreviated. |
| F-2-1 | The tagged test switches C major to E minor and observes the changed degree, scale, history key, and chords. |
| F-2-2 | The tagged test measures the marker at 60 and 120 BPM with bounded, different intervals. |
| F-2-3 | The tagged test uploads local WAV, sends synthetic MIDI, records requests, and inspects demo storage. |
| F-2-4 | The tagged test reloads changed key, scale, tempo, and history, while audio remains absent. |
| F-2-5 | The 390 px tagged test uses both an on-screen key and A–K without MIDI. |
| F-2-6 | Live h1 says “your backing track”; metadata correctly says “a local backing track.” |
| F-2-7 | `demo-ready` starts playback, observes advancing time/unpaused state and exact sample notes, then verifies reset. |
| F-2-8 | `playalong-continuity` proves screen, computer, and MIDI inputs leave the sample playing. |
| F-2-9 | Decorative section-code elements are absent from the current landing DOM. |
| F-2-10 | The workspace heading names the action: “Play notes with a backing track.” |
| F-2-11 | All three how-it-works headings name their corresponding steps. |
| F-2-12 | Current labels use beats per minute, Notes from C to C, and backup. |
| F-2-13 | README privacy language is user-facing; database detail is isolated as an implementation note. |
| F-2-14 | Both client and host missing-page paths say “Page not found”; the host returns 404. |
| F-2-15 | The Terms h1 identifies the page and product. |
| F-2-16 | Offline and 404 pages have complete metadata, shell, legal links, and accessible scans. |
| F-2-17 | Package, app, manifest, offline, and 404 all expose `v1.0.4`. |
| F-2-18 | The design record, A–K shortcut text, and 88-item automated copy audit agree. |
| F-3-1 | Backup test mutates history, restores exact original rows and keys, and rejects malformed files without changes. |
| F-3-2 | Registry and tagged request-log proof cover cold load plus real/demo practice, MIDI, audio, exports, and reloads. |
| F-3-3 | Real history deletion is tested through IndexedDB and reload while settings persist. |
| F-3-4 | README consistently calls the try-out a demo. |
| F-3-5 | README says notes played on a MIDI keyboard, not protocol/API terms. |
| F-3-6 | README correctly says the build writes files to `dist/`. |
| F-3-7 | Current UI, empty state, exports, and README use “note history.” |

## Missed leverage

The brief calls for immediate deterministic note/key context while a backing
track continues. The existing audio-file flow, MIDI/screen/computer input,
CSV/backup import-export, and local persistence cover that job. An AI feature
would not improve this real-time deterministic task and would introduce an
unnecessary key, network, and privacy surface. No omitted AI, import/export,
or sync feature is a finding.

## What would make this perfect

No corrective product work is currently required for this scope. A later
compatibility study with several physical MIDI keyboard/browser combinations
could broaden field confidence, but it is not an unverified promise or a
release finding in this local-first browser product.
