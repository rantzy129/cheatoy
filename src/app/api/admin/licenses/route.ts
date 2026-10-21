import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";
import {
  sendUserStatusChangeWebhook,
  sendLicenseExtendedWebhook,
  updateCurrentUsersCountWebhook,
} from "@/lib/discordWebhook";
import { sendVouchBonusDm } from "@/lib/discordBot";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

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
    const { id, action } = body; // action: 'toggle_ban' | 'reset_hwid' | 'add_days'

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

      // Automatically update live VIP count in #current-users channel (edits in-place)
      updateCurrentUsersCountWebhook().catch((e) =>
        console.warn("Auto-update current users count notice:", e)
      );

      return NextResponse.json({ success: true, is_banned: newStatus, message: newStatus ? "License banned" : "License unbanned" });
    }

    if (action === "add_days" || action === "extend") {
      if (!current) {
        return NextResponse.json({ success: false, error: "License not found" }, { status: 404 });
      }

      if (current.expires_at === null) {
        return NextResponse.json({
          success: false,
          error: "This key is Lifetime VIP (Permanent) and cannot be extended.",
        }, { status: 400 });
      }

      const daysToAdd = Math.max(1, Number(body.days) || 1);
      const reason = body.reason || "Discord Vouch Promotion (+1 Day)";

      const now = Date.now();
      const currentExpiryTime = current.expires_at ? new Date(current.expires_at).getTime() : now;
      const baseTime = currentExpiryTime > now ? currentExpiryTime : now;
      const newExpiry = new Date(baseTime + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

      // Update tier to visually reflect bonus days
      let updatedTier = current.tier || "VIP Pass";
      if (!updatedTier.includes("Vouch") && !updatedTier.includes("Bonus")) {
        updatedTier = `${updatedTier} (+${daysToAdd} Vouch Day${daysToAdd > 1 ? "s" : ""})`;
      } else if (updatedTier.includes("Vouch Day")) {
        const match = updatedTier.match(/\(\+(\d+)\s*Vouch Day/);
        if (match) {
          const currentBonus = parseInt(match[1], 10) || 1;
          updatedTier = updatedTier.replace(/\(\+\d+\s*Vouch Day(s)?\)/, `(+${currentBonus + daysToAdd} Vouch Days)`);
        }
      }

      const { error } = await supabase
        .from("licenses")
        .update({
          expires_at: newExpiry,
          tier: updatedTier,
          is_banned: false,
        })
        .eq("id", id);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      // 1. Send Discord Webhook audit log
      sendLicenseExtendedWebhook({
        license_key: current.license_key,
        discord_id: current.discord_id,
        discord_username: current.discord_username,
        daysAdded: daysToAdd,
        new_expires_at: newExpiry,
        reason: reason,
      }).catch((e) => console.warn("License extend webhook error:", e));

      // 2. Send automated Discord DM to the customer
      let dmResult: any = null;
      if (current.discord_id || current.discord_username) {
        dmResult = await sendVouchBonusDm({
          discordUserId: current.discord_id || "",
          discordUsername: current.discord_username,
          licenseKey: current.license_key,
          daysAdded: daysToAdd,
          newExpiresAt: newExpiry,
          reason: reason,
        }).catch((e) => {
          console.warn("Vouch bonus DM error:", e);
          return { dmSent: false, dmError: e.message };
        });
      }

      // 3. Automatically update live VIP count in #current-users channel (edits in-place)
      updateCurrentUsersCountWebhook().catch((e) =>
        console.warn("Auto-update current users count notice:", e)
      );

      return NextResponse.json({
        success: true,
        new_expires_at: newExpiry,
        tier: updatedTier,
        discord_dm: dmResult,
        message: `Successfully credited +${daysToAdd} Day to @${current.discord_username || "customer"}!`,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
