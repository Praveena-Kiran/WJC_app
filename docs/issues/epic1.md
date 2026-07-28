# Epic 1 — Auth & Database

> **Priority:** P0–P1. Auth must be solid before any UI; DB must be seeded before any module reads data.

---

## Issue #005 — Prisma schema, adapter, and better-auth init
**Epic:** auth | **Type:** seed/infra | **Priority:** P0 | **Size:** XL
**Hard deps:** #004b | **Soft deps:** #001 (rotated pw) | **Stream:** A | **Assignee:** ____

### Goal
Author the complete Prisma schema (reference + user-owned + better-auth-generated tables), wire the better-auth server instance using the Prisma adapter with the Expo plugin, and migrate both into Neon.

### Context for the AI agent
- Database: Neon Postgres (serverless Postgres). Connection URL from `DATABASE_URL` env var.
- Better-auth adapter: `prismaAdapter` from `better-auth/adapters`. The adapter takes `(prismaClient, { provider: "pg" })`.
- `@better-auth/cli generate` scans `auth.ts` and **appends** `model User`, `model Session`, `model Account`, `model Verification` to the configured `schema.prisma` output. Re-running it overwrites the generated section, so never hand-edit those four models.
- Sequence matters: 1) write own models in `schema.prisma` 2) run CLI generate 3) add back-relations to the auto-generated `User` model 4) migrate.

### Required deliverables
1. `mobile/prisma/schema.prisma` — begin with generator + datasource, then define **only these own models first**:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── Reference (seeded, read-only) ────────────────────────
model Lesson {
  id          Int      @id
  title       String
  jpTitle     String
  description String
  syllabus    Json
  kanji       String[]
  vocabulary  String[]
}

model Kana {
  id          String       @id
  char        String
  romaji      String
  type        String       // "hiragana" | "katakana"
  vocab       String
  translation String
  notes       String?
  example     Json?
  strokes     KanaStroke[]
}

model KanaStroke {
  id         Int    @id @default(autoincrement())
  char       String
  pathIndex  Int
  d          String
  kana       Kana   @relation(fields: [char], references: [char])
  @@unique([char, pathIndex])
}

model Vocabulary {
  id       Int    @id @default(autoincrement())
  word     String
  reading  String
  romaji   String
  english  String
  tag      String // "Noun" | "Verb" | "Adjective"
  type     String? // "u" | "ru" | "irr" | "i" | "na" — null for non-verbs/adjectives
  lesson   Int
  example  Json
  @@index([tag])
}

model Kanji {
  char     String  @id
  level    String  // "N5" | "N4"
  meaning  String
  onyomi   String
  kunyomi  String
  strokes  KanjiStroke[]
  @@index([level])
}

model KanjiStroke {
  id        Int    @id @default(autoincrement())
  char      String
  pathIndex Int
  d         String
  kanji     Kanji  @relation(fields: [char], references: [char])
  @@unique([char, pathIndex])
}

model KaiwaScenario {
  id          String @id
  title       String
  jpTitle     String
  category    String
  icon        String
  description String
  dialogue    Json
}

model PronunciationPhrase {
  id             String  @id
  japanese       String
  romaji         String
  english        String
  category       String
  pitchName      String
  pitchType      String  // "heiban" | "atamadaka" | "nakadaka" | "odaka"
  moras          String[]
  moraPitches    String[]
  pitchDropIndex Int?
  notes          String
}

model RadicalPuzzle {
  id             String @id
  targetKanji    String
  meaning        String
  onyomi         String
  kunyomi        String
  radicals       Json
  candidates     Json
  explanation    String
}

// ── Per-user (owned) ──────────────────────────────────────
model UserProfile {
  userId           String  @id
  role             String  @default("external") @db.VarChar(20) // "external" | "woxsen-student" | "teacher"
  targetJlptLevel  String  @default("N5") @db.VarChar(4)
  n5TargetDate     String?
  studyMode        String  @default("zen") @db.VarChar(10) // "zen" | "cyber"
  cyberTheme       String  @default("dark") @db.VarChar(10) // "dark" | "light"
  soundEnabled     Boolean @default(true)
  hapticsEnabled   Boolean @default(true)
  createdAt        DateTime @default(now())
  user             User    @relation(fields: [userId], references: [id])
  @@index([role])
}

model UserProgress {
  userId                String   @id
  masteredKana          String[] @default([])
  starredVocab          String[] @default([])
  practicedKanji        String[] @default([])
  solvedLessons         Int[]    @default([1])
  solvedNodes           Int[]    @default([1])
  activeLessonId        Int      @default(1)
  streakCount           Int      @default(0)
  dailyTasksCompleted   String[] @default([])
  updatedAt             DateTime @updatedAt
  user                  User     @relation(fields: [userId], references: [id])
}

model SrsCard {
  id          String   @id @default(cuid())
  userId      String
  kanaId      String
  interval    Int      @default(1)
  easeFactor  Float    @default(2.5)
  reviews     Int      @default(0)
  dueDate     DateTime @default(now()) // UTC
  user        User     @relation(fields: [userId], references: [id])
  @@unique([userId, kanaId])
  @@index([userId, dueDate])
}

model Attendance {
  id              Int      @id @default(autoincrement())
  attendanceDate  String   @db.Char(10) // YYYY-MM-DD only
  studentUserId   String
  status          String   @db.VarChar(10) // "present" | "absent" | "late"
  markedBy        String
  createdAt       DateTime @default(now())
  student         User     @relation("StudentAttendance", fields: [studentUserId], references: [id])
  marker          User     @relation("MarkerAttendance", fields: [markedBy], references: [id])
  @@unique([attendanceDate, studentUserId])
  @@index([studentUserId])
}

model UploadedFile {
  id          String   @id @default(cuid())
  name        String
  size        String
  date        DateTime
  fileUrl     String
  key         String
  uploadedBy  String
  file        User     @relation("UploadedFiles", fields: [uploadedBy], references: [id])
  @@index([uploadedBy])
}

