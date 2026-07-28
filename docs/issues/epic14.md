# Epic 14 — Teacher Portal Backend & Files

> **Priority:** P2. Attendance management + file upload/download for teacher portal.

---

## Issue #052 — `/api/attendance` handlers (save, list, roster)
**Epic:** teacher | **Type:** feat | **Priority:** P2 | **Size:** M
**Hard deps:** #014 | **Soft deps:** none | **Stream:** B | **Assignee:** ____

### Goal
Expose `POST /api/attendance` (teacher saves attendance for a date + student list), `GET /api/attendance` (returns all attendance records for the authenticated user), and `GET /api/attendance/roster` (returns all woxsen student users for teacher's class selection checklist). All routes are protected (teacher only).

### Context for the AI agent
- Presentation is a simple JSON-only backend — no SSE/WS.
- `Attendance` table stores `{ date (string 'YYYY-MM-DD'), studentUserId, status, markedBy }` — one row per student per date with a unique constraint.
- Roster: `UserProfile.role === 'woxsen-student'` — generic single-tenant.
- Web hardcoded five students; mobile will query actual registration.

### Required deliverables
1. `mobile/src/server/handlers/attendance.ts`:
   - `POST /api/attendance`: accepts body `{ date: string, records: [{ studentUserId, status }]}`. Upserts each record.
   - `GET /api/attendance`: returns `Attendance[]` for the calling user. Students get only their own; teachers may get all if needed (filter by classroom later).
   - `GET /api/attendance/roster`: returns `[{ userId, name, email }]` from users with `UserProfile.role = "woxsen-student"`.
2. Wire to `app.ts` (#014 already has the mount point).

### Technical notes
- Upsert: `prisma.attendance.upsert({ where: { attendanceDate_studentUserId: {attendanceDate:date, studentUserId} }, create, update })`.
- The auth middleware sets `userId` + `userRole` on the context. Check `userRole === "teacher"` for POST roster.
- All calls from mobile use `apiFetch` with automatic cookie.

### Validation / acceptance
- POST date + 5 student records → DB has 5 rows for that date.
- GET as student → returns only that student's rows.
- GET roster → returns list of woxsen-student users.
- GET unauthenticated → 401; student tries to POST roster → 403.

### Out of scope
- Cohort / classroom tables (v2).

### Linked files
- new: `mobile/src/server/handlers/attendance.ts`

---

## Issue #053 — `/api/upload` & `/api/files` handlers + S3 presigned upload
**Epic:** teacher | **Type:** feat | **Priority:** P2 | **Size:** M
**Hard deps:** #014, #015 (S3 credentials via Docker env) | **Soft deps:** none | **Stream:** B | **Assignee:** ____

### Goal
Port `web/src/lib/s3.ts` + `web/src/app/api/upload/route.ts` to the Hono handler. `GET /api/upload` returns whether S3 is configured. `POST /api/upload` accepts JSON `{ filename, fileType }` → returns presigned S3 URL or does direct buffer upload. `GET /api/files` lists all files for the calling user role (teacher sees all, student sees those for their cohort). `DELETE /api/files?id=...` removes a file from DB and S3.

### Context for the AI agent
- AWS credentials from env vars: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`.
- `createPresignedUploadUrl` mirrors web's `s3.ts:46-67`.
- `uploadBufferToS3` mirrors direct buffer upload (used for testing or when presigned not desired).
- Mobile client uses presigned: `fetch(uploadUrl, { method: 'PUT', body: fileBlob })`.

### Required deliverables
1. `mobile/src/server/lib/s3.ts` — porting from web's `s3.ts`.
2. `mobile/src/server/handlers/upload.ts`:
   - `GET /api/upload` → `{ s3Configured: bool }`.
   - `POST /api/upload` (presigned mode) → `{ uploadUrl, fileUrl, key }`.
   - `POST /api/upload` (multipart direct, if S3 not configured — fallback → mock).
3. `mobile/src/server/handlers/files.ts`:
   - `GET /api/files` → `UploadedFile[]` filtered by role + cohort.
   - `DELETE /api/files?id=...` → checks ownership (teacher or uploader), deletes from DB (S3 delete optional).
   - `POST /api/files` metadata bulk (called after mobile finishes S3 upload): `{ name, size, date, fileUrl, key }` → create `UploadedFile` row.

### Technical notes
- `sanitizeFilename` regex from web: `filename.replace(/[^a-zA-Z0-9.-]/g, "_")`.
- Use `auth.api.getSession(...headers)` → `userId` for ownership.
- `fileUrl` format: `https://{bucket}.s3.{region}.amazonaws.com/{key}`.
- Upload presigned: one `PUT /api/upload` JSON returns a presigned URL → mobile then `fetch PUT` directly to S3 → then `POST /api/files` metadata to register the file.

### Validation / acceptance
- `GET /api/upload` returns `s3Configured: true` when env set.
- `POST /api/upload` JSON returns a valid presigned URL.
- `PUT` to presigned URL with a test file → 200.
- `POST /api/files` with metadata → row in `UploadedFile` table visible in Prisma studio.
- `GET /api/files` as student → shows files.
- `DELETE /api/files?id=...` → removes from DB.

### Out of scope
- Direct upload full file on server (multipart heavy).

### Linked files
- read: `web/src/lib/s3.ts`, `web/src/app/api/upload/route.ts`
- new: `mobile/src/server/lib/s3.ts`, `mobile/src/server/handlers/upload.ts`, `mobile/src/server/handlers/files.ts`
