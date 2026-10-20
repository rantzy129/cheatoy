import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { assignDiscordVipRoleAndSendDm } from "@/lib/discordBot";

function calculateExpiry(tier: string) {
  const now = new Date();
  const lower = tier.toLowerCase();
  if (lower.includes("3 day")) {
    return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
  } else if (lower.includes("7 day") || lower.includes("week")) {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (lower.includes("15 day")) {
    return new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString();
  } else if (lower.includes("month") || lower.includes("30 day")) {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  return null; // Lifetime VIP
}

export async function POST(request: Request) {
  try {
    const token = getAdminTokenFromRequest(request);
    if (!verifyAdminSession(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { tier = "1 Month Pass", discord_username, discord_id } = body;

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json({ success: false, error: "Database configuration error" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const hex = () => crypto.randomBytes(2).toString("hex").toUpperCase();
    const newKey = `CHAM-AFPH-${hex()}-${hex()}`;
    const expiresAt = calculateExpiry(tier);

    const { data, error } = await supabase
      .from("licenses")
      .insert({
        license_key: newKey,
        discord_id: discord_id ? String(discord_id).trim() : null,
        discord_username: discord_username ? String(discord_username).trim() : "Manual Issue",
        tier: tier,
        expires_at: expiresAt,
        is_banned: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Auto-assign VIP role and DM customer if Discord ID is provided
    let discordBotStatus: any = null;
    if (discord_id) {
      discordBotStatus = await assignDiscordVipRoleAndSendDm({
        discordUserId: String(discord_id).trim(),
        discordUsername: discord_username,
        tier: tier,
        licenseKey: newKey,
        expiresAt: expiresAt,
      }).catch((e) => {
        console.warn("Discord Bot auto-role exception:", e);
        return { roleAssigned: false, dmSent: false, error: e.message };
      });
    }

    return NextResponse.json({
      success: true,
      license: data,
      discord_bot: discordBotStatus,
      message: `Successfully generated ${tier} key`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
