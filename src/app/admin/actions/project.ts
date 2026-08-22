"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function validateSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function validateYear(year: number | null): boolean {
  if (year === null) return true;
  return year >= 2000 && year <= 2100;
}

export async function createProject(formData: FormData) {
  await requireAdmin();

  try {
    const name = formData.get("name") as string;
    if (!name || name.trim().length === 0) {
      throw new Error("Project name is required");
    }

    const slug = (formData.get("slug") as string) || slugify(name);
    if (!validateSlug(slug)) {
      throw new Error("Invalid slug. Use only lowercase letters, numbers, and hyphens.");
    }

    const year = formData.get("year") ? parseInt(formData.get("year") as string) : null;
    if (!validateYear(year)) {
      throw new Error("Year must be between 2000 and 2100");
    }
    const oneLine = formData.get("oneLine") as string | null;
    const category = formData.get("category") as string | null;
    const status = (formData.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "DRAFT";
    const featured = formData.get("featured") === "on";
    const showOnHomepage = formData.get("showOnHomepage") === "on";
    const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;

    const description = formData.get("description") as string | null;
    const problem = formData.get("problem") as string | null;
    const designed = formData.get("designed") as string | null;
    const howItWorks = formData.get("howItWorks") as string | null;
    const engineering = formData.get("engineering") as string | null;
    const result = formData.get("result") as string | null;
    const learned = formData.get("learned") as string | null;

    const technologiesRaw = formData.get("technologies") as string | null;
    const technologies = technologiesRaw
      ? technologiesRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const seoTitle = formData.get("seoTitle") as string | null;
    const seoDescription = formData.get("seoDescription") as string | null;

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        oneLine,
        year,
        category,
        status,
        featured,
        showOnHomepage,
        displayOrder,
        description,
        problem,
        designed,
        howItWorks,
        engineering,
        result,
        learned,
        technologies,
        seoTitle,
        seoDescription,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    redirect(`/admin/projects/${project.id}`);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Project name")) throw error;
    if (error instanceof Error && error.message.startsWith("Invalid slug")) throw error;
    if (error instanceof Error && error.message.startsWith("Year must")) throw error;
    console.error("Failed to create project:", error);
    throw new Error("Failed to create project. Please try again.");
  }
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();

  try {
    const name = formData.get("name") as string;
    if (!name || name.trim().length === 0) {
      throw new Error("Project name is required");
    }

    const slug = (formData.get("slug") as string) || slugify(name);
    if (!validateSlug(slug)) {
      throw new Error("Invalid slug. Use only lowercase letters, numbers, and hyphens.");
    }

    const year = formData.get("year") ? parseInt(formData.get("year") as string) : null;
    if (!validateYear(year)) {
      throw new Error("Year must be between 2000 and 2100");
    }
    const oneLine = formData.get("oneLine") as string | null;
    const category = formData.get("category") as string | null;
    const status = (formData.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "DRAFT";
    const featured = formData.get("featured") === "on";
    const showOnHomepage = formData.get("showOnHomepage") === "on";
    const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;

    const description = formData.get("description") as string | null;
    const problem = formData.get("problem") as string | null;
    const designed = formData.get("designed") as string | null;
    const howItWorks = formData.get("howItWorks") as string | null;
    const engineering = formData.get("engineering") as string | null;
    const result = formData.get("result") as string | null;
    const learned = formData.get("learned") as string | null;

    const technologiesRaw = formData.get("technologies") as string | null;
    const technologies = technologiesRaw
      ? technologiesRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const seoTitle = formData.get("seoTitle") as string | null;
    const seoDescription = formData.get("seoDescription") as string | null;

    await prisma.project.update({
      where: { id },
      data: {
        name,
        slug,
        oneLine,
        year,
        category,
        status,
        featured,
        showOnHomepage,
        displayOrder,
        description,
        problem,
        designed,
        howItWorks,
        engineering,
        result,
        learned,
        technologies,
        seoTitle,
        seoDescription,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/projects");
    redirect(`/admin/projects/${id}`);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Project name")) throw error;
    if (error instanceof Error && error.message.startsWith("Invalid slug")) throw error;
    if (error instanceof Error && error.message.startsWith("Year must")) throw error;
    console.error("Failed to update project:", error);
    throw new Error("Failed to update project. Please try again.");
  }
}

export async function deleteProject(id: string) {
  await requireAdmin();

  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    redirect("/admin/projects");
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw new Error("Failed to delete project. Please try again.");
  }
}

export async function toggleFeatured(id: string) {
  await requireAdmin();

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return;

    await prisma.project.update({
      where: { id },
      data: { featured: !project.featured },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
  } catch (error) {
    console.error("Failed to toggle featured:", error);
    throw new Error("Failed to update project.");
  }
}

export async function toggleHomepage(id: string) {
  await requireAdmin();

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return;

    await prisma.project.update({
      where: { id },
      data: { showOnHomepage: !project.showOnHomepage },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to toggle homepage visibility:", error);
    throw new Error("Failed to update project.");
  }
}

export async function duplicateProject(id: string) {
  await requireAdmin();

  try {
    const original = await prisma.project.findUnique({
      where: { id },
      include: {
        sections: true,
        projectSkills: true,
        researchProjects: true,
        achievementProjects: true,
        relatedProjects: true,
      },
    });
    if (!original) return;

    const newSlug = `${original.slug}-copy-${Date.now()}`;

    const duplicate = await prisma.project.create({
      data: {
        name: `${original.name} (Copy)`,
        slug: newSlug,
        oneLine: original.oneLine,
        year: original.year,
        category: original.category,
        status: "DRAFT",
        featured: false,
        showOnHomepage: false,
        displayOrder: 0,
        description: original.description,
        problem: original.problem,
        designed: original.designed,
        howItWorks: original.howItWorks,
        engineering: original.engineering,
        result: original.result,
        learned: original.learned,
        technologies: original.technologies,
        seoTitle: original.seoTitle,
        seoDescription: original.seoDescription,
        sections: {
          create: original.sections.map((s: any) => ({
            sectionType: s.sectionType,
            title: s.title,
            content: s.content,
            visible: s.visible,
            displayOrder: s.displayOrder,
          })),
        },
        projectSkills: {
          create: original.projectSkills.map((ps: any) => ({ skillId: ps.skillId })),
        },
        researchProjects: {
          create: original.researchProjects.map((rp: any) => ({ researchId: rp.researchId })),
        },
        achievementProjects: {
          create: original.achievementProjects.map((ap: any) => ({ achievementId: ap.achievementId })),
        },
        relatedProjects: {
          create: original.relatedProjects.map((rp: any) => ({ relatedProjectId: rp.relatedProjectId })),
        },
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    redirect(`/admin/projects/${duplicate.id}`);
  } catch (error) {
    console.error("Failed to duplicate project:", error);
    throw new Error("Failed to duplicate project. Please try again.");
  }
}
