# Theory Playalong Sidecar — visual thesis

## Direction

**A pocket demoscene harmony console.** The interface borrows the clarity of an
old music tracker without imitating a game HUD. Notes become chunky phosphor
pixels, the beat travels along a fixed step rail, and the keyboard reads like a
small instrument rather than a dashboard chart. This fits exploratory playing:
the visual response is immediate, rhythmic, and never grades the player.

The product is intentionally single-mode and dark. A dark stage keeps the live
note, key, and beat visible beside bright notation software or a video player.

## Tokens

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Background | `--ink` | `#090c16` | Page and black keys |
| Raised surface | `--panel` | `#11182b` | Control deck |
| Recessed surface | `--well` | `#080b13` | History and meters |
| Primary text | `--paper` | `#f4f1dc` | Copy and white keys |
| Muted text | `--mist` | `#aeb7ca` | Supporting copy |
| Accent | `--phosphor` | `#eaff72` | Active note and primary action |
| Accent contrast | `--ink` | `#090c16` | Text on accent |
| Timing | `--cyan` | `#5ee7f2` | Beat and focus ring |
| Outside-key | `--coral` | `#ff8c82` | Exploratory outside-key note |
| Grid | `--grid` | `#2a3552` | Borders and inactive pixels |

All body text combinations meet 4.5:1. State is never color alone: note names,
symbols, and the words “in key” or “outside key” are always present.

## Type

- Display and live data: `ui-monospace, "Cascadia Mono", "SFMono-Regular", Consolas, monospace`.
  Square counters and aligned note names create the tracker character without a
  font download.
- Body and controls: `Inter, ui-sans-serif, system-ui, sans-serif`. This is a
  local system stack, chosen for quick loading and clear small labels.
- Scale: 14, 16, 20, 28, 44, and 64 px. Body text never falls below 16 px.
- Labels use uppercase only for short console readouts, with generous tracking.

## Spacing and shape

- An 8 px base grid, with 4 px used only inside compact readouts.
- Content width: 1184 px. Reading width: 68 characters.
- Panels have clipped 8 px corners via `clip-path`, plus a one-pixel inner line.
- Buttons use square shoulders and a 3 px down-right “pixel shadow”.
- Every pointer target is at least 44 by 44 px.

## Layout rhythm

The landing screen is asymmetric: copy occupies five columns while an original
pixel stage occupies seven. The actual instrument spans the page below it. On a
390 px phone, the stage is reduced to a narrow strip and the controls stack in
playing order: source, key, transport, live note, keyboard, history.

## Interaction grammar

- Primary actions depress by 2 px, like a console key.
- MIDI and audio states appear as fixed-width status readouts.
- The one-octave keyboard supports pointer input and computer keys A–K. A note
  lights from its physical key toward the live-note readout.
- Each played note adds one compact history chip. No score, red cross, or grade
  appears; an outside-key note uses a hollow diamond and plain language.

## Motion policy

The signature motion is a **stepped scan**: the active beat advances through
eight pixels rather than sliding. Interface transitions last 160–220 ms and
use opacity or transform only. Nothing flashes or loops continuously. With
`prefers-reduced-motion: reduce`, all travel becomes an instant state change and
nonessential transitions are removed.

## Original asset plan and provenance

- Hero artwork: a wide, text-free pixel/demoscene illustration of a MIDI
  keyboard feeding luminous note blocks into an abstract harmony orbit. It
  clarifies “play a note, see its context” without depicting capabilities the
  app lacks.
- App icons and interface glyphs: hand-authored SVG and CSS pixels.
- Social preview: composed locally from the generated hero art and product
  colors at 1200×630.

### Prompt sheet

Use case: stylized-concept. Asset: wide landing illustration. Subject: compact
MIDI keyboard at lower left sending three discrete note blocks toward a circular
12-note harmony display. World: 1990s demoscene music tracker rendered as modern
pixel art. Materials: dark navy glass, phosphor-lime pixels, pale cyan timing
ticks, sparse coral accents. Light: crisp screen glow with hard pixel edges.
Composition: landscape, focal action centered, quiet dark space around the
edges, readable at small size. Negative list: people, hands, readable text,
letters, logos, brands, watermark, gradients, photorealism, score notation,
busy background.

Generated with the factory image model (`factory-image`) on 2026-08-28 using
`/opt/fleet/lib/gen-image.sh`. Generated imagery is original to this product.
The final selected source and exact prompt are stored in `assets/src/`.
