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

export async function createProject(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || slugify(name);
  const oneLine = formData.get("oneLine") as string | null;
  const year = formData.get("year") ? parseInt(formData.get("year") as string) : null;
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
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || slugify(name);
  const oneLine = formData.get("oneLine") as string | null;
  const year = formData.get("year") ? parseInt(formData.get("year") as string) : null;
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
}

export async function deleteProject(id: string) {
  await requireAdmin();

  await prisma.project.delete({ where: { id } });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function toggleFeatured(id: string) {
  await requireAdmin();

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return;

  await prisma.project.update({
    where: { id },
    data: { featured: !project.featured },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function toggleHomepage(id: string) {
  await requireAdmin();

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return;

  await prisma.project.update({
    where: { id },
    data: { showOnHomepage: !project.showOnHomepage },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
}
