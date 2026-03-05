import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/auth";

async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSession(token);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const ok = await isAuthenticated(request);
    if (!ok) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/api/projects" && method === "POST") {
    const ok = await isAuthenticated(request);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  if (pathname.startsWith("/api/projects/") && (method === "PUT" || method === "DELETE")) {
    const ok = await isAuthenticated(request);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects", "/api/projects/:path*"],
};
