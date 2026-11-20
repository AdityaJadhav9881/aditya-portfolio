"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { isChecked, parseOrder } from "@/lib/forms";
import { Prisma } from "@prisma/client";

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

function parseResearchLinks(linksRaw: string | null): { label: string; url: string }[] | null {
  if (!linksRaw || !linksRaw.trim()) return null;
  try {
    const parsed = JSON.parse(linksRaw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((l): l is { label?: string; url?: string; href?: string; name?: string } => l && typeof l === "object")
        .filter((l) => l.url || l.href)
        .map((l) => ({ label: String(l.label || l.name || l.url || l.href), url: String(l.url || l.href) }));
    }
    if (parsed && typeof parsed === "object" && (parsed.url || parsed.href)) {
      const p = parsed as { label?: string; name?: string; url?: string; href?: string };
      return [{ label: String(p.label || p.name || p.url || p.href), url: String(p.url || p.href) }];
    }
    return null;
  } catch {
    if (/^https?:\/\//i.test(linksRaw.trim())) {
      return [{ label: "Link", url: linksRaw.trim() }];
    }
    return null;
  }
}

function toPrismaJson(value: { label: string; url: string }[] | null) {
  if (!value) return Prisma.DbNull;
  return value as unknown as Prisma.InputJsonValue;
}

export async function createResearchEntry(formData: FormData) {
  await requireAdmin();

  try {
    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || slugify(title);
    const description = formData.get("description") as string | null;
    const links = toPrismaJson(parseResearchLinks(formData.get("links") as string | null));
    const displayOrder = parseOrder(formData.get("displayOrder"));
    const visible = isChecked(formData.get("visible"));

    await prisma.researchEntry.create({
      data: { title, slug, description, links, displayOrder, visible },
    });

    revalidatePath("/admin");
    revalidatePath("/research");
  } catch (error) {
    console.error("Failed to create research entry:", error);
    throw new Error("Failed to create research entry.");
  }
}

export async function updateResearchEntry(id: string, formData: FormData) {
  await requireAdmin();

  try {
    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || slugify(title);
    const description = formData.get("description") as string | null;
    const links = toPrismaJson(parseResearchLinks(formData.get("links") as string | null));
    const displayOrder = parseOrder(formData.get("displayOrder"));
    const visible = isChecked(formData.get("visible"));

    await prisma.researchEntry.update({
      where: { id },
      data: { title, slug, description, links, displayOrder, visible },
    });

    revalidatePath("/admin");
    revalidatePath("/research");
  } catch (error) {
    console.error("Failed to update research entry:", error);
    throw new Error("Failed to update research entry.");
  }
}

export async function deleteResearchEntry(id: string) {
  await requireAdmin();

  try {
    await prisma.researchEntry.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/research");
  } catch (error) {
    console.error("Failed to delete research entry:", error);
    throw new Error("Failed to delete research entry.");
  }
}
