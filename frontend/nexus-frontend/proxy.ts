import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth gate for Nexus.
// Redirects unauthenticated visitors away from app pages and
// authenticated users away from the login/register pages.
// Cookie presence check only - real validation happens in the
// API's [Authorize] handlers.

const AUTH_PAGES = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const hasSession =
        request.cookies.has("access_token") ||
        request.cookies.has("refresh_token");

    const isAuthPage = AUTH_PAGES.some((page) =>
        pathname.startsWith(page)
    );

    if (!hasSession && !isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.search = "";
        return NextResponse.redirect(url);
    }

    if (hasSession && isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.search = "";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/workout/:path*",
        "/history/:path*",
        "/profile/:path*",
        "/login",
        "/register"
    ]
};
