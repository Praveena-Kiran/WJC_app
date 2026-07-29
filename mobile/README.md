# Zengo Mobile — Developer Guide & Architecture README

Welcome to the **Zengo Mobile** codebase! This repository contains the mobile client application built with **Expo SDK 55** (React Native 0.83, React 19.2) and its companion **Hono Node backend container** backed by **Neon Postgres** and **Prisma ORM**.

This guide outlines essential developer rules, setup instructions, architecture maps, and workflows to ensure seamless collaboration and prevent common technical pitfalls.

---

## 🚨 CRITICAL RULES — HOW TO NOT MESS UP THIS CODEBASE

Every contributor (human or AI) **must adhere strictly** to these six rules:

### 1. 🛡️ Keep Server Code Out of the Client Bundle
* **Rule:** Client components in `app/` and `src/components/` must **NEVER** import from `mobile/server/`, `mobile/prisma/`, `@prisma/client`, `hono`, `@aws-sdk/*`, or `better-auth/server`.
* **Enforcement:** Metro `resolver.blockList` in `metro.config.js` and ESLint `no-restricted-imports` will actively break the build if a server module is imported into the client bundle.
* **Solution:** Always use the `apiFetch()` wrapper (`src/lib/api.ts`) to communicate with backend REST endpoints via standard HTTP requests.

