# Adversarial first-read review 2

**Product:** Theory Playalong Sidecar  
**URL checked:** <https://theory-playalong-sidecar.sociobot.in>  
**Date:** 2026-08-28  
**Base:** `84ccca86bbe7f021e5fa3b4c0af8ae4c53d2af4b`  
**Verdict:** **FAIL** — seven blocking findings and twelve minor findings remain.

All ten commands in `.factory/claims.json` exit successfully. That is not a
claims pass: five tagged tests do not exercise the full promise assigned to
them, and three live promises are absent from the registry.

## First 30 seconds

Fresh 390 × 844 and 1440 × 900 Chromium contexts were opened without stored
state. Before scrolling, the screen answered all three questions:

- **What it does:** It shows where notes fit in a selected key while a backing
  track plays.
- **Who it is for:** The exact text is “For beginning keyboard players who want
  to see why each note fits while the music keeps moving.”
- **What to click first:** **Try it with sample data**. The adjacent text says
  “Opens a ready C-major practice set.”

The first-screen clarity gate passes. The mobile action and three facts are
visible before scrolling. The hero is a distinct pixel music console, not a
generic SaaS template.

## Blocking findings

### F-1-5 — BLOCKING, reopened: the abbreviated product name remains in shipped fallback copy

**Exact quote / location:** live `/offline.html` title: “Offline — Theory
Sidecar”; live offline body: “The sidecar works after you open it once.”;
`src/main.ts` offline toast: “The loaded sidecar still works.”

**Why this fails:** Review 1 required one product name everywhere. The repair
changed the main routes but missed two user-visible offline states. A visitor
again sees “Theory Sidecar,” “sidecar,” and “Theory Playalong Sidecar” used as
names for the same product. The history rule makes a half-fixed earlier finding
blocking under its original id.

**Concrete fix:** Use `Offline — Theory Playalong Sidecar`; rewrite the body as
“Theory Playalong Sidecar works offline after you open it once.”; rewrite the
toast as “The practice tool still works.” Add an assertion over the offline
document and the offline toast to the existing regression coverage.

### F-2-1 — BLOCKING: `harmony-context` never tests a selected key

**Exact claim:** “Shows whether each played note is in the selected key and
which matching chords include it.”

**Test gap:** `@claim:harmony-context` leaves the controls at the seeded C
major value. It checks E and F-sharp only against that default. It therefore
does not prove that selecting another key or scale changes the result.

**Why this fails:** “Selected key” is the central product behavior. A static C
major lookup could pass the current test.

**Concrete fix:** In the one tagged test, play a note in C major, select a
different key and minor/major mode, replay the same note, and assert that the
degree/in-key result, scale summary, and matching chords change correctly.

### F-2-2 — BLOCKING: `beat-marker` does not test the chosen tempo

**Exact claim:** “Shows an eight-beat marker that advances with audio playback
at the chosen tempo.”

**Test gap:** `@claim:beat-marker` uses only the default 96 BPM and merely waits
for any milestone from beat 2 through 8. It does not change the tempo or
measure the expected interval.

**Why this fails:** A marker advancing at a fixed or arbitrary rate would pass,
so “at the chosen tempo” is untested.

**Concrete fix:** Set two materially different BPM values in fresh demo runs,
measure the elapsed time between beat changes with tolerance, and assert the
period is `60 / BPM` for each.

### F-2-3 — BLOCKING: `local-audio` does not exercise the local audio or MIDI named in its privacy claim

**Exact claim:** “Audio, MIDI messages, and demo notes are not sent to a third
party or saved as real data.”

**Test gap:** `@claim:local-audio` plays the generated demo blob and clicks a
screen key. It never selects a user audio file and never dispatches a MIDI
message. The request/storage assertions therefore cover the generated sample
and a pointer note, not two of the three named data types.

**Why this fails:** The strongest privacy promise concerns the visitor's own
audio and hardware messages. The current passing result does not observe those
flows.

**Concrete fix:** Keep request recording active while uploading a valid local
audio fixture, playing it, installing a synthetic Web MIDI input, and sending a
note-on event. Then assert only same-origin/blob requests and no demo storage.

