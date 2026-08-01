import { Hono } from 'hono';
import { createPresignedUploadUrl, isS3Configured } from '../lib/s3';

export const uploadRoute = new Hono();

// GET /api/upload — Check whether S3 presigned upload is configured
uploadRoute.get('/', (c) => {
  return c.json({
    ok: true,
    s3Configured: isS3Configured(),
  });
});

// POST /api/upload — Generate S3 presigned URL or local mock upload fallback URL
uploadRoute.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const filename = body.filename || body.name || 'handout.pdf';
    const contentType = body.contentType || body.fileType || 'application/pdf';

    if (isS3Configured()) {
      const presigned = await createPresignedUploadUrl(filename, contentType);
      if (presigned) {
        return c.json({
          ok: true,
          mode: 's3',
          s3Configured: true,
          uploadUrl: presigned.uploadUrl,
          fileUrl: presigned.fileUrl,
          key: presigned.key,
        });
      }
    }

    // Fallback mode when S3 is not configured
    const sanitizeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const mockKey = `uploads/${Date.now()}_${sanitizeFilename}`;
    const mockUploadUrl = `/api/files/mock-upload/${mockKey}`;
    const mockFileUrl = `/vault/${sanitizeFilename}`;

    return c.json({
      ok: true,
      mode: 'local-fallback',
      s3Configured: false,
      message: 'No S3 credentials found; using local fallback upload endpoint.',
      uploadUrl: mockUploadUrl,
      fileUrl: mockFileUrl,
      key: mockKey,
    });
  } catch (error) {
    return c.json({ ok: false, error: 'Invalid upload request payload' }, 400);
  }
});
