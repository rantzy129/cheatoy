import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://emdjnrokrgotaxebqrpo.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";
import {
  sendOrderApprovedWebhook,
  sendOrderRejectedWebhook,
} from "@/lib/discordWebhook";

function calculateExpiry(tier: string) {
  const now = new Date();
  const lower = tier.toLowerCase();
  if (lower.includes("7 day") || lower.includes("week")) {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (lower.includes("15 day")) {
    return new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString();
  } else if (lower.includes("month") || lower.includes("30 day")) {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
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

      sendOrderRejectedWebhook(order).catch((e) =>
        console.warn("Reject webhook notice:", e)
      );

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

    // Generate Discord-bound License Key
    const hex = () => crypto.randomBytes(2).toString("hex").toUpperCase();
    const newKey = `CHAM-AFPH-${hex()}-${hex()}`;
    const expiresAt = calculateExpiry(order.tier);

    // 1. Insert into licenses table
    const { error: licErr } = await supabase.from("licenses").insert({
      license_key: newKey,
      discord_id: order.discord_id,
      discord_username: order.discord_username,
      tier: order.tier,
      expires_at: expiresAt,
      is_banned: false,
    });

    if (licErr) {
      console.warn("Notice inserting into licenses table:", licErr.message);
    }

    // 2. Update order to approved
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
    sendOrderApprovedWebhook(order, newKey, expiresAt).catch((e) =>
      console.warn("Approve webhook notice:", e)
    );

    return NextResponse.json({
      success: true,
      status: "approved",
      license_key: newKey,
      expires_at: expiresAt,
      message: `Order ${order_id} approved. Key issued for ${order.discord_username}`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
