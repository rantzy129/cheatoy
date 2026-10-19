import { NextResponse } from "next/server";
import { getAdminTokenFromRequest, verifyAdminSession } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const token = getAdminTokenFromRequest(request);
  const isValid = verifyAdminSession(token);

  if (!isValid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
