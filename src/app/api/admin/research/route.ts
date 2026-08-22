import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const research = await prisma.researchEntry.findMany({
    select: { id: true, title: true },
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json(research.map(r => ({ id: r.id, name: r.title })));
}
