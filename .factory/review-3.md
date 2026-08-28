# Adversarial first-read review 3

**Product:** Theory Playalong Sidecar

**URL checked:** <https://theory-playalong-sidecar.sociobot.in>

**Date:** 2026-08-28

**Candidate:** `e6957f0678bd13569627ed687bf29a88c2c1d90e`
**Verdict:** **FAIL — two blocking and six minor findings remain.**

Every declared command exits successfully, and the live product itself plays
the sample and restores a backup. The verdict still fails because two tagged
tests can pass without proving their complete registered claims. There are
also unlisted privacy promises and four plain-language defects.

## First 30 seconds

Fresh 390 × 844 and 1440 × 900 Chromium contexts were opened at `/` with no
stored state. Before scrolling, both screens answered all three questions:

- **What it does:** It lets a player play notes with a backing track and see
  how those notes fit the selected musical key.
- **Who it is for:** The page says, “For beginning keyboard players who want
  to see why each note fits while the music keeps moving.”
- **What to click first:** **Try it with sample data**. The adjacent result
  text says, “Opens a ready C-major practice set.”

The primary action occupied y=491–540 on the 844 px mobile viewport and
y=607–656 on desktop. The three plain facts were also visible without
scrolling. The first-screen gate passes at both sizes.

## Blocking findings

### F-2-7 — BLOCKING, reopened: the demo claim still does not prove that the sample audio is playable

**Exact claim / location:** `.factory/claims.json` says, “The demo opens with a
playable C-major groove and four recent notes.” The only tagged test is
`@claim:demo-ready` in `tests/app.spec.ts`.

**Why this fails:** The test reads `audio.duration > 7.9`, checks the four note
rows, plays a keyboard note, resets, and leaves. It never starts the audio or
asserts `currentTime` advances while `paused` is false. A decodable metadata
header with playback that fails can pass. Review 2’s F-2-7 explicitly required
the tagged test to prove that the groove is playable; the repair is therefore
half-fixed and must reopen under the same ID. Independent live exercise did
start the audio and observed `currentTime=0.224` with `paused=false`, but the
claims contract requires the one tagged test to contain that proof.

**Concrete fix:** In `@claim:demo-ready`, click **Play sample groove**, wait for
`audio.currentTime > 0.2`, and assert `paused === false` and `SAMPLE PLAYING`.
Keep the existing exact-note and reset assertions.

### F-3-1 — BLOCKING: the backup import claim permits a no-op importer to pass

**Exact claim / location:** `.factory/claims.json` says, “Exports and imports
note history as a backup file.” The test `@claim:history-portability` exports
four notes and immediately imports them into the unchanged four-note demo.

**Why this fails:** After import, the test checks only the success message and
that the list still contains four rows. An importer that ignores the file and
always announces success would pass. The promised restoration result is not
observed. The live implementation did restore an exported four-row backup
after a fifth note was added, but that does not repair the required tagged
test.

**Concrete fix:** Export the four rows, then clear the list or add a fifth
distinct note. Import the saved file and assert the exact four notes, order,
key labels, and count return. Also assert malformed backup data leaves the
existing history unchanged.

## Minor findings

### F-3-2 — Minor: broad privacy promises are absent from the claim registry

**Exact quotes / locations:**

- `/privacy`: “Theory Playalong Sidecar has no account and makes no
  third-party requests.”
- `/privacy`: “Audio files, MIDI messages, and note history are not uploaded.”
- `README.md`: “The app makes no third-party requests during practice.”

**Why this fails:** `local-audio` records requests for a demo local-file/MIDI
flow, but its registered sentence covers local audio, MIDI messages, demo
notes, and demo isolation. It does not list the broader “no third-party
requests” promise or real note-history upload behavior. `local-history` checks
persistence but does not record requests. These are therefore claim-like
sentences without a registry entry that proves their full scope.

**Concrete fix:** Add one `no-third-party-requests` claim for cold load plus
real and demo practice. Its tagged test must record the entire request log
while playing a real note, selecting local audio, sending MIDI, exporting,
and reloading; assert every request is same-origin or a local `blob:` URL.

