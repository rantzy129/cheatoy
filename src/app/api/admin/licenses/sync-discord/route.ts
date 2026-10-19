import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";
import { sendUserListWebhook } from "@/lib/discordWebhook";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://emdjnrokrgotaxebqrpo.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(request: Request) {
  try {
    const token = getAdminTokenFromRequest(request);
    if (!verifyAdminSession(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json({ success: false, error: "Database configuration error" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: licenses, error } = await supabase
      .from("licenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Dispatch User List Roster to Discord Webhook
    await sendUserListWebhook(licenses || []);

    return NextResponse.json({
      success: true,
      count: (licenses || []).length,
      message: `Successfully broadcasted ${(licenses || []).length} registered VIP users to Discord User Vault!`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