### F-2-4 — BLOCKING: `local-history` does not test saved settings

**Exact claim:** “Keeps settings and note history in this browser but does not
store audio files.”

**Test gap:** `@claim:local-history` saves and reloads one G note and confirms
that an audio filename disappears. It never changes or reloads the key, scale,
or tempo settings covered by the word “settings.”

**Why this fails:** Settings could be lost on every reload while the registered
claim still passes.

**Concrete fix:** Change key, scale, and tempo; reload; assert all three values
and the note history persist while the selected audio does not. Alternatively,
narrow the claim and README to note history only.

### F-2-5 — BLOCKING: `keyboard-fallback` proves only half of its claim

**Exact claim:** “The screen keys and computer keys A–K work without MIDI
hardware.”

**Test gap:** `@claim:keyboard-fallback` presses only the computer key A. It
does not click a screen key. A different claim test happens to click screen
keys, but the claims contract requires the one test tagged for this id to prove
the complete promise.

**Why this fails:** The pointer/touch fallback could regress while this claim
continues to pass, which is especially relevant on the reviewed phone width.

**Concrete fix:** In `@claim:keyboard-fallback`, click at least one on-screen
key at 390 px and press at least one mapped computer key; assert both update the
live note and history without calling Web MIDI.

### F-2-6 — BLOCKING: “any backing track” is an unlisted absolute claim

**Exact quote / location:** landing h1: “Play notes against any backing track”;
root meta/OG/Twitter description: “Play a MIDI keyboard beside any backing
track and see each note in the key you choose.”

**Why this fails:** The app accepts a local file only when the browser can
decode its format. It does not accept streaming URLs, protected media, or
literally every backing track. No claims entry tests “any,” and the audio tests
use only a generated WAV or a placeholder RIFF buffer.

**Concrete fix:** Use “Play notes with your backing track” for the h1 and “Play
a MIDI keyboard with a local backing track…” for metadata. If broad format
support is intended, list supported formats and add fixtures and a claim test
for each.

## Minor findings

### F-2-7 — Minor: the ready-demo promise is absent from `claims.json`

**Exact quote / location:** landing: “Opens a ready C-major practice set.”;
README: “The demo includes a local C-major groove and four recent notes.”

**Why this fails:** The behavior works and an untagged regression checks it,
but the live promise has no registry entry. Verifiers following only
`claims.json` do not run that proof.

**Concrete fix:** Add `demo-ready` to `claims.json`; tag the existing direct
query demo test `@claim:demo-ready`; assert the groove is playable and exactly
four named sample notes are visible on entry.

### F-2-8 — Minor: continuous playalong is an unlisted compound claim

**Exact quote / location:** landing: “Use MIDI or the screen keys while the
audio continues.”; README: “Play a MIDI keyboard beside a backing track…” and
“try notes without stopping the music.”

**Why this fails:** Separate tests cover audio, MIDI, and keys, but none starts
audio, plays notes, and confirms playback continues. That combined behavior is
the job-to-be-done.

**Concrete fix:** Add a `playalong-continuity` claim. Start the sample, trigger
screen, computer, and synthetic MIDI notes, then assert note output changes and
`audio.currentTime` continues increasing without a pause event.

### F-2-9 — Minor: decorative section codes carry no information

**Exact quote / location:** landing labels “01 / PLAYALONG”, “02 / SIGNAL
PATH”, and “03 / BOUNDARIES”.

**Why this fails:** “Signal path” is a metaphor here, while the numbered labels
do not help a first-time visitor find or use a section. They conflict with the
plain-words rule against decorative labels and invented lore.

**Concrete fix:** Delete the three labels. The descriptive section headings
should carry the outline.

### F-2-10 — Minor: the workspace heading does not name the section

**Exact quote / location:** landing h2: “Keep the track moving”.

**Why this fails:** In a list of headings, this is an instruction or slogan,
not the name of the product workspace.

**Concrete fix:** Rewrite it as “Play notes with a backing track”.

### F-2-11 — Minor: the how-it-works headings are vague without their paragraphs

