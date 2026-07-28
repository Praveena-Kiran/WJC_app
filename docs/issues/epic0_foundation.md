# Epic 0 — Foundation & Security

> **All issues in this epic are P0 — must complete before any other work starts.**

---

## Issue #001 — Rotate Neon DB password & verify secrets are gitignored
**Epic:** foundation | **Type:** infra | **Priority:** P0 | **Size:** S
**Hard deps:** none | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
The Neon Postgres connection string in `mobile/.env` is on disk with `mobile/` untracked. Rotate Neon credentials now and confirm `mobile/.env` is fully ignored before any code hits `main`, preventing a key leak.

### Context for the AI agent
- The current repo has no root `.gitignore` (root only has `.gitattributes` per commit `34367e4`). `web/.gitignore` exists but only scopes `web/`. `mobile/` is untracked.
- Neon credentials currently live in `mobile/.env` as `DATABASE_URL=postgresql://neondb_owner:...@ep-crimson-pond-...`
- `git check-ignore -v mobile/.env` returns **nothing** (not ignored) as of the audit snapshot.
- Issue #002 will add `.gitignore` files — this issue depends only on the fact they'll be there.

### Required deliverables
1. Rotate the password at the Neon console (reset the `neondb_owner` role password).
2. Update `mobile/.env` with the new `DATABASE_URL`.
3. Verify `git check-ignore -v mobile/.env` shows a gitignore rule covering it.
4. Kill the old password in the provider (Neon console "Reset password" ensures old key is invalidated).

### Technical notes
- The DB host is an AWS `us-east-2` pooler (`ep-crimson-pond-ax8is8xl-pooler.c-4.us-east-2.aws.neon.tech/neondb`). This is a connection-pooler URL — direct connections use the same password; rotate both.
- If there are other secrets in your team's shared env files, similarly rotate them now.
- This issue is manual — it cannot be done by an AI; a human with Neon access must execute it.

