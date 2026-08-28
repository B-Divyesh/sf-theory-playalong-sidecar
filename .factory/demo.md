# Demo sandbox

- URL: `https://theory-playalong-sidecar.sociobot.in/demo` (local:
  `http://127.0.0.1:4173/demo`)
- Sample: an eight-second procedural C-major groove, C-major context, 96 BPM,
  and four recent notes: C, E, F-sharp, and G.
- Interaction: press the on-screen keys or A–K. The same note-analysis path is
  used for demo, pointer, computer keyboard, and MIDI input.
- Reset: select **Reset demo** in the persistent demo banner.
- Leave: select **Start for real**. Demo state is discarded.
- Isolation: demo state stays in memory. It never opens the real
  `theory-sidecar-v1` IndexedDB database or writes to localStorage.
- Offline: the sample groove is generated in the browser. It needs no network
  and remains available when the cached demo reloads offline.