**Exact quote / location:** “Choose the context”, “Play without stopping”, and
“Notice what changed”.

**Why this fails:** “Context” is abstract, and the other headings omit what is
being played or noticed. A screen-reader heading list does not explain the
steps.

**Concrete fix:** Use “Choose a key and audio file”, “Play notes while audio
continues”, and “See where each note fits”.

### F-2-12 — Minor: beginner-facing controls expose unexplained terms

**Exact quote / location:** landing controls “Tempo  BPM”, “One-octave note
map”, “Export JSON”, “Import JSON”; README also says “Sidecar JSON”.

**Why this fails:** BPM, octave, and JSON are not explained for a beginning
player. “JSON” and “Sidecar JSON” also use two names for the same backup.

**Concrete fix:** Use “Tempo (beats per minute)”, “Notes from C to C”, “Export
backup”, and “Import backup”. Mention the `.json` extension only in developer
documentation or a file-picker hint.

### F-2-13 — Minor: README privacy copy uses implementation jargon and adds unregistered detail

**Exact quote / location:** “Saves key, tempo, and recent note history in
browser IndexedDB.”; “There are no accounts, trackers, ads, third-party
scripts, or runtime CDNs.”; “Audio uses a temporary browser URL.”; “Real
practice state uses the `theory-sidecar-v1` IndexedDB database.”

**Why this fails:** “IndexedDB,” “runtime CDN,” “browser URL,” and “state” make
the privacy explanation harder to use. The exact no-ads/runtime-CDN and
temporary-URL assertions are not registered claims.

**Concrete fix:** Use the existing tested terms: “Your key, tempo, and recent
notes stay in this browser. Audio files are not stored. The app makes no
third-party runtime requests.” Put database names in a separate implementation
note, or register and test them if they are a supported contract.

### F-2-14 — Minor: the 404 relies on a music metaphor

**Exact quote / location:** live 404 h1: “This bar is empty”; body: “That page
is not part of the arrangement.”

**Why this fails:** Neither line says “page not found” on first read. The
plain-words rule explicitly rejects mood and metaphor headings.

**Concrete fix:** Use h1 “Page not found” and body “That address does not match
a page in Theory Playalong Sidecar.” Keep the pixel styling as the visual
identity.

### F-2-15 — Minor: the Terms h1 does not identify the page

**Exact quote / location:** live `/terms` h1: “Use this practice tool”.

**Why this fails:** It sounds like an action prompt, not the heading for legal
terms. It makes less sense than the browser title when heard out of context.

**Concrete fix:** Use “Terms for Theory Playalong Sidecar”.

### F-2-16 — Minor: secondary page shells are incomplete and inconsistent

**Exact location:** live `/offline.html` has no meta description, canonical,
Open Graph/Twitter metadata, favicon, header, footer, Privacy link, or Terms
link. The static 404 footer omits the version/build id, and its Sociobot link
does not identify itself as external.

**Why this fails:** The site-structure contract requires route metadata and a
consistent header/footer on every page. These two fallback pages lose that
orientation and legal navigation.

**Concrete fix:** Give the offline document the same metadata and shell as the
other routes. Add the current build id and an external-site label to the 404
footer. Add browser assertions over both static documents.

### F-2-17 — Minor: the displayed build/version identifiers disagree

**Exact location:** live footer and `src/main.ts` show `v1.0.2`;
`package.json` is `1.0.1`; `manifest.webmanifest` starts at `/?v=1.0.1`.

**Why this fails:** The required footer build id cannot be traced to the
package or manifest version, so a visitor and maintainer cannot identify one
release consistently.

**Concrete fix:** Derive one version/build id during the build and use it in
the footer, package release, manifest start URL (if a version query is needed),
and handoff.

### F-2-18 — Minor: internal copy/design evidence is inaccurate

**Exact location:** `.factory/copy-audit.md` records the 17-word sentence “For
beginning keyboard players who want to see why each note fits while the music
keeps moving.” as 16 words. `.factory/design.md` says computer keys “A–J” while
the live UI, README, and implementation use A–K.

