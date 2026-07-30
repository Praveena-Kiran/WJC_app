import { describe, it, expect } from 'vitest';
import app from '../server/app';

describe('GET /api/files & POST /api/upload Handlers (Issue #129 / #053)', () => {
  it('GET /api/files returns course vault file array', async () => {
    const res = await app.request('/api/files');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.files)).toBe(true);
    expect(data.files.length).toBeGreaterThan(0);
  });

  it('POST /api/upload returns upload URL with local fallback when AWS env is missing', async () => {
    const res = await app.request('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: 'N5_Syllabus.pdf',
        contentType: 'application/pdf',
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.uploadUrl).toBeDefined();
  });
});
