import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";
import { sendUserListWebhook } from "@/lib/discordWebhook";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { getClientIp, checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const cookieOrHeaderToken = getAdminTokenFromRequest(request);
    const body = await request.json().catch(() => ({}));
    const credential = cookieOrHeaderToken || body?.token || body?.pin;

    if (!verifyAdminSession(credential)) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp, RATE_LIMIT_PRESETS.ADMIN_DISCORD_SYNC);
    if (!rateCheck.allowed) {
      return createRateLimitResponse(
        rateCheck,
        `Discord Sync broadcast rate limit active. Please wait ${rateCheck.resetSeconds}s before broadcasting again.`
      );
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json({ success: false, error: "Database configuration error" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // 1. Fetch licenses
    const { data: licenses, error: licErr } = await supabase
      .from("licenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (licErr) {
      return NextResponse.json({ success: false, error: licErr.message }, { status: 500 });
    }

    // 2. Fetch orders to capture registered customer accounts & pending payments
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    // 3. Fetch Discord Guild members to capture all signed-in / server community members
    let guildMembers: any[] = [];
    const botToken = process.env.DISCORD_BOT_TOKEN;
    const guildId = process.env.DISCORD_GUILD_ID;
    if (botToken && guildId) {
      try {
        const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=100`, {
          headers: { Authorization: `Bot ${botToken}` },
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            guildMembers = list.filter((m: any) => !m.user?.bot);
          }
        }
      } catch (e) {
        console.warn("Notice fetching guild members for directory sync:", e);
      }
    }

    // Dispatch comprehensive User List Roster to Discord Webhook
    await sendUserListWebhook({
      licenses: licenses || [],
      orders: orders || [],
      guildMembers: guildMembers,
    });

    const totalTracked = (licenses || []).length + (orders || []).length + guildMembers.length;

    return NextResponse.json({
      success: true,
      license_count: (licenses || []).length,
      order_count: (orders || []).length,
      guild_member_count: guildMembers.length,
      message: `Successfully synchronized ${totalTracked} registered users, orders, and VIP members to Discord!`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