model QuizRun {
  id        String   @id @default(cuid())
  userId    String
  deck      String
  length    Int
  score     Int
  createdAt DateTime @default(now())
  user      User     @relation("QuizRuns", fields: [userId], references: [id])
  @@index([userId])
}
```

2. `mobile/src/server/db.ts` — Prisma singleton:
   ```ts
   import { PrismaClient } from "@prisma/client";
   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
   export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["query"] : [] });
   if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
   ```

3. `mobile/src/server/auth.ts` — better-auth instance:
   ```ts
   import { betterAuth } from "better-auth";
   import { prismaAdapter } from "better-auth/adapters";
   import { expo } from "@better-auth/expo";
   import { prisma } from "./db";

   export const auth = betterAuth({
     database: prismaAdapter(prisma, { provider: "pg" }),
     secret: process.env.BETTER_AUTH_SECRET!,
     emailAndPassword: {
       enabled: true,
       minPasswordLength: 8,
       requireEmailVerification: false,
     },
     // socialProviders: [...], // add google/apple here later if desired
     trustedOrigins: ["zengo://", "exp://", "exp://**"],
     plugins: [expo()],
   });
   ```

4. Run the better-auth CLI to append User/Session/Account/Verification models **into the same `schema.prisma`**:
   ```bash
   npx @better-auth/cli@latest generate --config ./src/server/auth.ts --output ./prisma/schema.prisma
   ```
   This will append the four auth models after the existing models (don't panic; they won't overwrite your hand-written models — only the generated `model User` block).

5. Add the back-relations to the auto-generated `User` model: add fields like `userProfile UserProfile?`, `userProgress UserProgress?`, `srsCards SrsCard[]`, etc. **Put these inside the auto-generated `model User` block** (which the CLI leaves alone after your first edit; subsequent re-generates won't touch it if you keep them inside the generated block — test this once then commit). If the CLI deletes your relations, use a post-generate script to inject relations, or hand-edit the generated `User` model each time.

6. Run migration: `npx prisma migrate dev --name init`.

7. Add `npm run db:migrate` script → `prisma migrate dev`, `npm run db:migrate:prod` → `prisma migrate deploy`.

### Technical notes
- Use `@db.Char(10)` for `attendanceDate` to store `YYYY-MM-DD` strings — NOT native `Date` — to avoid timezone shift bugs (gap G16).
- `UserProfile.role` indexed for roster queries (gap G6).
- `UserProgress.solvedLessons` defaults to `[1]` matching web's `solvedLessons: [1]` initial state.
- The `prismaAdapter` import path is `better-auth/adapters` in v1.x — verify no alias issues with `tsconfig.json` `paths`.
- Do NOT run `prisma db push` — use `migrate dev` to keep a migration history.
- `@@unique([userId, kanaId])` on `SrsCard` ensures one SRS entry per user per kana.

### Validation / acceptance
- `npx prisma validate` → "The schema is valid".
- `npx prisma migrate dev --name init` → migration folder at `prisma/migrations/...` exists.
- `npx prisma studio` opens, shows all 18 tables including `User`, `Session`, `Account`, `Verification` from better-auth.
- `npx tsx src/server/auth.ts` doesn't throw (it initializes).
- `git diff --stat` shows all new file lines, no secrets committed.

### Out of scope
- Seed data (Issue #006).
- Expo Router mount (Issue #008).
- Mobile auth client (Issue #009).
- `onSignUp` hook to create default UserProfile/UserProgress (Issue #012b).

### Linked files
- new: `mobile/prisma/schema.prisma`, `mobile/src/server/db.ts`, `mobile/src/server/auth.ts`
- reference: better-auth Prisma adapter docs

---

## Issue #006 — Seed script: port `web/src/lib/data.ts` + inlined component data into Postgres
**Epic:** db | **Type:** seed | **Priority:** P0 | **Size:** L
**Hard deps:** #005 | **Soft deps:** none | **Stream:** B | **Assignee:** ____

### Goal
Transcode all reference content from the web app's JS/TS constants into the Neon DB so modules read from a single source. The seed script must be idempotent (re-runnable via upserts without duplicating).

### Context for the AI agent
- Four source files:
  1. `web/src/lib/data.ts` (lessons, kanaData, kanaStrokes, dictionary, kanjiData) — read the full file (1484 lines).
  2. `web/src/components/KaiwaView.tsx` — the `scenarios` const (line ~32, array of `Scenario` objects with `dialogue: DialogueTurn[]`).
  3. `web/src/components/PronunciationCoach.tsx` — the `targetPhrases` const (line ~20, `TargetPhrase` objects).
  4. `web/src/components/KanjiRadicalView.tsx` — the `puzzleItems` const (line ~17, `RadicalPuzzleItem` objects).
- The seed will be a single `.ts` file (`mobile/prisma/seed.ts`) runnable via `tsx` before the API exists.
- Use `prisma.$transaction` wrapping upserts per entity type to stay within connection limits.

### Required deliverables
1. `mobile/prisma/seed.ts` — a single file with `async function main()`, structured as ordered steps. Each step prints `rowCount` to stdout.

**STEP 1 — Lessons** (from `web/src/lib/data.ts` `lessons` export):
```ts
await prisma.lesson.upsert({
  where: { id: l.id },
  create: { id: l.id, title: l.title, jpTitle: l.japaneseTitle,
    description: l.description, syllabus: l.syllabus,
    kanji: l.kanji, vocabulary: l.vocabulary },
  update: { title: l.title, jpTitle: l.japaneseTitle,
    description: l.description, syllabus: l.syllabus,
    kanji: l.kanji, vocabulary: l.vocabulary }
});
// 10 rows in {
//   id, title, jpTitle (← japaneseTitle),
//   description, syllabus (array → Json),
//   kanji (string[]), vocabulary (string[])
// }
```

**STEP 2 — Kana + KanaStrokes** (from `kanaData` + `kanaStrokes`):
```ts
for (const k of kanaData) {
  await prisma.kana.upsert({ where:{ id:k.id }, create:{ id:k.id, char:k.char,
    romaji:k.romaji, type:k.type, vocab:k.vocab,
    translation:k.translation, notes:k.notes||null,
    example: k.example ? k.example : null }, update: {...} });
  if (kanaStrokes[k.char]) {
    kanaStrokes[k.char].forEach((d, pathIndex) =>
      prisma.kanaStroke.upsert({ where:{ char_pathIndex:{char:k.char,pathIndex} },
        create:{ char:k.char, pathIndex, d }, update:{ d } }));
  }
}
```

**STEP 3 — Vocabulary** (from `dictionary` export):
```ts
for (const v of dictionary) {
  await prisma.vocabulary.create({
    data: {
      word: v.word, reading: v.reading, romaji: v.romaji,
      english: v.english, tag: v.tag, type: v.type ?? null,
      lesson: v.lesson, example: v.example ?? null
    }
  });
}
// Note: web has intentional dupes (暑い appears twice) —
// use createMany or no-unique constraint. If id autoincrement, each dupe gets a new row.
```

**STEP 4 — Kanji + KanjiStrokes** (from `kanjiData`):
```ts
for (const k of kanjiData) {
  await prisma.kanji.upsert({ where:{ char:k.char }, create:{
    char:k.char, level:k.level, meaning:k.meaning,
    onyomi:k.onyomi, kunyomi:k.kunyomi }, update:{...} });
  k.strokes.forEach((d, pathIndex) =>
    prisma.kanjiStroke.upsert({ where:{ char_pathIndex:{char:k.char,pathIndex} },
      create:{ char:k.char, pathIndex, d }, update:{ d } }));
}
```

**STEP 5 — KaiwaScenarios** (from `web/src/components/KaiwaView.tsx` `scenarios` const):
Set up `cp web/src/components/KaiwaView.tsx mobile/prisma/sources/KaiwaView.tsx` (read-only copy) then import from that copy. Iterate:
```ts
for (const s of scenarios) {
  await prisma.kaiwaScenario.upsert({ where:{ id:s.id }, create:{
    id:s.id, title:s.title, jpTitle:s.japaneseTitle,
    category:s.category, icon:s.icon,
    description:s.description, dialogue: s.dialogue }, update:{...} });
}
```
**Dialogue JSON shape** (store as-is):
```ts
type DialogueTurn = {
  speaker: string;            // "Clerk (店員)"
  avatar: string;             // "☕" emoji
  japanese: string;
  furigana: string;
  romaji: string;
  english: string;
  options?: Array<{
    text: string; romaji: string; english: string;
    isCorrect: boolean; feedback: string;
  }>;
}
```

**STEP 6 — PronunciationPhrases** (from `web/src/components/PronunciationCoach.tsx` `targetPhrases` const):
```ts
for (const p of targetPhrases) {
  await prisma.pronunciationPhrase.upsert({ where:{ id:p.id }, create:{
    id:p.id, japanese:p.japanese, romaji:p.romaji,
    english:p.english, category:p.category,
    pitchName:p.pitchPatternName,
    pitchType:p.pitchType,
    moras:p.moras, moraPitches:p.moraPitches,
    pitchDropIndex:p.pitchDropIndex,
    notes:p.phoneticNotes }, update:{...} });
}
```

**STEP 7 — RadicalPuzzles** (from `web/src/components/KanjiRadicalView.tsx` `puzzleItems` const):
```ts
for (const p of puzzleItems) {
  await prisma.radicalPuzzle.upsert({ where:{ id:p.id }, create:{
    id:p.id, targetKanji:p.targetKanji, meaning:p.meaning,
    onyomi:p.onyomi, kunyomi:p.kunyomi,
    radicals: p.radicals, candidates: p.candidateRadicals,
    explanation:p.explanation }, update:{...} });
}
```
**radicals** and **candidates** JSON shapes:
```ts
type RadicalEntry = { char: string; meaning: string; }
```

2. `mobile/package.json` — add `"prisma": { "seed": "tsx prisma/seed.ts" }` and `"scripts": { "db:seed": "prisma db seed" }`.
3. Add `tsx` as dev dep if not already: `npm i -D tsx`.
4. Run `npx prisma db seed` and confirm every table has rows.

### Technical notes
- Use `prisma.$transaction([upsert1, upsert2, ...])` per 10 items to keep the connection alive without blowing up.
- Emit a summary at the end: `console.table({ lessons, kana, vocab, kanji, kanjiStrokes, scenarios, phrases, puzzles })` so the AI can spot zero-count tables.
- Kanji levels: `web/src/lib/data.ts → kanjiData` has both N5 and N4 mixed (filterable by `k.level`). Seed both.
- Katakana example sentences: most entries lack `example` — that's fine; field allows null.
- Do NOT seed user-owned tables (`UserProfile`, `UserProgress`, `SrsCard`, `Attendance`, `UploadedFile`, `QuizRun`).
- Do NOT seed better-auth tables (`User`, `Session` etc.) — not even an admin user. All users are created via sign-up.

### Validation / acceptance
- `npx prisma db seed` runs cleanly (exit 0).
- Re-running it twice: no errors, no duplicate keys, row counts unchanged (or updated, not increased).
- `npx prisma studio` → `Lesson` table: 10 rows (id 1–10).
- `npx prisma studio` → `Kana` table: ~92 rows (46 hiragana + 46 katakana). `KanaStroke` table: ~300 rows.
- `npx prisma studio` → `Vocabulary`: ~150 rows.
- `npx prisma studio` → `Kanji`: ~80+ rows (N5 + N4). `KanjiStroke`: ~400+ rows.
- `npx prisma studio` → `KaiwaScenario`: ~5 rows. `PronunciationPhrase`: ~20 rows. `RadicalPuzzle`: ~8 rows.
- Producing a multi-byte sanity check: query `Kana where char = "あ"` → returns expected vocabs/romaji.

### Out of scope
- Any API endpoint to read this data — that's Issue #035.
- Auto-seeding on every deploy (Issue #015 entrypoint only runs `migrate deploy`).
- `UserProfile` initialization for new sign-ups — Issue #012b.

### Linked files
- read: `web/src/lib/data.ts`, `web/src/components/KaiwaView.tsx`, `web/src/components/PronunciationCoach.tsx`, `web/src/components/KanjiRadicalView.tsx`
- new: `mobile/prisma/seed.ts`, `mobile/prisma/sources/` (copy-only)
- edit: `mobile/package.json`

---

## Issue #007 — Server exports: `auth.ts` instance + Prisma singleton
**Epic:** auth | **Type:** feat | **Priority:** P0 | **Size:** S
**Hard deps:** #005 | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
Produce the actual `auth.ts` with better-auth server instance + `db.ts` singleton used by all handlers.

### Context for the AI agent
- The schema in #005 was written; now implement `src/server/auth.ts`.
- The `prismaAdapter` import path is `better-auth/adapters` — NOT `better-auth/adapters/prisma` (deprecated). The correct import is:
  ```ts
  import { prismaAdapter } from "better-auth/adapters";
  ```
- The `expo()` plugin server-side must be registered here: `plugins: [expo()]`.
- `BETTER_AUTH_SECRET` is required per better-auth docs; it's a random string. Generate one via `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and store in `.env`.

