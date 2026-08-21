import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadToR2 } from "@/lib/r2";
import { getSession } from "@/lib/auth";

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
}
