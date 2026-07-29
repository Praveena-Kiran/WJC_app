/**
 * app/api/auth/[...auth]+api.ts
 *
 * Expo Router API route: mounts the better-auth handler for DEV use.
 * In production, auth is served by the Hono app (see src/server/app.ts).
 *
 * Expo Router API routes run server-side (Node), NOT inside the Hermes/JSC
 * runtime, so the Metro blockList does not apply here.
 *
 * Usage (dev):
 *   curl http://localhost:8081/api/auth/ok
 *   curl -X POST http://localhost:8081/api/auth/sign-up/email \
 *     -H 'Content-Type: application/json' \
 *     -d '{"email":"test@zengo.test","password":"Test12345!","name":"Test"}'
 *
 * Closes #008
 */
import { auth } from '@/src/server/auth';

export const GET = auth.handler;
export const POST = auth.handler;
