import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const achievements = await prisma.achievement.findMany({
    select: { id: true, title: true },
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json(achievements.map(a => ({ id: a.id, name: a.title })));
}
