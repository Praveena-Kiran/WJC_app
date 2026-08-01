import { describe, it, expect } from 'vitest';
import app from '../server/app';

describe('GET & POST /api/upload & /api/files Handlers (Issue #129 / #053)', () => {
  it('GET /api/upload returns s3Configured status boolean', async () => {
    const res = await app.request('/api/upload');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(typeof data.s3Configured).toBe('boolean');
  });

  it('POST /api/upload returns upload URL with local fallback or S3 presigned URL', async () => {
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
    expect(data.fileUrl).toBeDefined();
    expect(data.key).toBeDefined();
  });

  it('GET /api/files returns course vault file array', async () => {
    const res = await app.request('/api/files');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.files)).toBe(true);
    expect(data.files.length).toBeGreaterThan(0);
  });

  it('POST /api/files registers new file metadata and DELETE /api/files removes it', async () => {
    const postRes = await app.request('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'JLPT N5 Practice Test 1.pdf',
        size: '3.5 MB',
        fileUrl: 'https://woxsen-vault.s3.amazonaws.com/uploads/practice_test_1.pdf',
        key: 'uploads/practice_test_1.pdf',
      }),
    });

    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.ok).toBe(true);
    expect(postData.file).toBeDefined();
    const createdId = postData.file.id;

    // Delete created file
    const delRes = await app.request(`/api/files?id=${createdId}`, {
      method: 'DELETE',
    });

    expect(delRes.status).toBe(200);
    const delData = await delRes.json();
    expect(delData.ok).toBe(true);
  });
});
