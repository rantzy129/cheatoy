import { NextResponse } from "next/server";
import { checkRateLimit, recordFailedAttempt, resetRateLimit, generateAdminToken } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const adminPin = (process.env.ADMIN_PIN || "").trim();
    if (!adminPin || !process.env.ADMIN_SECRET_KEY?.trim()) {
      console.error("ADMIN_PIN or ADMIN_SECRET_KEY is not configured");
      return NextResponse.json({ success: false, error: "Admin service configuration error" }, { status: 500 });
    }
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Rate-limit check
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Security lockout active for ${rateCheck.remainingLockoutSeconds}s.`,
          locked: true,
          lockoutSeconds: rateCheck.remainingLockoutSeconds,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { pin } = body;

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, error: "Access PIN required" },
        { status: 400 }
      );
    }

    // 2. Validate PIN
    if (pin.trim() !== adminPin) {
      const attempts = recordFailedAttempt(clientIp);
      const remainingAttempts = Math.max(0, 5 - attempts);
      return NextResponse.json(
        {
          success: false,
          error: remainingAttempts > 0
            ? `Access Denied: Invalid Master PIN (${remainingAttempts} attempts remaining before lockout)`
            : "Access Denied: Multiple invalid attempts. Security lockout active for 15 minutes.",
        },
        { status: 401 }
      );
    }

    // 3. Success: Reset rate limit and issue cryptographic token in an HTTP-Only cookie
    resetRateLimit(clientIp);
    const token = generateAdminToken();

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication authorized",
    });

    // Set secure HTTP-Only cookie so client-side storage is not used
    response.cookies.set({
      name: "chameleon_admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Authentication service error: " + err.message },
      { status: 500 }
    );
  }
}
