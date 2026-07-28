# Epic 2 — Server Containerization

> **Priority:** P1. Side project — not required for local Expo Go dev, but must be container-ready from day one for eventual deployment.

---

## Issue #014 — Hono server `app.ts` (single source of handlers)
**Epic:** server | **Type:** infra | **Priority:** P1 | **Size:** M
**Hard deps:** #007, #012, #035, #042, #052, #053 | **Soft deps:** none | **Stream:** B | **Assignee:** ____

### Goal
Build a single Hono app at `mobile/src/server/app.ts` that mounts all handler modules (`auth.handler`, `progress.ts`, `upload.ts`, `attendance.ts`, `files.ts`, `quiz.ts`, `reference.ts`). This is the production entrypoint that runs in Docker and also acts as the TypeScript entry for local dev via `tsx watch` if someone wants to test server-only outside Expo Go. Expo Router API routes (dev) call the same handler functions so logic is never duplicated.

### Context for the AI agent
- Hono framework (fast, Edge-first, but also works on standard Node). Should use `serve` from `@hono/node-server` to launch on Node.
- Each handler module exports a function with the signature: `(request: Request) => Promise<Response>` or `(c: Context) => Response`. We'll standardize on Hono `Context` exports: `export const route = new Hono();` per module, and the top-level app mounts them at `.route('/api/progress', progressRoute)` etc.
- The `auth.handler` from better-auth expects standard web `Request | Request`, so it's Hono-compatible.

### Required deliverables
1. `mobile/src/server/app.ts`:
   ```ts
   import { Hono } from "hono";
   import { cors } from "hono/cors";
   import { auth } from "./auth";
   import { progressRoute } from "./handlers/progress";
   import { referenceRoute } from "./handlers/reference";
   import { uploadRoute } from "./handlers/upload";
   import { attendanceRoute } from "./handlers/attendance";
   import { filesRoute } from "./handlers/files";
   import { quizRoute } from "./handlers/quiz";

   const app = new Hono();

   app.use("*", cors({
     origin: ["*"], // refine in prod
     allowHeaders: ["Content-Type", "Cookie"],
     credentials: true,
   }));

   // Health
   app.get("/healthz", (c) => c.json({ ok: true }));

   // Auth
   app.mount("/api/auth", auth.handler); // or wrapper

   // Auth middleware for protected routes
   app.use("/api/progress/*", async (c, next) => {
     const session = await auth.api.getSession(c.req.raw);
     if (!session) return c.json({ error: "Unauthorized" }, 401);
     c.set("userId", session.user.id);
     c.set("userRole", (await prisma.userProfile.findUnique({ where:{ userId: session.user.id } }))?.role || "external");
     await next();
   });
   // Repeat for '/api/attendance/*', '/api/files/*', '/api/quiz/*' etc.
   // Reference is public — no middleware needed.
   // Upload — only accessible by teacher, checked in the handler itself.

   app.route("/api/progress", progressRoute);
   app.route("/api/reference", referenceRoute);
   app.route("/api/upload", uploadRoute);
   app.route("/api/attendance", attendanceRoute);
   app.route("/api/files", filesRoute);
   app.route("/api/quiz", quizRoute);

   export default app;
   ```
   Note: if Auth `use` middleware is too lightweight — refine when handlers are implemented.
2. `mobile/server/index.ts` — Node start:
   ```ts
   import { serve } from "@hono/node-server";
   import app from "../src/server/app";
   const port = parseInt(process.env.PORT || "8081");
   serve({ fetch: app.fetch, port });
   console.log(`Server running on port ${port}`);
   ```
3. `mobile/package.json` script: `"server:dev": "tsx watch server/index.ts"`.

### Technical notes
- The `auth.handler` is a true Request→Response function — `.mount("/api/auth", auth.handler)` will work as expected because the auth path prefixes map.
- For the `Hono` approach: CORS enabled for `*` for now — production should narrow to the actual frontend host.
- The `referenceRoute` will take query params `?type=kana` etc. — fully implemented in #035.
- Progress handler is implemented in #012 using a raw `Response.json` — Hono handler can return `c.json()` or a `Response` object via `c.body()`.

### Validation / acceptance
- `npm run server:dev` boots and serves `http://localhost:8081/healthz` → `{ ok: true }`.
- `GET /api/auth/ok` works via the Hono mount.
- `GET /api/reference?type=kana` returns canned test data.