### F-3-3 — Minor: the saved-note deletion promise is unlisted and untested

**Exact quote / location:** `/privacy`, under **Your controls**: “Clear history
removes saved notes from this browser.”

**Why this fails:** No `.factory/claims.json` entry or tagged test clears real
history and confirms that it stays empty after reload. This is a data-control
promise a visitor can rely on.

**Concrete fix:** Add a `history-deletion` claim and tagged real-mode test:
save notes, confirm the clear action, reload, and assert no history rows remain
while key, scale, and tempo retain their documented behavior.

### F-3-4 — Minor: the README uses two technical names for the demo

**Exact quotes / locations:** “Try the isolated sample…” and “For the ready
sandbox, open…” in `README.md`; the rest of the product calls this the “demo.”

**Why this fails:** “Isolated sample” is vague and “sandbox” is implementation
jargon. Three names for the same entry path make setup instructions harder to
scan.

**Concrete fix:** Use “Try the demo at `?demo=1` or `/demo`…” and “For the
demo, open `http://localhost:5173/?demo=1`.”

### F-3-5 — Minor: two README capability sentences use unexplained MIDI jargon

**Exact quotes / locations:** “Reads note-on messages from a connected MIDI
keyboard.” and “Web MIDI support depends on the browser and device.”

**Why this fails:** A beginning instrumentalist does not need protocol event
names or the browser API name to understand the capability or limitation.

**Concrete fix:** Use “Reads notes you play on a connected MIDI keyboard.” and
“MIDI keyboard support depends on your browser and device.”

### F-3-6 — Minor: the build instruction uses a metaphor

**Exact quote / location:** `README.md`: “Static output lands in `dist/`, with
`dist/index.html` at its root.”

**Why this fails:** “Lands” does not name the build action and conflicts with
the plain-words rule against metaphor copy.

**Concrete fix:** Use “The build writes static files to `dist/`, including
`dist/index.html`.”

### F-3-7 — Minor: the note list has two names despite the terminology record

**Exact quotes / locations:** landing heading “Recent notes,” empty state
“Played notes will appear here,” buttons “Export CSV” / “Export backup,” and
README phrases “recent notes” and “note history.” `.factory/copy-audit.md`
declares the one term to be “note history.”

**Why this fails:** These labels describe the same saved and exported list.
The terminology proof contradicts both the live UI and README.

**Concrete fix:** Use **Note history** for the heading, “Played notes will
appear in your note history” for the empty state, and “note history” in README
descriptions. Update the copy audit from the resulting strings.

## Copy audit

Counts are whitespace-separated rendered words; hyphenated words count once.
Commands, URLs standing alone, note names, and status readouts are not prose
sentences. No audited item exceeds 22 words or contains a banned marketing
adjective.

### Landing page sentences and headings

| Words | Exact copy | Result |
| ---: | --- | --- |
| 6 | See each note in the key. | Pass |
| 6 | Play notes with your backing track | Pass |
| 17 | For beginning keyboard players who want to see why each note fits while the music keeps moving. | Pass |
| 6 | Opens a ready C-major practice set. | Pass |
| 3 | Free to use. | Pass |
| 5 | Audio stays on your device. | Pass |
| 6 | Works offline after your first visit. | Pass |
| 11 | A pixel keyboard sends glowing notes into a twelve-note harmony wheel. | Pass; image alt |
| 3 | Play a note. | Pass |
| 6 | See its place in the key. | Pass |
| 6 | Play notes with a backing track | Pass |
| 2 | Backing track | Pass |
| 4 | Note in the key | Pass |
| 3 | No MIDI keyboard? | Pass |
| 6 | Use the screen keys or A–K. | Pass |
| 2 | LIVE NOTE | Pass |
| 7 | Play a note to see its place. | Pass |
| 4 | Chords that include it | Pass |
| 6 | Chord names appear after you play. | Pass |
| 5 | Notes from C to C | Pass |
| 15 | Computer keys: A W S E D F T G Y H U J K | Pass |
| 2 | Recent notes | F-3-7 |
| 5 | Played notes will appear here. | F-3-7 |
| 3 | How it works | Pass |
| 6 | Choose a key and audio file | Pass |
| 9 | Pick a key, then load your own audio file. | Pass |
| 5 | Play notes while audio continues | Pass |
| 10 | Use MIDI or the screen keys while the audio continues. | Pass |
| 5 | See where each note fits | Pass |
| 12 | See the note number in the key, matching chords, and recent notes. | F-3-7 |
| 3 | Your practice data | Pass |
| 9 | Your settings and note history stay in this browser. | Pass |
| 5 | Audio files are not stored. | Pass |
| 8 | See each note inside the key you choose. | Pass; footer |

