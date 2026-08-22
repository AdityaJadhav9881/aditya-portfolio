"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  await prisma.media.delete({ where: { id } });
}
