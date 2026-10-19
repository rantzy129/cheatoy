import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";
import { sendUserStatusChangeWebhook } from "@/lib/discordWebhook";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://emdjnrokrgotaxebqrpo.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function GET(request: Request) {
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

    return NextResponse.json({ success: true, licenses: licenses || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const token = getAdminTokenFromRequest(request);
    if (!verifyAdminSession(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { id, action } = body; // action: 'toggle_ban' | 'reset_hwid' | 'delete'

    if (!id) {
      return NextResponse.json({ success: false, error: "License ID required" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Fetch existing license for audit details
    const { data: current } = await supabase
      .from("licenses")
      .select("*")
      .eq("id", id)
      .single();

    if (action === "reset_hwid") {
      const { error } = await supabase.from("licenses").update({ hwid: null }).eq("id", id);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

      if (current) {
        sendUserStatusChangeWebhook({
          license_key: current.license_key,
          discord_id: current.discord_id,
          discord_username: current.discord_username,
          action: "reset_hwid",
          details: "HWID unlinked by administrator. Customer can now launch from a new PC.",
        }).catch((e) => console.warn("User status webhook notice:", e));
      }

      return NextResponse.json({ success: true, message: "HWID unlinked successfully" });
    }

    if (action === "toggle_ban") {
      const newStatus = !(current?.is_banned);
      const { error } = await supabase.from("licenses").update({ is_banned: newStatus }).eq("id", id);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

      if (current) {
        sendUserStatusChangeWebhook({
          license_key: current.license_key,
          discord_id: current.discord_id,
          discord_username: current.discord_username,
          action: newStatus ? "ban" : "unban",
          details: newStatus
            ? "License key suspended by administrator."
            : "License key restored and re-activated.",
        }).catch((e) => console.warn("User status webhook notice:", e));
      }

      return NextResponse.json({ success: true, is_banned: newStatus, message: newStatus ? "License banned" : "License unbanned" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
