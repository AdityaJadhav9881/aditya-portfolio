"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function createSection(projectId: string, formData: FormData) {
  await requireAdmin();

  try {
    const sectionType = formData.get("sectionType") as string;
    const title = formData.get("title") as string | null;
    const content = formData.get("content") as string | null;
    const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;

    await prisma.projectSection.create({
      data: { projectId, sectionType: sectionType as any, title, content, displayOrder },
    });
    revalidatePath(`/admin/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to create section:", error);
    throw new Error("Failed to create section.");
  }
}

export async function updateSection(sectionId: string, projectId: string, formData: FormData) {
  await requireAdmin();

  try {
    const title = formData.get("title") as string | null;
    const content = formData.get("content") as string | null;
    const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;
    const visible = formData.get("visible") !== "off";

    await prisma.projectSection.update({
      where: { id: sectionId },
      data: { title, content, displayOrder, visible },
    });
    revalidatePath(`/admin/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to update section:", error);
    throw new Error("Failed to update section.");
  }
}

export async function deleteSection(sectionId: string, projectId: string) {
  await requireAdmin();

  try {
    await prisma.projectSection.delete({ where: { id: sectionId } });
    revalidatePath(`/admin/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to delete section:", error);
    throw new Error("Failed to delete section.");
  }
}

export async function toggleSectionVisible(sectionId: string, projectId: string) {
  await requireAdmin();

  try {
    const section = await prisma.projectSection.findUnique({ where: { id: sectionId } });
    if (!section) return;
    await prisma.projectSection.update({
      where: { id: sectionId },
      data: { visible: !section.visible },
    });
    revalidatePath(`/admin/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to toggle section visibility:", error);
    throw new Error("Failed to update section.");
  }
}
