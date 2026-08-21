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

export async function createResearchEntry(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || slugify(title);
  const description = formData.get("description") as string | null;
  const linksRaw = formData.get("links") as string | null;
  const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;
  const visible = formData.get("visible") !== "off";

  let links = null;
  if (linksRaw) {
    try {
      links = JSON.parse(linksRaw);
    } catch {
      links = linksRaw;
    }
  }

  await prisma.researchEntry.create({
    data: { title, slug, description, links, displayOrder, visible },
  });

  revalidatePath("/admin");
  revalidatePath("/research");
}

export async function updateResearchEntry(id: string, formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || slugify(title);
  const description = formData.get("description") as string | null;
  const linksRaw = formData.get("links") as string | null;
  const displayOrder = formData.get("displayOrder") ? parseInt(formData.get("displayOrder") as string) : 0;
  const visible = formData.get("visible") !== "off";

  let links = null;
  if (linksRaw) {
    try {
      links = JSON.parse(linksRaw);
    } catch {
      links = linksRaw;
    }
  }

  await prisma.researchEntry.update({
    where: { id },
    data: { title, slug, description, links, displayOrder, visible },
  });

  revalidatePath("/admin");
  revalidatePath("/research");
}

export async function deleteResearchEntry(id: string) {
  await requireAdmin();

  await prisma.researchEntry.delete({ where: { id } });

  revalidatePath("/admin");
  revalidatePath("/research");
}
