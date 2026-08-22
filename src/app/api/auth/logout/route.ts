import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to destroy session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
