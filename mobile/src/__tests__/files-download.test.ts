import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

vi.mock('../server/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('../server/db', () => ({
  prisma: {
    uploadedFile: {
      findUnique: vi.fn(),
    },
    userProfile: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('../server/lib/s3', () => ({
  isS3Configured: vi.fn().mockReturnValue(true),
  createPresignedDownloadUrl: vi.fn(),
  deleteS3Object: vi.fn(),
}));

import { auth } from '../server/auth';
import { prisma } from '../server/db';
import { isS3Configured, createPresignedDownloadUrl } from '../server/lib/s3';
import { filesRoute } from '../server/handlers/files';

function mockSession(role: string | null) {
  const session = {
    user: { id: 'user-1', name: 'Test Student' },
    session: { token: 'mock-token' },
  };
  const profile = role ? { userId: 'user-1', role: role.toUpperCase() } : null;
  (auth.api.getSession as any).mockResolvedValue(session);
  (prisma.userProfile.findUnique as any).mockResolvedValue(profile);
}

function noSession() {
  (auth.api.getSession as any).mockResolvedValue(null);
  (prisma.userProfile.findUnique as any).mockResolvedValue(null);
}

describe('Source checks — s3.ts and files.ts', () => {
  it('s3.ts exports createPresignedDownloadUrl', () => {
    const s3Path = path.resolve(__dirname, '../server/lib/s3.ts');
    const code = fs.readFileSync(s3Path, 'utf-8');
    expect(code).toContain('export async function createPresignedDownloadUrl');
    expect(code).toContain('GetObjectCommand');
  });

  it('files.ts has GET /:id/download route', () => {
    const filesPath = path.resolve(__dirname, '../server/handlers/files.ts');
    const code = fs.readFileSync(filesPath, 'utf-8');
    expect(code).toContain("filesRoute.get('/:id/download'");
    expect(code).toContain('createPresignedDownloadUrl');
  });
});

describe('GET /api/files/:id/download', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 403 when no session', async () => {
    noSession();
    const res = await filesRoute.request('/f-1/download');
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toContain('Forbidden');
  });

  it('returns 403 for external role', async () => {
    mockSession('external');
    const res = await filesRoute.request('/f-1/download');
    expect(res.status).toBe(403);
  });

  it('returns presigned URL for woxsen-student with S3 configured', async () => {
    mockSession('woxsen-student');
    (prisma.uploadedFile.findUnique as any).mockResolvedValue({
      id: 'f-1',
      name: 'JLPT N5 Grammar Handbook.pdf',
      key: 'vault/JLPT_N5_Grammar_Handbook.pdf',
      fileUrl: 'https://bucket.s3.region.amazonaws.com/vault/file.pdf',
    });
    (createPresignedDownloadUrl as any).mockResolvedValue(
      'https://presigned.example.com/download?token=abc'
    );

    const res = await filesRoute.request('/f-1/download');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.downloadUrl).toBe('https://presigned.example.com/download?token=abc');
  });

  it('falls back to fileUrl when S3 not configured', async () => {
    mockSession('woxsen-student');
    (isS3Configured as any).mockReturnValue(false);
    (prisma.uploadedFile.findUnique as any).mockResolvedValue({
      id: 'f-1',
      name: 'Test.pdf',
      key: 'vault/Test.pdf',
      fileUrl: '/vault/Test.pdf',
    });

    const res = await filesRoute.request('/f-1/download');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.downloadUrl).toBe('/vault/Test.pdf');
  });

  it('returns 404 for unknown file id', async () => {
    mockSession('woxsen-student');
    (prisma.uploadedFile.findUnique as any).mockResolvedValue(null);

    const res = await filesRoute.request('/nonexistent/download');
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toContain('not found');
  });

  it('returns fallback file from registry when DB offline', async () => {
    mockSession('woxsen-student');
    (prisma.uploadedFile.findUnique as any).mockRejectedValue(
      new Error('DB offline')
    );

    const res = await filesRoute.request('/f-1/download');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.downloadUrl).toBe('/vault/JLPT_N5_Grammar_Handbook.pdf');
  });
});
