import { NextResponse } from "next/server";

export async function GET() {
  // 1. Create a successful JSON response (Do NOT use a redirect here)
  const response = NextResponse.json({
    success: true,
    message: "Successfully logged out",
  });

  // 2. Destroy the "token" cookie by setting its expiration date to the past
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}