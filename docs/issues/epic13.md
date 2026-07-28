# Epic 13 — Kanji Radical Puzzle

> **Priority:** P3. Drag/tap puzzle to assemble kanji from component radicals.

---

## Issue #046 — KanjiRadicalView
**Epic:** radicals | **Type:** port | **Priority:** P3 | **Size:** S
**Hard deps:** #035 | **Soft deps:** none | **Stream:** E | **Assignee:** ____

### Goal
Port `web/src/components/KanjiRadicalView.tsx`: show a target kanji with meaning and readings, a set of candidate radicals (with meanings) to tap into two slots, validate the correct pair, and reveal the mnemonic explanation.

### Context for the AI agent
- Puzzles loaded from `RadicalPuzzle` table via `GET /api/reference?type=puzzles`.
- Each puzzle: `targetKanji`, `radicals` (correct 1–2 radicals), `candidates` (3–5 options), `explanation`.
- Web uses drag-and-drop; RN: tap-to-select (selected radical goes into a slot), with 1–2 slots to fill. On correct assembly, show explanation.

### Required deliverables
1. `mobile/app/more/radicals.tsx` — screen.
2. `mobile/src/components/KanjiRadicalView.tsx`:
   - Puzzle card: target kanji display, meaning below, onyomi/kunyomi labels.
   - Candidate tray: several radical buttons (each showing `{char} - {meaning}`).
   - 1-2 slots (depending on puzzle: some have 1 radical, some 2). Tapping a candidate moves it to the next empty slot.
   - Correct: green highlight, explanation appears as a text block.
   - Wrong: red flash, reset slots.

### Technical notes
- If a puzzle has 2 correct radicals, the user must add exactly those two in any order to win.
- Tap the same candidate again to remove it from the slot (toggle).
- Disable candidates already in slots.

### Validation / acceptance
- Puzzle "休 = Person + Tree" → two radicals appear, tapping both fills both slots, green flash + explanation shows.
- Wrong pair → red flash, cleared.
- Re-entering puzzle shows the correct unlock state.

### Out of scope
- Animations, drag-and-drop.

### Linked files
- read: `web/src/components/KanjiRadicalView.tsx`
- new: `mobile/app/more/radicals.tsx`, `mobile/src/components/KanjiRadicalView.tsx`
