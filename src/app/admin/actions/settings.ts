"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany();
  return settings.reduce<Record<string, unknown>>(
    (acc, s) => ({ ...acc, [s.key]: s.value }),
    {}
  );
}

export async function updateSiteSetting(key: string, value: string) {
  await requireAdmin();

  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: JSON.parse(JSON.stringify(value)) },
    create: { key, value: JSON.parse(JSON.stringify(value)) },
  });

  revalidatePath("/admin/settings");
}
