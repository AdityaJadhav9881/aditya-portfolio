import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadToR2 } from "@/lib/r2";
import { getSession } from "@/lib/auth";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "application/pdf",
];

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const projectId = formData.get("projectId") as string | null;
  const role = (formData.get("role") as string) || "OTHER";
  const alt = formData.get("alt") as string | null;
  const caption = formData.get("caption") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `File type not allowed: ${file.type}. Allowed: images, videos, PDFs.` },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 20MB.` },
      { status: 400 }
    );
  }

  try {
    const { url, key } = await uploadToR2(file, "portfolio");

    const media = await prisma.media.create({
      data: {
        filename: key,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url,
        alt,
        caption,
        role: role as "COVER" | "HERO" | "GALLERY" | "DIAGRAM" | "HARDWARE" | "TESTING" | "OTHER",
        projectId: projectId || null,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