### Validation / acceptance
- `git status` shows `mobile/.env` as **ignored** (not listed in untracked).
- Old password fails `psql "$OLD_DATABASE_URL" -c "SELECT 1"`.
- New password succeeds `psql "$DATABASE_URL" -c "SELECT 1"`.
- (After #002 lands) `git add . && git status` confirms only `mobile/` shows up, no `.env`.

### Out of scope
- Rotating AWS keys (not yet in use). Any CI/monitoring of credential expiry.

### Linked files
- existing: `mobile/.env`

---

## Issue #002 — Add `.gitignore` files (mobile + root)
**Epic:** foundation | **Type:** infra | **Priority:** P0 | **Size:** S
**Hard deps:** none | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
Ensure `mobile/.env*`, `node_modules/`, `.expo/`, build artifacts, and OS files are never tracked anywhere, via a root `.gitignore` and `mobile/.gitignore`.

### Context for the AI agent
- The repo root currently has **no `.gitignore`** — it only has `.gitattributes` for line-endings. `web/.gitignore` scopes only the web dir. A blank `mobile/` dir is untracked, and `mobile/.env` contains live credentials.
- See `.gitignore` patterns from web: `web/.gitignore`.
- Expo projects produce these untracked artifacts: `.expo/`, `dist/`, `ios/`, `android/`, `web-build/`, `.env*`, `*.tsbuildinfo`, `*.log`.

### Required deliverables
1. `mobile/.gitignore` with these entries:
   ```
   .env*
   node_modules/
   .expo/
   dist/
   ios/
   android/
   web-build/
   *.tsbuildinfo
   *.log
   .DS_Store
   ```
2. `.gitignore` at repo root:
   ```
   # OS & editor
   .DS_Store
   Thumbs.db
   *.swp
   *.swo
   *~

   # IDE
   .vscode/
   .idea/
   *.code-workspace

   # Environment files (applied recursively)
   **/.env
   **/.env.*
   !**/.env.example
   !**/.env.development.example

   # Dependencies (applied recursively)
   **/node_modules/
   ```
3. Verify that `!` negation rules for `.env.example` work with `git check-ignore` on each pattern.

### Technical notes
- The root `.gitignore` `**/.env` blocks all `.env` files at all levels, while `!.../.env.example` allows only example files.
- `mobile/.gitignore` is more specific so if someone runs `git` from inside mobile, rules still apply.
- Do NOT remove `web/.gitignore` that protects the web folder — keep both.
- Don't forget `.DS_Store` — macOS machines on your team WILL commit it otherwise.

### Validation / acceptance
- `git check-ignore -v mobile/.env` returns the `.gitignore` rule.
- `git check-ignore mobile/.env.example` returns **nothing** (allowed).
- `git add . && git status` — no `.DS_Store`, no `node_modules/`, `mobile/.env` absent, `mobile/.env.example` trackable.

### Out of scope
- `.gitattributes` modification; `.gitignore` in any other subfolder (they're fine).

### Linked files
- new: `.gitignore`, `mobile/.gitignore`
- existing: `web/.gitignore`

---

## Issue #003 — Scaffold Expo SDK 55 app inside `mobile/`
**Epic:** foundation | **Type:** infra | **Priority:** P0 | **Size:** S
**Hard deps:** #001, #002 | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
Run `npx create-expo-app@latest mobile` with the `tabs` template, ending with a bootable app in Expo Go on a real device. Configure `app.json` with Zengo-specific brand values and required plugin registrations.

### Context for the AI agent
- Expo SDK 55 (React Native 0.83, React 19.2) — the latest stable as of July 2026. The app will use Expo Router (file-based) and the New Architecture (enabled by default in SDK 55).
- better-auth Expo integration **requires** New Architecture, which SDK 55 enables by default. Do NOT downgrade to SDK 52 or switch New Architecture off.
- Expo Go on a physical device works for all runtime deps we need (verified in audit: react-native-svg, gesture-handler, reanimated, expo-speech, expo-audio, expo-secure-store, expo-network, expo-document-picker, expo-file-system, expo-sharing, expo-web-browser, expo-linking, expo-constants).

### Required deliverables
1. `cd /path/to/repo` then run `npx create-expo-app@latest mobile --template tabs@latest --no-install` inside a temp dir, then merge the output into the existing `mobile/` folder (which currently has only `.env` and `.gitignore`).
   - Alternatively: blow away `mobile/` except `.env` and `.gitignore`, run `npx create-expo-app@latest mobile --template tabs`, then restore `.env` and `.gitignore`.
2. Verify the scaffold includes `app/`, `components/`, `hooks/`, `constants/`, `assets/`, `app.json`, `babel.config.js`, `tsconfig.json`, `metro.config.js`, `package.json`.
3. Configure `app.json`:
   ```json
   {
     "expo": {
       "name": "Zengo",
       "slug": "zengo",
       "scheme": "zengo",
       "version": "0.1.0",
       "orientation": "portrait",
       "icon": "./assets/images/icon.png",
       "userInterfaceStyle": "automatic",
       "splash": {
         "image": "./assets/images/splash.png",
         "resizeMode": "contain",
         "backgroundColor": "#1a1a2e"
       },
       "ios": { "supportsTablet": true, "bundleIdentifier": "com.zengo.app" },
       "android": { "adaptiveIcon": { "foregroundImage": "./assets/images/adaptive-icon.png", "backgroundColor": "#1a1a2e" } },
       "plugins": [
         "expo-router",
         "expo-secure-store",
         "expo-document-picker",
         "expo-audio"
       ],
       "experiments": { "typedRoutes": true },
       "extra": {
         "apiUrl": ""
       }
     }
   }
   ```
4. Delete the template's default `app/(tabs)/explore.tsx` and `components/ParallaxScrollView.tsx` and any other template clutter. Keep `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx` — rename index to be a skeleton "Hello Zengo" wait screen.
5. Create `mobile/AGENTS.md` with the scaffolding section placeholder.
6. Boot: `npx expo start --clear` and verify on a physical device or simulator → "Hello Zengo" shows.
7. Create `mobile/.env.example` (sample values only):

   ```
   # Client (EXPO_PUBLIC_ prefix required to be visible to the RN runtime via Metro)
   EXPO_PUBLIC_API_URL=http://localhost:8081

   # Server-only (not prefixed with EXPO_PUBLIC_, invisible to mobile bundle)
   DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
   BETTER_AUTH_SECRET=replace-with-64-char-random-secret
   BETTER_AUTH_URL=http://localhost:8081
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_S3_BUCKET_NAME=zengo-study-files
   ```

### Technical notes
- The Metro `unstable_enablePackageExports` flag is ON by default in SDK 53+. Do NOT disable it — better-auth relies on package exports resolution. If you have a custom `metro.config.js`, leave defaults intact.
- The `scheme: "zengo"` value in `app.json` is what `@better-auth/expo` uses for deep links. Pick an app-specific name (not `zengo` if that conflicts with your team).
- Placeholder splash and icon assets — real ones come later in #060.

### Validation / acceptance
- `npx expo start` boots on a physical device with Expo Go.
- `exp://<lanip>:8081` connects and renders "Hello Zengo".
- `npx expo start -c` (clear cache) still works and does NOT show better-auth/pnpm/PackageExports warnings.
- `mobile/.env.example` exists and is tracked by git.

### Out of scope
- Any runtime deps installation (Issue #004).
- Custom splash/icon assets (Issue #060).
- Better-auth or Prisma wiring.
- Removing the `web/` folder (keep it untouched).
- AGENTS.md content beyond the scaffolding header.

### Linked files
- new: `mobile/app.json`, `mobile/package.json`, `mobile/tsconfig.json`, `mobile/babel.config.js`, `mobile/metro.config.js`, `mobile/.env.example`, `mobile/AGENTS.md`

---

## Issue #003b — Document Expo Go compatibility & dev-build escape hatch
**Epic:** foundation | **Type:** docs | **Priority:** P2 | **Size:** S
**Hard deps:** #003 | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
A living section in `AGENTS.md` that lists: (a) all libraries that work in Expo Go today, (b) libraries that would require a dev build / prebuild, and (c) the commands to switch to a dev build if the team ever outgrows Expo Go.

### Context for the AI agent
- We chose Expo Go because all required libs (react-native-svg, gesture-handler, reanimated, expo modules) have Expo Go bundled native code in the standard SDK.
- If someone proposes a non-Expo-Go lib (e.g. `react-native-webrtc`, `@react-native-firebase/analytics`, `react-native-iap`) the team needs to know the escape hatch: `npx expo prebuild` → iOS/Android Xcode/Android Studio projects.
- The audit flagged this as a gap since new contributors might not know the boundary.

### Required deliverables
1. `mobile/AGENTS.md` section `## Expo Go vs Dev Builds`:
   - List all installed libs with "Expo Go ✓" or "Expo Go ✗ (needs dev build)".
   - Add a warning: "Before adding any new dependency, check if it supports Expo Go by searching at <https://docs.expo.dev/versions/latest/> in the SDK reference. If it requires a dev build, discuss with the team lead first."
   - Escape hatch commands: `npx expo prebuild` for the first time, then `npx expo run:ios` / `npx expo run:android`.
   - Note that `npx expo prebuild` is slow (10+ min first time) and the team should batch dev-build-only features.
2. Add a pre-commit checklist item: the implementation does not introduce new native deps without the team lead's approval.

### Technical notes
- The boundary between "Expo Go compatible" and "dev build" is not always clear — some libs have fallbacks. Use the official `expo-doctor` tool to flag incompatible deps: `npx expo-doctor`.
- Add `npx expo-doctor` (or a similar fast equivalent `npx expo install --check`) to the CI pipeline (Issue #065 can incorporate this).

### Validation / acceptance
- `AGENTS.md` section exists with the checklist.
- A teammate reading the file can correctly decide whether a new lib needs a dev build.
- `npx expo-doctor` run against the current deps returns 0.

### Out of scope
- Any actual prebuild or dev-build setup (just docs).
- CI verification (Issue #065 picks this up).

### Linked files
- new: `mobile/AGENTS.md`

---

## Issue #004 — Install & wire all runtime dependencies
**Epic:** foundation | **Type:** infra | **Priority:** P0 | **Size:** M
**Hard deps:** #003 | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
Install every runtime + build-time dependency the app needs into `mobile/package.json`, configure bundler/transpiler, and verify `npx expo start` still boots cleanly.

### Context for the AI agent
- Previous commits had a `mobile/src/core` package (commit `54766ad`) that was reverted — ignore it; start fresh.
- The **client bundle** (what Expo Go loads) must only contain Expo-Go-safe libraries. Server-only libs (`@prisma/client`, `prisma`, `better-auth` server core, `hono`, `@aws-sdk/*`) are installed in the same `package.json` BUT must be excluded from the Metro bundle via `blockList` (Issue #004b builds on this).
- `EXPO_PUBLIC_*` env vars are the only ones visible to the RN runtime. Server-only env vars (DB_URL etc.) do NOT have the prefix and are invisible to Metro.

### Required deliverables
1. Install these into `mobile/package.json` `dependencies`:
   - `better-auth` (v1.x latest; server + client, but Metro blockList protects the client from importing server parts)
   - `@better-auth/expo` (Expo client plugin + server plugin)
   - `expo-secure-store` (session cookie storage)
   - `expo-network` (offline detection)
   - `expo-speech` (Japanese TTS)
   - `expo-audio` (SFX playback; replaces expo-av)
   - `expo-file-system` (download files)
   - `expo-sharing` (open downloaded files in system viewer)
   - `expo-document-picker` (teacher file selection)
   - `expo-web-browser` (social auth OAuth)
   - `expo-linking` (deep link handle)
   - `expo-constants` (env access)
   - `expo-haptics` (press feedback)
   - `react-native-svg` (kana/kanji stroke drawing)
   - `react-native-gesture-handler` (drawing pan)
   - `react-native-reanimated` (~3.x; animated SVG strokes)
   - `@expo/vector-icons` (FontAwesome icon replacements)
   - `@tanstack/react-query` (data fetching/cache; install `@tanstack/react-query-persist-client` for offline)
   - `svg-path-properties` (pure-JS path length for drawing accuracy)
2. Install these into `mobile/package.json` `devDependencies`:
   - `typescript`
   - `@types/react`
   - `eslint`, `eslint-config-expo`
   - `vitest`, `@testing-library/react-native`, `@testing-library/jest-native`
3. Install **server-side deps** (same `package.json`, Metro blockList stops them from bundling — see #004b):
   - `@prisma/client`
   - `prisma`
   - `hono`
   - `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
4. Lint config: extend `eslint-config-expo`, add rule `no-restricted-paths` to forbid `app/**` and `src/components/**` from importing from `server/` or `prisma/`.
5. Clean up `package.json` scripts: `"dev"`, `"lint"`, `"typecheck"`, `"test"`, `"db:migrate"`, `"db:seed"`, `"server:dev"`.
6. Run `npx expo start --clear` and verify no import errors.

### Technical notes
- Do NOT add `expo-font` + `@expo-google-fonts/noto-sans-jp` yet (so early in project) unless already used; Issue #060 handles font polish.
- `svg-path-properties` is pure JS, zero native deps — compatible with Expo Go out of the box.
- `@tanstack/react-query` needs a `QueryClient` singleton + `QueryClientProvider` in the app root. That wiring is issue #009c.
- `react-native-reanimated` requires the `react-native-reanimated/plugin` in `babel.config.js`. The Expo template already includes it by default via `expo-router`'s babel preset — verify but no extra config needed.
- `react-native-gesture-handler` requires `import 'react-native-gesture-handler'` at the top of `app/_layout.tsx`. Ensure this is present.

### Validation / acceptance
- `npx expo start` boots no errors.
- `npx tsc --noEmit` passes.
- `npx expo-doctor` returns clean.
- `npx vitest run` passes (0 tests is OK at this point — you'll add them later).
- `npx eslint .` passes (no lint error, or just pre-existing ones).

### Out of scope
- Metro blockList setup (Issue #004b).
- Auth client initialization (Issue #009).
- Test file writing (Issue #065b writes the first test).

### Linked files
- new: `mobile/package.json`, `mobile/tsconfig.json`, `mobile/.eslintrc.js`, `mobile/babel.config.js`

---

## Issue #004b — Metro `blockList` + ESLint guard to keep server code out of the mobile bundle
**Epic:** foundation | **Type:** infra | **Priority:** P0 | **Size:** M
**Hard deps:** #004 | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
Prevent the Metro bundler from ever resolving `@prisma/client`, `better-auth/server`, `hono`, `@aws-sdk/*`, or any code under `mobile/server/` or `mobile/prisma/` into the Expo Go JS bundle. If a client file accidentally imports server code, the build must fail loudly with a clear error — not silently bundle native Node modules into a broken app.

### Context for the AI agent
- All server code (`better-auth` instance, Prisma client, Prisma schema, seed, S3, Hono handlers) lives at `mobile/server/`. The Expo Router API routes import from `mobile/src/server/` ↔ we'll alias that.
- `prisma` + `@aws-sdk` contain binary Node artifacts or native addons that crash inside Hermes / JavaScriptCore.
- The safest approach: **Metro has a `resolver.blockList`** pattern that can blacklist file paths from resolution. If the app code ever does `import '../../server/auth.ts'`, Metro refuses to resolve with a `ResolutionError`.
- Additionally, an **ESLint `no-restricted-imports`** rule catches accidental server imports at lint time (before Metro even tries).

### Required deliverables
1. `mobile/metro.config.js` — use `getDefaultConfig` from `expo/metro-config`, then extend `resolver.blockList`:
   ```js
   const { getDefaultConfig } = require("expo/metro-config");
   const config = getDefaultConfig(__dirname);
   config.resolver.blockList = [
     ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : [config.resolver.blockList].filter(Boolean)),
     /server\//,           // blocks any import path containing 'server/'
     /prisma\//,           // blocks any import path containing 'prisma/'
     /node_modules\/(?=.*(prisma|@prisma|hono|@aws-sdk)).*/ // blocks server-only node_modules
   ];
   module.exports = config;
   ```
2. `mobile/.eslintrc.js` — add `no-restricted-imports`:
   ```js
   rules: {
     'no-restricted-imports': ['error', {
       patterns: ['**/server/**', '**/prisma/**'],
       paths: [
         { name: '@prisma/client', message: 'Prisma is server-only; use apiFetch()' },
         { name: 'prisma', message: 'Prisma CLI is server-only' },
         { name: 'hono', message: 'Hono is server-only' },
         { name: '@aws-sdk/client-s3', message: 'AWS SDK is server-only; use presigned URL via apiFetch' },
         { name: '@aws-sdk/s3-request-presigner', message: 'AWS SDK is server-only' }
       ]
     }]
   }
   ```
3. Write a small **smoke test** `mobile/src/__tests__/no-server-leak.test.ts` that:
   - Asserts that `require.resolve('@prisma/client')` throws (or at least is not in the bundle scope). Actually that won't work — instead, add an `eslint` plugin-rule check to `eslint.config.js` (or disable that test and keep only lint + Metro guards).
4. Verify: temporarily add `import '@prisma/client'` to `app/_layout.tsx`, run `npx expo start`, see Metro fail with a clear blockList error. Then **revert** the import.

### Technical notes
- The `blockList` regex matches substring `server/` ANYWHERE in the resolved path — if any third-party dep happens to have a folder called `server/` that's needed, the regex will block it, causing a mystery crash. To be safe, narrow the regex to `mobile/server/` or `src/server/`. But for the initial setup with zero third-party server folders, the broad pattern is fine.
- Expo Router API routes (`app/api/...`) import from the same server code. But API routes are **server-side** (Metro runs them when serving the dev API). The blockList should allow `app/api/` to import from `server/` because those routes are not bundled into the client JS. Double-check: Metro serves API routes from Node, not from the Hermes runtime, so the blockList won't apply there. If it does, you can selectively remove API route files from the blockList via a check on the `requestPath`.
- `eslint-plugin-import` `no-restricted-paths` provides zone-based rules (different from `no-restricted-imports`). Choose whichever; both work.

### Validation / acceptance
- `npx eslint .` flags `import ... from '@/server/auth'` with the custom message.
- Adding a temporary server import in `app/_layout.tsx` breaks `npx expo start` with a Metro resolution error (verify the error is clear, not a cryptic native-module crash).
- Removing the temp import restores clean boot.
- `npx expo start` still boots normally.

### Out of scope
- Fine-grained per-API-route allowlist (can be added later if API routes are blocked).
- CI check (folds into #065 once CI exists).

### Linked files
- new: `mobile/metro.config.js`, `mobile/.eslintrc.js`, `mobile/src/__tests__/no-server-leak.test.ts`
