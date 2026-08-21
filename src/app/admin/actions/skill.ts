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

export async function createSkillGroup(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || slugify(name);
  const description = formData.get("description") as string | null;
  const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;

  await prisma.skillGroup.create({
    data: { name, slug, description, displayOrder },
  });

  revalidatePath("/admin");
  revalidatePath("/skills");
}

export async function updateSkillGroup(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || slugify(name);
  const description = formData.get("description") as string | null;
  const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;

  await prisma.skillGroup.update({
    where: { id },
    data: { name, slug, description, displayOrder },
  });

  revalidatePath("/admin");
  revalidatePath("/skills");
}

export async function deleteSkillGroup(id: string) {
  await requireAdmin();

  await prisma.skillGroup.delete({ where: { id } });

  revalidatePath("/admin");
  revalidatePath("/skills");
}

export async function createSkill(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || slugify(name);
  const skillGroupId = formData.get("skillGroupId") as string | null;
  const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;

  await prisma.skill.create({
    data: {
      name,
      slug,
      skillGroupId: skillGroupId || null,
      displayOrder,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/skills");
}

export async function updateSkill(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || slugify(name);
  const skillGroupId = formData.get("skillGroupId") as string | null;
  const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;

  await prisma.skill.update({
    where: { id },
    data: {
      name,
      slug,
      skillGroupId: skillGroupId || null,
      displayOrder,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/skills");
}

export async function deleteSkill(id: string) {
  await requireAdmin();

  await prisma.skill.delete({ where: { id } });

  revalidatePath("/admin");
  revalidatePath("/skills");
}