Landing actions are **Try it with sample data** (5), **Choose an audio file**
(4), **Connect MIDI** (2), **Clear history** (2), **Export CSV** (2), **Export
backup** (2), **Import backup** (2), and **Play [note]** (2). Each uses a verb
and names the result. Navigation labels are links, not action buttons.

### README sentences and headings

| Words | Exact copy | Result |
| ---: | --- | --- |
| 3 | Theory Playalong Sidecar | Pass |
| 18 | Play a MIDI keyboard with a local backing track and see each note inside the key you choose. | Pass |
| 13 | It is for beginning instrumentalists who want to play notes while audio continues. | Pass |
| 16 | It shows each note’s number in the key, matching chords, an eight-beat marker, and recent notes. | F-3-7 |
| 11 | Try the isolated sample at `?demo=1` or `/demo`, or at <https://theory-playalong-sidecar.sociobot.in/?demo=1>. | F-3-4 |
| 11 | The demo includes a local C-major groove and four recent notes. | F-3-7 |
| 8 | It does not write to real practice data. | Pass |
| 3 | What it does | Pass |
| 8 | Reads note-on messages from a connected MIDI keyboard. | F-3-5 |
| 11 | Accepts a local audio file and does not store the file. | Pass |
| 11 | Keeps your key, scale, tempo, and recent notes in this browser. | F-3-7 |
| 13 | Exports note history as CSV or a backup file, and imports that backup. | F-3-7; claim proof F-3-1 |
| 7 | Works offline after the first online visit. | Pass |
| 8 | Runs free, without an account or payment gate. | Pass |
| 9 | Web MIDI support depends on the browser and device. | F-3-5 |
| 12 | The screen keys and the computer keys A–K work without MIDI hardware. | Pass |
| 2 | Run locally | Pass |
| 6 | Requirements: Node.js 20 or newer. | Pass |
| 2 | Open <http://localhost:5173>. | Pass |
| 6 | For the ready sandbox, open <http://localhost:5173/?demo=1>. | F-3-4 |
| 3 | Test and build | Pass |
| 17 | `npm test` builds the production site and runs the Playwright claim, accessibility, routing, mobile, and offline checks. | Pass; verified |
| 8 | The exact deploy command is `npm run build`. | Pass; verified |
| 10 | Static output lands in `dist/`, with `dist/index.html` at its root. | F-3-6 |
| 3 | Privacy and data | Pass |
| 4 | There is no account. | Pass |
| 11 | Your key, scale, tempo, and recent notes stay in this browser. | F-3-7 |
| 5 | Audio files are not stored. | Pass |
| 8 | The app makes no third-party requests during practice. | F-3-2 |
| 10 | Demo changes stay separate and are discarded when you leave. | Pass |
| 10 | Implementation note: real practice data uses the `theory-sidecar-v1` browser database. | Pass; developer note |
| 7 | Read the in-app privacy page and terms. | Pass |
| 2 | Project notes | Pass |
| 3 | Product brief: `.factory/brief.json` | Pass |
| 6 | Visual system and image provenance: `.factory/design.md` | Pass |
| 3 | Demo contract: `.factory/demo.md` | Pass |
| 3 | Tested claims: `.factory/claims.json` | Pass |
| 2 | Handoff: `.factory/handoff.md` | Pass |
| 2 | MIT licensed. | Pass |
| 4 | Built by Param Factory. | Pass |