### 2. 🔐 Respect Environment Variable Scoping (`EXPO_PUBLIC_`)
* **Client Variables:** Environment variables accessed inside the React Native bundle **MUST** be prefixed with `EXPO_PUBLIC_` (e.g., `EXPO_PUBLIC_API_URL`).
* **Server-Only Secrets:** Sensitive keys such as `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `AWS_SECRET_ACCESS_KEY` must **NEVER** use the `EXPO_PUBLIC_` prefix to prevent leaking secrets into client bundles.

### 3. 📱 Check Expo Go Compatibility Before Adding Dependencies
* **Rule:** All runtime libraries must be compatible with the **Expo Go** native runtime.
* **Escape Hatch:** Do **NOT** install packages requiring custom native code (e.g., `@react-native-firebase/*`, `react-native-webrtc`) without team lead approval. If custom native code becomes necessary, run `npx expo prebuild` to switch to Expo Dev Builds (`npx expo run:ios` / `npx expo run:android`).
* **Verification:** Always run `npx expo-doctor` after adding new dependencies.

### 4. 🗄️ Database Migrations vs. Seeding in Production
* **Rule:** Production/Docker entrypoints execute `npx prisma migrate deploy` to safely apply pending schema changes.
* **Strict Prohibition:** **NEVER** run `prisma db seed` inside Docker build stages, production containers, or deployment scripts. Database seeding is strictly a local development task (`npm run db:seed`).

### 5. 🔑 Do Not Manually Edit Auto-Generated Auth Schema
* **Rule:** Better Auth manages four core models: `User`, `Session`, `Account`, and `Verification`.
* **Workflow:** Define your own application models in `prisma/schema.prisma`, execute `@better-auth/cli generate` to append auth tables, and then add back-relations. Never hand-edit the auto-generated models directly.

### 6. 🔒 Secrets & Git Hygiene
* **Rule:** Never commit live `.env` files. Verify that `git check-ignore -v mobile/.env` returns an active `.gitignore` rule.
* **Action:** If credentials are ever accidentally exposed, rotate Neon DB passwords immediately via the Neon Console.

---

## 🛠️ Prerequisites & Local Setup

### Prerequisites
* **Node.js**: v20.0.0 or higher
* **npm**: v10.0.0 or higher
* **Expo Go**: Installed on an iOS or Android physical device, or Xcode Simulator / Android Studio Emulator

### Step-by-Step Installation

1. **Navigate to the Mobile Directory:**
   ```bash
   cd mobile
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
   *Fill in your local Neon Postgres `DATABASE_URL` and `BETTER_AUTH_SECRET`.*

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run Database Migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Seed Initial Reference Data:**
   ```bash
   npm run db:seed
   ```

6. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Scan the generated QR code with your device camera (iOS) or the Expo Go app (Android).

---

## 🗺️ Project Architecture & Directory Map

```
mobile/
├── .env.example              # Sample environment variable template
├── .eslintrc.js              # ESLint configuration with server-leak guards
├── Dockerfile                # Multi-stage production container build
├── docker-compose.yml        # Docker Compose configuration for backend testing
├── metro.config.js           # Metro bundler config with blockList enforcement
├── package.json              # Project dependencies and script runner
├── tsconfig.json             # TypeScript configuration for mobile app
├── tsconfig.server.json      # TypeScript configuration for Hono backend
│
├── app/                      # Expo Router File-Based Navigation (Client & API)
│   ├── _layout.tsx           # App root wrapper (Providers, Splash, GestureHandler)
│   ├── index.tsx             # Entry / landing page
│   ├── (auth)/               # Auth route group (login, sign-up, password reset)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/               # Main bottom tab bar (Student views)
│   │   ├── _layout.tsx       # Bottom tab bar setup & role gating
│   │   ├── index.tsx         # Dashboard / Home
│   │   ├── kana.tsx          # Kana learning module
│   │   ├── dictionary.tsx    # Dictionary lookup module
│   │   ├── kanji.tsx         # Kanji practice module
│   │   └── quiz.tsx          # Quiz module
│   ├── more/                 # Drawer / secondary navigation
│   │   ├── _layout.tsx       # Drawer layout configuration
│   │   ├── profile.tsx       # User profile screen
│   │   ├── settings.tsx      # Settings & theme selector
│   │   └── roadmap.tsx      # N5 curriculum roadmap
│   └── api/                  # Expo Router dev API routes (proxying to server handlers)
│
├── src/                      # Mobile Application Source Code
│   ├── components/           # Reusable UI components
│   │   ├── MobileHeader.tsx  # Header with logo, safe area, and settings trigger
│   │   ├── SoundBanner.tsx   # Top banner notification for sound feedback
│   │   └── N5PlannerView.tsx # Curriculum planner view
│   ├── context/              # React Context State Providers
│   │   ├── AppContext.tsx    # Global application state
│   │   ├── AuthContext.tsx   # Authentication session state
│   │   └── ThemeContext.tsx  # Dynamic theme provider
│   ├── lib/                  # Client utility modules
│   │   ├── api.ts            # Client HTTP fetch wrapper (apiFetch)
│   │   ├── sound.ts          # Local SFX player (expo-audio)
│   │   ├── speech.ts         # Japanese Text-To-Speech engine (expo-speech)
│   │   └── drawing.ts        # SVG path algorithms & accuracy scoring
│   ├── server/               # Hono Backend Application Code (Server-Only!)
│   │   ├── app.ts            # Top-level Hono app & route mounting
│   │   ├── auth.ts           # Better Auth instance configuration
│   │   └── handlers/         # API Route Handlers
│   │       ├── attendance.ts
│   │       ├── files.ts
│   │       ├── progress.ts
│   │       ├── quiz.ts
│   │       ├── reference.ts
│   │       └── upload.ts
│   └── theme/                # Design Tokens & Styling System
│       └── tokens.ts         # Theme tokens (Zen, Cyber Dark, Cyber Light)
│
├── server/                   # Standalone Server Entrypoint
│   └── index.ts              # Node HTTP server wrapper for production/local dev
│
├── prisma/                   # Database Schemas & Migrations
│   ├── schema.prisma         # Combined Prisma database schema
│   └── seed.ts               # Database seed script for reference data
│
└── assets/                   # Static Media Assets
    ├── images/               # App icons, splash screens, adaptive icons
    └── sfx/                  # Sound effect files (.wav)
```

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Expo Go Metro bundler (`npx expo start --clear`) on port `8081`. |
| `npm run server:dev` | Runs the standalone Hono Node server locally with auto-reload (`tsx watch server/index.ts`). |
| `npm run typecheck` | Validates TypeScript types across the codebase (`npx tsc --noEmit`). |
| `npm run lint` | Runs ESLint to enforce code style and detect server code leaks (`npx eslint .`). |
| `npm run test` | Executes unit and integration tests using Vitest (`npx vitest run`). |
| `npm run db:migrate` | Runs pending Prisma migrations in local development (`npx prisma migrate dev`). |
| `npm run db:seed` | Populates local Neon Postgres database with initial reference datasets (`npx prisma db seed`). |
| `npx expo-doctor` | Validates installed package versions against Expo SDK 55 compatibility rules. |

---

## 🎨 Theme & Design System

Zengo Mobile implements a flexible theme system managed via `ThemeContext` and tokens in `src/theme/tokens.ts`. 

The app supports three curated themes:
1. **Zen (`.theme-zen`)**: Calming, neutral, focused study palette.
2. **Cyber Dark (`.theme-cyber-dark`)**: Deep dark mode with high-contrast neon accents.
3. **Cyber Light (`.theme-cyber-light`)**: Clean, crisp light mode with subtle cyber styling.

### Using Themes in Components
Always consume theme tokens from `useTheme()` context rather than hardcoding hex colors:
```tsx
import { useTheme } from '@/context/ThemeContext';

export function ExampleComponent() {
  const { tokens } = useTheme();
  return (
    <View style={{ backgroundColor: tokens.bgPrimary }}>
      <Text style={{ color: tokens.textPrimary }}>Hello Zengo</Text>
    </View>
  );
}
```

---

## ✏️ Subsystems & Engines

### 1. Canvas & Drawing Engine
* **Libraries:** `react-native-svg`, `react-native-gesture-handler`, `react-native-reanimated`, `svg-path-properties`.
* **Purpose:** Enables real-time kanji and kana stroke drawing, stroke order validation, path length calculation, and accuracy scoring.

### 2. Audio & Speech Subsystem
* **Japanese TTS:** `expo-speech` provides native voice synthesis for Japanese vocabulary and practice phrases.
* **Sound Effects (SFX):** `expo-audio` plays bundled `.wav` assets in `assets/sfx/` (`click.wav`, `correct.wav`, `incorrect.wav`, `success.wav`).

### 3. Auth & Session Management
* **Engine:** `better-auth` paired with `@better-auth/expo` and `expo-secure-store`.
* **Persistence:** Auth sessions persist securely across app relaunches using `expo-secure-store`.

---

## 🐳 Docker & Containerization

The production backend container hosts the Hono API server independently of the Expo client.

### Building & Running Local Container
```bash
docker compose up --build
```

### Docker Architecture Highlights
* **Multi-Stage Build:** Standardized on `node:20-alpine` for minimal image footprint.
* **Prisma Engine Generation:** Generates Linux-compatible Prisma binaries inside the build container stage.
* **Startup Sequence:** Executes `npx prisma migrate deploy` on container startup before initiating Node.

---

## ✅ Pre-Commit / PR Checklist

Before creating a pull request or pushing code to repository branches, ensure all of the following checks pass:

- [ ] **No Server Leaks:** Verify client files (`app/`, `src/components/`) do not import `@prisma/client`, `hono`, `@aws-sdk/*`, or server routes.
- [ ] **TypeScript Check:** `npm run typecheck` completes with `0 errors`.
- [ ] **ESLint Verification:** `npm run lint` passes cleanly.
- [ ] **Expo Go Health:** `npx expo-doctor` reports no package incompatibility warnings.
- [ ] **Secret Protection:** Verify `git check-ignore -v mobile/.env` confirms `.env` is untracked.
- [ ] **Theme Parity:** All new UI elements utilize `ThemeContext` design tokens.