**Why this fails:** The files presented as the proof of copy simplicity and the
visual source of truth disagree with the shipped product.

**Concrete fix:** Correct the count to 17 and the design interaction range to
A–K, then add a small copy-audit check so recorded counts are generated from
the current strings.

## Copy audit

Method: whitespace-separated words; hyphenated terms count as one. The landing
table includes every visible initial prose sentence, heading, image alt, and
section label. State readouts and controls are listed separately. No sentence
exceeds 22 words and no banned marketing adjective appears.

### Landing page

| Words | Exact copy | Result |
| ---: | --- | --- |
| 6 | See each note in the key. | Pass |
| 6 | Play notes against any backing track | F-2-6 |
| 17 | For beginning keyboard players who want to see why each note fits while the music keeps moving. | Pass |
| 6 | Opens a ready C-major practice set. | F-2-7 |
| 3 | Free to use. | Pass |
| 5 | Audio stays on your device. | Pass |
| 6 | Works offline after your first visit. | Pass |
| 11 | A pixel keyboard sends glowing notes into a twelve-note harmony wheel. | Pass (image alt) |
| 3 | Play a note. | Pass |
| 6 | See its place in the key. | Pass |
| 3 | 01 / PLAYALONG | F-2-9 |
| 4 | Keep the track moving | F-2-10 |
| 2 | Backing track | Pass |
| 4 | Note in the key | Pass |
| 3 | No MIDI keyboard? | Pass |
| 6 | Use the screen keys or A–K. | Pass |
| 2 | LIVE NOTE | Pass |
| 7 | Play a note to see its place. | Pass |
| 4 | Chords that include it | Pass |
| 6 | Chord names appear after you play. | Pass |
| 3 | One-octave note map | F-2-12 |
| 15 | Computer keys: A W S E D F T G Y H U J K | Pass |
| 2 | Recent notes | Pass |
| 5 | Played notes will appear here. | Pass |
| 4 | 02 / SIGNAL PATH | F-2-9 |
| 3 | How it works | Pass |
| 3 | Choose the context | F-2-11 |
| 9 | Pick a key, then load your own audio file. | Pass |
| 3 | Play without stopping | F-2-11 |
| 10 | Use MIDI or the screen keys while the audio continues. | F-2-8, F-2-11 |
| 3 | Notice what changed | F-2-11 |
| 12 | See the note number in the key, matching chords, and recent notes. | Pass |
| 3 | 03 / BOUNDARIES | F-2-9 |
| 7 | What this practice tool does not do | Pass |
| 9 | Your settings and note history stay in this browser. | F-2-4 |
| 5 | Audio files are not stored. | Pass |
| 3 | Theory Playalong Sidecar | Pass |
| 8 | See each note inside the key you choose. | Pass |

Unique landing actions and controls: **Try it with sample data** (5), **Choose
an audio file** (4), **Connect MIDI** (2), **Clear history** (2), **Export CSV**
(2), **Export JSON** (2), and **Import JSON** (2). All use result-naming verbs;
the JSON pair is flagged only for jargon and inconsistent naming. The piano
buttons expose accessible names such as **Play C** (2).

Conditional landing/demo sentences are also under the cap: “MIDI is not
available here.” (5); “Use the screen keys or A–K.” (6); “Connect a MIDI
keyboard, then press Connect MIDI again.” (9); “Play your keyboard.” (3);
“Notes will appear below.” (4); “MIDI access was blocked.” (4); “Allow it in
browser settings, then try again.” (8); “Saved settings could not load.” (5);
“You can still play.” (4); “Changes could not be saved.” (5); “Your browser may
block storage.” (5); “The sample could not start.” (5); “Press play in the
audio controls.” (6); “That JSON file did not contain note history.” (8);
“Choose an exported Sidecar file.” (5); “No matching three-note chord includes
this note.” (7); “Note history imported.” (3); “Note history cleared.” (3);
“You are back online.” (4); “You are offline.” (3); “The loaded sidecar still
works.” (5, F-1-5); “An update is ready.” (4); “Reload to use it.” (4); and
“Offline setup could not finish.” (5); “Try reloading.” (2).

