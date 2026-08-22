"use server";

import { prisma } from "@/lib/db";
import { deleteFromR2 } from "@/lib/r2";

export async function updateMedia(id: string, data: { alt?: string; caption?: string; role?: string }) {
  const updateData: Record<string, unknown> = {};
  if (data.alt !== undefined) updateData.alt = data.alt;
  if (data.caption !== undefined) updateData.caption = data.caption;
  if (data.role !== undefined) updateData.role = data.role as any;
  await prisma.media.update({ where: { id }, data: updateData });
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (media) {
    try {
      await deleteFromR2(media.filename);
    } catch (e) {
      console.error("Failed to delete file from storage:", e);
    }
  }
  await prisma.media.delete({ where: { id } });
}
