"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { isChecked, parseYear, parseOrder } from "@/lib/forms";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

export async function createJourneyEntry(formData: FormData) {
  await requireAdmin();

  try {
    const year = parseYear(formData.get("year"));
    if (year === null) throw new Error("Year is required");
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const type = (formData.get("type") as "MILESTONE" | "PROJECT" | "ONGOING") || "MILESTONE";
    const displayOrder = parseOrder(formData.get("displayOrder"));
    const visible = isChecked(formData.get("visible"));

    await prisma.journeyEntry.create({
      data: { year, title, description, type, displayOrder, visible },
    });

    revalidatePath("/admin");
    revalidatePath("/journey");
  } catch (error) {
    console.error("Failed to create journey entry:", error);
    throw new Error("Failed to create journey entry.");
  }
}

export async function updateJourneyEntry(id: string, formData: FormData) {
  await requireAdmin();

  try {
    const year = parseYear(formData.get("year"));
    if (year === null) throw new Error("Year is required");
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const type = (formData.get("type") as "MILESTONE" | "PROJECT" | "ONGOING") || "MILESTONE";
    const displayOrder = parseOrder(formData.get("displayOrder"));
    const visible = isChecked(formData.get("visible"));

    await prisma.journeyEntry.update({
      where: { id },
      data: { year, title, description, type, displayOrder, visible },
    });

    revalidatePath("/admin");
    revalidatePath("/journey");
  } catch (error) {
    console.error("Failed to update journey entry:", error);
    throw new Error("Failed to update journey entry.");
  }
}

export async function deleteJourneyEntry(id: string) {
  await requireAdmin();

  try {
    await prisma.journeyEntry.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/journey");
  } catch (error) {
    console.error("Failed to delete journey entry:", error);
    throw new Error("Failed to delete journey entry.");
  }
}
