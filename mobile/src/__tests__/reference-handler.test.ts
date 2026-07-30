import { describe, it, expect } from 'vitest';
import app from '../server/app';

describe('GET /api/reference handler (Issue #168 / #035)', () => {
  it('returns reference data payload and Cache-Control headers', async () => {
    const res = await app.request('/api/reference?type=all');
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toContain('max-age=604800');
    expect(res.headers.get('ETag')).toBeDefined();

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
  });

  it('returns 304 Not Modified when ETag matches If-None-Match header', async () => {
    const res = await app.request('/api/reference', {
      headers: { 'If-None-Match': '"ref-v1"' },
    });
    expect(res.status).toBe(304);
  });
});
