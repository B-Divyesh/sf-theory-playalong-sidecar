# Theory Playalong Sidecar

Play a MIDI keyboard with a local backing track and see each note inside the key
you choose.

It is for beginning instrumentalists who want to play notes while audio
continues. It shows each note’s number in the key, matching chords, an
eight-beat marker, and note history.

Try the demo at `?demo=1` or `/demo`, or at
<https://theory-playalong-sidecar.sociobot.in/?demo=1>. The demo includes a local
C-major groove and four notes in its note history. It does not write to real
practice data.

## What it does

- Reads notes you play on a connected MIDI keyboard.
- Accepts a local audio file and does not store the file.
- Keeps your key, scale, tempo, and note history in this browser.
- Exports note history as CSV or a backup file, and imports that backup.
- Works offline after the first online visit.
- Runs free, without an account or payment gate.

MIDI keyboard support depends on your browser and device. The screen keys and the
computer keys A–K work without MIDI hardware.

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open <http://localhost:5173>. For the demo, open
<http://localhost:5173/?demo=1>.

## Test and build

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

`npm test` builds the production site and runs the Playwright claim,
accessibility, routing, mobile, and offline checks. The exact deploy command is
`npm run build`. The build writes static files to `dist/`, including
`dist/index.html`.

## Privacy and data

There is no account. Your key, scale, tempo, and note history stay in this
browser. Audio files are not stored. The app makes no third-party requests
during practice. Demo changes stay separate and are discarded when you leave.

Implementation note: real practice data uses the `theory-sidecar-v1` browser
database. Demo data stays in memory.

Read the in-app [privacy page](https://theory-playalong-sidecar.sociobot.in/privacy)
and [terms](https://theory-playalong-sidecar.sociobot.in/terms).

## Project notes

- Product brief: `.factory/brief.json`
- Visual system and image provenance: `.factory/design.md`
- Demo contract: `.factory/demo.md`
- Tested claims: `.factory/claims.json`
- Handoff: `.factory/handoff.md`

MIT licensed. Built by Param Factory.
