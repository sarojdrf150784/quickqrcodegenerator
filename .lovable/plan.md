## Add Border Frames & QR Style Templates

Extend the generator with two new visual customization options: **border/frame styles** around the QR code and **QR design templates** (preset color + style combinations).

### 1. QR Design Templates (presets)

A horizontal scrollable row of preset thumbnails at the top of the customization section. Selecting one applies fg/bg colors and dot style in one click.

Presets:
- **Classic** — black on white
- **Midnight** — white on deep navy
- **Sunset** — orange-red on cream
- **Forest** — dark green on mint
- **Ocean** — deep teal on light blue
- **Mono Dark** — light gray on charcoal
- **Royal** — gold on deep purple
- **Candy** — hot pink on light pink

### 2. Border / Frame Styles

A selector (icon grid) for the frame wrapping the QR code:
- **None** — no border (current behavior)
- **Simple** — solid 1px rounded border
- **Thick** — bold 4px border in fg color
- **Rounded Card** — large radius + shadow
- **Dashed** — dashed border
- **Double** — double-line border
- **Scan Me** — bordered frame with "SCAN ME" label below
- **Corners** — only 4 L-shaped corner brackets

Border color follows the foreground color by default.

### 3. Persistence

Save the chosen `design_preset` (nullable text) and `border_style` (text, default `'none'`) with each QR code so history regeneration restores them. Apply the same border in the PNG download (canvas drawing) and in the history thumbnail/download.

### Technical Details

**Database migration** — add two columns to `qr_codes`:
- `border_style TEXT NOT NULL DEFAULT 'none'`
- `design_preset TEXT` (nullable)

**New files**
- `src/lib/qrPresets.ts` — exported `DESIGN_PRESETS` and `BORDER_STYLES` arrays with id, label, and style config.
- `src/components/QRStylePicker.tsx` — renders the preset row + border picker, calls back with selected values.
- `src/components/QRFrame.tsx` — wrapper component that renders the chosen border around its `QRCodeSVG` child (handles "Scan Me" label and corner brackets via absolutely-positioned divs).

**Edited files**
- `src/components/QRGenerator.tsx` — add `borderStyle` / `designPreset` state, mount `QRStylePicker`, wrap preview in `QRFrame`, include both fields in `saveMutation` and `handleRegenerate`, and extend `handleDownload` to draw the border onto the canvas before exporting.
- `src/components/QRHistory.tsx` — render preview thumbnails inside `QRFrame` and include border when downloading saved codes.

No business-logic changes beyond the new fields; styles use existing semantic tokens from `index.css`.
