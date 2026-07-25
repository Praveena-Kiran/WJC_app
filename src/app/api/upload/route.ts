import { NextRequest, NextResponse } from "next/server";
import { isS3Configured, createPresignedUploadUrl, uploadBufferToS3 } from "@/lib/s3";

export async function GET(req: NextRequest) {
  const configured = isS3Configured();
  return NextResponse.json({
    s3Configured: configured,
    message: configured
      ? "S3 storage is active and configured."
      : "S3 credentials are missing. Operating in local fallback mode.",
  });
}

export async function POST(req: NextRequest) {
  try {
    const configured = isS3Configured();

    // Check if request is multipart/form-data or JSON (presigned URL request)
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const { filename, fileType } = await req.json();

      if (!filename) {
        return NextResponse.json({ error: "Filename is required" }, { status: 400 });
      }

      if (!configured) {
        // Fallback response for local dev without S3 credentials
        const mockFileUrl = `/uploads/mock_${Date.now()}_${filename}`;
        return NextResponse.json({
          s3Configured: false,
          mode: "fallback",
          fileUrl: mockFileUrl,
          message: "S3 credentials not set in .env.local. Created local mock upload URL.",
        });
      }

      const presignedData = await createPresignedUploadUrl(filename, fileType || "application/octet-stream");
      if (!presignedData) {
        return NextResponse.json({ error: "Failed to generate presigned S3 URL" }, { status: 500 });
      }

      return NextResponse.json({
        s3Configured: true,
        mode: "presigned",
        ...presignedData,
      });
    }

    // Direct FormData file upload handling
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided in form data" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!configured) {
      // Local fallback mode: Return simulated URL and metadata
      const mockFileUrl = `https://mock-s3.local/uploads/${Date.now()}_${file.name}`;
      return NextResponse.json({
        s3Configured: false,
        mode: "fallback",
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        fileUrl: mockFileUrl,
        message: "S3 credentials not configured. File received and simulated in local fallback mode.",
      });
    }

    const uploadResult = await uploadBufferToS3(buffer, file.name, file.type || "application/octet-stream");
    if (!uploadResult) {
      return NextResponse.json({ error: "Failed to upload file to S3 bucket" }, { status: 500 });
    }

    return NextResponse.json({
      s3Configured: true,
      mode: "direct",
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      fileUrl: uploadResult.fileUrl,
      key: uploadResult.key,
    });
  } catch (error: any) {
    console.error("Upload Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
