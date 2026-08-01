import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface S3Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

export function getS3Config(): S3Config | null {
  const region = process.env.AWS_REGION || 'us-east-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET;

  if (!accessKeyId || !secretAccessKey || !bucketName) {
    return null;
  }

  return {
    region,
    accessKeyId,
    secretAccessKey,
    bucketName,
  };
}

export function isS3Configured(): boolean {
  return getS3Config() !== null;
}

export function getS3Client(): S3Client | null {
  const config = getS3Config();
  if (!config) return null;

  return new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

export async function createPresignedUploadUrl(
  filename: string,
  contentType: string = 'application/octet-stream'
): Promise<{ uploadUrl: string; fileUrl: string; key: string } | null> {
  const config = getS3Config();
  const s3Client = getS3Client();
  if (!config || !s3Client) return null;

  const sanitizeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `uploads/${Date.now()}_${sanitizeFilename}`;

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const fileUrl = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`;

  return { uploadUrl, fileUrl, key };
}

export async function uploadBufferToS3(
  buffer: Buffer,
  filename: string,
  contentType: string = 'application/octet-stream'
): Promise<{ fileUrl: string; key: string } | null> {
  const config = getS3Config();
  const s3Client = getS3Client();
  if (!config || !s3Client) return null;

  const sanitizeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `uploads/${Date.now()}_${sanitizeFilename}`;

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  const fileUrl = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`;

  return { fileUrl, key };
}

export async function deleteS3Object(key: string): Promise<boolean> {
  const config = getS3Config();
  const s3Client = getS3Client();
  if (!config || !s3Client) return false;

  try {
    const command = new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (err) {
    console.error('S3 delete error:', err);
    return false;
  }
}
