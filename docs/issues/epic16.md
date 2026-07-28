# Epic 16 — Offline, Polish & CI

> **Priority:** P3–P4. Finishing touches: offline-first cache, splash/icons/fonts, loading/error states, haptics, accessibility, i18n skeleton, CI, docs.

---

## Issue #058 — Offline queue + AsyncStorage cache (expo-network)
**Epic:** offline | **Type:** feat | **Priority:** P3 | **Size:** M
**Hard deps:** #009c, #013 | **Soft deps:** none | **Stream:** G | **Assignee:** ____

### Goal
When the device goes offline (detected via `expo-network`), queue write mutations in AsyncStorage and replay them on reconnect. Reference data stays cached (already from #035 + #009c). Show a small "offline" banner.

### Context for the AI agent
- `expo-network.getNetworkStateAsync()` returns `{ isConnected, isInternetReachable }`. Use `useNetworkStatus` hook from `expo-network`.
- Queue saved mutations as a JSON array in AsyncStorage key `zengo_offline_queue`.
- On reconnecting online: replay each queued mutation in order via `apiFetch`, pop on success.
- App state backgrounding/foregrounding triggers re-check.

### Required deliverables
1. `mobile/src/lib/offline.ts` — `queueMutation(mutation: {method, path, body})`, `replayQueue()`.
2. `AppContext` intercepts all mutations → if offline, queue in `offline.ts`; else call `apiFetch`.
3. `OfflineBanner` component (top bar with "You're offline. Changes will be saved when reconnected.").

### Validation / acceptance
- Disable WiFi on device → app shows offline banner.
- Mark a kana as mastered → queued.
- Enable WiFi → kana appears mastered in app + persists in server.

### Out of scope
- Conflict resolution (last-write-wins applied).

### Linked files
- new: `mobile/src/lib/offline.ts`
- edit: `mobile/src/context/AppContext.tsx`

---

## Issue #060 — Splash, icons, fonts (Noto Sans JP)
**Epic:** polish | **Type:** polish | **Priority:** P3 | **Size:** M
**Hard deps:** #003 | **Soft deps:** none | **Stream:** G | **Assignee:** ____

### Goal
Create app icon, adaptive icon, and splash screen using the Zengo brand (禅郷 ZENGO text mark). Load Noto Sans JP via `expo-font` for crisp Japanese glyph rendering.

### Context for the AI agent
- Required dimensions: splash 1242×2436 PNG (iPhone X), adaptive icon 1024×1024 (Android foreground) + preferred 1024×1024 (iOS).
- `@expo-google-fonts/noto-sans-jp` provides the font via a one-liner: `useFonts({ NotoSansJP: require('@expo-google-fonts/noto-sans-jp') })`.
- If full Noto Sans JP is too large (~2.5 MB), use system Japanese fonts as primary, Noto as fallback.
- Icon should be a simple kanji "禅" brush style on a gradient background.

### Required deliverables
1. `mobile/assets/images/icon.png` (1024×1024).
2. `mobile/assets/images/adaptive-icon.png` (1024×1024 foreground).
3. `mobile/assets/images/splash.png` (1242×2436).
4. `mobile/assets/fonts/NotoSansJP-Regular.ttf` (or import via `@expo-google-fonts`).
5. `mobile/app/_layout.tsx` loads the font at boot (`useFonts`).

### Validation / acceptance
- App icon in Expo Go launcher shows the kanji logo.
- Splash screen appears on cold start.
- Japanese characters in the app render with Noto Sans JP (no tofu blocks).

### Out of scope
- Dark/light mode icon variants.

### Linked files
- new: `mobile/assets/images/*`, `mobile/assets/fonts/*`
- edit: `mobile/app/_layout.tsx`

---

## Issue #061 — Loading, empty, and error states across modules
**Epic:** polish | **Type:** polish | **Priority:** P3 | **Size:** M
**Hard deps:** all module issues | **Soft deps:** none | **Stream:** G | **Assignee:** ____

### Goal
Every screen with async data must have a loading skeleton, an empty-state copy, and a retry-on-error state. Add a global `<ErrorBoundary>` that catches render crashes.

### Context for the AI agent
- TanStack Query provides `isLoading`, `isError` state per query. Each `useApiQuery` consumer should render accordingly.
- Skeleton: a shimmer placeholder matching the content shape (e.g., 5 rows of gray boxes for vocabulary list).
- Empty: a centered Text paragraph, e.g., "No starred vocabulary yet! Add stars inside the Dictionary tab →".
- Error: a "Retry" button + the error message snippet.
- Global `ErrorBoundary`: wraps the root `app/_layout.tsx` render; shows "Something went wrong" + Reload + Sign out.

### Required deliverables
1. `mobile/src/components/Skeleton.tsx` — accepts `rows: number`, renders gray boxes.
2. Each screen: use `useApiQuery` → if loading: `<Skeleton rows={5} />`; if error: `ErrorView retry`; if empty: `<EmptyState message={...}/>`.
3. `mobile/src/components/ErrorBoundary.tsx` — simple class component with `componentDidCatch`.
4. Wire in root layout.

### Validation / acceptance
- Pull wifi → Vocabulary screen shows cached data already. Turn wifi off AND clear cache → skeleton loads.
- Tapping Retry after API fails → retries.
- Go to a broken route (test) → ErrorBoundary catches it and shows fallback UI.

### Out of scope
- Sentry / crash reporting integration.

### Linked files
- new: `mobile/src/components/Skeleton.tsx`, `mobile/src/components/ErrorBoundary.tsx`
- edit: multiple screen components

---

## Issue #062 — Haptics
**Epic:** polish | **Type:** polish | **Priority:** P3 | **Size:** S
**Hard deps:** #004 (expo-haptics installed) | **Soft deps:** none | **Stream:** G | **Assignee:** ____

### Goal
Add light/medium haptic feedback to button presses, success confirmations, and long presses across the app. Controlled by `hapticsEnabled` toggle (separate from sound).

### Context for the AI agent
- `expo-haptics` provides `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`, `...Medium`, `...Heavy` and `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`.
- Gate: `if (!state.hapticsEnabled) return;`.
- In settings: separate toggle from `soundEnabled` (two sliders, not one).

### Required deliverables
1. `mobile/src/lib/haptics.ts` — exports `hapticLight()`, `hapticMedium()`, `hapticSuccess()`.
2. Wire to buttons: nav, tab presses, quiz answer, marking a task, solving a lesson, drawing check success.
3. Settings toggle for haptics.

### Validation / acceptance
- Press a navigation button → light tap vibration on device.
- Complete quiz → success haptic vibration.
- Tap check → correct feedback (medium).
- Disable in settings → no haptics triggered.

### Out of scope
- Haptic patterns for specific tasks.

### Linked files
- new: `mobile/src/lib/haptics.ts`
- edit: settings screen, AppContext, tab bar

---

## Issue #063 — Accessibility pass
**Epic:** polish | **Type:** polish | **Priority:** P3 | **Size:** M
**Hard deps:** all UI issues | **Soft deps:** none | **Stream:** G | **Assignee:** ____

### Goal
Add `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`, and 44pt minimum touch areas to all interactive elements so the app works with VoiceOver/TalkBack.

### Context for the AI agent
- Each `TouchableOpacity` should have an `accessibilityLabel` describing what it does. E.g., "Kana あ. A. Hiragana. Tap to learn."
- Buttons: `accessibilityRole="button"`. Tabs: `accessibilityRole="tab"`. Switches: `accessibilityRole="switch"`.
- All touch targets ≥ 44pt (min 44dp on RN).

### Required deliverables
1. Audit every component file and add `accessibilityLabel` etc.
2. Test by activating VoiceOver on iOS simulator → run through each screen → ensure correct reading order.

### Validation / acceptance
- VoiceOver reads each kana card as "Kana あ. A. Hiragana. Tap to learn." and speaks the correct meaning.
- Tapping "Speak" button with VoiceOver active → reads "Speak pronunciation".

### Out of scope
- Custom focus order.

### Linked files
- edit: all UI components

---

## Issue #064 — i18n/l10n scaffolding (English lock for v1)
**Epic:** polish | **Type:** polish | **Priority:** P4 | **Size:** S
**Hard deps:** none | **Soft deps:** none | **Stream:** G | **Assignee:** ____

### Goal
Add an `i18n` skeleton using `expo-localization` and a small `en.json` with all UI copy strings — so future Japanese/other language UI strings can drop in without a full refactor.

### Required deliverables
1. `mobile/src/lib/i18n/en.json` — strings extracted from all component text (e.g., `"dashboard.welcome": "こんにちわ, Learner"`).
2. `mobile/src/lib/i18n/index.ts` — single `t(key: string): string` function reading from the JSON.
3. All component hardcoded copy replaced by `t('key')`.

### Validation / acceptance
- Changing a string in `en.json` immediately reflects in the app.

### Out of scope
- Full localization or RTL layout.

### Linked files
- new: `mobile/src/lib/i18n/en.json`, `mobile/src/lib/i18n/index.ts`

---

## Issue #065 — CI: lint, typecheck, prisma validate
**Epic:** polish | **Type:** infra | **Priority:** P2 | **Size:** M
**Hard deps:** #005 | **Soft deps:** #004 | **Stream:** G | **Assignee:** ____

### Goal
GitHub Actions workflow (`.github/workflows/mobile-ci.yml`) that runs node 20, `npm ci`, `npx tsc --noEmit`, `npx eslint .`, `npx prisma validate`, `npx prisma migrate status` against a throwaway Postgres service (or skip migrate status if Neon not reachable in CI, validate is enough). Block PRs on failure.

### Required deliverables
1. `.github/workflows/mobile-ci.yml`:
   ```yaml
   name: Mobile CI
   on: [push, pull_request]
   jobs:
     lint-typecheck:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: 20, cache: "npm", cache-dependency-path: mobile/package-lock.json }
         - run: cd mobile && npm ci
         - run: cd mobile && npx tsc --noEmit
         - run: cd mobile && npx eslint .
         - run: cd mobile && npx prisma validate
   ```

### Validation / acceptance
- PR pushes green; intentional lint error → CI red.

### Out of scope
- E2E tests, device builds.

### Linked files
- new: `.github/workflows/mobile-ci.yml`

---

## Issue #065b — Minimal test setup (`vitest` + `@testing-library/react-native`)
**Epic:** polish | **Type:** infra | **Priority:** P2 | **Size:** M
**Hard deps:** #004 | **Soft deps:** none | **Stream:** G | **Assignee:** ____

### Goal
Configure `vitest` to run tests for pure utils (`conjugator.ts`, `check-drawing.ts`, `api-fetch.ts`, `srs.ts`) and a minimal render test for one component (`DictionaryView` or `KanaTrainer`). Not comprehensive — just a working test harness so the team can add tests incrementally.

### Required deliverables
1. `mobile/vitest.config.ts` — using `@testing-library/react-native` preset.
2. First test file: `mobile/src/__tests__/conjugator.test.ts` (already authored in #039).
3. Second test file: `mobile/src/__tests__/check-drawing.test.ts` (already authored in #023).
4. Third test file: `mobile/src/components/__tests__/DictionaryView.test.tsx` — smoke test (renders a `Text` with word content).
5. `npm run test` script: `vitest run`.

### Validation / acceptance
- `npm run test` passes (4 test files green).
- Running with `--reporter verbose` lists individual test names.

### Out of scope
- 100% coverage or snapshot tests.

### Linked files
- new: `mobile/vitest.config.ts`
- edit: `mobile/package.json`

---

## Issue #066 — CI: container build smoke test
**Epic:** polish | **Type:** infra | **Priority:** P3 | **Size:** S
**Hard deps:** #015, #065 | **Soft deps:** none | **Stream:** G | **Assignee:** ____

### Goal
Add a job to the CI workflow that builds the Docker image, starts it, and curls `/healthz` expecting 200. Catches `Dockerfile` drift before merging.

### Required deliverables
1. Extend `.github/workflows/mobile-ci.yml` with:
   ```yaml
   docker-build:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
       - run: docker build -t zengo-api -f mobile/Dockerfile mobile/
       - run: docker run -d -p 8081:8081 -e DATABASE_URL=${{ secrets.DATABASE_URL }} -e BETTER_AUTH_SECRET=test-secret zengo-api
       - run: curl --retry 5 --retry-connrefused http://localhost:8081/healthz
   ```
2. Add `DATABASE_URL` as a GitHub Actions secret.

### Validation / acceptance
- CI green on `docker build` and curl returns 200.

### Out of scope
- Full integration test of all API routes.

### Linked files
- edit: `.github/workflows/mobile-ci.yml`

---

## Issue #067 — AGENTS.md / README for the team
**Epic:** polish | **Type:** docs | **Priority:** P3 | **Size:** M
**Hard deps:** #003 (app exists) | **Soft deps:** none | **Stream:** G | **Assignee:** ____

### Goal
A comprehensive developer README at `mobile/AGENTS.md` covering: local setup (env vars, rotate Neon pw), `npx expo start`, `npx prisma migrate dev`, `npm run db:seed`, server dev (`npm run server:dev`), Docker build, routing map (Expo Router anatomy), theme token sources, drawing util API, SFX generation, known ports (8081 Metro), and build commands.

### Required deliverables
1. `mobile/AGENTS.md` with table of contents + sections:
   - Setup (Clone, .env, rotate Neon pw, `npx expo start`)
   - Prisma (schema, migration, seed)
   - Server (Hono layout, Docker)
   - Routing (app structure, tabs, drawer, api routes)
   - Themes (token map)
   - Drawing engine (API)
   - Audio (Speech + SFX)
   - Testing
   - CI
   - Adding a new library (Expo Go vs dev build)

### Validation / acceptance
- A new teammate can clone the repo, follow `AGENTS.md` from top to bottom, and boot the app in Expo Go + see a seeded database.

### Out of scope
- Project history or management structure.

### Linked files
- new: `mobile/AGENTS.md`

---

## Issue #039b — Document Expo Go vs dev-build escape hatch
**Epic:** polish | **Type:** docs | **Priority:** P2 | **Size:** S
**Hard deps:** #003b | **Soft deps:** none | **Stream:** G | **Assignee:** ____

### Goal
Already part of #003b. This issue ensures the `AGENTS.md` section "Expo Go vs Dev Builds" is properly documented. If already done, verify it's correct.

### Required deliverables
- Copy the text from #003b into `AGENTS.md` if not already there.
- Ensure the `npx expo-doctor` check is listed.
- List known Expo Go–compatible libraries (all deps listed in #004).

### Validation / acceptance
- Section exists, lists libraries, has command to migrate to dev build.

### Out of scope
- Actual migration.

### Linked files
- edit: `mobile/AGENTS.md`
- existing: mobile/AGENTS.md
