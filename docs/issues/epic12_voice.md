# Epic 12 — Pronunciation Coach

> **Priority:** P3. Pitch accent visualization and voice recording.

---

## Issue #045 — PronunciationCoach
**Epic:** voice | **Type:** port | **Priority:** P3 | **Size:** L
**Hard deps:** #035, #019b, #038 | **Soft deps:** none | **Stream:** E | **Assignee:** ____

### Goal
Port `web/src/components/PronunciationCoach.tsx`: pick a target phrase, see mora H/L pitch bars (Heiban, Atamadaka, Nakadaka, Odaka patterns), listen to target pronunciation via `expo-speech`, **Record** via `expo-audio` recording into a `wav` blob, then **Play back** the recording.

### Context for the AI agent
- Phrases pulled from `PronunciationPhrase` table via `GET /api/reference?type=phrases`.
- Each phrase has: `moras` array, `moraPitches` (H/L), `pitchDropIndex`, and `pitchType` enum.
- Pitch visualization: render mora boxes (one per mora) with color L (light) and H (dark), and a drop indicator at the pitch drop index.
- Recording: `expo-audio` provides `Audio.Recording.createAsync` → sets up permission request.
- Playback: use `expo-audio` to replay the recording. Also listen to the target phrase via `speakJapanese`.

### Required deliverables
1. `mobile/app/more/voice.tsx` — screen.
2. `mobile/src/components/PronunciationCoach.tsx`:
   - Phrase picker: `FlatList` of phrases.
   - Pitch bar SVG: render mora boxes colored per `moraPitches`. Add a user indicator (dot) showing current progress.
   - Listen button → `speakJapanese(phrase.japanese)`.
   - Record button → starts/ends recording.
   - Playback button → replays the recording.
   - Optional: "Score" based on simple heuristic (length of audio / compare to target length) — not a full pitch detector.

### Technical notes
- `expo-audio` recording: `const recording = new Audio.Recording(); await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY); await recording.startAsync();` → after stop, get `.wav` URI.
- Playback: `new Audio.Sound.createAsync({ uri: recordingUri })`. Then `playAsync()`.
- Pitch bars using `react-native-svg`: each mora is a `<Rect>` with fill based on H/L. A vertical line after the drop-index mora (if pitchDropIndex is provided).
- Recording permissions: ask on `onPress` record, handle denial.

### Validation / acceptance
- Select "Konnichiwa" → see 5 mora boxes, L H H H H pattern.
- Listen → phone plays native Japanese voice.
- Record → user speaks; playback echoes exactly what was recorded.
- Other phrases with Atamadaka and Nakadaka show correct pitch patterns (H falling to L at the drop index).

### Out of scope
- True pitch comparison / pitch detection (v2).

### Linked files
- read: `web/src/components/PronunciationCoach.tsx`
- new: `mobile/app/more/voice.tsx`, `mobile/src/components/PronunciationCoach.tsx`
