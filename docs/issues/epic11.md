# Epic 11 — Kaiwa Roleplay

> **Priority:** P2. Branching dialogue scenarios with multiple choice responses.

---

## Issue #044 — KaiwaView
**Epic:** kaiwa | **Type:** port | **Priority:** P2 | **Size:** M
**Hard deps:** #035, #038 | **Soft deps:** none | **Stream:** E | **Assignee:** ____

### Goal
Port `web/src/components/KaiwaView.tsx`: scenario list cards, selected scenario renders dialogue turns with avatars (emoji), japanese text, furigana, romaji, english translation, and user options when it's the user's turn. Correct option advances dialogue; wrong option shows feedback then lets you retry.

### Context for the AI agent
- Scenarios are stored in DB table `KaiwaScenario` via seed (Issue #006). Accessed via `GET /api/reference?type=scenarios`.
- Each scenario has `dialogue: DialogueTurn[]` (JSON). User turns have `options` array with `{text, romaji, english, isCorrect, feedback}`.
- Speaker bubbles: different side / color for clerk vs user; emoji avatar in a circle.

### Required deliverables
1. `mobile/app/more/kaiwa.tsx` — screen.
2. `mobile/src/components/KaiwaView.tsx`:
   - Scenario card picker (flatlist of cards with title, category, icon, description).
   - After selecting, render dialogue history as `FlatList` of bubbles.
   - User turns: show `options` as `TouchableOpacity` buttons. On tap:
     - Correct → green background, flash, advance to next turn.
     - Incorrect → red background, show `feedback`, stay on same turn (reset buttons).
   - Speak buttons on each dialogue for correct pronunciation.

### Technical notes
- Use `useApiQuery('/api/reference?type=scenarios')` to load scenarios.
- For the `FlatList` of dialogue history, use `keyExtractor` with index since the same dialogue turn may appear multiple times (due to wrong attempts).
- Markdown-style rendering of furigana (not needed — render as plain text with `<Text style={...}/>`).
- Speak: `speakJapanese(japanese)` on each message.

### Validation / acceptance
- Select "At a Tokyo Cafe" → see welcome message from clerk.
- Tap correct option → advance to next turn.
- Tap wrong option → feedback shown, able to re-select.
- Reach end of dialogue → "You completed this conversation!" message.

### Out of scope
- Multiple-choice counter, XP, progress tracking.

### Linked files
- read: `web/src/components/KaiwaView.tsx`
- new: `mobile/app/more/kaiwa.tsx`, `mobile/src/components/KaiwaView.tsx`
