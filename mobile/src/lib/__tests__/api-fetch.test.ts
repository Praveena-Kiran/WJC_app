/**
 * api-fetch.test.ts — Unit tests for the apiFetch wrapper.
 *
 * Tests:
 *   1. Returns parsed JSON on 200 OK
 *   2. Throws ApiError on 401 Unauthorized
 *   3. Throws ApiError on 404 Not Found with body
 *   4. Injects Cookie header when authClient.getCookie() returns a value
 *
 * Uses vitest with manual fetch mocking (no MSW required).
 *
 * Closes #009b
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiError } from '../api-fetch';

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mock expo-constants (getApiUrl dependency)
vi.mock('expo-constants', () => ({
  default: {
    expoConfig: { extra: { apiUrl: 'http://localhost:8081' } },
    expoGoConfig: null,
  },
}));

// Mock auth client so getCookie() is controllable
vi.mock('@/src/auth-client', () => ({
  authClient: {
    getCookie: vi.fn().mockReturnValue(null),
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockFetch(status: number, body: unknown) {
  return vi.spyOn(global, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('apiFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed JSON on 200 OK', async () => {
    mockFetch(200, { ok: true, message: 'healthy' });

    // Dynamic import after mocks are in place
    const { apiFetch } = await import('../api-fetch');
    const result = await apiFetch('/api/healthz');

    expect(result).toEqual({ ok: true, message: 'healthy' });
  });

  it('throws ApiError with status 401 on unauthorized', async () => {
    mockFetch(401, { error: 'Unauthorized' });

    const { apiFetch } = await import('../api-fetch');

    const err: any = await apiFetch('/api/progress').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(401);
  });

  it('throws ApiError with status 404 and body', async () => {
    mockFetch(404, { error: 'Not Found' });
    mockFetch(404, { error: 'Not Found' }); // second call for .rejects.toMatchObject

    const { apiFetch } = await import('../api-fetch');

    const err: any = await apiFetch('/api/nonexistent').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(404);
    expect(err.body).toEqual({ error: 'Not Found' });
  });

  it('injects Cookie header when authClient has a session', async () => {
    const { authClient } = await import('@/src/auth-client');
    vi.mocked((authClient as any).getCookie).mockReturnValue('better-auth.session-token=abc123');

    const fetchSpy = mockFetch(200, { masteredKana: [] });

    const { apiFetch } = await import('../api-fetch');
    await apiFetch('/api/progress');

    const calledHeaders = fetchSpy.mock.calls[0]?.[1]?.headers as Headers | undefined;
    expect(calledHeaders?.get('Cookie')).toBe('better-auth.session-token=abc123');
  });

  it('sets credentials to omit', async () => {
    mockFetch(200, {});

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response('{}', { status: 200 })
    );

    const { apiFetch } = await import('../api-fetch');
    await apiFetch('/api/healthz');

    expect(fetchSpy.mock.calls[0]?.[1]?.credentials).toBe('omit');
  });
});
