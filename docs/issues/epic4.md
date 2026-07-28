# Epic 4 — Drawing Engine (shared util)

> **Blocks:** Kanji Board (#040), Kana Modal drawing (#033), Check accuracy (#023). No other module uses this engine.

---

## Issue #022 — `KanjiDrawingCanvas` RN component (SVG + gesture-handler)
**Epic:** drawing | **Type:** port | **Priority:** P1 | **Size:** L
**Hard deps:** #004 (reanimated, svg, gesture-handler, svg-path-properties installed) | **Soft deps:** #016 (theme tokens) | **Stream:** C | **Assignee:** ____

### Goal
Port the web's `TracingCanvas` class (`web/src/lib/canvas.ts`) into a reusable React Native component: an SVG canvas showing animated guide strokes, a user drawing layer via pan gesture, and controls (brush size slider, color dots, animate, clear). Accepts external `onCheck` callback.

### Context for the AI agent
- Web uses `<canvas>` + `Path2D` (not possible in RN). The replacement:
  1. **Guide layer**: `react-native-svg` `<Svg viewBox="0 0 109 109">` containing notebook grid lines (diagonal crosses like web), plus one `<Path>` per guide stroke.
  2. **Stroke animation**: pre-compute `len = svgPathProperties(d).length` (using `svg-path-properties` lib from #004), then animate `strokeDashoffset` from `len → 0` via reanimated `useAnimatedProps`. Use `withSequence` for sequential strokes (web plays all at once on animate; RN can use `withDelay` per path or `withSequence` to chain).
  3. **User drawing**: `react-native-gesture-handler` `Pan` gesture. On `onStart` → append a new empty polyline to a ref. On `onEnd` → finalize polyline. On `onChange` → accumulate `{x,y}` points in viewBox 109 space.
     - **Coordinate mapping**: measure the SVG container via `onLayout` → store `layoutWidth`, `layoutHeight`, `layoutLeft`, `layoutTop` (via `measure`). For each gesture event, transform: `x = (eventX - layoutLeft) / layoutWidth * 109` and `y = (eventY - layoutTop) / layoutHeight * 109`. Push into current polyline ref.
     - User strokes rendered as `<Path d={polyline.points.map((p,i)=>`${i===0?'M':'L'} ${p.x},${p.y}`).join(' ')} stroke={currentColor} strokeWidth={…}/>`.
  4. **Clear**: empty user polyline state.
  5. **Controls**: brush size slider (2–15, scales strokeWidth), color dots (tap set `currentColor`), animate button (triggers stroke animation), clear button, check button (calls `props.onCheck(userStrokes)`).

### Required deliverables
1. `mobile/src/components/drawing/KanjiDrawingCanvas.tsx` — the full component.
   - Props: `strokePaths: string[]; initialColor?: string; initialBrushSize?: number; onCheck?: (userStrokes: Point[][]) => void;`.
   - Exposes ref: `canvasRef.current = { getStrokes: () => userStrokes, clear: () => {}, animate: () => {} }` (optional — or just use state).
2. `mobile/src/components/drawing/ColorPalette.tsx` — re-exports color dots selecting `currentColor`.
3. `mobile/src/components/drawing/BrushSlider.tsx` — slider from 2 to 15.

### Technical notes
- Measure the SVG `ref` with `useRef` + `onLayout` — `event.nativeEvent.layout` gives `width` and `height`.
- `react-native-reanimated` version: 3.x+; import `Animated` from `react-native-reanimated`, create animated component: `const RePath = Animated.createAnimatedComponent(Path)`.
- Polyline path `d` attribute: use `.map` for each point; avoid trailing `L`.
- Pan gesture must `hitSlop` beyond the drawing area and `simultaneousHandlers` on Android.
- The `react-native-reanimated/plugin` must be in `babel.config.js` (already since SDK 55 → enabled by `expo-router` preset).
- `svg-path-properties` is synchronous and pure-JS; `svgPathProperties(d)` returns `{..., length, getPointAtLength(): {x,y}}`.

### Validation / acceptance
- The component renders guide strokes (preview kanji "一" with its `d` string).
- Slide brush size slider: stroke changes width accordingly (visual).
- Tap a color dot: next stroke drawn in that color.
- `Animate` button: strokes draw left to right in sequence.
- `Clear` button: user strokes disappear.
- Drawing via touch and mouse (simulator) works smoothly without skipping, and lines appear under the finger.

### Out of scope
- `onCheck` callback wiring ↑ next issue.
- Integration with KanjiBoard or KanaModal (handled by #040, #033).

### Linked files
- read: `web/src/lib/canvas.ts`
- new: `mobile/src/components/drawing/KanjiDrawingCanvas.tsx`, `mobile/src/components/drawing/ColorPalette.tsx`, `mobile/src/components/drawing/BrushSlider.tsx`

---

## Issue #023 — Drawing accuracy `checkDrawing()` util
**Epic:** drawing | **Type:** port | **Priority:** P1 | **Size:** M
**Hard deps:** #022, `svg-path-properties` (installed from #004) | **Soft deps:** none | **Stream:** C | **Assignee:** ____

### Goal
Implement a pure TS function `checkDrawing(guidePaths, userStrokes): number` outputting 0–100, measuring the overlap of user strokes with the guide path, mirroring the pixel-overlap logic of `web/src/lib/canvas.ts:171-213` but adapted to RN without Canvas.

### Context for the AI agent
- Algorithm:
  1. Reference: for each guidePath, sample `samplesPerPath = 200` points using `svg-path-properties` → `getPointAtLength(i * totalLength / 200)`.
  2. For each point `(x, y)` in viewBox 109, map to a 64×64 grid cell = `(floor(x * 64 / 109), floor(y * 64 / 109))`. Set those cells `refInked` = true.
  3. User strokes: for each polyline `[p0, p1, p2, ...]`, using Bresenham line between consecutive points (viewBox 109), mark touched cells onto `userInked` map.
  4. Count intersection: `overlap = |refInked ∩ userInked| / |refInked|`. Final percent = round to integer.
  5. If `refInked` size is zero → return 0.
- The `drawing.ts` algorithm runs fully synchronously with no external libs (besides `svg-path-properties`), making it testable.

### Required deliverables
1. `mobile/src/lib/drawing/check-drawing.ts`:
   ```ts
   import { svgPathProperties } from "svg-path-properties";
   export function checkDrawing(opts: {
     guidePaths: string[], userStrokes: Array<Array<{x:number;y:number}>>,
     grid?: number, samplesPerPath?: number, tolerance?: number
   }): number {
     const G = opts.grid ?? 64;
     const samples = opts.samplesPerPath ?? 200;
     const tolerance = opts.tolerance ?? 1;
     const refSet = new Set<string>();
     for (const d of guidePaths) {
       const props = svgPathProperties(d);
       const len = props.length;
       for (let i = 0; i <= samples; i++) {
         const t = i / samples;
         const pt = props.getPointAtLength(t * len);
         markCell(pt.x, pt.y, G, refSet, tolerance);
       }
     }
     const userSet = new Set<string>();
     for (const [start, ...rest] of userStrokes) {
       for(const p0 of rest) {
         markLine(p0, p1, G, userSet, tolerance);
         p0 = p1;
       }
     }
     if (refSet.size === 0) return 0;
     let overlap = 0;
     for (const key of refSet) { if (userSet.has(key)) overlap++; }
     return Math.round((overlap / refSet.size) * 100);
   }
   ```
   (helper functions: `markCell(x,y,G,set,tolerance)`, `markLine(p0,p1,G,set)`)
2. `mobile/src/lib/drawing/__tests__/check-drawing.test.ts` — vitest test cases:
   - Horizontal guide (`M10,54 L100,54`), user draws same path → ≥ 85%。
   - Same guide → user draws vertical line → ≤ 10%。
   - Empty user strokes → 0.
   - Empty guide paths → 0.

### Technical notes
- `markCell` enlarges lines by tolerance: for each point, mark all cells within ±tolerance radius.
- `markLine` uses Bresenham's algorithm for an accurate digital line rasterization.
- Tuning tolerance: set to 1 for sharp, 2 for slightly forgiving.

### Validation / acceptance
- All tests green (`npx vitest run`).
- Insert into KanjiBoard: drawing the horizontal guide "一" → Check → shows ≥ 85%.

### Out of scope
- Any UI integration (issue #040 includes it).

### Linked files
- read: `web/src/lib/canvas.ts` (checkDrawing method)
- new: `mobile/src/lib/drawing/check-drawing.ts`, `__tests__/check-drawing.test.ts`

---

## Issue #024 — Color palette + brush size UI primitives (reusable)
**Epic:** drawing | **Type:** feat | **Priority:** P3 | **Size:** S
**Hard deps:** #022 (ColorPalette + BrushSlider already named) | **Soft deps:** none | **Stream:** C | **Assignee:** ____

### Goal
Extract the color palette and brush size slider from #022 into reusable components so they can be used independently (e.g., in settings or within KanaModal). They already exist as files in #022 but should be extracted properly.

The component requirements are minimal. This issue cross-links completion to #022, which owns the implementations.

### Required deliverables
- Check `mobile/src/components/drawing/ColorPalette.tsx` and `mobile/src/components/drawing/BrushSlider.tsx` from #022 are complete and exportable.
- Add unit tests (optional) for the color selection logic.

### Validation / acceptance
- Components render and change values via `onColorChange` / `onBrushChange` props.
- Tapping a dot updates the active color globally in both kanji and kana drawing screens.

### Out of scope
- Custom color pickers, preset palette, or stroke history.

### Linked files
- new: (same files as #022 list)
