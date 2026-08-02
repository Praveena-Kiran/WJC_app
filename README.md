# Zengo (禅語) — JLPT N5 Japanese Learning Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2055-000000.svg)](https://expo.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000.svg)](https://nextjs.org/)
[![Hono](https://img.shields.io/badge/Hono-API-E36002.svg)](https://hono.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-6E9F18.svg)](https://vitest.dev/)

**Zengo (禅語)** is a modern, full-stack Japanese learning platform designed to take learners from zero to JLPT N5 proficiency. It provides interactive Kana (Hiragana & Katakana) and Kanji stroke-order drawing practice, Spaced Repetition System (SRS) flashcards, structured syllabus stepping stones, native audio pronunciation, and dedicated dashboards for both self-learners and classroom environments.

---

## 🌟 Key Features

* **✍️ Interactive Stroke Order Practice**: Real-time canvas drawing with SVG path recognition, stroke order validation, and instant visual/haptic feedback for Hiragana, Katakana, and JLPT N5 Kanji.
* **🎯 JLPT N5 Syllabus & Stepping Stones**: Structured learning roadmap breaking down vocabulary, grammar rules, particle usage, and kanji into manageable nodes.
* **🎴 SRS Flashcards & Quizzes**: Spaced Repetition memory retention system and adaptive quizzes to reinforce mastery over time.
* **🎧 Native Audio & Pronunciation**: Built-in audio playback (`expo-audio`) and native text-to-speech engine (`expo-speech`) for authentic Japanese pronunciation.
* **📊 Multi-Dashboard Experience**:
  * **Zen Dashboard**: Serene, distraction-free daily goal tracking.
  * **Cyber-Zen Dashboard**: Gamified experience with streaks, XP, and futuristic visuals.
  * **Woxsen Student Dashboard**: Structured curriculum overview for course enrolled students.
  * **Teacher & Admin Dashboard**: Roster management, student attendance tracking, and course vault file distribution via AWS S3 presigned URLs.
* **🔐 Modern Authentication & API**: Secure auth powered by **Better Auth** with Expo deep-linking support (`zengo://`), request rate limiting, and CORS isolation.

---

## 🏗️ Tech Stack

### Mobile Client (`mobile/`)
* **Framework**: [Expo SDK 55](https://expo.dev/) / React Native 0.81+, [Expo Router v6](https://docs.expo.dev/router/introduction/) (File-based routing)
* **UI & Animation**: React Native Reanimated, Gesture Handler, React Native SVG
* **State & Query**: TanStack Query (React Query) v5 with Async Storage persistence
* **Testing**: Vitest (`npx vitest run`), React Native Testing Library

### Backend Server (`mobile/src/server/`)
* **Framework**: [Hono](https://hono.dev/) (Lightweight, ultra-fast web framework)
* **Database**: PostgreSQL (Neon Database) managed via [Prisma ORM](https://www.prisma.io/)
* **Auth**: Better Auth with Expo integration (`@better-auth/expo`)
* **Storage**: AWS S3 S3Client & presigned URL generation for course materials

### Web Application (`web/`)
* **Framework**: [Next.js 16](https://nextjs.org/) (App Router), React 19, TypeScript

---

## 📁 Repository Structure

```
WJC_app/
├── mobile/                   # React Native Expo Application & Hono Server
│   ├── app/                  # Expo Router file-based screens & API routes
│   │   ├── (auth)/           # Authentication screens (Login, Sign Up)
│   │   ├── (tabs)/           # Main app navigation tabs
│   │   └── api/              # Hono server entry point (`app/api/[...starts]+api.ts`)
│   ├── components/           # Reusable UI components (Canvas, Cards, Modals)
│   ├── prisma/               # Database schema (`schema.prisma`) & seed script (`seed.ts`)
│   └── src/
│       ├── components/       # Core app components & dashboards
│       ├── lib/              # API clients & utility functions
│       └── server/           # Hono API routes, handlers, & middleware
│           └── handlers/     # API handlers (attendance, files, progress, quiz, upload)
├── web/                      # Next.js 16 Web Application
│   └── src/                  # Next.js App Router components & pages
├── docs/                     # Architectural guides & setup docs
│   ├── DEEP_LINKS.md         # Deep linking specification (`zengo://`)
│   ├── EAS_SECRETS.md        # EAS build secrets setup
│   └── OTA_UPDATES.md        # Expo Over-The-Air updates configuration
├── Dockerfile                # Production multi-stage Docker build
└── docker-compose.yml        # Docker compose runner for local/staging server execution
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v20.0.0 or higher
* **npm**: v10.0.0 or higher
* **Expo Go** app on iOS/Android physical device, or Xcode Simulator / Android Studio Emulator

### Mobile Setup & Execution

1. **Navigate to the mobile app directory:**
   ```bash
   cd mobile
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to create `.env`:
   ```bash
   cp .env.example .env
   ```
   *Set your local/remote Neon PostgreSQL `DATABASE_URL` and `BETTER_AUTH_SECRET`.*

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run Database Migrations & Seed:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start Development Server:**
   ```bash
   # Run Expo bundler with cleared cache
   npm run dev
   ```
   *Scan the generated QR code with your mobile device or press `i` for iOS Simulator / `a` for Android Emulator.*

### Web App Setup

```bash
cd web
npm install
npm run dev
```

---

## 🐳 Docker Deployment

The repository includes a multi-stage `Dockerfile` and `docker-compose.yml` to run the backend server in containerized environments:

```bash
# Build and run backend container
docker-compose up --build -d
```

---

## 🧪 Testing & Verification

Maintain zero TypeScript errors and ensure all Vitest unit tests pass prior to submitting changes:

```bash
# Run TypeScript strict typecheck
npm --prefix mobile run typecheck

# Run Vitest test suite
npm --prefix mobile run test
```

---

## 📖 Developer Guidelines

1. **Client/Server Isolation**: Code in `mobile/app/` and `mobile/src/components/` must **never** import server packages (`@prisma/client`, `hono`, `better-auth/server`). Use `apiFetch()` to communicate with backend endpoints.
2. **Scoped Environment Variables**: Only expose client-side variables with `EXPO_PUBLIC_` prefix (e.g. `EXPO_PUBLIC_API_URL`). Keep database credentials and secrets private.
3. **Expo Go vs Custom Dev Builds**:
   * Standard UI features run out-of-the-box in **Expo Go** (`npx expo start`).
   * When modifying native plugins, build a custom development build via `npx expo run:android` or `npx expo run:ios`.

---

## 📄 Documentation & Resources

* 🔗 [Deep Linking Guide](docs/DEEP_LINKS.md)
* 🔐 [EAS Secrets Configuration](docs/EAS_SECRETS.md)
* 🚀 [OTA Updates Guide](docs/OTA_UPDATES.md)

---

## 📜 License

This project is licensed under the [MIT License](mobile/LICENSE).
