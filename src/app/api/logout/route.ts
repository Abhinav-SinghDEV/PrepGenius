import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/login", request.url)
  );

  // Clear NextAuth session cookies
  response.cookies.set("next-auth.session-token", "", {
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set("__Secure-next-auth.session-token", "", {
    path: "/",
    expires: new Date(0),
    secure: true,
  });

  response.cookies.set("next-auth.csrf-token", "", {
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set("__Host-next-auth.csrf-token", "", {
    path: "/",
    expires: new Date(0),
    secure: true,
  });

  // Clear custom token
  response.cookies.set("token", "", {
    path: "/",
    expires: new Date(0),
  });

  // Clear middleware auth cookie
  response.cookies.set("pg_auth", "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}