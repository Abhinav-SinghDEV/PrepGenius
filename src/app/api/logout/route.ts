import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/register", request.url)
  );

  // Clear NextAuth cookies
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

  // Clear custom token if you use one
  response.cookies.set("token", "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}