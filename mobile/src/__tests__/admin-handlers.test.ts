import { describe, it, expect } from 'vitest';
import app from '../server/app';

describe('/api/admin handlers RBAC guard (Issue #181 / #054)', () => {
  it('returns 401 Unauthorized for unauthenticated GET /api/admin/users', async () => {
    const res = await app.request('/api/admin/users');
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: 'Unauthorized' });
  });

  it('returns 401 Unauthorized for unauthenticated GET /api/admin/health', async () => {
    const res = await app.request('/api/admin/health');
    expect(res.status).toBe(401);
  });

  it('returns 401 Unauthorized for unauthenticated GET /api/admin/audit', async () => {
    const res = await app.request('/api/admin/audit');
    expect(res.status).toBe(401);
  });
});
