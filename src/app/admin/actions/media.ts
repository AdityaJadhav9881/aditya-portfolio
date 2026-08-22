"use server";

import { prisma } from "@/lib/db";
import { deleteFromR2 } from "@/lib/r2";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function updateMedia(id: string, data: { alt?: string; caption?: string; role?: string; projectId?: string | null }) {
  await requireAdmin();

  try {
    const updateData: Record<string, unknown> = {};
    if (data.alt !== undefined) updateData.alt = data.alt;
    if (data.caption !== undefined) updateData.caption = data.caption;
    if (data.role !== undefined) updateData.role = data.role as any;
    if (data.projectId !== undefined) updateData.projectId = data.projectId || null;
    await prisma.media.update({ where: { id }, data: updateData });
  } catch (error) {
    console.error("Failed to update media:", error);
    throw new Error("Failed to update media.");
  }
}

export async function deleteMedia(id: string) {
  await requireAdmin();

  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (media) {
      try {
        await deleteFromR2(media.filename);
      } catch (e) {
        console.error("Failed to delete file from storage:", e);
      }
    }
    await prisma.media.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete media:", error);
    throw new Error("Failed to delete media.");
  }
}
