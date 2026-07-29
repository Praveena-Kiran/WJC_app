/**
 * app/api/progress+api.ts
 *
 * Expo Router API route: proxies /api/progress to the Hono handler for DEV.
 * In production the Hono app (src/server/app.ts) serves this route.
 *
 * Closes #012
 */
import app from '@/src/server/app';

export const GET = (request: Request) => app.fetch(request);
export const PUT = (request: Request) => app.fetch(request);
