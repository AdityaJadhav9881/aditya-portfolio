"use server";

import { prisma } from "@/lib/db";

export async function updateMedia(id: string, data: { alt?: string; caption?: string; role?: string }) {
  const updateData: Record<string, unknown> = {};
  if (data.alt !== undefined) updateData.alt = data.alt;
  if (data.caption !== undefined) updateData.caption = data.caption;
  if (data.role !== undefined) updateData.role = data.role as any;
  await prisma.media.update({ where: { id }, data: updateData });
}

export async function deleteMedia(id: string) {
  await prisma.media.delete({ where: { id } });
}
