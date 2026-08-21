import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API auth routes
  if (
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/admin/setup") ||
    !pathname.startsWith("/admin") ||
    pathname === "/admin/login" ||
    pathname === "/admin/setup"
  ) {
    return NextResponse.next();
  }

  // Check session cookie for admin routes
  const session = request.cookies.get("admin-session");
  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
