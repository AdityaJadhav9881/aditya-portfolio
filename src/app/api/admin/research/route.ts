import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const research = await prisma.researchEntry.findMany({
      select: { id: true, title: true },
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(research.map(r => ({ id: r.id, name: r.title })));
  } catch (error) {
    console.error("Failed to fetch research:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
