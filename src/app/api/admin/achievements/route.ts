import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const achievements = await prisma.achievement.findMany({
      select: { id: true, title: true },
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(achievements.map(a => ({ id: a.id, name: a.title })));
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