### Required deliverables
1. `mobile/src/server/db.ts`:
   ```ts
   import { PrismaClient } from "@prisma/client";
   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
   export const prisma = globalForPrisma.prisma ?? new PrismaClient({
     log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
   });
   if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
   ```

2. `mobile/src/server/auth.ts`:
   ```ts
   import { betterAuth } from "better-auth";
   import { expo } from "@better-auth/expo";
   import { prismaAdapter } from "better-auth/adapters";
   import { prisma } from "./db";

   const trustedOrigins: string[] = ["zengo://", "exp://", "exp://**"];
   if (process.env.NODE_ENV === "development") {
     trustedOrigins.push("http://localhost:8081");
     trustedOrigins.push("http://localhost:*");
   }

   export const auth = betterAuth({
     database: prismaAdapter(prisma, { provider: "pg" }),
     secret: process.env.BETTER_AUTH_SECRET!,
     emailAndPassword: {
       enabled: true,
       minPasswordLength: 8,
       requireEmailVerification: false,
     },
     trustedOrigins,
     plugins: [expo()],
   });
   ```
   (Optional: add `google`, `apple` social providers later — the `expo` plugin already sets up deep link redirects.)
3. Verify with `npx tsx src/server/auth.ts` (or a test script that imports it) — it should NOT crash.

