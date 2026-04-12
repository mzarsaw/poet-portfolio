import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getIronSession } from "iron-session";
import type { SessionData } from "./lib/auth";

const intlMiddleware = createIntlMiddleware(routing);

const sessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long_replace_me",
  cookieName: "poet-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Admin detection: subdomain OR direct /admin path
  const isAdminHost = hostname.startsWith("admin.");
  const isAdminPath = pathname.startsWith("/admin");
  const isAdmin = isAdminHost || isAdminPath;

  if (isAdmin) {
    // Determine the actual admin path
    // If accessing via subdomain and path doesn't already have /admin prefix: /dashboard -> /admin/dashboard
    // If path already has /admin prefix: /admin/dashboard -> /admin/dashboard (no double prefix)
    const adminPath = (isAdminHost && !pathname.startsWith("/admin")) ? `/admin${pathname}` : pathname;
    const loginPath = isAdminHost ? "/login" : "/admin/login";
    const authApiPath = isAdminHost ? "/api/auth/" : "/admin/api/auth/";

    // Allow login page and auth API without session check
    if (pathname === loginPath || pathname.startsWith(authApiPath) ||
        pathname === "/admin/login" || pathname.startsWith("/admin/api/auth/")) {
      if (isAdminHost) {
        const url = request.nextUrl.clone();
        url.pathname = adminPath;
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }

    // Check session for all other admin routes
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      if (isAdminHost) {
        return NextResponse.rewrite(url);
      }
      return NextResponse.redirect(url);
    }

    // Rewrite only if using subdomain
    if (isAdminHost) {
      const url = request.nextUrl.clone();
      url.pathname = adminPath;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Public site — delegate to next-intl for locale handling
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|uploads|favicon.ico|robots.txt|sitemap.xml).*)"],
};
