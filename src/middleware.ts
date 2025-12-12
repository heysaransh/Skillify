import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    // Protect /dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        if (!token) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            url.searchParams.set("redirect", request.nextUrl.pathname);
            return NextResponse.redirect(url);
        }
    }

    // Redirect /login or /signup to dashboard if already logged in
    if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") && token) {
        // We assume token is valid here, if not API will fail and handle it (logout)
        // For UX speed we redirect. 
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};