### README

| Words | Exact copy | Result |
| ---: | --- | --- |
| 3 | Theory Playalong Sidecar | Pass (title) |
| 17 | Play a MIDI keyboard beside a backing track and see each note inside the key you choose. | F-2-8 |
| 14 | It is for beginning instrumentalists who want to try notes without stopping the music. | F-2-8 |
| 16 | It shows each note’s number in the key, matching chords, an eight-beat marker, and recent notes. | Pass |
| 11 | Try the isolated sample at `?demo=1` or `/demo`, or at `https://theory-playalong-sidecar.sociobot.in/?demo=1`. | Pass |
| 11 | The demo includes a local C-major groove and four recent notes. | F-2-7 |
| 8 | It does not write to real practice data. | Pass |
| 3 | What it does | Pass (heading) |
| 8 | Reads note-on messages from a connected MIDI keyboard. | Pass |
| 11 | Accepts a local audio file and does not store the file. | Pass |
| 10 | Saves key, tempo, and recent note history in browser IndexedDB. | F-2-4, F-2-13 |
| 11 | Exports note history as CSV or JSON and imports Sidecar JSON. | F-2-12 |
| 7 | Works offline after the first online visit. | Pass |
| 8 | Runs free, without an account or payment gate. | Pass |
| 9 | Web MIDI support depends on the browser and device. | Pass (compatibility limit) |
| 12 | The screen keys and the computer keys A–K work without MIDI hardware. | F-2-5 |
| 2 | Run locally | Pass (heading) |
| 6 | Requirements: Node.js 20 or newer. | Pass (developer requirement) |
| 2 | Open `http://localhost:5173`. | Pass |
| 6 | For the ready sandbox, open `http://localhost:5173/?demo=1`. | Pass |
| 3 | Test and build | Pass (heading) |
| 17 | `npm test` builds the production site and runs the Playwright claim, accessibility, routing, mobile, and offline checks. | Pass; verified |
| 8 | The exact deploy command is `npm run build`. | Pass; verified |
| 10 | Static output lands in `dist/`, with `dist/index.html` at its root. | Pass; verified |
| 3 | Privacy and data | Pass (heading) |
| 11 | There are no accounts, trackers, ads, third-party scripts, or runtime CDNs. | F-2-13 |
| 6 | Audio uses a temporary browser URL. | F-2-13 |
| 6 | MIDI messages stay inside the page. | F-2-3 |
| 8 | Real practice state uses the `theory-sidecar-v1` IndexedDB database. | F-2-13 |
| 5 | Demo state stays in memory. | Pass |
| 7 | Read the in-app privacy page and terms. | Pass |
| 2 | Project notes | Pass (heading) |
| 3 | Product brief: `.factory/brief.json` | Pass |
| 6 | Visual system and image provenance: `.factory/design.md` | Pass |
| 3 | Demo contract: `.factory/demo.md` | Pass |
| 3 | Tested claims: `.factory/claims.json` | Pass |
| 2 | Handoff: `.factory/handoff.md` | Pass |
| 2 | MIT licensed. | Pass |
| 4 | Built by Param Factory. | Pass |

## Demo and sandbox verification

- One click from the hero reached `/?demo=1` and immediately showed “Try notes
  in C major,” a ready sample groove, and C, E, F-sharp, and G history rows.
- The persistent banner said “Demo — sample data, nothing is saved” and exposed
  **Reset demo** and **Start for real**.
- A screen note changed the demo history from four rows to five. Reset returned
  it to four.
- Before entering demo, one real note was saved. After demo interaction, reset,
  and **Start for real**, that real history still contained exactly one note.
- The live request log contained only the product origin and product-origin
  `blob:` URLs. No third-party request occurred.
- The declared local privacy test found no demo IndexedDB database or
  localStorage writes. The stronger user-audio/MIDI coverage gap is F-2-3.

The demo gate itself passes.

## Claims verification

Each exact command in `.factory/claims.json` was run separately after `npm ci`
from the clean base checkout:

