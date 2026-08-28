# Adversarial first-read review 1

**Product:** Theory Playalong Sidecar

**URL checked:** <https://theory-playalong-sidecar.sociobot.in>

**Date:** 2026-08-28
**Verdict:** **FAIL** — five minor findings remain. There are no blocking demo, claim-test, privacy-sandbox, or routing failures.

## First 30 seconds

Cold desktop and 390 px mobile contexts both answered the three first-read
questions before scrolling:

- **What it does:** It lets a player play notes over a backing track and shows
  where each note sits in the selected key.
- **Who it is for:** “For beginning keyboard players…”
- **What to click first:** **Try it with sample data**; the adjacent text says
  “Opens a ready C-major practice set.”

The mobile hero is readable, the action is visible in the first viewport, and
the visual treatment is a distinct pixel/demoscene console rather than a
generic SaaS layout. This first-screen gate passes.

## Findings

### F-1-1 — Minor: root and 404 titles do not use the required product-title pattern

**Location / exact text:** root `<title>` is “Play notes against a key —
Theory Sidecar”; host 404 `<title>` is “Not found — Theory Sidecar”.

**Why this fails:** Both reverse the required `Product name — what it does`
pattern and abbreviate the product name. A browser tab, search result, or
saved page cannot consistently identify the product as Theory Playalong
Sidecar.

**Concrete fix:** Use `Theory Playalong Sidecar — play with a backing track`
on `/` and `Theory Playalong Sidecar — page not found` on the host 404. Keep
the existing route-specific titles for Demo, Privacy, and Terms.

### F-1-2 — Minor: Open Graph and Twitter metadata stay on the landing copy after route changes

**Location / exact text:** on live `/demo`, `/privacy`, and `/terms`, the
document title and description change, but `og:title` remains “Play notes
against a key — Theory Sidecar”. The Twitter title and descriptions are also
the root values.

**Why this fails:** A shared Demo, Privacy, or Terms URL advertises the wrong
page. This conflicts with the site-structure requirement for route metadata.

**Concrete fix:** Extend `setMetadata()` to update `og:title`,
`og:description`, `twitter:title`, and `twitter:description` from the same
per-route map as `<title>` and the meta description. Give the 404 document its
matching static metadata too.

### F-1-3 — Minor: three landing phrases use unexplained theory/product jargon

**Location / exact text:**

- Hero eyebrow: “Live harmony · no score needed”.
- Workspace text: “See the scale degree, nearby chords, and your note history.”
- Boundary heading: “A sidecar, not a teacher”.

**Why this fails:** “Live harmony,” “scale degree,” and “sidecar” do not say
their meaning in a cold, beginner-facing first read. The README repeats the
same issue in “The sidecar shows the scale degree, matching diatonic chords…”;
“diatonic” is additional unexplained jargon.

**Concrete fix:** Replace the eyebrow with “See each note in the key.” Replace
the workspace line with “See the note number in the key, matching chords, and
recent notes.” Replace the boundary heading with “What this practice tool does
not do.” Rewrite the README sentence as “It shows each note’s number in the
key, matching chords, an eight-beat marker, and recent notes.”

### F-1-4 — Minor: landing claims have no corresponding claims entry

**Location / exact text:**

- “Live harmony · no score needed”.
- “It does not grade notes, import scores, transcribe music, or generate
  accompaniment.”
- Footer: “Generated artwork disclosed in the design notes.”

**Why this fails:** These are factual visitor-facing promises, but none has an
entry in `.factory/claims.json`. The claims contract requires an observable
test for every such promise or removal of the promise. The negative capability
list cannot be verified by the current claim suite.

**Concrete fix:** Prefer removing the first two promises in favour of the
backed harmony-context copy described in F-1-3, and remove the footer
provenance assertion from the live page (the required provenance remains in
`.factory/design.md`). If any promise remains, add a specifically named claim
and a clean-demo observable test.

### F-1-5 — Minor: landing/document terminology alternates between the full and abbreviated product name

**Location / exact text:** the header and root metadata say “THEORY SIDECAR” /
“Theory Sidecar”; the footer, README heading, and product contract say “Theory
Playalong Sidecar”.

**Why this fails:** A first-time visitor sees two names for one product. This
also contributes to the metadata error in F-1-1.

**Concrete fix:** Use “Theory Playalong Sidecar” in metadata and full-text
product references. If a compact wordmark is retained for the small header,
give it the accessible name “Theory Playalong Sidecar home” and avoid using
the shortened form elsewhere as the product name.

## Copy audit

Word counts treat a hyphenated or en-dash term as one word. This audit includes
all prose sentences and headings on the landing page and README; it excludes
state readouts, note names, menu labels, URLs/commands standing alone, and
numbered section codes. No audited sentence exceeds 22 words.

### Landing page

| Words | Copy |
| ---: | --- |
| 5 | Live harmony · no score needed *(F-1-3, F-1-4)* |
| 6 | Play notes against any backing track |
| 17 | For beginning keyboard players who want to see why each note fits while the music keeps moving. |
| 6 | Opens a ready C-major practice set. |
| 3 | Free to use. |
| 5 | Audio stays on your device. |
| 6 | Works offline after your first visit. |
| 11 | A pixel keyboard sends glowing notes into a twelve-note harmony wheel. *(image alt)* |
| 3 | Play a note. |
| 6 | See its place in the key. |
| 4 | Keep the track moving |
| 3 | No MIDI keyboard? |
| 6 | Use the screen keys or A–K. |
| 7 | Play a note to see its place. |
| 6 | Chord names appear after you play. |
| 15 | Computer keys: A W S E D F T G Y H U J K |
| 5 | Played notes will appear here. |
| 3 | How it works |
| 3 | Choose the context |
| 9 | Pick a key, then load your own audio file. |
| 3 | Play without stopping |
| 10 | Use MIDI or the screen keys while the audio continues. |
| 3 | Notice what changed |
| 10 | See the scale degree, nearby chords, and your note history. *(F-1-3)* |
| 5 | A sidecar, not a teacher *(F-1-3)* |
| 12 | It does not grade notes, import scores, transcribe music, or generate accompaniment. *(F-1-4)* |
| 9 | Your settings and note history stay in this browser. |
| 5 | Audio files are not stored. |
| 8 | See each note inside the key you choose. |
| 7 | Generated artwork disclosed in the design notes. *(F-1-4)* |