Shell commands are excluded as commands, not sentences.

### Terminology

| Concept | Current terms | Required term |
| --- | --- | --- |
| Try-out mode | demo, isolated sample, sandbox | demo (F-3-4) |
| Saved played-note list | recent notes, played notes, note history | note history (F-3-7) |
| Imported sound | audio file; backing track describes its role | audio file |
| Tonal selection | key | key |
| Major/minor choice | scale | scale |
| MIDI device | MIDI keyboard | MIDI keyboard |
| Portable history file | backup | backup |
| Product name | Theory Playalong Sidecar; compact visual wordmark has the full accessible name | Theory Playalong Sidecar |

## Demo and sandbox verification

- The first action reached `/?demo=1` in one click. The first demo screen
  already showed C major, an eight-second local sample groove, and exactly C,
  E, F-sharp, and G in the note list.
- The persistent banner said “Demo — sample data, nothing is saved” and
  exposed **Reset demo** and **Start for real**.
- Playing a note changed four rows to five; **Reset demo** restored four.
- A real note created before demo remained the only real row after demo use,
  reset, and exit. Demo changes did not enter the real IndexedDB namespace.
- A direct live backup exercise exported four rows, added a fifth row, then
  imported the backup and restored four. This confirms the implementation,
  while F-3-1 records the insufficient required test.
- The sample groove started on the live site and advanced past 0.2 seconds.
  This confirms the implementation, while reopened F-2-7 records the
  insufficient required test.
- Live requests during cold load, demo interaction, route checks, and offline
  preparation were same-origin or local `blob:` media. No third-party runtime
  request appeared. Demo localStorage stayed empty and the real IndexedDB
  database was not opened by the tagged isolation test.

The demo behavior itself passes. Its claim proof does not.

## Claims and clean-clone quality gates

A clean clone of candidate `e6957f0` was created at
`/tmp/theory-review3-clean-xMOVS8/repo` and installed with `npm ci` (0
vulnerabilities). Every exact command in `.factory/claims.json` was run
separately. Each ID appears exactly once in the test source.

| Claim id | Command | Contract result |
| --- | --- | --- |
| `harmony-context` | Pass | Pass; C major changes to E minor with note, scale, history, and chords asserted |
| `midi-input` | Pass | Pass |
| `local-audio` | Pass | Pass for its registered demo/audio/MIDI scope |
| `beat-marker` | Pass | Pass at 60 and 120 beats per minute |
| `csv-export` | Pass | Pass |
| `history-portability` | Pass | **Incomplete — F-3-1** |
| `local-history` | Pass | Pass for key, scale, tempo, note history, and absent audio after reload |
| `offline-reload` | Pass | Pass |
| `free-use` | Pass | Pass |
| `keyboard-fallback` | Pass | Pass at 390 px for screen and computer keys |
| `demo-ready` | Pass | **Incomplete — reopened F-2-7** |
| `playalong-continuity` | Pass | Pass for screen, computer, and synthetic MIDI input while audio advances |

Additional clean-clone results:

- `npm test`: 19/19 passed.
- `npm run lint`: passed.
- `npm run build`: passed and produced `dist/`.
- Initial JavaScript: 22.39 kB raw / 8.31 kB gzip.
- `npm run copycheck`: passed its current 49-row record. F-3-7 explains why
  the terminology record is not yet accurate despite the green counter.

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown path returns a
  designed HTTP 404. `/offline.html`, `robots.txt`, `sitemap.xml`, manifest,
  icons, and social artwork are present.
- Each route has one h1, one main landmark, `lang="en"`, a route-specific title
  and description, canonical URL, Open Graph/Twitter metadata, favicon, and a
  consistent header/footer with Privacy and Terms.
- The root title is `Theory Playalong Sidecar — play with a backing track` (52
  characters). Demo, Privacy, and Terms use the required route-title pattern.
