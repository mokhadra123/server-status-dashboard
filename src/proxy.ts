import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "session";
const PUBLIC_ROUTE_PREFIXES = ["/login", "/signup"] as const;
const PROTECTED_ROUTE_PREFIXES = ["/servers"] as const;

function pathMatchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTE_PREFIXES.some((p) => pathMatchesPrefix(pathname, p));
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((p) => pathMatchesPrefix(pathname, p));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE);
  const loginUrl = new URL("/login", request.url);

  if (isProtectedPath(pathname) && !session) {
    return NextResponse.redirect(loginUrl);
  }

  if (session && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/servers",
    "/servers/:path*",
  ],
};
