# Copy audit — polish round 3

Method: counts are whitespace-separated words; hyphenated words count once.
`npm run copycheck` recalculates every recorded row and rejects counts over 22
or banned marketing terms. Browser tests check the current first-screen,
workspace, and terminology strings against this record.

## Landing page

| Words | Copy | Result |
| ---: | --- | --- |
| 6 | See each note in the key. | Pass |
| 6 | Play notes with your backing track | Pass |
| 17 | For beginning keyboard players who want to see why each note fits while the music keeps moving. | Pass |
| 6 | Opens a ready C-major practice set. | Pass |
| 3 | Free to use. | Pass |
| 5 | Audio stays on your device. | Pass |
| 6 | Works offline after your first visit. | Pass |
| 11 | A pixel keyboard sends glowing notes into a twelve-note harmony wheel. | Pass |
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
| 2 | Note history | Pass |
| 8 | Played notes will appear in your note history. | Pass |
| 3 | How it works | Pass |
| 6 | Choose a key and audio file | Pass |
| 9 | Pick a key, then load your own audio file. | Pass |
| 5 | Play notes while audio continues | Pass |
| 10 | Use MIDI or the screen keys while the audio continues. | Pass |
| 5 | See where each note fits | Pass |
| 12 | See the note number in the key, matching chords, and note history. | Pass |
| 3 | Your practice data | Pass |
| 9 | Your settings and note history stay in this browser. | Pass |
| 5 | Audio files are not stored. | Pass |
| 8 | See each note inside the key you choose. | Pass |

Landing actions are **Try it with sample data**, **Choose an audio file**,
**Connect MIDI**, **Clear history**, **Export CSV**, **Export backup**,
**Import backup**, and **Play [note]**. Each action uses a verb and names its
result. The first screen reads aloud in one breath: play notes with your
backing track; try the ready C-major practice set.

## Demo and status copy

| Words | Copy | Result |
| ---: | --- | --- |
| 18 | The sample groove and four notes are ready. Press a screen key or use A–K on your keyboard. | Pass |
| 7 | Demo — sample data, nothing is saved | Pass |
| 5 | MIDI is not available here. | Pass |
| 6 | Use the screen keys or A–K. | Pass |
| 9 | Connect a MIDI keyboard, then press Connect MIDI again. | Pass |
| 5 | The sample could not start. | Pass |
| 6 | Press play in the audio controls. | Pass |
| 8 | That backup file did not contain note history. | Pass |
| 5 | Choose an exported backup file. | Pass |
| 3 | Note history imported. | Pass |
| 3 | Note history cleared. | Pass |
| 3 | You are offline. | Pass |
| 5 | The practice tool still works. | Pass |

## README

| Words | Copy | Result |
| ---: | --- | --- |
| 3 | Theory Playalong Sidecar | Pass |
| 18 | Play a MIDI keyboard with a local backing track and see each note inside the key you choose. | Pass |
| 13 | It is for beginning instrumentalists who want to play notes while audio continues. | Pass |
| 16 | It shows each note’s number in the key, matching chords, an eight-beat marker, and note history. | Pass |
| 10 | Try the demo at `?demo=1` or `/demo`, or at <https://theory-playalong-sidecar.sociobot.in/?demo=1>. | Pass |
| 14 | The demo includes a local C-major groove and four notes in its note history. | Pass |
| 8 | It does not write to real practice data. | Pass |
| 3 | What it does | Pass |
| 9 | Reads notes you play on a connected MIDI keyboard. | Pass |
| 11 | Accepts a local audio file and does not store the file. | Pass |
| 11 | Keeps your key, scale, tempo, and note history in this browser. | Pass |
| 13 | Exports note history as CSV or a backup file, and imports that backup. | Pass |
| 7 | Works offline after the first online visit. | Pass |
| 8 | Runs free, without an account or payment gate. | Pass |
| 9 | MIDI keyboard support depends on your browser and device. | Pass |
| 12 | The screen keys and the computer keys A–K work without MIDI hardware. | Pass |
| 2 | Run locally | Pass |
| 5 | Requirements: Node.js 20 or newer. | Pass |
| 2 | Open <http://localhost:5173>. | Pass |
| 5 | For the demo, open <http://localhost:5173/?demo=1>. | Pass |
| 3 | Test and build | Pass |
| 17 | `npm test` builds the production site and runs the Playwright claim, accessibility, routing, mobile, and offline checks. | Pass |
| 8 | The exact deploy command is `npm run build`. | Pass |
| 9 | The build writes static files to `dist/`, including `dist/index.html`. | Pass |
| 3 | Privacy and data | Pass |
| 4 | There is no account. | Pass |
| 11 | Your key, scale, tempo, and note history stay in this browser. | Pass |
| 5 | Audio files are not stored. | Pass |
| 8 | The app makes no third-party requests during practice. | Pass |
| 10 | Demo changes stay separate and are discarded when you leave. | Pass |
| 10 | Implementation note: real practice data uses the `theory-sidecar-v1` browser database. | Pass |
| 5 | Demo data stays in memory. | Pass |
| 7 | Read the in-app privacy page and terms. | Pass |
| 2 | Project notes | Pass |
| 3 | Product brief: `.factory/brief.json` | Pass |
| 6 | Visual system and image provenance: `.factory/design.md` | Pass |
| 3 | Demo contract: `.factory/demo.md` | Pass |
| 3 | Tested claims: `.factory/claims.json` | Pass |
| 2 | Handoff: `.factory/handoff.md` | Pass |
| 2 | MIT licensed. | Pass |
| 4 | Built by Param Factory. | Pass |

## Terminology

| Concept | One term |
| --- | --- |
| Imported sound | audio file |
| Tonal selection | key |
| Major or minor collection | scale |
| MIDI device | MIDI keyboard |
| Played-event list | note history |
| Portable saved history | backup |
| Bundled try-out | demo |
| Product name | Theory Playalong Sidecar |

No audited item exceeds 22 words or contains a banned marketing term.