- Push navigation and browser Back move focus to the restored h1. Direct deep
  links reload correctly. The link crawl found 200 responses for every
  navigational internal/external link; mail links were explicit. Same-document
  skip links on the 404 correctly remain on the current 404 document.
- The mobile page has no horizontal document overflow. Focus rings, reduced
  motion, 44 px controls, form labels, and image alt text are present.
- `/opt/fleet/lib/verify-url.sh` passed with no errors: title, `lang`, one h1,
  main, image alt, button labels, and console checks passed. Live Axe scans
  reported zero serious/critical violations on all four app routes, offline,
  and 404. No console or page errors appeared.
- The asymmetric phosphor pixel console, tracker typography, custom artwork,
  stepped beat rail, and clipped controls match `.factory/design.md`. It is
  visually distinct and not a generic SaaS hero/card template.

No structure, accessibility, or visual-identity finding remains.

## Earlier-finding verification

Each item was checked against both current source/tests and the live site.

| Earlier id | Current result |
| --- | --- |
| F-1-1 | Fixed: root and 404 use the full product-title pattern. |
| F-1-2 | Fixed: title, description, canonical, Open Graph, and Twitter values change per app route. |
| F-1-3 | Fixed: the cited harmony/scale/sidecar jargon is absent. New README jargon is F-3-5. |
| F-1-4 | Fixed for its exact cited promises; the no-score, negative-capability, and artwork-footer claims remain absent. New privacy claims are F-3-2/F-3-3. |
| F-1-5 | Fixed: fallback copy and toast use the full name or “practice tool”; the compact wordmark has the full accessible name. |
| F-2-1 | Fixed: the tagged harmony test changes C major to E minor and asserts changed results. |
| F-2-2 | Fixed: the tagged beat test measures 60 and 120 beats per minute. |
| F-2-3 | Fixed: the privacy test exercises a valid local WAV and synthetic MIDI while logging requests/storage. |
| F-2-4 | Fixed: key, scale, tempo, and history persist; audio does not. |
| F-2-5 | Fixed: both a screen key and computer key are exercised at 390 px. |
| F-2-6 | Fixed: “any backing track” is absent from live copy and metadata. |
| F-2-7 | **Not fully fixed: reopened above because the tagged demo test never starts the claimed playable groove.** |
| F-2-8 | Fixed: registered continuity proof exercises all three input paths while audio advances. |
| F-2-9 | Fixed: decorative section codes are absent. |
| F-2-10 | Fixed: workspace heading is “Play notes with a backing track.” |
| F-2-11 | Fixed: all three step headings name their action and object. |
| F-2-12 | Fixed: controls use “beats per minute,” “Notes from C to C,” and “backup.” |
| F-2-13 | Fixed for its cited database/CDN/browser-URL wording; implementation detail is isolated as a developer note. |
| F-2-14 | Fixed: both SPA/static 404s say “Page not found.” |
| F-2-15 | Fixed: Terms h1 identifies the page and product. |
| F-2-16 | Fixed: offline and 404 shells have complete navigation, legal links, metadata, icons, external labeling, and build ID. |
| F-2-17 | Fixed: package, manifest, app, offline, and 404 show v1.0.3. |
| F-2-18 | Fixed for the cited 17-word count and A–K design range. F-3-7 is a new terminology contradiction. |

## Missed leverage

No additional feature finding is warranted. The brief’s core note/key/chord
analysis is deterministic and works offline, so an AI call would add cost and
privacy surface without improving the job. CSV export and backup import/export
already provide portability. Account sync would conflict with the brief’s
local-first, no-account scope unless the brief changes.

## What would make this perfect

Make the two tagged tests prove playback and restoration rather than merely
inspect metadata or unchanged counts. Register and test the full privacy and
deletion promises. Then standardize “demo” and “note history,” remove the two
MIDI API terms and the “lands” metaphor, regenerate the copy audit, and rerun
all exact claims plus the cold live checks. Nothing else should remain.
