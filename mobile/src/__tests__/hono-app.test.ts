import { describe, it, expect } from 'vitest';
import app from '../server/app';

describe('Hono Server app.ts Single Source of Handlers (Issue #145 / #014)', () => {
  it('GET /healthz returns ok: true', async () => {
    const res = await app.request('/healthz');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
