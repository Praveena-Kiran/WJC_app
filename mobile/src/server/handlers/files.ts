import { Hono } from 'hono';
import { auth } from '../auth';
import { prisma } from '../db';
import { deleteS3Object, isS3Configured } from '../lib/s3';

export const filesRoute = new Hono();

export interface VaultFile {
  id: string;
  name?: string;
  filename?: string;
  size: string;
  date?: string;
  uploadedAt?: string;
  fileUrl?: string;
  url?: string;
  key?: string;
  uploadedBy?: string;
}

const fallbackFileRegistry: VaultFile[] = [
  {
    id: 'f-1',
    filename: 'JLPT N5 Grammar Handbook.pdf',
    name: 'JLPT N5 Grammar Handbook.pdf',
    size: '2.4 MB',
    uploadedAt: '2026-07-28',
    date: '2026-07-28',
    url: '/vault/JLPT_N5_Grammar_Handbook.pdf',
    fileUrl: '/vault/JLPT_N5_Grammar_Handbook.pdf',
    key: 'vault/JLPT_N5_Grammar_Handbook.pdf',
    uploadedBy: 'system',
  },
  {
    id: 'f-2',
    filename: 'Kanji Stroke Order Guide.pdf',
    name: 'Kanji Stroke Order Guide.pdf',
    size: '4.1 MB',
    uploadedAt: '2026-07-29',
    date: '2026-07-29',
    url: '/vault/Kanji_Stroke_Order_Guide.pdf',
    fileUrl: '/vault/Kanji_Stroke_Order_Guide.pdf',
    key: 'vault/Kanji_Stroke_Order_Guide.pdf',
    uploadedBy: 'system',
  },
];

async function getAuthAndProfile(c: any) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (!session) return { session: null, profile: null, role: null };

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    });
    return { session, profile, role: profile?.role?.toLowerCase() || 'external' };
  } catch (err) {
    return { session: null, profile: null, role: null };
  }
}

// GET /api/files — Course vault catalog
filesRoute.get('/', async (c) => {
  const { session, role } = await getAuthAndProfile(c);

  try {
    const files = await prisma.uploadedFile.findMany({
      orderBy: { date: 'desc' },
      include: {
        file: { select: { id: true, name: true, email: true } },
      },
    });

    if (files.length > 0) {
      const formatted = files.map((f) => ({
        id: f.id,
        name: f.name,
        filename: f.name,
        size: f.size,
        date: f.date.toISOString().split('T')[0],
        uploadedAt: f.date.toISOString().split('T')[0],
        fileUrl: f.fileUrl,
        url: f.fileUrl,
        key: f.key,
        uploadedBy: f.uploadedBy,
        uploaderName: f.file?.name,
      }));
      return c.json({ ok: true, files: formatted });
    }
  } catch (err) {
    // DB offline / fallback
  }

  return c.json({
    ok: true,
    files: fallbackFileRegistry,
  });
});

// POST /api/files — Register file metadata after S3 upload
filesRoute.post('/', async (c) => {
  const { session } = await getAuthAndProfile(c);
  const userId = session?.user.id || 'default-uploader';

  try {
    const body = await c.req.json();
    const { name, filename, size, date, fileUrl, url, key } = body;
    const fileNameToUse = name || filename || 'handout.pdf';
    const fileSizeToUse = size || '1.0 MB';
    const fileUrlToUse = fileUrl || url || `/vault/${fileNameToUse}`;
    const fileKeyToUse = key || `uploads/${Date.now()}_${fileNameToUse}`;
    const dateToUse = date ? new Date(date) : new Date();

    let createdRecord: VaultFile;

    try {
      const record = await prisma.uploadedFile.create({
        data: {
          name: fileNameToUse,
          size: fileSizeToUse,
          date: dateToUse,
          fileUrl: fileUrlToUse,
          key: fileKeyToUse,
          uploadedBy: userId,
        },
      });

      createdRecord = {
        id: record.id,
        name: record.name,
        filename: record.name,
        size: record.size,
        date: record.date.toISOString().split('T')[0],
        uploadedAt: record.date.toISOString().split('T')[0],
        fileUrl: record.fileUrl,
        url: record.fileUrl,
        key: record.key,
        uploadedBy: record.uploadedBy,
      };
    } catch (dbErr) {
      const fallbackRecord: VaultFile = {
        id: `f-${Date.now()}`,
        name: fileNameToUse,
        filename: fileNameToUse,
        size: fileSizeToUse,
        date: dateToUse.toISOString().split('T')[0],
        uploadedAt: dateToUse.toISOString().split('T')[0],
        fileUrl: fileUrlToUse,
        url: fileUrlToUse,
        key: fileKeyToUse,
        uploadedBy: userId,
      };
      fallbackFileRegistry.push(fallbackRecord);
      createdRecord = fallbackRecord;
    }

    return c.json({
      ok: true,
      message: 'File metadata registered successfully',
      file: createdRecord,
    });
  } catch (err) {
    return c.json({ ok: false, error: 'Invalid payload' }, 400);
  }
});

// DELETE /api/files?id=... — Remove file from DB and S3
filesRoute.delete('/', async (c) => {
  const id = c.req.query('id');
  if (!id) {
    return c.json({ ok: false, error: 'Missing file id query parameter' }, 400);
  }

  const { session, role } = await getAuthAndProfile(c);
  const userId = session?.user.id;
  const isTeacherOrAdmin = role === 'teacher' || role === 'admin' || role === 'super_admin';

  try {
    const existingFile = await prisma.uploadedFile.findUnique({
      where: { id },
    });

    if (existingFile) {
      // Permission check: uploader or teacher/admin
      if (session && existingFile.uploadedBy !== userId && !isTeacherOrAdmin) {
        return c.json({ ok: false, error: 'Forbidden: You do not own this file' }, 403);
      }

      await prisma.uploadedFile.delete({ where: { id } });

      if (isS3Configured() && existingFile.key) {
        await deleteS3Object(existingFile.key);
      }

      return c.json({ ok: true, message: 'File deleted successfully' });
    }
  } catch (dbErr) {
    // DB query error / fallback handling
  }

  const idx = fallbackFileRegistry.findIndex((f) => f.id === id);
  if (idx !== -1) {
    const file = fallbackFileRegistry[idx];
    if (session && file.uploadedBy && file.uploadedBy !== userId && !isTeacherOrAdmin) {
      return c.json({ ok: false, error: 'Forbidden: You do not own this file' }, 403);
    }
    fallbackFileRegistry.splice(idx, 1);
    return c.json({ ok: true, message: 'File deleted successfully' });
  }

  return c.json({ ok: false, error: 'File not found' }, 404);
});
