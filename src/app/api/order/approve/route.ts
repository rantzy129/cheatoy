import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";
import {
  sendOrderApprovedWebhook,
  sendOrderRejectedWebhook,
  updateCurrentUsersCountWebhook,
} from "@/lib/discordWebhook";
import { assignDiscordVipRoleAndSendDm } from "@/lib/discordBot";

function calculateExpiry(tier: string, hasBonusDay: boolean = false) {
  const now = new Date();
  const lower = tier.toLowerCase();
  const bonusMs = hasBonusDay ? 1 * 24 * 60 * 60 * 1000 : 0; // +1 Bonus Day for referred buyers

  if (lower.includes("3 day")) {
    return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + bonusMs).toISOString();
  } else if (lower.includes("7 day") || lower.includes("week")) {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + bonusMs).toISOString();
  } else if (lower.includes("15 day")) {
    return new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000 + bonusMs).toISOString();
  } else if (lower.includes("month") || lower.includes("30 day")) {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000 + bonusMs).toISOString();
  }
  // Lifetime VIP -> null
  return null;
}

export async function POST(request: Request) {
  try {
    const cookieOrHeaderToken = getAdminTokenFromRequest(request);
    const body = await request.json().catch(() => ({}));
    const { pin, token, order_id, action } = body; // action: 'approve' or 'reject'

    const credential = cookieOrHeaderToken || token || pin;
    if (!verifyAdminSession(credential)) {
      return NextResponse.json({ success: false, error: "Unauthorized: Invalid Admin Credentials" }, { status: 401 });
    }

    if (!order_id) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json({ success: false, error: "Database configuration error" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Fetch the order
    const { data: order, error: fetchErr } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", order_id)
      .single();

    if (fetchErr || !order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (action === "reject") {
      const { error: rejErr } = await supabase
        .from("orders")
        .update({ status: "rejected" })
        .eq("id", order.id);

      if (rejErr) {
        return NextResponse.json({ success: false, error: rejErr.message }, { status: 500 });
      }

      try {
        await sendOrderRejectedWebhook(order);
      } catch (e) {
        console.warn("Reject webhook notice:", e);
      }

      return NextResponse.json({ success: true, status: "rejected", message: "Order rejected" });
    }

    // Default action: 'approve'
    if (order.status === "approved" && order.license_key) {
      return NextResponse.json({
        success: true,
        status: "approved",
        license_key: order.license_key,
        message: "Order was already approved",
      });
    }

    // Extract referral affiliate if present
    const refMatch = (order.payment_method || "").match(/\[ref:(.*?)\]/);
    const referrerHandle = refMatch && refMatch[1] ? refMatch[1].trim() : null;
    const hasReferral = Boolean(referrerHandle);

    // Generate Discord-bound License Key (includes +1 Bonus Day for buyer if referred)
    const hex = () => crypto.randomBytes(2).toString("hex").toUpperCase();
    const newKey = `CHAM-AFPH-${hex()}-${hex()}`;
    const expiresAt = calculateExpiry(order.tier, hasReferral);

    // 1. Insert into licenses table
    const { error: licErr } = await supabase.from("licenses").insert({
      license_key: newKey,
      discord_id: order.discord_id,
      discord_username: order.discord_username,
      tier: hasReferral ? `${order.tier} (+1 Referral Bonus Day)` : order.tier,
      expires_at: expiresAt,
      is_banned: false,
    });

    if (licErr) {
      console.warn("Notice inserting into licenses table:", licErr.message);
    }

    // 2. Process Referrer Reward:
    // User Rule:
    // - If inviter has an ACTIVE VIP pass: gets +3 Free VIP Days extended onto their license.
    // - If inviter is NOT VIP or hasn't bought (no license or expired): gets +1 Free VIP Day only,
    //   provided the buyer purchases at least a 3-day pass.
    let referralRewardStatus: {
      rewarded: boolean;
      referrer?: string;
      daysAdded?: number;
      isExistingVip?: boolean;
      error?: string;
    } | null = null;

    if (referrerHandle) {
      const isAtLeast3Days =
        !order.tier.toLowerCase().includes("1 day") &&
        !order.tier.toLowerCase().includes("trial");

      if (!isAtLeast3Days) {
        referralRewardStatus = {
          rewarded: false,
          referrer: referrerHandle,
          error: "Purchased tier must be at least 3 days to qualify for referral bonus.",
        };
      } else {
        try {
          const { data: refLicenses } = await supabase
            .from("licenses")
            .select("*")
            .ilike("discord_username", `%${referrerHandle}%`)
            .eq("is_banned", false)
            .order("created_at", { ascending: false })
            .limit(1);

          const refLicense = refLicenses && refLicenses.length > 0 ? refLicenses[0] : null;

          // Check if referrer is currently an ACTIVE VIP
          const isLifetime = Boolean(refLicense && refLicense.expires_at === null);
          const isActiveTimedVip = Boolean(
            refLicense &&
            refLicense.expires_at &&
            new Date(refLicense.expires_at).getTime() > Date.now()
          );
          const isActiveVip = isLifetime || isActiveTimedVip;

          if (isActiveVip) {
            // Referrer is active VIP -> gets +3 Free VIP Days
            if (isLifetime) {
              referralRewardStatus = {
                rewarded: true,
                referrer: referrerHandle,
                daysAdded: 3,
                isExistingVip: true,
              };
            } else if (refLicense && refLicense.expires_at) {
              const currentExpiryTime = new Date(refLicense.expires_at).getTime();
              const newRefExpiry = new Date(currentExpiryTime + 3 * 24 * 60 * 60 * 1000).toISOString();

              await supabase
                .from("licenses")
                .update({ expires_at: newRefExpiry })
                .eq("id", refLicense.id);

              referralRewardStatus = {
                rewarded: true,
                referrer: referrerHandle,
                daysAdded: 3,
                isExistingVip: true,
              };
            }
          } else {
            // Referrer is NOT VIP or hasn't bought (expired or never purchased) -> gets 1 Day only
            if (refLicense) {
              // Existing expired license: reactivate for +1 Day (24 hours) from now
              const newRefExpiry = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString();
              await supabase
                .from("licenses")
                .update({
                  expires_at: newRefExpiry,
                  tier: "1 Day Pass (Referral Reward)",
                })
                .eq("id", refLicense.id);

              referralRewardStatus = {
                rewarded: true,
                referrer: referrerHandle,
                daysAdded: 1,
                isExistingVip: false,
              };
            } else {
              // No previous license (never bought): mint a new 1-Day VIP reward key
              const refBonusKey = `CHAM-AFPH-REF1-${hex()}`;
              const newRefExpiry = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString();

              await supabase.from("licenses").insert({
                license_key: refBonusKey,
                discord_username: referrerHandle,
                tier: "1 Day Pass (Referral Reward)",
                expires_at: newRefExpiry,
                is_banned: false,
              });

              referralRewardStatus = {
                rewarded: true,
                referrer: referrerHandle,
                daysAdded: 1,
                isExistingVip: false,
              };
            }
          }
        } catch (refErr: any) {
          console.warn("Notice crediting referrer bonus:", refErr);
          referralRewardStatus = { rewarded: false, referrer: referrerHandle, error: refErr.message };
        }
      }
    }

    // 3. Update order to approved
    const { error: ordErr } = await supabase
      .from("orders")
      .update({
        status: "approved",
        license_key: newKey,
        approved_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (ordErr) {
      return NextResponse.json({ success: false, error: ordErr.message }, { status: 500 });
    }

    // Dispatch Discord Webhook Notification for Approved Order & Minted Key
    try {
      await sendOrderApprovedWebhook(order, newKey, expiresAt, referralRewardStatus);
    } catch (e) {
      console.warn("Approve webhook notice:", e);
    }

    // Automatically update the live VIP count card in #current-users channel (edits in-place)
    try {
      await updateCurrentUsersCountWebhook();
    } catch (e) {
      console.warn("Current users count webhook notice:", e);
    }

    // Automated Discord VIP Role Assignment & Private DM Dispatch
    let discordBotStatus: any = null;
    const targetUserIdOrName = order.discord_id || order.discord_username;
    if (targetUserIdOrName) {
      discordBotStatus = await assignDiscordVipRoleAndSendDm({
        discordUserId: targetUserIdOrName,
        discordUsername: order.discord_username,
        tier: hasReferral ? `${order.tier} (+1 Bonus Day)` : order.tier,
        licenseKey: newKey,
        expiresAt: expiresAt,
      }).catch((e) => {
        console.warn("Discord Bot auto-role notice:", e);
        return { roleAssigned: false, dmSent: false, error: e.message };
      });
    }

    return NextResponse.json({
      success: true,
      status: "approved",
      license_key: newKey,
      expires_at: expiresAt,
      discord_bot: discordBotStatus,
      referral_reward: referralRewardStatus,
      message: `Order ${order_id} approved.${hasReferral ? ` +1 Day applied to buyer. +3 Days credited to @${referrerHandle}.` : ""}`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