| Claim id | Command result | Contract result |
| --- | --- | --- |
| `harmony-context` | Pass | **Incomplete — F-2-1** |
| `midi-input` | Pass | Pass |
| `local-audio` | Pass | **Incomplete — F-2-3** |
| `beat-marker` | Pass | **Incomplete — F-2-2** |
| `csv-export` | Pass | Pass; header plus one row per visible demo record |
| `history-portability` | Pass | Pass; four rows exported and imported |
| `local-history` | Pass | **Incomplete — F-2-4** |
| `offline-reload` | Pass | Pass; cached demo reloaded and accepted a note offline |
| `free-use` | Pass | Pass; demo opened without credentials or payment gate |
| `keyboard-fallback` | Pass | **Incomplete — F-2-5** |

The separate demo regression passes but is missing from the registry (F-2-7).
The continuity promise has no combined test (F-2-8). There is no process-level
test failure; the blocking result comes from claims that remain observably
untested despite green commands.

## Structure, accessibility, and quality gates

- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown path returns a
  designed HTTP 404. `robots.txt`, `sitemap.xml`, manifest, favicon,
  apple-touch icon, and social image return 200.
- Normal routes have one h1, a main landmark, `lang="en"`, route-specific title,
  description, canonical, Open Graph, and Twitter metadata. Push navigation and
  Back both focus and announce the restored h1.
- All discovered product links return 200, the unknown-route test returns 404,
  explicit mail links are valid link types, and `https://sociobot.in/` returns
  200.
- The supplied `verify-url.sh` passes: title present, `lang="en"`, one h1, main
  present, no missing alt, no unlabeled button, and no console errors.
- Live Axe scans at 390 × 844 and 1440 × 900 report zero violations. Mobile has
  no horizontal document overflow. Reduced-motion coverage passes locally.
- `npm test` passes 15/15; `npm run lint`, `npm run typecheck`, and `npm run
  build` pass. `dist/` is produced. Initial JavaScript is 22.61 kB raw / 8.47
  kB gzip.
- The site uses only same-origin runtime resources and system fonts. The
  original pixel/demoscene artwork and asymmetric console layout match the
  recorded design and are visually distinct.
- F-2-14 through F-2-17 record the remaining 404/offline/terms/version structure
  defects.

## Earlier-finding verification

| Earlier id | Live and code result |
| --- | --- |
| F-1-1 | Fixed: root is `Theory Playalong Sidecar — play with a backing track`; live unknown route is `Theory Playalong Sidecar — page not found`. |
| F-1-2 | Fixed: Demo, Privacy, and Terms update title, description, Open Graph, Twitter, and canonical values. |
| F-1-3 | Fixed: the cited “Live harmony,” “scale degree,” “diatonic,” and “A sidecar, not a teacher” wording is absent. New heading issues have F-2 ids. |
| F-1-4 | Fixed for the three cited promises: “no score,” the negative capability list, and artwork-provenance footer claim are absent. New unlisted claims have F-2 ids. |
| F-1-5 | **Not fully fixed:** main metadata and accessible wordmark use the full name, but the live offline document and offline toast retain “Theory Sidecar” / “sidecar”. Reopened above. |

`.factory/polish-1.md` and the prior handoff mark all five closed. The direct
live/code checks above confirm four closures and disprove the complete closure
of F-1-5.

## Missed leverage

No additional feature finding is warranted. The brief's job is deterministic
note/key/chord feedback, so an AI action would add cost and privacy surface
without improving the core task. CSV export plus JSON import/export already
cover portability. Account sync would conflict with the brief's local-first,
free practice tool unless explicitly requested. The meaningful missing proof
is continuous input while audio plays (F-2-8), not an AI feature.

## What would make this perfect

Close every finding above. In particular, complete each tagged claim test so it
proves its entire registered sentence, register the demo and continuous
playalong promises, replace “any,” remove decorative/vague copy, and bring the
offline/404 shells and version identifiers into the same contract as the main
routes. Then repeat the cold mobile/desktop review, all exact claim commands,
the live request/storage checks, link crawl, `verify-url.sh`, and Axe. A perfect
round has no reopened history item, no partial claim proof, and no copy flag.
