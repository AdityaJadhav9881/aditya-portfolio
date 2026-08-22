"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function toggleProjectSkill(projectId: string, skillId: string) {
  await requireAdmin();

  try {
    const existing = await prisma.projectSkill.findUnique({
      where: { projectId_skillId: { projectId, skillId } },
    });
    if (existing) {
      await prisma.projectSkill.delete({ where: { projectId_skillId: { projectId, skillId } } });
    } else {
      await prisma.projectSkill.create({ data: { projectId, skillId } });
    }
    revalidatePath(`/admin/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to toggle project skill:", error);
    throw new Error("Failed to update skill relationship.");
  }
}

export async function toggleProjectResearch(projectId: string, researchId: string) {
  await requireAdmin();

  try {
    const existing = await prisma.researchProject.findUnique({
      where: { researchId_projectId: { researchId, projectId } },
    });
    if (existing) {
      await prisma.researchProject.delete({ where: { researchId_projectId: { researchId, projectId } } });
    } else {
      await prisma.researchProject.create({ data: { researchId, projectId } });
    }
    revalidatePath(`/admin/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to toggle project research:", error);
    throw new Error("Failed to update research relationship.");
  }
}

export async function toggleProjectAchievement(projectId: string, achievementId: string) {
  await requireAdmin();

  try {
    const existing = await prisma.achievementProject.findUnique({
      where: { achievementId_projectId: { achievementId, projectId } },
    });
    if (existing) {
      await prisma.achievementProject.delete({ where: { achievementId_projectId: { achievementId, projectId } } });
    } else {
      await prisma.achievementProject.create({ data: { achievementId, projectId } });
    }
    revalidatePath(`/admin/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to toggle project achievement:", error);
    throw new Error("Failed to update achievement relationship.");
  }
}

export async function toggleRelatedProject(projectId: string, relatedProjectId: string) {
  await requireAdmin();

  try {
    if (projectId === relatedProjectId) return;
    const existing = await prisma.projectRelatedProject.findUnique({
      where: { projectId_relatedProjectId: { projectId, relatedProjectId } },
    });
    if (existing) {
      await prisma.projectRelatedProject.delete({
        where: { projectId_relatedProjectId: { projectId, relatedProjectId } },
      });
    } else {
      await prisma.projectRelatedProject.create({
        data: { projectId, relatedProjectId },
      });
    }
    revalidatePath(`/admin/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to toggle related project:", error);
    throw new Error("Failed to update project relationship.");
  }
}

export async function updateProjectMedia(mediaId: string, projectId: string, formData: FormData) {
  await requireAdmin();

  try {
    const role = formData.get("role") as string | null;
    const alt = formData.get("alt") as string | null;
    const caption = formData.get("caption") as string | null;
    const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;

    await prisma.media.update({
      where: { id: mediaId },
      data: {
        projectId,
        role: role as any,
        alt,
        caption,
        displayOrder,
      },
    });
    revalidatePath(`/admin/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to update project media:", error);
    throw new Error("Failed to update media.");
  }
}

export async function unassignMedia(mediaId: string, projectId: string) {
  await requireAdmin();

  try {
    await prisma.media.update({
      where: { id: mediaId },
      data: { projectId: null },
    });
    revalidatePath(`/admin/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to unassign media:", error);
    throw new Error("Failed to unassign media.");
  }
}
