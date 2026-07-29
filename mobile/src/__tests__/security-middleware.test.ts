import { describe, it, expect } from 'vitest';
import app from '../server/app';

describe('API Security Middleware (Issue #176 / #069)', () => {
  it('returns security headers on requests', async () => {
    const res = await app.request('/healthz');
    expect(res.status).toBe(200);
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('x-frame-options')).toBe('DENY');
  });

  it('rejects malformed body payloads with 400 Bad Request', async () => {
    const res = await app.request('/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deck: '', // min length 1 required
        length: 'invalid', // number required
      }),
    });
    expect(res.status).toBe(400);
  });
});
