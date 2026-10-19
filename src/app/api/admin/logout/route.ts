import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Admin session cleared",
  });

  // Clear HTTP-Only session cookie
  response.cookies.set({
    name: "chameleon_admin_session",
    value: "",
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
