import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // 1. Get NextAuth Google cookies
  const nextAuthToken = 
    req.cookies.get("next-auth.session-token")?.value || 
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  // 2. Get your custom manual email/password token
  const customToken = req.cookies.get("token")?.value;

  // 3. BULLETPROOF CHECK: Ensure tokens actually exist and aren't just strings saying "undefined"
  const isValidNextAuth = !!nextAuthToken && nextAuthToken !== "undefined";
  const isValidCustom = !!customToken && customToken !== "undefined";

  // If either valid token exists, the user is logged in
  const isLoggedIn = isValidNextAuth || isValidCustom;
    
  const { pathname } = req.nextUrl;

  // Route Guard 1: If hitting the base domain "/"
  if (pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // Route Guard 2: Block dashboard if not logged in
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // Route Guard 3: If already logged in, block access to login/register pages
  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};