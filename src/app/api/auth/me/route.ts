import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.adminId },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 401 });
    }

    return NextResponse.json({ admin });
  } catch (error) {
    console.error("Failed to fetch admin session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
