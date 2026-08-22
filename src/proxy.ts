import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth";

const PUBLIC_AUTH_ROUTES = ["/admin/login", "/admin/setup"];
const PUBLIC_API_ROUTES = ["/api/auth/login", "/api/admin/setup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin") && !pathname.startsWith("/api/upload")) {
    return NextResponse.next();
  }

  // Allow public auth API routes
  if (PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow public admin pages (login, setup)
  if (pathname.startsWith("/admin") && PUBLIC_AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check session for protected routes
  const session = await getSession();
  if (!session) {
    // For API routes, return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // For page routes, redirect to login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/upload"],
};
