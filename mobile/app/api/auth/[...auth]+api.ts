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

// Register a global error handler for uncaught stream errors caused by disconnected HTTP sockets
// in Expo Server (expo-server vendor pipeline bug).
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  process.on('unhandledRejection', (reason: any) => {
    if (
      reason?.message?.includes('Cannot pipe to a closed or destroyed stream') ||
      reason?.code === 'ERR_STREAM_DESTROYED'
    ) {
      // Suppress benign client disconnect stream error so Metro server doesn't crash
      return;
    }
    console.error('Unhandled Rejection:', reason);
  });
}

async function handle(request: Request) {
  // If the client aborted the connection before processing, return a body-less response
  if (request.signal?.aborted) {
    return new Response(null, { status: 499 });
  }

  try {
    const response = await auth.handler(request);

    // If client disconnected while handler was processing, return body-less response
    if (request.signal?.aborted) {
      return new Response(null, { status: 499 });
    }

    // Buffer response body to prevent stream piping errors in expo-server
    const body = await response.arrayBuffer();

    if (request.signal?.aborted) {
      return new Response(null, { status: 499 });
    }

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error: any) {
    if (
      request.signal?.aborted ||
      error?.name === 'AbortError' ||
      error?.message?.includes('closed or destroyed stream')
    ) {
      return new Response(null, { status: 499 });
    }

    console.error('[auth api handler error]:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const GET = handle;
export const POST = handle;


