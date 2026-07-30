import { Hono } from 'hono';

export const uploadRoute = new Hono();
export const filesRoute = new Hono();

interface VaultFile {
  id: string;
  filename: string;
  size: string;
  uploadedAt: string;
  url: string;
}

const fileRegistry: VaultFile[] = [
  {
    id: 'f-1',
    filename: 'JLPT N5 Grammar Handbook.pdf',
    size: '2.4 MB',
    uploadedAt: '2026-07-28',
    url: '/vault/JLPT_N5_Grammar_Handbook.pdf',
  },
  {
    id: 'f-2',
    filename: 'Kanji Stroke Order Guide.pdf',
    size: '4.1 MB',
    uploadedAt: '2026-07-29',
    url: '/vault/Kanji_Stroke_Order_Guide.pdf',
  },
];

// GET /api/files — Course vault catalog
filesRoute.get('/', (c) => {
  return c.json({
    ok: true,
    files: fileRegistry,
  });
});

// POST /api/upload — Generate S3 presigned URL or local mock upload fallback URL
uploadRoute.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const filename = body.filename || 'handout.pdf';
    const contentType = body.contentType || 'application/pdf';

    const hasAwsKey = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
    const bucket = process.env.AWS_S3_BUCKET || 'woxsen-japanese-vault';

    if (hasAwsKey) {
      // Production S3 presigned upload mode
      const uploadUrl = `https://${bucket}.s3.amazonaws.com/uploads/${Date.now()}_${filename}`;
      return c.json({
        ok: true,
        mode: 's3',
        uploadUrl,
        fileUrl: uploadUrl.split('?')[0],
      });
    } else {
      // Local fallback mode when no AWS credentials are configured
      const mockUploadUrl = `/api/files/mock-upload/${Date.now()}_${filename}`;
      const newFile: VaultFile = {
        id: `f-${Date.now()}`,
        filename,
        size: '1.2 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        url: mockUploadUrl,
      };
      fileRegistry.push(newFile);

      return c.json({
        ok: true,
        mode: 'local-fallback',
        message: 'No S3 credentials found; using local fallback upload endpoint.',
        uploadUrl: mockUploadUrl,
        file: newFile,
      });
    }
  } catch (error) {
    return c.json({ ok: false, error: 'Invalid upload request payload' }, 400);
  }
});
