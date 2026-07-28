# Epic 7 — Dictionary & Conjugator

> **Priority:** P1. Core module: searchable vocabulary with audio, favorites, CSV export, and verb conjugation tool.

---

## Issue #037 — DictionaryView (search, chips, favorites, CSV export, conjugator)
**Epic:** dictionary | **Type:** port | **Priority:** P1 | **Size:** L
**Hard deps:** #013, #035, #039 | **Soft deps:** #038 (speech) | **Stream:** E | **Assignee:** ____

### Goal
Port `web/src/components/DictionaryView.tsx` into the RN tab. Features: searchable vocabulary from reference data, category chips (All/Noun/Verb/Adjective/Favorites), favorite star toggle (persisted to `starredVocab`), speak button per word, CSV export via `expo-sharing`, and a Verb Conjugator panel using the pure `conjugateVerb()` utility.

### Context for the AI agent
- Web dictionary renders a list of 150+ items, category chips filter to specific tags, and a "Favorites" chip shows only starred words.
- CSV export: gather all visible vocabulary items, build a CSV string (`word,reading,romaji,english\n...`), write to `FileSystem.cacheDirectory + 'zengo-vocab.csv'`, then `expo-sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Export Vocabulary' })`.
- Verb conjugator is a dropdown + conjugation grid at the bottom. It should only load verbs (`tag === "Verb"`) — NOT all dictionary entries — to avoid the conjugator breaking on adjectives.
- The category chips and verb-selector overlap structurally but both work on the same screen.

### Required deliverables
1. `mobile/app/(tabs)/dictionary.tsx` — thin wrapper around `DictionaryView`.
2. `mobile/src/components/DictionaryView.tsx`:
   - Search bar at top (real-time filter).
   - Chip row: All / Nouns / Verbs / Adjectives / Favorites (⭐).
   - `FlatList` rendering items: `{word (japanese)} - {reading} - {english}`, star icon to toggle star, speaker icon to speak.
   - CSV export: floating action button → triggers share.
   - Verb conjugator panel: picker (`verb-selector`) listing verbs, conjugation grid showing Polite/→ Negative/ → Past/ → Te forms.

### Technical notes
- `useApiQuery('/api/reference?type=vocab')` to get data.
- Filter locally: search matches `word`, `reading`, `romaji`, or `english`. Chip filters by `tag`.
- Star toggle calls `AppContext.toggleStarVocab(word)`.
- CSV export: generate via `Array#map` → `join('\n')`.
- Conjugator: filter vocab array by `id → tag === "Verb"` → verb-selector displays names. On selection, call `conjugateVerb(verbObj)` (pure utility ported in #039) → update the grid cells.
- Export CSV: if no items, show a warning; if items > 150, limit to 200 to avoid huge file.

### Validation / acceptance
- Search "watashi" → shows 私 (わたし) result.
- Tap "Nouns" chip → only nouns visible.
- Tap star → result appears in Favorites chip.
- Tap speaker → pronounces.
- Select verb "食べる" → conjugate rows show: Polite: 食べます, Negative: 食べない, Past: 食べた, Te: 食べて.
- Tap CSV export → system share sheet opens → save/send.

### Out of scope
- Incremental loading / pagination (reference data is < 200 entries, not needed).

### Linked files
- read: `web/src/components/DictionaryView.tsx`
- new: `mobile/app/(tabs)/dictionary.tsx`, `mobile/src/components/DictionaryView.tsx`

---

## Issue #039 — `conjugateVerb()` pure util port
**Epic:** dictionary | **Type:** port | **Priority:** P1 | **Size:** S
**Hard deps:** #004 | **Soft deps:** none | **Stream:** B | **Assignee:** ____

### Goal
Copy the `conjugateVerb()` function from `web/src/lib/data.ts:808-895` into a mobile pure-TS module with unit tests. This handles all verb types: ru (ichidan) + u (godan) + irregular (kuru/suru) + special 行く → 行った. Also copy the `iRow`/`aRow` vowel mapping tables.

### Context for the AI agent
- The function reads `verbObj.type` ('u'/'ru'/'irr' from vocabulary table) and `verbObj.word` (kanji form) and `verbObj.reading` (kana form).
- Output shape: `{ type: string, polite: string, masu: string, negative: string, nai: string, past: string, ta: string, te: string }`.
- Web uses the `dictionary` array to look up verbs; mobile already has data in Vocabulary table — matching `conjugateVerb` implementation unchanged.

### Required deliverables
1. `mobile/src/lib/conjugator.ts` — verbatim copy of `conjugateVerb` logic, exports `conjugateVerb(verbObj)`.
2. `mobile/src/lib/__tests__/conjugator.test.ts` — vitest tests:
   - `食べる` → polite=食べます, negative=食べない, past=食べた, te=食べて.
   - `飲む` → polite=飲みます, negative=飲まない, past=飲んだ, te=飲んで.
   - `来る` → polite=来ます, negative=来ない, past=来た, te=来て.
   - `する` → polite=します, negative=しない, past=した, te=して.
   - `行く` → past=行った, te=行って (irregular u-verb special case).
   - `買う` → polite=買います, negative=買わない, past=買った, te=買って.
   - `読む` → polite=読みます, negative=読まない, past=読んだ, te=読んで.
   - `話す` → polite=話します, negative=話さない, past=話した, te=話して.

### Technical notes
- The `iRow`/`aRow` mapping tables should be imported from the web source verbatim: `{ う: い, く: き, つ: ち, ... }`, `{ う: わ, く: か, つ: た, ... }`.
- The special case for 行く handling must be included (web's lines 870-871).
- Type definitions: `verbObj: { word: string; reading?: string; type: string }` at minimum.

### Validation / acceptance
- All test cases pass (above 8 tests).
- `npx vitest run --reporter verbose` outputs full test list.

### Out of scope
- Adjective conjugation (the web dict doesn't conjugate adjectives in the conjugator; only verbs. But adjectives have a separate `tag` — do not attempt to conjugate them in v1).

### Linked files
- read: `web/src/lib/data.ts` (conjugateVerb + iRow/aRow tables)
- new: `mobile/src/lib/conjugator.ts`, `mobile/src/lib/__tests__/conjugator.test.ts`
