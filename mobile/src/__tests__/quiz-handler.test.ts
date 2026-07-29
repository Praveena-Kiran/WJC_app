import { describe, it, expect, vi } from 'vitest';
import app from '../server/app';
import { quizRoute } from '../server/handlers/quiz';

describe('/api/quiz POST handler (Issue #042)', () => {
  it('GET /healthz returns ok: true', async () => {
    const res = await app.request('/healthz');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
  });

  it('POST /api/quiz returns 401 Unauthorized when unauthenticated', async () => {
    const res = await app.request('/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deck: 'Hiragana',
        length: 10,
        score: 8,
      }),
    });
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toEqual({ error: 'Unauthorized' });
  });
});
