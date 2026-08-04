# WJC App Team Guidelines & Agent Instructions

Welcome to the **WJC App (Zengo • 禅語)** codebase!

## Development Workflow Guidelines
1. **TypeScript Strictness**: Keep zero `tsc --noEmit` errors across both `mobile` and `web` projects.
2. **Vitest Unit Testing**: Every utility or component feature must have associated unit/integration tests running under `npx vitest run`.
3. **Expo Go vs Custom Dev Builds**:
   - For rapid prototyping, run `npx expo start` with **Expo Go**.
   - For native plugins (`@sentry/react-native`), build a custom dev client using `npx expo run:android` or `npx expo run:ios`.
4. **Codebase Structure**:
   - `mobile/`: React Native Expo app (Expo Router v3).
   - `web/`: Next.js 15 web application.
   - `mobile/src/server/`: Hono server API handlers.
