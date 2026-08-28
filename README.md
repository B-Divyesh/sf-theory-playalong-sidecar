# Theory Playalong Sidecar

Play a MIDI keyboard beside a backing track and see each note inside the key
you choose.

It is for beginning instrumentalists who want harmony context without stopping
the music. The sidecar shows the scale degree, matching diatonic chords, an
eight-beat marker, and a non-judgmental note history.

Try the isolated sample at `/demo` or at
<https://theory-playalong-sidecar.sociobot.in/demo>. The demo includes a local
C-major groove and four recent notes. It does not write to real practice data.

## What it does

- Reads note-on messages from a connected MIDI keyboard.
- Accepts a local audio file and does not store the file.
- Saves key, tempo, and recent note history in browser IndexedDB.
- Exports note history as CSV or JSON and imports Sidecar JSON.
- Works offline after the first online visit.
- Runs free, without an account or payment gate.

Web MIDI support depends on the browser and device. The screen keys and the
computer keys A–K work without MIDI hardware.

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open <http://localhost:5173>. For the ready sandbox, open
<http://localhost:5173/demo>.

## Test and build

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

`npm test` builds the production site and runs the Playwright claim,
accessibility, routing, mobile, and offline checks. The exact deploy command is
`npm run build`. Static output lands in `dist/`, with `dist/index.html` at its
root.

## Privacy and data

There are no accounts, trackers, ads, third-party scripts, or runtime CDNs.
Audio uses a temporary browser URL. MIDI messages stay inside the page. Real
practice state uses the `theory-sidecar-v1` IndexedDB database. Demo state stays
in memory.

Read the in-app [privacy page](https://theory-playalong-sidecar.sociobot.in/privacy)
and [terms](https://theory-playalong-sidecar.sociobot.in/terms).

## Project notes

- Product brief: `.factory/brief.json`
- Visual system and image provenance: `.factory/design.md`
- Demo contract: `.factory/demo.md`
- Tested claims: `.factory/claims.json`
- Handoff: `.factory/handoff.md`

MIT licensed. Built by Param Factory.