### Technical notes
- The `secret` field MUST be set or better-auth throws in production. During `NODE_ENV=development`, better-auth auto-generates a random secret — but this is NOT persistent across restarts. Use a real env var.
- `trustedOrigins` is the CORS + deep-link origin list. In dev, the Metro LAN IP changes, so wildcards are necessary. In prod, use the specific domain.
- The `expo()` plugin exposes extra hooks for deep linking — it does NOT affect web targets.

### Validation / acceptance
- `npx tsx -e "import { auth } from './src/server/auth'; console.log('auth.handler exists', typeof auth.handler);"` prints `auth.handler exists function`.
- Round-trip `auth.api.getSession()` returns null for a no-session request (tested after #008 is wired).
- `BETTER_AUTH_SECRET` is set in `.env` (gitignored). `.env.example` shows the placeholder.

### Out of scope
- API route mounting (Issue #008).
- Auth client (Issue #009).
- Password reset / email verification flows (v1 skipped).

### Linked files
- new: `mobile/src/server/db.ts`, `mobile/src/server/auth.ts`

---

## Issue #008 — Expo Router API route: mount better-auth (dev)
**Epic:** auth | **Type:** feat | **Priority:** P0 | **Size:** S
**Hard deps:** #007 | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
Mount the better-auth handler inside Expo Router's `api` route system so `GET /api/auth/ok` and `POST /api/auth/sign-up/email` are served by Metro during development. This **only** serves during dev; in prod (docker container) the same handler is mounted in the Hono app (#014).

### Context for the AI agent
- Expo Router supports `app/api/<route>+api.ts` files that export HTTP method handlers (named exports `GET`, `POST`, `PUT`, `DELETE`).
- `auth.handler` returns a standard web `Request`→`Response` handler.
- Better-auth docs for Expo API routes: wrap `auth.handler` via a `toRequestHandler` from h3 or use `auth.handler` directly as it accepts standard web Request.

### Required deliverables
1. `mobile/app/api/auth/[...auth]+api.ts`:
   ```ts
   import { auth } from "@/src/server/auth";
   export const GET = auth.handler;
   export const POST = auth.handler;
   ```
2. Verify `npx expo start` boots, then hit:
   ```bash
   curl http://localhost:8081/api/auth/ok
   # returns 200 with { status: "ok" } or similar
   ```
3. On a physical device on the same Wi-Fi:
   ```bash
   curl http://<lan-ip>:8081/api/auth/ok
   # returns 200
   ```

### Technical notes
- The `auth.handler` expects the request body as a standard `Request` object — Expo Router API routes provide `Request` (native fetch API), so this works.
- The handler reads `better-auth.session-token` cookie — no changes needed.
- For the `[...auth]` catch-all route to work, the Expo Router `api` folder convention requires `[...auth]+api.ts` with **named** exports `GET` and `POST`. NOT `export default function handler`.

### Validation / acceptance
- `curl http://localhost:8081/api/auth/ok` → 200 OK.
- `curl -X POST http://localhost:8081/api/auth/sign-up/email -H "Content-Type: application/json" -d '{"email":"test@zengo.example","password":"Test12345!","name":"Test User"}'` → 200–201, returns token.
- Open `npx prisma studio` → User table has the new row with email `test@zengo.example`.
- Delete that test user so the DB is clean for real users.

### Out of scope
- Any UI (login form is #010).
- Production deployment (Hono mount is #014).
- Email verification / rate-limit / CAPTCHA.

### Linked files
- new: `mobile/app/api/auth/[...auth]+api.ts`
- existing: `mobile/src/server/auth.ts`

---

## Issue #009 — Better-auth Expo client + `apiFetch()` + `apiUrl` resolution
**Epic:** auth | **Type:** feat | **Priority:** P0 | **Size:** L
**Hard deps:** #008 | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
Initialize the `@better-auth/expo` client on the mobile side with `expo-secure-store`, set up `EXPO_PUBLIC_API_URL` resolution (dev uses Metro LAN IP, prod uses custom domain), and build a `apiFetch()` wrapper that auto-injects session cookies into every server call (required by better-auth's Expo pattern).

### Context for the AI agent
- Better-auth Expo docs: session cookies stored in `expo-secure-store` automatically; the client exposes `useSession()` hook.
- For **protected API calls** (fetching progress, attendance, files), you must:
  1. Call `authClient.getCookie()` which returns a raw cookie string.
  2. Set request `headers.Cookie = cookieString`.
  3. Set `credentials: "omit"` (prevents native fetch from attaching OS-level cookies).
- The API URL changes between dev (http://<lan-ip>:8081) and prod (https://api.zengo.example). Expo inlines `EXPO_PUBLIC_*` env vars but Metro LAN IP changes between machines — use `expo-constants`.

### Required deliverables
1. `mobile/src/lib/api-url.ts`:
   ```ts
   import Constants from "expo-constants";
   export function getApiUrl(): string {
     const explicit = Constants.expoConfig?.extra?.apiUrl
       ?? (typeof process !== "undefined" && (process as any).env?.EXPO_PUBLIC_API_URL);
     if (explicit && explicit.length > 0) return explicit.replace(/\/$/, "");
     if (__DEV__) {
       const lan = Constants.expoGoConfig?.debuggerHost?.split(":")[0];
       if (lan) return `http://${lan}:8081`;
       return "http://localhost:8081";
     }
     throw new Error("Missing EXPO_PUBLIC_API_URL in production build");
   }
   ```
2. `mobile/src/auth-client.ts`:
   ```ts
   import { createAuthClient } from "better-auth/react";
   import { expoClient } from "@better-auth/expo/client";
   import * as SecureStore from "expo-secure-store";
   import { getApiUrl } from "@/lib/api-url";
   export const authClient = createAuthClient({
     baseURL: getApiUrl(),
     plugins: [
       expoClient({ scheme: "zengo", storagePrefix: "zengo", storage: SecureStore }),
     ],
   });
   export const { useSession } = authClient;
   ```
3. `mobile/src/lib/api-fetch.ts`:
   ```ts
   import { authClient } from "@/auth-client";
   import { getApiUrl } from "@/lib/api-url";

   export class ApiError extends Error {
     status: number; body: any;
     constructor(status: number, body: any) { super(`API ${status}`); this.status = status; this.body = body; }
   }

   export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
     const url = `${getApiUrl()}${path}`;
     const headers = new Headers(init.headers);
     headers.set("Accept", "application/json");
     if (!headers.has("Content-Type") && init.method !== "GET" && init.body) {
       headers.set("Content-Type", "application/json");
     }
     try {
       const cookies = authClient.getCookie();
       if (cookies) headers.set("Cookie", cookies);
     } catch { /* not signed in — omit Cookie */ }

     const res = await fetch(url, { ...init, headers, credentials: "omit" });
     if (!res.ok) {
       const body = await res.json().catch(() => null);
       throw new ApiError(res.status, body);
     }
     return res.json();
   }
   ```
4. `mobile/.env.development` (gitignored, not committed): `EXPO_PUBLIC_API_URL=http://<your-lan-ip>:8081`.
5. `mobile/.env.development.example` (committed, tracked): placeholder with instructions.
6. `mobile/app.json` → `expo.extra.apiUrl` set to `""` (env wins at build time; `getApiUrl()` reads it first).

### Technical notes
- `__DEV__` is a Metro global available in dev builds — works in Expo Go.
- `authClient.getCookie()` may throw if `SecureStore` isn't initialized yet — wrap in try/catch.
- The `Credentials: "omit"` is essential — native fetch on iOS 18+ tries to attach received `Set-Cookie` headers automatically if you leave `credentials: "include"`, shadow-requesting the Cookie header with a conflicting one.
- Do NOT import `@prisma/client`, `better-auth/node`, or anything from `mobile/server/` here (gap G1/#004b).
- `apiFetch` is the single entry point for ALL protected server calls — every downstream issue (#012, #027, #028, #041, #042, #052, #053) must use it, never raw fetch.

### Validation / acceptance
- Session created (after #010 sign-up login) → `authClient.getCookie()` returns `better-auth.session-token=...`.
- `apiFetch('/api/progress', { method: 'GET' })` returns 200 (after #012).
- Same call without a session → a 401 `ApiError` thrown (confirm the `ApiError` message is `API 401`).
- Switching Wi-Fi networks: `EXPO_PUBLIC_API_URL` in `.env.development` is updated, then `expo start --clear` picks it up. Existing session persists via SecureStore, just pointing at the new IP.
- `apiFetch('/nonexistent')` throws `ApiError { status: 404 }`.

### Out of scope
- TanStack Query `useApiQuery` helper (Issue #009c).
- Login UI (Issue #010).
- Any route implementations (just tested with a dummy or #012).

### Linked files
- new: `mobile/src/lib/api-url.ts`, `mobile/src/auth-client.ts`, `mobile/src/lib/api-fetch.ts`, `mobile/.env.development.example`
- edit: `mobile/.env.development` (gitignored), `mobile/app.json`

---

## Issue #009b — `apiFetch()` authorized HTTP wrapper + `useApiQuery` hook
**Epic:** auth | **Type:** feat | **Priority:** P0 | **Size:** M
**Hard deps:** #009 | **Soft deps:** #009c (TanStack Query) | **Stream:** A | **Assignee:** ____

### Goal
Build the `apiFetch()` wrapper (already drafted in #009's deliverable — this issue formalizes the implementation and testing) and add a `useApiQuery` hook on top of TanStack Query that each module can simply import to GET server data without repeating cookie logic.

### Required deliverables
1. The `apiFetch` implementation from issue #009 deliverable (it's authored there; this issue owns the test).
2. `mobile/src/lib/use-api-query.ts`:
   ```ts
   import { useQuery, UseQueryOptions } from "@tanstack/react-query";
   import { apiFetch } from "./api-fetch";
   export function useApiQuery<T = any>(
     path: string,
     opts?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
   ) {
     return useQuery({
       queryKey: [path],
       queryFn: ({ signal }) => apiFetch<T>(path, { signal }),
       ...opts,
     });
   }
   ```
   (Signal feature requires `apiFetch` to pass `signal` through — add `signal` to its `init` param list.)
3. Test coverage: `mobile/src/lib/__tests__/api-fetch.test.ts` (vitest + msw or simple mock):
   - Calls `/healthz` returns JSON.
   - Calls `/protected` without cookie → returns 401.
   - Calls `/protected` with `authClient.getCookie()` mock → returns 200.

### Technical notes
- `apiFetch` should support an optional `signal` from the query client (abortSignal) — pass it inside `RequestInit`.
- The `useApiQuery` hook combines TanStack Query's auto-caching with the cookie injection from `apiFetch`, so every module like Dictionary or KanjiBoard just does `useApiQuery('/api/reference?type=kana')` and gets cached, reactive data with one line of code.
- TanStack Query's `defaultOptions.staleTime` and `gcTime` should be set globally in #009c — this hook uses those defaults.

### Validation / acceptance
- Installed: `npm i react-query` with `apiFetch` import verified.
- `useApiQuery('/api/healthz')` resolves with 200.
- `useApiQuery('/api/protected')` without session → error (render error fallback, not crash).
- `useApiQuery('/api/protected')` with session → renders JSON.

### Out of scope
- TanStack Query global config (Issue #009c).
- Persisted cache / offline writes (Issue #058).

### Linked files
- new: `mobile/src/lib/use-api-query.ts`, `mobile/src/lib/__tests__/api-fetch.test.ts`
- edit: `mobile/src/lib/api-fetch.ts` (add signal)

---

## Issue #009c — TanStack Query client + AsyncStorage persistence + hydration gate (no UI flicker)
**Epic:** auth | **Type:** feat | **Priority:** P1 | **Size:** M
**Hard deps:** #009 | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
Set up TanStack Query globally with appropriate defaults and a persistent cache via AsyncStorage so that the app shows cached data instantly and updates in background. This is optional in dev but prevents flicker and improves perceived performance.

### Context for the AI agent
- TanStack Query v5+ includes `@tanstack/react-query-persist-client` plugin and `createAsyncStoragePersister` (which uses React Native's AsyncStorage).
- We need a `QueryClient` singleton configured at the root layout level (`_layout.tsx` in #017 will wrap children with `<QueryClientProvider>`).
- The `suspense` option can show fallbacks while loading; we use `useQuery` in the `useApiQuery` helper from #009b.

### Required deliverables
1. `mobile/src/lib/query-client.ts`:
   ```ts
   import { QueryClient } from "@tanstack/react-query";
   import { createAsyncStoragePersister } from "@tanstack/react-query-persist-client";
   import AsyncStorage from "@react-native-async-storage/async-storage";

   export const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 60 * 1000,        // 1 min before refetch (when online)
         gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days garbage-collection interval
         retry: 1,                     // one automatic retry on failure
         refetchOnWindowFocus: false,  // mobile doesn't have window focus
       },
       mutations: {
         retry: 0,
       },
     },
   });

   export const persister = createAsyncStoragePersister({
     storage: AsyncStorage,
     key: "zengo_query_cache",
   });
   ```
2. `mobile/app/_layout.tsx` (or wherever the root wraps — #017 adds it):
   ```tsx
   import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
   import { queryClient, persister } from "@/lib/query-client";

   export default function RootLayout() {
     // ... existing providers
     return (
       <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
         {/* ThemeProvider, AuthProvider, etc. */}
       </PersistQueryClientProvider>
     );
   }
   ```
3. Set up `useOnlineManager` hook from TanStack docs (not full offline, just refetching after reconnect):
   ```tsx
   import { onlineManager, focusManager } from "@tanstack/react-query";
   import * as Network from "expo-network";
   import { AppState, Platform } from "react-native";

   // In the root layout, subscribe to online status
   useEffect(() => {
     onlineManager.setEventListener(setOnline => {
       // use expo-network to detect connectivity
       const check = async () => {
         const state = await Network.getNetworkStateAsync();
         setOnline(state.isConnected ?? true);
       };
       const sub = AppState.addEventListener("change", check);
       return () => sub.remove();
     });
   }, []);
   ```

### Technical notes
- `@react-native-async-storage/async-storage` comes with Expo; no extra install needed (it's in the SDK bundle). If not: `npx expo install @react-native-async-storage/async-storage`.
- `7-day gcTime` ensures reference data stays cached on disk for a week without refetching. Since reference data rarely changes (only on seed update), this is near-infinite for the user.
- The `staleTime: 60s` means background refetches happen at most every minute when the user is on a screen — controlled by `useApiQuery`.

### Validation / acceptance
- On first app launch (cold boot), `useApiQuery('/api/reference?type=kana')` shows a loading state.
- On second launch (warm boot, cache hit), same call shows the cached data INSTANTLY (no loading flicker), then refetches in background.
- Killing Wi-Fi: cached data still visible; on reconnect, data silently updates.

### Out of scope
- Full offline queue for mutations (Issue #058).
- Expiring reference data on seed update (a `version` key in AsyncStorage invalidates all cached queries).

### Linked files
- new: `mobile/src/lib/query-client.ts`
- edit: `mobile/app/_layout.tsx`
- dep: `@tanstack/react-query`, `@tanstack/react-query-persist-client` (already in #004)

---

## Issue #010 — Auth screens: Login / Register / Forgot password
**Epic:** auth | **Type:** feat | **Priority:** P1 | **Size:** M
**Hard deps:** #009, #016 (theme provider exists) | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
Implement three auth screens inside `(auth)` layout: login (email + password), register (email + password + name), forgot password (email input + reset). On successful sign-in, redirect to onboarding if first login else to `(tabs)/index`.

### Context for the AI agent
- Expo Router layouts: _choose `(auth)` as a group layout_; it renders the auth stack, and after login the `(tabs)` layout is switched via `<Stack>` navigation.
- Use `authClient.signIn.email`, `authClient.signUp.email`, and `authClient.forgetPassword` from better-auth client.
- The theme colors from Issue #016 will be referenced but not blocked by them — start with hardcoded zen colors; they'll be replaced by theme tokens in #016.

### Required deliverables
1. `mobile/app/(auth)/_layout.tsx` — Auth stack navigator (no header or minimal).
2. `mobile/app/(auth)/login.tsx`:
   - Email, Password inputs.
   - "Sign In" button → `authClient.signIn.email({ email, password, callbackURL: "/" })`.
   - Error display (invalid credentials, network error).
   - Link to Register + Forgot.
   - Loading state on submit.
3. `mobile/app/(auth)/register.tsx`:
   - Email, Name, Password, Confirm Password inputs (min 8 char).
   - "Create Account" button → `authClient.signUp.email({ email, password, name, callbackURL: "/onboarding" })`.
   - Password strength visual (optional).
4. `mobile/app/(auth)/forgot.tsx`:
   - Email input + "Send Reset Link" → `authClient.forgetPassword({ email, redirectTo: "zengo://reset-password" })`.
   - Success message: "Check your email".

### Technical notes
- The `callbackURL` is used by better-auth for email redirects; on native, `expoClient` plugin translates it to a deep link.
- After `signIn.email` resolves with no error, do `router.replace("/onboarding")` if the user has no `UserProfile` (check via `useApiQuery('/api/progress')` for a 404), otherwise `router.replace("/(tabs)/")`.
- The `secure` property on forgot-password shouldn't be a non-HTTP native edge case; set `redirectTo: "zengo://reset-password"` for deep-link compatibility.

### Validation / acceptance
- Register a real user → DB has `User` row.
- Login with same credentials → redirected to onboarding.
- Forgot password sends email (dev: check better-auth console log for the reset token).
- Login with bad password → error shown.
- Navigation: Login → Register (link) → back to login with newly registered credentials → onboarding (next issue) → tabs.

### Out of scope
- Social logins (Google/Apple), email verification (deferred v2).
- Onboarding flow (Issue #011).
- Full design polish (later in #061).

### Linked files
- new: `mobile/app/(auth)/_layout.tsx`, `mobile/app/(auth)/login.tsx`, `mobile/app/(auth)/register.tsx`, `mobile/app/(auth)/forgot.tsx`
- existing: `mobile/src/auth-client.ts`, `mobile/src/lib/api-fetch.ts`

---

## Issue #011 — Onboarding screen (post-signup)
**Epic:** auth | **Type:** feat | **Priority:** P1 | **Size:** M
**Hard deps:** #010, #012b (profile creation on sign-up) | **Soft deps:** #016 | **Stream:** A | **Assignee:** ____

### Goal
Replace the web's `OnboardingModal.tsx` with a full-screen onboarding sequence that: asks for display name, selects user role (external / woxsen-student / teacher), picks JLPT target level (N5…N1), and sets a target deadline (preset buttons + custom date input). On submit, post to `/api/progress` to create `UserProfile` + `UserProgress`, then redirect to `(tabs)/`.

### Context for the AI agent
- This dialogs replaces `web/src/components/OnboardingModal.tsx` but must flow to a sign-up user's first experience.
- The onboarding is a one-time step; after completion, the `hasCompletedOnboarding` flag is implicitly the presence of a `UserProfile` row.
- Role switching after onboarding is blocked for end users (only dev-mode allows it — see #020).

### Required deliverables
1. `mobile/app/onboarding.tsx` (not inside `(auth)` stack; rendered as part of the root navigation):
   - Steps: form validation, one-page form with each field visible.
   - Name input (pre-filled from better-auth `name` if available).
   - Role Picker (scrollable segmented control: "External Student" / "Woxsen Student" / "Instructor").
   - JLPT Level Picker (Vista: N5 selected, tap to cycle N5→N4→N3→N2→N1).
   - Target Date: default +30 days shown; preset buttons "15 days" / "30 days" / "60 days" prepopulated as selected; custom date input via a DateTimePicker.
   - Submit: calls `POST /api/progress` → creates `UserProfile`, `UserProgress` → `router.replace("/(tabs)/")`.
2. A POST handler in `mobile/server/app.ts` (or whichever place #012 defines) accepting the onboarding payload.

### Technical notes
- The `apiFetch` wrapper must be used for the POST.
- `UserProfile.role` is one of three strings: `"external"`, `"woxsen-student"`, `"teacher"`. Map picker UI values to these.
- `targetJlptLevel` is a 2-char string: `"N5"`…`"N1"`.
- `n5TargetDate` is `YYYY-MM-DD` string (used in #043 for deadline math).
- Handle network failure: show inline retry button, don't lose user's input on failure (local state persists).

### Validation / acceptance
- Completing onboarding → payload sent → `UserProfile` and `UserProgress` rows created in Neon (verify in Prisma studio).
- On subsequent app opens, the root layout **skips** onboarding (since `UserProfile` exists) → lands directly on dashboard.
- All four role/labels correctly show in the dashboard dispatcher (#029).
- Custom date set to "2026-10-30" → persisted and visible in N5 Planner later (#043).

### Out of scope
- Re-running onboarding from Settings (Issue #020 "Re-configure Target Goal").
- Validation of minimum/maximum date (just an alert if before today or >2 years out).

### Linked files
- new: `mobile/app/onboarding.tsx`
- dep: #012b (profile creation endpoint)

---

## Issue #012 — `/api/progress` GET/PUT handler (server)
**Epic:** auth | **Type:** feat | **Priority:** P1 | **Size:** M
**Hard deps:** #007, #009b, #012b | **Soft deps:** none | **Stream:** B | **Assignee:** ____

### Goal
Expose authenticated `GET /api/progress` returning merged `UserProfile` + `UserProgress` + `SrsCard` due now, and `PUT /api/progress` to upsert per-user state fields exactly as web's `AppContext` mutations write.

### Context for the AI agent
- This backend maps directly to `web/src/context/AppContext.tsx` state shape: `masteredKana`, `starredVocab`, `practicedKanji`, `solvedLessons`, `solvedNodes`, `activeLessonId`, `streakCount`, `dailyTasksCompleted`, `studyMode`, `cyberTheme`, `n5TargetDate`, `targetJlptLevel`, `soundEnabled`, `hapticsEnabled`.
- GET returns a flattened JSON with all three sub-objects for the currently logged-in user.
- PUT only updates the fields present in the body; missing fields are left unchanged.

### Required deliverables
1. GET handler:
   ```ts
   // request authenticated via auth.api.getSession(headers)
   const session = await auth.api.getSession(request);
   if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
   const profile = await prisma.userProfile.findUnique({ where: { userId: session.user.id } }) ?? null;
   const progress = await prisma.userProgress.findUnique({ where: { userId: session.user.id } }) ?? null;
   const srsDue = await prisma.srsCard.findMany({ where: { userId: session.user.id, dueDate: { lte: new Date() } } });
   return Response.json({ profile, progress, srsDue });
   ```
2. PUT handler:
   ```ts
   // request body: { profile?: Partial<UserProfile>, progress?: Partial<UserProgress> }
   const body = await request.json();
   let p: any = {};
   if (body.profile) p = await prisma.userProfile.upsert({ where:{ userId:session.user.id }, create:{ userId:session.user.id, ...body.profile }, update: body.profile });
   let pg: any = {};
   if (body.progress) pg = await prisma.userProgress.upsert({ where:{ userId:session.user.id }, create:{ userId:session.user.id, ...body.progress }, update: body.progress });
   return Response.json({ profile: p, progress: pg });
   ```
3. Wire the two handlers into the Hono app `mobile/src/server/app.ts` (Issue #014 also touches this). For now, use a temporary Hono router in this issue to prove the handler works; formal routing within `app.ts` is #014's responsibility.

### Technical notes
- Do NOT trust the client to pass `userId` — derive it from the session only.
- `UserProgress`s on first login are created in #012b (`onSignUp` hook); this handler expects the row to exist (if missing, create it on first GET with defaults).
- `SrsCard.dueDate` comparison uses `Date` objects; Prisma handles `lte: new Date()` natively.

### Validation / acceptance
- `PUT /api/progress` with `{ progress: { masteredKana: ["h-a","h-i"] } }` → validates that row updates.
- `GET /api/progress` returns the same `masteredKana` array.
- Unauthenticated GET → 401.

### Out of scope
- Full offline queue (Issue #058).
- Bulk attendance or file management (those have their own handlers: #052, #053).

### Linked files
- new: `mobile/src/server/handlers/progress.ts`
- edit: `mobile/src/server/app.ts`

---

## Issue #012b — `onSignUp` hook creates empty `UserProfile` + `UserProgress`
**Epic:** auth | **Type:** feat | **Priority:** P1 | **Size:** S
**Hard deps:** #005, #012 | **Soft deps:** none | **Stream:** A | **Assignee:** ____

### Goal
Automatically create a empty `UserProfile` (role=external, JLPT=N5 etc.) + `UserProgress` (defaults matching web initial state) every time a new user signs up, so the first `/api/progress GET` never returns null.

### Context for the AI agent
- Better-auth supports `databaseHooks: { user: { create: { after: async (user) => { ... } } } }` that runs after a user row is created.
- The sign-up POST in #010 triggers user creation; `after` hook fires immediately.
- Default `UserProgress` values should match web `AppContext` initial state: `solvedLessons: [1]`, `activeLessonId: 1`, `streakCount: 0`, etc.

### Required deliverables
1. In `mobile/src/server/auth.ts`, add a `databaseHooks` block next to the existing betterAuth config:
   ```ts
   databaseHooks: {
     user: {
       create: {
         after: async (user) => {
           await prisma.userProfile.create({
             data: { userId: user.id, role: "external", studyMode: "zen", targetJlptLevel: "N5" }
           });
           await prisma.userProgress.create({
             data: { userId: user.id, solvedLessons: [1], solvedNodes: [1], activeLessonId: 1, streakCount: 0 }
           });
         }
       }
     }
   }
   ```
2. Confirm: after a new user signs up, `GET /api/progress` returns non-null profile and progress.
3. Onboarding later updates the `UserProfile` fields (role, target, etc.) via `PUT /api/progress`.

### Technical notes
- Wrap in `try/catch` and log errors — if the `after` hook throws, the signup will fail and user gets a 500. The catch can re-throw (let sign-up fail if profile creation fails) OR just log (swallow error) — choose the safer approach: log and re-throw.
- Use `prisma` singleton from `db.ts`, not a new instance.

### Validation / acceptance
- Sign up fresh user via `POST /api/auth/sign-up/email` → DB: both `UserProfile` and `UserProgress` rows appear.
- The `progress` object in `GET /api/progress` has `solvedLessons: [1]`.
- Existing users who registered before this hook was added: the first GET `/api/progress` should then create a default row (handled in #012's GET handler — NOT this hook).

### Out of scope
- Filling any further default `dailyTasksCompleted`, `starredVocab` (these are empty at start — matches web initial empty state).

### Linked files
- edit: `mobile/src/server/auth.ts`

---

## Issue #013 — `AppContext` (RN) backed by `/api/progress` + AsyncStorage cache
**Epic:** auth | **Type:** port | **Priority:** P1 | **Size:** L
**Hard deps:** #012, #009b | **Soft deps:** #009c | **Stream:** A | **Assignee:** ____

### Goal
Rewrite `web/src/context/AppContext.tsx` for React Native: source of truth is the server (`/api/progress`), local cache in AsyncStorage makes UI instant, and the same action surface (`setActiveView`, `toggleStarVocab`, `markLessonSolved`, `updateSrsData`, etc.) is exported so modules don't change call patterns.

### Context for the AI agent
- Web `AppContext` (~400 lines) stores everything in `useState` + `localStorage.sync`. Mobile moves to server-backed data but keeps a Optimistic-Upon-UI: upon any mutation, update local state first, then async `PUT /api/progress`.
- The shape of state must mirror `AppState` interface exactly (same names, same shapes).
- Functions `speakJapanese` (speech) and `playSound` (SFX) — these aren't resolved here; they'll be provided by #038 and #055. For now, stub them (no-ops with log).
- `setActiveView` in web changes the "active view" string to switch between dashboard/kana/etc. In RN, Expo Router handles navigation via `router.push`, so `setActiveView` maps view names to routes and navigates.

### Required deliverables
1. `mobile/src/lib/storage.ts` — AsyncStorage reader/writer with key `zengo_app_state_v1`:
   ```ts
   import AsyncStorage from "@react-native-async-storage/async-storage";
   export const loadCache = async () => { const raw = await AsyncStorage.getItem("zengo_app_state_v1"); return raw ? JSON.parse(raw) : null; };
   export const saveCache = async (data: any) => { await AsyncStorage.setItem("zengo_app_state_v1", JSON.stringify(data)); };
   export const clearCache = async () => { await AsyncStorage.removeItem("zengo_app_state_v1"); };
   ```
2. `mobile/src/context/AppContext.tsx` — new data-flow:
   - `useEffect` on mount: attempt `loadCache()` → set local `state` (instant render). Immediately fetch `GET /api/progress` → merge into state → `saveCache()`.
   - `useEffect` hook: on each `state` change (debounced 1s), `PUT /api/progress` with the partial changed keys (track diffs or post full state).
3. Port EVERY action from web exactly:
   - `setActiveView(view)` → maps view string to Expo Router route and calls `router.push('/(tabs)/${route}')` for tabs or `router.push('/more/${route}')` for drawer screens. (Route mapping table inside `src/lib/routes.ts`.)
   - `markLessonSolved(id)` → optimistic update solvedLessons + streakCount + activeLessonId, then PUT. Web's `markNodeSolved` keeps the same.
   - `toggleStarVocab` / `toggleMasterKana` / `addPracticedKanji` — same.
   - `setStudyMode`, `setCyberTheme` — same.
   - `setQuizState` — tracks current quiz in local state; on quiz finish, POST `/api/quiz` (done by #042).
   - `updateSrsData(kanaId, rating)` — reuses the web's spacing algorithm exactly, re computes new interval / easeFactor / dueDate, and sends the updated SRS card to `/api/progress` (the PUT handler upserts SrsCard).
   - `setN5TargetDate`, `toggleDailyTask`, `completeOnboarding` — same.

### Technical notes
- `markLessonSolved` must also call `playSound("success")` after the server confirm (not before; if server fails, revert optimistic update).
- SRS algorithm port MUST match `web/src/context/AppContext.tsx:289-324` exactly. Copy the `if/else` block verbatim. Ratings: `again` → reset, `hard` → slow growth, `good` → normal growth, `easy` → faster. This is a pure TS function; extract into `mobile/src/lib/srs.ts` for testability.
- `setActiveView` mapping: define a `VIEW_ROUTE_MAP = { dashboard: "/(tabs)/", "kana-trainer": "/(tabs)/kana", dictionary: "/(tabs)/dictionary", "kanji-board": "/(tabs)/kanji", quiz: "/(tabs)/quiz", "n5-roadmap": "/more/roadmap", kaiwa: "/more/kaiwa", "voice-coach": "/more/voice", "kanji-radicals": "/more/radicals", settings: "/more/settings" }`.
- For `teacher` role: tabs don't show (bottom nav hidden); drawer-only navigation. `setActiveView` handles this by mapping to a different route or switching the root layout.

### Validation / acceptance
- Star a vocabulary word → see `API` call and star count update.
- Kill app, reopen → starred word persists (fetched from server).
- Solve lesson 3 → `solvedLessons = [1,2,3]`, streakCount incremented.
- Toggle study mode to cyber → dashboard changes to cyber theme + persists.
- SRS card rating = `easy` → dueDate shifts into the future, not shown in due list until it lapses.

### Out of scope
- Offline queue (Issue #058).
- Haptic/sound triggers (provided later — this issue stubs them as no-ops).

### Linked files
- new: `mobile/src/lib/storage.ts`, `mobile/src/lib/srs.ts`, `mobile/src/lib/routes.ts`, `mobile/src/context/AppContext.tsx`
- read: `web/src/context/AppContext.tsx`
