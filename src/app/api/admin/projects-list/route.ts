import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({ select: { id: true, name: true }, orderBy: { displayOrder: "asc" } });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects list:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
