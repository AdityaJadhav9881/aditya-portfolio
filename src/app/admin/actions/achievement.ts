"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function createAchievement(formData: FormData) {
  await requireAdmin();

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const year = formData.get("year") ? parseInt(formData.get("year") as string) : null;
    const category = formData.get("category") as string | null;
    const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;
    const visible = formData.get("visible") !== "off";

    await prisma.achievement.create({
      data: { title, description, year, category, displayOrder, visible },
    });

    revalidatePath("/admin");
    revalidatePath("/achievements");
  } catch (error) {
    console.error("Failed to create achievement:", error);
    throw new Error("Failed to create achievement.");
  }
}

export async function updateAchievement(id: string, formData: FormData) {
  await requireAdmin();

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const year = formData.get("year") ? parseInt(formData.get("year") as string) : null;
    const category = formData.get("category") as string | null;
    const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;
    const visible = formData.get("visible") !== "off";

    await prisma.achievement.update({
      where: { id },
      data: { title, description, year, category, displayOrder, visible },
    });

    revalidatePath("/admin");
    revalidatePath("/achievements");
  } catch (error) {
    console.error("Failed to update achievement:", error);
    throw new Error("Failed to update achievement.");
  }
}

export async function deleteAchievement(id: string) {
  await requireAdmin();

  try {
    await prisma.achievement.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/achievements");
  } catch (error) {
    console.error("Failed to delete achievement:", error);
    throw new Error("Failed to delete achievement.");
  }
}
