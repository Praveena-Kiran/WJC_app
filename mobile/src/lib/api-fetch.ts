/**
 * api-fetch.ts — Authenticated HTTP wrapper for all server calls.
 *
 * Injects better-auth session cookies automatically, so modules never
 * need to manage cookies manually. All protected API calls must go
 * through this function — never use raw fetch() for server requests.
 *
 * Usage:
 *   const data = await apiFetch<UserProgress>('/api/progress');
 *   await apiFetch('/api/progress', { method: 'PUT', body: JSON.stringify({ ... }) });
 *
 * On error, throws ApiError with status code + response body.
 *
 * Closes #009
 */
import { authClient } from '@/src/auth-client';
import { getApiUrl } from '@/src/lib/api-url';

/** Typed error class for non-2xx API responses. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`API ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/**
 * Fetches a server endpoint with automatic session cookie injection.
 *
 * @param path    - Server path, e.g. '/api/progress'
 * @param init    - Optional fetch options (method, body, headers, signal)
 * @returns       - Parsed JSON response body
 * @throws        - ApiError on non-2xx responses
 */
export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit & { signal?: AbortSignal } = {}
): Promise<T> {
  const url = `${getApiUrl()}${path}`;
  const headers = new Headers(init.headers);

  // Ensure Accept header is always set.
  headers.set('Accept', 'application/json');

  // Set Content-Type for requests with a body (unless already set).
  if (!headers.has('Content-Type') && init.method !== 'GET' && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject the better-auth session cookie.
  // getCookie() returns the raw Cookie header string (e.g. "better-auth.session-token=abc123")
  try {
    const cookies = (authClient as any).getCookie?.();
    if (cookies) headers.set('Cookie', cookies);
  } catch {
    // Not signed in — omit Cookie header. The request will be treated as unauthenticated.
  }

  const response = await fetch(url, {
    ...init,
    headers,
    // CRITICAL: 'omit' prevents native fetch on iOS 18+ from attaching OS-level
    // cookies, which would conflict with the manually-injected Cookie header.
    credentials: 'omit',
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body);
  }

  return response.json() as Promise<T>;
}
