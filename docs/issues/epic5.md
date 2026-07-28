# Epic 5 — Dashboards

> **Priority:** P1. Four role-specific dashboards + dispatcher + bonsai SVG + pebble SVG.

---

## Issue #025 — ZenDashboard (external student, zen mode)
**Epic:** dashboard | **Type:** port | **Priority:** P1 | **Size:** L
**Hard deps:** #013, #016, #022 (SVG) | **Soft deps:** #035 (reference API) | **Stream:** D | **Assignee:** ____

### Goal
Mirror `web/src/components/dashboard/ZenDashboard.tsx` with the same layout: welcome row, Lesson Stepping Stones (pebble timeline in SVG) on the left side, Lesson Detail Card and Bonsai Garden Progress on the right.

### Context for the AI agent
- The Zen dashboard shows: greeting "こんにちは, {name}" → Pebble timeline with 5-connected step stones for each lesson → lesson detail card (syllabus list + "Start Practice" button) → bonsai with dynamic leaf growth based on solved lessons.
- Web uses CSS grid; RN uses `ScrollView` with `View` row layout.
- Pebbles render as `<Svg>` with `<Circle>` and `<Text>` inside each pebble position dynamically determined by the lesson list.
- Bonsai SVG code is in the index.html inline — but is being updated from `web/src/components/dashboard/ZenDashboard.tsx`. Read that component for the bonsai logic.

