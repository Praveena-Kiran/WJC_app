# Epic 6 — Kana Trainer

> **Priority:** P1. Core learning module: visual kana grid, detail modal with drawing, SRS flashcards.

---

## Issue #032 — KanaTrainer view
**Epic:** kana | **Type:** port | **Priority:** P1 | **Size:** L
**Hard deps:** #013, #033, #034, #035 | **Soft deps:** #016 | **Stream:** E | **Assignee:** ____

### Goal
Port `web/src/components/kana/KanaTrainer.tsx`: segmented Hiragana / Katakana / Flashcards tabs, kana grid rendered from server reference data, romaji toggle, and tap a kana card opens `KanaModal`.

### Context for the AI agent
- Web renders a grid of cards (5 columns × 10 rows). Each card shows the character, romaji (if toggle on), and a small speaker icon. Tapping opens the detail modal.
- In RN, use `FlatList` with `numColumns={5}` for the grid. Each cell is a `<TouchableOpacity>` with `<Text>` and `<FontAwesome name="volume-up" size={12}/>`.
- The data comes from `GET /api/reference?type=kana` (Issue #035). Row shape: `{ id, char, romaji, type, vocab, translation }`.
- Flashcard segment swaps in the `<FlashcardPanel>` from #034.
- Romaji toggle persists to local state.

### Required deliverables
1. `mobile/app/(tabs)/kana.tsx` — screen export (thin wrapper around `KanaTrainer` component).
2. `mobile/src/components/kana/KanaTrainer.tsx`:
   - Segment control at top: Hiragana / Katakana / Flashcard.
   - Romaji toggle switch (on/off).
   - Grid using `useApiQuery('/api/reference?type=kana')` → filtered by current segment → `FlatList numColumns={5}`.
   - Each cell: `onPress` → opens KanaModal (mount the `<Modal>` inside this file).
   - Speaker on each cell calls `speakJapanese(kana.char)` (from AppContext).
   - Mastery indicator: green check if `masteredKana.includes(id)`.
3. Integrate into tab layout from #019: `(tabs)/kana.tsx` exists.

### Technical notes
- The grid item height should be consistent (use a dimension from layout calculation).
- Mastery toggles via `toggleMasterKana` (AppContext → PUT /api/progress).
- FlashcardPanel is a sibling component; show it as the third segment's content area instead of the grid.
- The web grid has ~10 rows for hiragana, 10 for katakana. RN: `numColumns={5}` → `Math.ceil(filteredKana.length/5)` rows.

### Validation / acceptance
- Loading `api/reference` → shows full kana grid in Hiragana.
- Switch to Katakana → grid updates.
- Toggle Romaji off → romaji disappears from grid.
- Tap a kana → modal opens (Issue #033).
- Tap speaker → Japanese audio plays.

### Out of scope
- Custom themed font for row headers.

### Linked files
- read: `web/src/components/kana/KanaTrainer.tsx`
- new: `mobile/app/(tabs)/kana.tsx`, `mobile/src/components/kana/KanaTrainer.tsx`

---

## Issue #033 — KanaModal (detail + trace + mastery)
**Epic:** kana | **Type:** port | **Priority:** P1 | **Size:** L
**Hard deps:** #022, #019b (playSound) | **Soft deps:** #038 (speech) | **Stream:** E | **Assignee:** ____

### Goal
Port `web/src/components/kana/KanaModal.tsx`: shows the selected kana character prominently with an SVG notebook-grid background, guide stroke tracing via the drawing engine from #022, romaji tag, pronunciation description, vocabulary example + sentence, prev/next arrows, Animate/Clear/Check buttons, mastery checkbox, and a feedback banner.

### Context for the AI agent
- Web modal content includes SVG trace guide along with a canvas, speak button, prev/next buttons, Animate, Clear, Check, and a footer for prev/next.
- RN: Use a `ReactNative.Modal` or screen-per-route. For simplicity, use a modal within the KanaTrainer (push navigation within the stack may be preferred for state. Either approach is fine.
- The `KanjiDrawingCanvas` component from #022 (`strokePaths` prop + pan drawing + animate) should be used here, passing `kanaStrokes[id].d` as the array of SVG paths.
- The modal has its own feedback banner (green for high accuracy, red for low).

### Required deliverables
1. `mobile/src/components/kana/KanaModal.tsx`:
   - Show character in a large char box with `KanjiDrawingCanvas` (the drawing component from #022).
   - Header: romaji `a`, chip: "Hiragana", speak button.
   - Vocab example: "{vocab}" + translation.
   - Example sentence: `{example.jp}` / `{example.en}` block.
   - Footer row: prev (←), Animate, Clear, Check, next (→).
   - Check: call `checkDrawing(guidePaths, userStrokes)` → update feedback banner percent + pass/fail color.
   - Mastery checkbox: toggle mastery.
2. The prev/next arrows navigate through the current filtered kana list (passed as prop).

### Technical notes
- The drawing component must be sized to around 200x200 (or responsive after modal is open).
- `checkDrawing` from #023 returns percent. Overlay a text like "84% — You're close!" or "12% — try again".
- Clear button clears the user strokes (call `clear` on ref if available in #022).
- Animate button triggers the stroke animation (animate prop in #022).
- Speech button calls `speakJapanese(char)`.

### Validation / acceptance
- Tap a kana → modal shows the character.
- Draw the correct strokes → Check → shows ≥80%, green banner.
- Scribble wrong → Shows <20%, red banner.
- Prev/next navigates to adjacent kana.
- Mastery toggle persists.

### Out of scope
- Multiple stroke annotations per character.

### Linked files
- read: `web/src/components/kana/KanaModal.tsx`
- new: `mobile/src/components/kana/KanaModal.tsx`

---

## Issue #034 — FlashcardPanel (SRS)
**Epic:** kana | **Type:** port | **Priority:** P1 | **Size:** M
**Hard deps:** #012, #013 | **Soft deps:** none | **Stream:** E | **Assignee:** ____

### Goal
Port `web/src/components/kana/FlashcardPanel.tsx`: card flip, Forgot/Hard/Easy rating buttons, SRS card update via `updateSrsData`, deck built from due `SrsCard` rows fetched from server. Ratings map: Forgot=again, Hard=hard, Easy=good+hard (combine many tiers to match web's 3 buttons).

### Context for the AI agent
- Web has 4 ratings: again, hard, good, easy — but only 3 buttons (Forgot, Hard, Easy). Easy maps to "good" algorithmically; note that web's missing "easy" button; keep that.
- The SRS deck is built dynamically from cards where `dueDate ≤ now()` → the card will have its data from the `kana` reference.
- After rating, `updateSrsData` (issue #013 → `mobile/src/lib/srs.ts`) is called, recomputes interval/easeFactor, then PUT to server.
- The front/back flip works like: front shows the character, a speak button, and "Flip Card" button. Back shows romaji, vocabulary, example. After seeing the back, the 3 rating buttons appear.

### Required deliverables
1. `mobile/src/components/kana/FlashcardPanel.tsx`:
   - Fetches due cards via `useApiQuery('/api/progress')` → reads `srsDue` array.
   - For each due `SrsCard`, fetch the kana from reference cache (or pass in as prop from the reference query).
   - Render FlashcardView with front/back, flip logic, and rating buttons.
   - On rating, call `AppContext.updateSrsData(kanaId, rating)`.

### Technical notes
- SRS algorithm exact copy from web's `AppContext.updateSrsData` (already ported in #013 to `mobile/src/lib/srs.ts`).
- The three-tier rating mapping: Forgot → `again`, Hard → `hard`, Easy → `good` (no `easy` tier since web only has 3 buttons).
- After rating, the card should slide out (optional animation) and show the next due card.
- If no due cards, show a message "All caught up! Come back later" with the due time of the next card displayed.

### Validation / acceptance
- Rating Hard → interval roughly doubles (20% more).
- Rating Forgot → interval resets to 1 day.
- After rating, card is not shown again until its new `dueDate` has passed.
- Existing SRS cards sync from server each app launch — progress persists.

### Out of scope
- SRS statistics or graphs.

### Linked files
- read: `web/src/components/kana/FlashcardPanel.tsx`, `web/src/context/AppContext.tsx` (updateSrsData)
- new: `mobile/src/components/kana/FlashcardPanel.tsx`

---

## Issue #035 — `/api/reference` GET handler (kana, kanji, vocab, scenarios, phrases, puzzles)
**Epic:** kana | **Type:** feat | **Priority:** P0 | **Size:** M
**Hard deps:** #006 (seed populated) | **Soft deps:** none | **Stream:** B | **Assignee:** ____

### Goal
Expose a public GET endpoint `GET /api/reference?type=` that returns all reference data from seeded tables in a single JSON payload. Use `ETag` + `Last-Modified` headers to allow client caching. Support multiple type combinations: `?type=kana` → kana + strokes; `?type=kanji` → kanji + strokes; `?type=vocab` → vocabulary; `?type=scenarios` → kaiwa scenarios; `?type=phrases` → pronunciation phrases; `?type=puzzles` → radical puzzles; `?type=lessons` → lessons; `?type=all` → all combined.

### Required deliverables
1. `mobile/src/server/handlers/reference.ts`:
   ```ts
   // Hono handler
   import { prisma } from "../db";
   export const referenceRoute = new Hono()
     .get("/api/reference", async (c) => {
       const type = c.req.query("type") || "all";
       const data: any = {};
       // cache control: 7 days
       c.header("Cache-Control", "public, max-age=604800, immutable");
       c.header("ETag", `"ref-${lastSeedHash}"`); // fixed hash until next seed
       if (type === "all" || type === "kana") data.kana = await prisma.kana.findMany({ include: { strokes: true } });
       if (type === "all" || type === "kanji") data.kanji = await prisma.kanji.findMany({ include: { strokes: true } });
       if (type === "all" || type === "vocab") data.vocabulary = await prisma.vocabulary.findMany();
       if (type === "all" || type === "scenarios") data.scenarios = await prisma.kaiwaScenario.findMany();
       if (type === "all" || type === "phrases") data.phrases = await prisma.pronunciationPhrase.findMany();
       if (type === "all" || type === "puzzles") data.puzzles = await prisma.radicalPuzzle.findMany();
       if (type === "all" || type === "lessons") data.lessons = await prisma.lesson.findMany();
       return c.json(data);
     });
   ```
2. Wire `referenceRoute` to `app.ts` (already listed in #014).

### Technical notes
- Use `ETag` based on a hash of the migration commit (or leave as constant). In dev, the hash changes when seed script is rerun; set it via `process.env.REFERENCE_ETAG`.
- On client side (#009c), TanStack Query will respect `Cache-Control: immutable` for reference data — it will remain cached for the life of the query client.
- `relations: true` (include strokes) will nest the JSON — perfect for the client to read.

### Validation / acceptance
- `GET /api/reference?type=all` returns all data in one big JSON (size ~200 KB acceptable).
- `GET /api/reference?type=kana` returns only kana + strokes.
- `If-None-Match` returns 304 when data unchanged.

### Out of scope
- Authorization (public → no auth needed).

### Linked files
- new: `mobile/src/server/handlers/reference.ts`
- edit: `mobile/src/server/app.ts`

---

## Issue #036 — StudyModal (lesson slides, ported from web's StudyModal)
**Epic:** kana | **Type:** port | **Priority:** P2 | **Size:** M
**Hard deps:** #013 | **Soft deps:** #035 | **Stream:** E | **Assignee:** ____

### Goal
Port web's `StudyModal.tsx` into the RN app: slide container showing each syllabus item with vocabulary kanji, prev/next buttons, slide progress indicator, and a close × button. On reaching the last slide, `markLessonSolved` updates the dashboard.

### Context for the AI agent
- `web/src/components/StudyModal.tsx` renders a modal with simple prev/next slide carousel.
- Each slide consists of a syllabus line (e.g., "Grammar: N1 wa N2 desu") and optionally vocabulary/kanji entries from the lesson's list.
- RN uses a `ReactNative.Modal` or a full-screen stack screen. The modal accepts `lessonId` and the corresponding `lesson` from the reference data.

### Required deliverables
1. `mobile/src/components/kana/StudyModal.tsx`:
   - Controlled by `modalVisible` and `onClose`.
   - Receives `lesson: Lesson` as a prop (fetched from reference).
   - Slides through `syllabus[]` array (the JSON `syllabus` field from the lesson).
   - Prev/Next buttons, progress "Slide 1 of 4".
   - On last slide, the "Finish" button (Next becomes Finish) → `markLessonSolved(lesson.id)` → close modal.

### Validation / acceptance
- Tapping "Start Practice" on a pebble → modal opens with syllabus text.
- Navigating to the last slide → Finish → modal closes and pebble becomes solved.
- Progress indicator updates correctly.

### Out of scope
- Animations, drag-to-dismiss.

### Linked files
- read: `web/src/components/StudyModal.tsx`
- new: `mobile/src/components/kana/StudyModal.tsx`