Buttons are result-naming verbs where applicable: **Try it with sample data**,
**Choose an audio file**, **Connect MIDI**, **Clear history**, **Export CSV**,
**Export JSON**, and **Import JSON**. Navigation labels are links rather than
pretending to be result actions.

### README

| Words | Copy |
| ---: | --- |
| 17 | Play a MIDI keyboard beside a backing track and see each note inside the key you choose. |
| 13 | It is for beginning instrumentalists who want harmony context without stopping the music. |
| 17 | The sidecar shows the scale degree, matching diatonic chords, an eight-beat marker, and a non-judgmental note history. *(F-1-3: jargon)* |
| 13 | Try the isolated sample at `/demo` or at `https://theory-playalong-sidecar.sociobot.in/demo`. |
| 11 | The demo includes a local C-major groove and four recent notes. |
| 8 | It does not write to real practice data. |
| 8 | Reads note-on messages from a connected MIDI keyboard. |
| 11 | Accepts a local audio file and does not store the file. |
| 10 | Saves key, tempo, and recent note history in browser IndexedDB. |
| 11 | Exports note history as CSV or JSON and imports Sidecar JSON. |
| 7 | Works offline after the first online visit. |
| 8 | Runs free, without an account or payment gate. |
| 9 | Web MIDI support depends on the browser and device. |
| 12 | The screen keys and the computer keys A–K work without MIDI hardware. |
| 6 | Requirements: Node.js 20 or newer. |
| 4 | Open `http://localhost:5173`. |
| 9 | For the ready sandbox, open `http://localhost:5173/demo`. |
| 17 | `npm test` builds the production site and runs the Playwright claim, accessibility, routing, mobile, and offline checks. |
| 8 | The exact deploy command is `npm run build`. |
| 12 | Static output lands in `dist/`, with `dist/index.html` at its root. |
| 11 | There are no accounts, trackers, ads, third-party scripts, or runtime CDNs. |
| 6 | Audio uses a temporary browser URL. |
| 6 | MIDI messages stay inside the page. |
| 8 | Real practice state uses the `theory-sidecar-v1` IndexedDB database. |
| 5 | Demo state stays in memory. |
| 7 | Read the in-app privacy page and terms. |
| 2 | MIT licensed. |
| 4 | Built by Param Factory. |

## Demo and sandbox verification

- The first landing action reached `/demo` in one click. The first screen
  immediately showed a C-major sample groove and four realistic recent notes.
- The persistent banner said “Demo — sample data, nothing is saved” and
  included **Reset demo** and **Start for real**.
- In a fresh direct `/demo` context, `localStorage` was empty and IndexedDB had
  no databases. Only product-origin resources and generated `blob:` audio were
  requested.
- Pressing A changed history from four notes to five; **Reset demo** restored
  exactly four notes. The demo isolation and reset behavior pass.
- The demo's sample groove is generated locally, so no remote sample/audio
  resource was observed. The local claim test additionally verified the
  offline reload path.

## Claims and local quality gates

A fresh clone at `47c64afbeccdecce8a45b2f934e5d66712e89352` was installed with
`npm ci`. Each exact command in `.factory/claims.json` passed separately:

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

`npm test` passed 14/14, `npm run lint` passed, and `npm run build` produced
`dist/`. The declared privacy test records demo requests and storage; the
independent direct demo check above agreed with it. There were no untested
declared claims and no failing declared claim test.

## Structure, accessibility, and history checks

- Root, Demo, Privacy, and Terms returned 200. The designed unknown route
  returned HTTP 404; `robots.txt`, `sitemap.xml`, and the manifest returned
  200. All linked internal pages and `https://sociobot.in/` returned 200;
  `mailto:` links are explicit mail links.
- The live app has one h1 per normal route, a main landmark, lang="en",
  canonical URLs, descriptions, SVG/apple icons, a manifest, and an original
  product-specific visual system. Its CSP permits only the app origin plus the
  required local data/blob media forms. No console errors or third-party
  runtime requests appeared in cold desktop or mobile checks.
- The clean-suite accessibility coverage passed, including mobile width,
  keyboard interaction, focus, reduced motion, route focus, and Axe serious /
  critical checks. The test suite is the repository's available Axe runner;
  `verify-url.sh` is not present.
- No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. Earlier
  verification reports identified beat-marker flakiness, asset caching, and
  404 behavior; the fresh exact claim test, immutable-asset regression, and
  live 404 check confirm those items are fixed rather than merely marked
  fixed.
- The brief does not imply a necessary AI step: note/key analysis is local and
  deterministic. CSV/JSON import/export is already present, so no missed AI,
  import/export, or sync feature was identified.

## What would make this perfect

Resolve F-1-1 through F-1-5, then rerun the exact claim commands and cold
route-metadata checks. At that point the product would retain its clear,
one-click, private demo while presenting one unambiguous name, plain beginner
language, and accurate share metadata.
