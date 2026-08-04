# Zengo Mobile — AGENTS.md & Contributor Guidelines

This document provides essential instructions for AI agents and human developers working on the `mobile` codebase. For the full developer guide, architectural overview, and setup instructions, see [README.md](./README.md).

---

## 🚨 Critical Architectural Guards

1. **Client-Server Boundary Isolation**:
   - Client code (`app/`, `src/components/`, `src/context/`, `src/lib/`) **must never** import server dependencies (`@prisma/client`, `hono`, `@aws-sdk/*`, `better-auth/server`, or `src/server/`).
   - Server imports are blocked via Metro `resolver.blockList` (`metro.config.js`) and ESLint `no-restricted-imports` (`.eslintrc.js`).
   - Client code must communicate with server endpoints via `apiFetch()` (`src/lib/api.ts`).

2. **Environment Variable Visibility**:
   - Variables prefixed with `EXPO_PUBLIC_` are bundled into the client app.
   - Sensitive keys (`DATABASE_URL`, `BETTER_AUTH_SECRET`, AWS credentials) must **not** have `EXPO_PUBLIC_` and must remain server-side.

3. **Expo Go Compatibility**:
   - All installed packages must support Expo Go.
   - Run `npx expo-doctor` to verify package compatibility.
   - Escape hatch for native dependencies: `npx expo prebuild` then `npx expo run:ios` / `npx expo run:android`.

4. **Production DB Migrations**:
   - Docker container runs `npx prisma migrate deploy` on startup.
   - **Never** include `prisma db seed` in production or Docker entrypoints.

---

## 📱 Expo Go vs Dev Builds Library Support

| Dependency | Expo Go Supported | Dev Build Needed | Notes |
| :--- | :---: | :---: | :--- |
| `better-auth` / `@better-auth/expo` | ✓ | | Web & Expo plugin |
| `expo-secure-store` | ✓ | | Secure cookie storage |
| `expo-network` | ✓ | | Offline detection |
| `expo-audio` | ✓ | | SFX playback |
| `expo-file-system` | ✓ | | File downloads |
| `expo-sharing` | ✓ | | System file viewer |
| `expo-document-picker` | ✓ | | File picker |
| `expo-web-browser` | ✓ | | OAuth web browser |
| `expo-linking` | ✓ | | Deep linking (`zengo://`) |
| `react-native-svg` | ✓ | | Kana/Kanji drawing |
| `react-native-gesture-handler` | ✓ | | Gesture detection |
| `react-native-reanimated` | ✓ | | Smooth animations |
| `@tanstack/react-query` | ✓ | | Data fetching & cache |
| `svg-path-properties` | ✓ | | Pure JS path calculations |
| Native WebRTC / Custom C++ Native Modules | ✗ | ✓ | Requires `npx expo prebuild` |

---

## 🎨 Design System (Theming & UI Primitives)

All UI must use the centralized theme system. **Never hardcode hex colors or emojis.**

- **Theme tokens**: `import { useTheme } from '@/src/theme/ThemeContext'` — provides `theme.background`, `theme.surface`, `theme.border`, `theme.text`, `theme.textMuted`, `theme.accent`, `theme.accentMuted`, `theme.onAccent`, `theme.success`, `theme.warning`, `theme.error`, etc.
- **Layout tokens**: `import { SPACING, RADIUS, TYPE, CARD_SHADOW } from '@/src/theme/tokens'`
- **UI primitives**: `import { Screen, Card, Button, Input, Chip, Badge, ProgressBar, Icon, ListItem, SegmentedControl } from '@/src/components/ui'`
- **State views**: `import { LoadingSkeleton, EmptyState, ErrorBanner } from '@/src/components/common/StateViews'`
- **Icons**: Use the `Icon` component (Feather glyphs). No emojis. Kana/Kanji tab icons use あ/漢 text glyphs.
- **Theme preference** is persisted to AsyncStorage and supports system/light/dark with an in-app toggle in Settings.

---

## 🛠️ Essential Commands

- **Start Metro Bundler (Expo Go)**: `npm run dev` (`npx expo start --clear`)
- **Start Standalone Server**: `npm run server:dev` (`tsx watch server/index.ts`)
- **Type Check**: `npm run typecheck` (`npx tsc --noEmit`)
- **Lint Codebase**: `npm run lint` (`npx eslint .`)
- **Run Tests**: `npm run test` (`npx vitest run`)
- **Migrate Database (Dev)**: `npm run db:migrate` (`npx prisma migrate dev`)
- **Seed Database**: `npm run db:seed` (`npx prisma db seed`)
- **Check Expo Compatibility**: `npx expo-doctor`
