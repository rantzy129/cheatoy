import { NextResponse } from "next/server";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";
import { getMinLoaderVersion, setMinLoaderVersion } from "@/lib/versionControl";

export async function GET(request: Request) {
  try {
    const token = getAdminTokenFromRequest(request);
    if (!verifyAdminSession(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const config = await getMinLoaderVersion();
    return NextResponse.json({ success: true, ...config });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = getAdminTokenFromRequest(request);
    const body = await request.json().catch(() => ({}));
    const credential = token || body?.token || body?.pin;

    if (!verifyAdminSession(credential)) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { minVersion, downloadUrl } = body;
    if (!minVersion || !String(minVersion).trim()) {
      return NextResponse.json({ success: false, error: "Version string is required" }, { status: 400 });
    }

    const updated = await setMinLoaderVersion(minVersion, downloadUrl);
    return NextResponse.json({
      success: true,
      message: `Enforced minimum loader version set to v${updated.minVersion}. All older versions will be blocked.`,
      ...updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