### Out of scope
- Full Docker build (Issue #015).
- CORS hardening for production.
- Rate-limit (auth endpoint is protected by better-auth's internal rate-limit).

### Linked files
- new: `mobile/src/server/app.ts`, `mobile/server/index.ts`
- edit: `mobile/package.json`

---

## Issue #015 — Dockerfile + docker-compose (dev-optional, prod-ready)
**Epic:** server | **Type:** infra | **Priority:** P2 | **Size:** M
**Hard deps:** #014, #005 (schema migrated) | **Soft deps:** none | **Stream:** B | **Assignee:** ____

### Goal
Build a multi-stage Dockerfile that bundles the Hono server + built JS, generates Prisma client, and runs pending migrations on start. Provide a `docker-compose.yml` for local parity testing (API only — no mobile client). Entrypoint runs `migrate deploy` then starts Node, NEVER `prisma db seed`.

### Context for the AI agent
- Prisma queries must be generated inside the container (the `query-engine` binary is platform-specific). Do not copy a local generated Prisma client into the image.
- The `.env` file is NOT committed; instead, the container reads `DATABASE_URL`, `BETTER_AUTH_SECRET`, `AWS_*` from Docker secrets or the host environment passed at `docker run -e DATABASE_URL=...`.
- Neon connection requires TLS; Prisma's Postgres provider enables `sslmode=require` via the connection string (already present in `DATABASE_URL`).

### Required deliverables
1. `mobile/Dockerfile`:
   ```dockerfile
   FROM node:20-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --omit=dev
   COPY prisma/ ./prisma/
   RUN npx prisma generate
   COPY tsconfig.json ./
   COPY src/server/ ./src/server/
   # compile TS→JS (use esbuild/tsc)
   RUN npx tsc -p tsconfig.server.json && npm prune --production

   FROM node:20-alpine AS runtime
   WORKDIR /app
   COPY --from=build /app/node_modules ./node_modules
   COPY --from=build /app/prisma/ ./prisma
   COPY --from=build /app/dist/ ./dist
   COPY server/ ./server/
   ENV NODE_ENV=production PORT=8081
   EXPOSE 8081
   ENTRYPOINT ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/server/index.js"]
   ```
2. `mobile/docker compose.yml`:
   ```yaml
   version: "3.8"
   services:
     api:
       build: .
       ports:
         - "8081:8081"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
         - AWS_REGION=${AWS_REGION}
         - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
         - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
         - AWS_S3_BUCKET_NAME=${AWS_S3_BUCKET_NAME}
       restart: unless-stopped
   ```
3. A `mobile/tsconfig.server.json` that compiles only `src/server/` and `server/` to `dist/`:
   ```json
   {
     "extends": "./tsconfig.json",
     "compilerOptions": { "outDir": "dist", "module": "commonjs", "target": "es2022" },
     "include": ["src/server/**/*", "server/**/*"]
   }
   ```
4. `.dockerignore` excluding `node_modules`, `.expo`, `dist`, `ios`, `android`, `assets`, `app`, `src/components`, `src/context` (client app code has no place in the server image).

### Technical notes
- `npx prisma migrate deploy` runs **pending migrations** only — it will NOT create a new migration or re-run existing ones. This is the correct prod command (`migrate dev` creates new migrations — dev only).
- The `ENTRYPOINT` specifically chains `prisma migrate deploy && node` — if the migration fails, the container exits, preventing serving a stale DB schema.
- Do NOT put `prisma db seed` anywhere in the entrypoint (gap G8). Seed is a MANUAL one-time operation done during onboarding.

### Validation / acceptance
- `docker build -t zengo-api .` succeeds.
- `docker compose up` → container starts, migrates against Neon, and logs `Server running on port 8081`.
- `curl http://localhost:8081/healthz` → 200.
- Re-running `docker compose up` (after initial migrate) → no duplicate migration errors.
- `docker compose down && docker compose up` → still passes migrations (no new ones found) → serves.

### Out of scope
- Exposing mobile app via container (it's Expo Go — separate build step).
- CI integration for building the container (Issue #066 covers that).

### Linked files
- new: `mobile/Dockerfile`, `mobile/docker compose.yml`, `mobile/tsconfig.server.json`, `mobile/.dockerignore`, `mobile/server/index.ts`
- dep: existing `mobile/src/server/app.ts`, `mobile/prisma/schema.prisma`