### Required deliverables
1. `mobile/src/components/dashboard/ZenDashboard.tsx`:
   - Welcome title/paragraph.
   - `<LessonSteppingStones />` (Pebble component from #031).
   - `<LessonDetailCard />` showing `title`, `description`, `syllabus` (`<FlatList>`), and `Start Practice` button.
   - `<BonsaiGarden />` (Bonsai SVG component from #030).

### Technical notes
- Use `useApiQuery('/api/reference?type=lessons')` for lessons (via #035).
- Pebbles position hardcoded initially; later can be `FlatList` based on `solvedLessons`.
- `Start Practice` → opens StudyModal (Issue #036).
- Use theme tokens for text and background colors.
- `BonsaiGarden` component should render leaf count/stretch based on `solvedLessons.length`.

### Validation / acceptance
- With 1 solved lesson, bonsai shows 1 leaf (small).
- Tapping a pebble for a solved lesson shows its syllabus and "Start Practice" visible.
- Tapping a locked lesson does nothing (or shows lock icon).

### Out of scope
- Full sliding menu or duplicate of cyber/teacher dashboards.

### Linked files
- read: `web/src/components/dashboard/ZenDashboard.tsx`, `web/src/components/dashboard/N5DeadlineCard.tsx`
- new: `mobile/src/components/dashboard/ZenDashboard.tsx`

---

## Issue #026 — CyberZenDashboard (external student, cyber mode)
**Epic:** dashboard | **Type:** port | **Priority:** P2 | **Size:** M
**Hard deps:** #025, #013 | **Soft deps:** none | **Stream:** D | **Assignee:** ____

### Goal
Mirror `web/src/components/dashboard/CyberZenDashboard.tsx`: streak badge, stat cards (Kana Mastery %, Kanji Read Ratio, Starred Dictionary count), Starred Vocabulary Vault grid, Quick Modules buttons routing to Kana/Dictionary/Kanji/Quiz.

### Context for the AI agent
- Streak label: "Days Streak" is shown in web but behind the scenes it's actually solved-lessons count — keep exactly as the web does (no logic rewrite).
- Stats sourced from AppContext: `masteredKana.length / 92 * 100` for kana mastery, `practicedKanji.length` / count for kanji ratio, `starredVocab.length` for stars count.
- Quick modules buttons: each navigates via `router.push`.

### Required deliverables
1. `mobile/src/components/dashboard/CyberZenDashboard.tsx`:
   - Streak badge: `<View><Text>{state.streakCount} Days Streak</Text></View>`
   - Stat row: three stat cards in a row.
   - Starred vocabulary list: `FlatList` of `state.starredVocab` fetching from cached data.
   - Quick modules: 4 `TouchableOpacity` buttons with `setActiveView` dispatchers.

### Technical notes
- Use `apiFetch` for vocabulary data if not cached.
- Streak kept as lessons-solved; label "Days Streak" preserved.

### Validation / acceptance
- Stats reflect real data from user progress.
- Quick module button `Dictionary` → pushes `/more/dictionary`.
- Show 0 streak → still shows "0 Days Streak".

### Out of scope
- Changing streak semantics (defer to v2).

### Linked files
- read: `web/src/components/dashboard/CyberZenDashboard.tsx`, `web/src/components/dashboard/WoxsenStudentDashboard.tsx`
- new: `mobile/src/components/dashboard/CyberZenDashboard.tsx`

---

## Issue #027 — WoxsenStudentDashboard
**Epic:** dashboard | **Type:** port | **Priority:** P2 | **Size:** M
**Hard deps:** #013, #052, #053 | **Soft deps:** none | **Stream:** D | **Assignee:** ____

### Goal
Port `web/src/components/dashboard/WoxsenStudentDashboard.tsx`: attendance percentage, classes attended ratio, documents count, Attendance History calendar list (sourced from server), Course Vault file list with tap to download via `expo-file-system` → `expo-sharing`.

### Context for the AI agent
- Attendance data comes from `GET /api/attendance` (Issue #052). Vault files from `GET /api/files?role=student` (Issue #053).
- On file tap: download to `FileSystem.cacheDirectory`, then `expo-sharing.shareAsync()`.

### Required deliverables
1. `mobile/src/components/dashboard/WoxsenStudentDashboard.tsx`:
   - Attendance stat bars: aggregated counts from the API.
   - Calendar history: `<FlatList>` of attendance records with status icons (present/absent).
   - Course Vault list: each file name + size + date, `onPress` downloads and opens.

### Technical notes
- `useApiQuery('/api/attendance')` for attendance data.
- `useApiQuery('/api/files?role=student')` for files.
- File download: `FileSystem.downloadAsync(fileUrl, cachePath)`, then `expoFileSharing.shareAsync(cachePath, { mimeType: fileUrl.endsWith('.pdf') ? 'application/pdf' : '*/*' })`.

### Validation / acceptance
- Attendance % shown; tapping a date expands to show status.
- Tapping a file → download → opens in the system viewer (Preview/Chrome/PDF reader).
- Course vault shows empty state if no files uploaded.

### Out of scope
- Filtering by date range.

### Linked files
- read: `web/src/components/dashboard/WoxsenStudentDashboard.tsx`
- new: `mobile/src/components/dashboard/WoxsenStudentDashboard.tsx`

---

## Issue #028 — TeacherDashboard
**Epic:** dashboard | **Type:** port | **Priority:** P2 | **Size:** L
**Hard deps:** #013, #052, #053, #004 (expo-document-picker) | **Soft deps:** none | **Stream:** D | **Assignee:** ____

### Goal
Port `web/src/components/dashboard/TeacherDashboard.tsx`: stats (class avg attendance, total roster students, shared files count), Class Attendance Marker (date picker + roster checklist → Save via `/api/attendance`), Upload Study Resource panel (drag-to-upload → RN: document-picker → presigned PUT to `/api/upload` → POST file metadata to `/api/files`), uploaded files list with delete.

### Context for the AI agent
- Document-picker flow: `DocumentPicker.getDocumentAsync({ type: '*/*' })` returns `{assets: [{uri, name, mimeType, size}]}`. Copy file to cache: `FileSystem.copyAsync({ from: asset.uri, to: cache + asset.name })`.
- Upload: `POST /api/upload` JSON `{ filename, fileType }` → returns `{ uploadUrl, fileUrl, key }`. Then `fetch(uploadUrl, { method: 'PUT', body: fileBlob, headers: {'Content-Type': ...} })` then manually `POST /api/files` to register metadata.
- Teacher attendance roster: `GET /api/attendance/roster` lists all woxsen students.
- Delete file: `DELETE /api/files?id=...`.

### Required deliverables
1. `mobile/src/components/dashboard/TeacherDashboard.tsx`:
   - Stats header (avg attendance, roster count, files count).
   - Attendance Marker: select date (DateTimePicker), list of roster students with present/absent toggles, Save button via `apiFetch`.
   - Upload: file picker → presigned upload → POST metadata → appended to files list.
   - Uploaded files: `FlatList` with row delete via `DELETE /api/files?id=...`.

### Technical notes
- File picker on iOS returns a URI with file scheme — need native permissions handled by expo-document-picker (already).
- Use `fetch` to PUT directly to S3 with `Content-Type` header (presigned URL already signs this header).
- All API calls via `apiFetch` (#009b).
- Roster: `GET /api/attendance/roster` → returns `[{userId, name, email}]`.

### Validation / acceptance
- Upload a PDF → appears in student's Course Vault (issue #027 verifies this).
- Save attendance for a date → student sees updated attendance record (#027).
- Delete uploaded file → removed from list and from DB.

### Out of scope
- Bulk attendance marking, export CSV.

### Linked files
- read: `web/src/components/dashboard/TeacherDashboard.tsx`
- new: `mobile/src/components/dashboard/TeacherDashboard.tsx`

---

## Issue #029 — Dashboard dispatcher (role + theme aware)
**Epic:** dashboard | **Type:** feat | **Priority:** P1 | **Size:** S
**Hard deps:** #025, #026, #027, #028 | **Soft deps:** none | **Stream:** D | **Assignee:** ____

### Goal
In `mobile/app/(tabs)/index.tsx`, dispatch the correct dashboard based on `userRole` + `studyMode` — exactly as web `page.tsx` dispatches.

### Context for the AI agent
- Web switch:
  ```
  teacher → TeacherDashboard
  woxsen-student → WoxsenStudentDashboard
  external → studyMode "zen" ? ZenDashboard : CyberZenDashboard
  ```
  Same mapping in RN.

### Required deliverables
1. `mobile/app/(tabs)/index.tsx`:
   ```tsx
   const { state } = useApp();
   return state.userRole === "teacher" ? <TeacherDashboard />
        : state.userRole === "woxsen-student" ? <WoxsenStudentDashboard />
        : state.studyMode === "zen" ? <ZenDashboard /> : <CyberZenDashboard />;
   ```

### Validation / acceptance
- Switch role in dev settings → dashboard changes.
- Switch theme from zen to cyber → dashboard changes.

### Out of scope
- Dashboard layout animation.

### Linked files
- edit: `mobile/app/(tabs)/index.tsx`

---

## Issue #030 — Bonsai Garden SVG growth component
**Epic:** dashboard | **Type:** feat | **Priority:** P3 | **Size:** S
**Hard deps:** #025 | **Soft deps:** none | **Stream:** D | **Assignee:** ____

### Goal
Extract bonsai rendering from ZenDashboard into a reusable `<BonsaiGarden leaves={n} streak={m} />` component with react-native-svg.

### Context for the AI agent
- Web bonsai: `<rect>` pot, trunk bezier, dynamic `<g>` for leaves (count driven by progress). Dark-themed gradient around the bonsai for glow effect.
- RN: use `<Svg>` with similar `<Rect>`, `<Path>` for trunk, dynamic `<Circle>` / `<Path>` for leaves, a `<RadialGradient>` for glow.

### Required deliverables
1. `mobile/src/components/dashboard/BonsaiGarden.tsx` — accepts `leaves: number` (derived from `solvedLessons.length`), renders up to 20 leaves in a circular pattern, plus trunk and pot base.

### Validation / acceptance
- 0 solved → 0 leaves visible.
- 5 solved → 5 leaves.
- 10 solved → 10 leaves visible.
- Grow animation (optional).

### Out of scope
- Detailed bonsai style per level.

### Linked files
- read: `web/src/components/dashboard/ZenDashboard.tsx` (bonsai section)
- new: `mobile/src/components/dashboard/BonsaiGarden.tsx`

---

## Issue #031 — Pebble stepping-stone SVG component
**Epic:** dashboard | **Type:** feat | **Priority:** P3 | **Size:** M
**Hard deps:** #025, #022 | **Soft deps:** none | **Stream:** D | **Assignee:** ____

### Goal
Interactive pebble timeline showing 10 lessons as connected stepping stones with locked/unlocked states, connector lines colored green/red, and detail card trigger on tap.

### Context for the AI agent
- Web uses `<svg>` with connector `<line>`+`<path>` and dynamic pebble buttons. Layout: a 2x5 grid (2 rows × 5 columns) for desktop, or vertical zig-zag for mobile.
- Mobile: vertical scrolling list with pebble buttons each spaced vertically, a vertical line connecting them below. Each pebble has a lesson number in a circle; locked pebbles appear grayed, unlocked appear accent-colored.
- On tapping an unlocked pebble, the `activeLessonId` changes and the detail card updates.

### Required deliverables
1. `mobile/src/components/dashboard/PebbleTimeline.tsx`:
   - Renders 10 pebbles with vertical connectors.
   - Uses `solvedLessons` from AppContext to color pebbles.
   - Emits `onSelectLesson(id)` callback.

### Validation / acceptance
- Show 10 pebbles; 2 solved (accent), 3rd unlocked (lighter accent), 4th+ locked (gray).
- Tap unlocked lesson → detail card updates.

### Out of scope
- Horizontal zig-zag layout (mobile-only vertical).

### Linked files
- read: `web/src/components/dashboard/ZenDashboard.tsx` (pebble section)
- new: `mobile/src/components/dashboard/PebbleTimeline.tsx`
