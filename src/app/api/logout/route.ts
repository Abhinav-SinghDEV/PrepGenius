import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. Tell the server exactly where to send you after clearing cookies
  const response = NextResponse.redirect(new URL("/register", request.url));

  // 2. Aggressively destroy every possible NextAuth and custom cookie
  response.cookies.set("next-auth.session-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("__Secure-next-auth.session-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("token", "", { maxAge: 0, path: "/" });

  // 3. Execute the redirect
  return response;
}