# Epic 8 — Kanji Board

> **Priority:** P1. Complex module: kanji grid picker, animated stroke rendering, tracing canvas with accuracy check.

---

## Issue #040 — KanjiBoard view
**Epic:** kanji | **Type:** port | **Priority:** P1 | **Size:** L
**Hard deps:** #022, #023, #035 | **Soft deps:** #038 (speech) | **Stream:** E | **Assignee:** ____

### Goal
Port `web/src/components/KanjiBoard.tsx`: N5/N4 level filter, kanji select grid, selected kanji workspace with notebook-grid SVG background + animated guide strokes via `KanjiDrawingCanvas`, info panel (char, meaning, onyomi, kunyomi, speak button), brush controls (slider + color dots), Animate/Clear/Check buttons, and feedback banner showing accuracy %.

### Context for the AI agent
- Kanji data has two levels: `N5` (30+ characters) and `N4` (30+ characters). These are fetched from `GET /api/reference?type=kanji` (Issue #035 → `/api/reference` handler).
- Each kanji has an array of `strokes` (SVG path strings for guide drawing) and associated metadata (meaning, onyomi, kunyomi).
- The drawing canvas is sized to ~300×300 or the full device width (adaptive). Guide strokes are rendered at viewBox 109×109.
- "Check My Drawing" calls `checkDrawing(strokePaths, userStrokes)` from #023.
- On success (≥70%), `addPracticedKanji` is called, persisting it to `UserProgress.practicedKanji`.

### Required deliverables
1. `mobile/app/(tabs)/kanji.tsx` — thin wrapper around `KanjiBoard`.
2. `mobile/src/components/KanjiBoard.tsx`:
   - Level filter: N5 / N4 toggle.
   - Kanji grid: `FlatList` with series of buttons for each kanji character.
   - Selected kanji workspace: `KanjiDrawingCanvas` + info panel (meaning, onyomi, kunyomi).
   - Speak button calls `speakJapanese(char)`.
   - Brush slider + color dots (reuse from #024).
   - Animate (stroke animation), Clear (clear user strokes), Check (accuracy %).
   - Success: green banner "+ Practiced!" with percent.
   - If no kanji drawn yet, default state shows "Select a kanji to begin".

### Technical notes
- The `KanjiDrawingCanvas` must handle kanji with many strokes (e.g., 時 has 10 strokes). All strokes should be displayed and animated sequentially.
- Grid: render kanji characters in `Text` with larger font (size 28–32).
- Color palette: tap a dot → set `currentColor`, redraw next stroke.
- Filter: N5 / N4 toggle filters `kanjiData.level`.

### Validation / acceptance
- N5 select → shows kanji including 一, 二, 三, 日, 月, etc.
- Select "一" → guide stroke appears (left→right single line).
- Animate → stroke draws.
- Draw over it → Check → shows ≥85% accuracy.
- After success, "practicedKanji" in dashboard shows count 1.

### Out of scope
- Detailed stroke-order numbering per stroke.

### Linked files
- read: `web/src/components/KanjiBoard.tsx`
- new: `mobile/app/(tabs)/kanji.tsx`, `mobile/src/components/KanjiBoard.tsx`
