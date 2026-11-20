import { NextRequest, NextResponse } from "next/server";
import { isAllowedMediaUrl } from "@/lib/media";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const download = request.nextUrl.searchParams.get("download") === "1";

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  if (!isAllowedMediaUrl(url)) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    if (download) {
      const urlObj = new URL(url);
      const filename = urlObj.pathname.split("/").pop() || "download";
      headers["Content-Disposition"] = `attachment; filename="${filename}"`;
      headers["Cache-Control"] = "no-store";
    }

    return new NextResponse(buffer, { headers });
  } catch {
    return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 });
  }
}
