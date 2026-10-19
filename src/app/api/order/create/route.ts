import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { sendOrderCreatedWebhook } from "@/lib/discordWebhook";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://emdjnrokrgotaxebqrpo.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const VALID_TIERS: Record<string, { duration: string; pricePhp: string; priceUsd: string }> = {
  "7days": { duration: "7 Days Pass", pricePhp: "₱500", priceUsd: "$9.99" },
  "15days": { duration: "15 Days Pass", pricePhp: "₱1,000", priceUsd: "$18.99" },
  "month": { duration: "1 Month Pass", pricePhp: "₱1,500", priceUsd: "$27.99" },
  "lifetime": { duration: "Lifetime VIP", pricePhp: "₱2,500", priceUsd: "$45.99" },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tier_id, discord_id, discord_username, reference_no, sender_name, currency = "PHP" } = body;

    if (!discord_id || !discord_username) {
      return NextResponse.json({ success: false, error: "Discord authentication required" }, { status: 401 });
    }

    if (!reference_no || reference_no.trim().length < 6) {
      return NextResponse.json({ success: false, error: "Please enter a valid GCash / Bank reference number (min 6 digits)" }, { status: 400 });
    }

    const tier = VALID_TIERS[tier_id];
    if (!tier) {
      return NextResponse.json({ success: false, error: "Invalid product tier selected" }, { status: 400 });
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json({ success: false, error: "Database configuration error" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const cleanRef = reference_no.trim();

    // Anti-Fraud: Check if reference number has already been used in another order
    const { data: existingRef } = await supabase
      .from("orders")
      .select("order_id, status")
      .eq("reference_no", cleanRef)
      .limit(1);

    if (existingRef && existingRef.length > 0) {
      return NextResponse.json({
        success: false,
        error: "This GCash reference number has already been submitted for order " + existingRef[0].order_id,
      }, { status: 409 });
    }

    // Cryptographic Order Tokenization
    const randomHex = () => crypto.randomBytes(3).toString("hex").toUpperCase();
    const order_id = `ORD-AF-${randomHex()}-${randomHex()}`;
    const order_token = `tok_${crypto.randomBytes(24).toString("hex")}`;
    const price = currency === "USD" ? tier.priceUsd : tier.pricePhp;

    const orderRecord = {
      order_id,
      discord_id: discord_id.trim(),
      discord_username: discord_username.trim(),
      tier: tier.duration,
      price: price,
      payment_method: "InstaPay / GCash (CCheats)",
      reference_no: cleanRef,
      sender_name: sender_name ? sender_name.trim() : null,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(orderRecord)
      .select()
      .single();

    const finalOrder = data || orderRecord;

    // Dispatch Discord Webhook Notification
    sendOrderCreatedWebhook(finalOrder).catch((e) =>
      console.warn("Order webhook notice:", e)
    );

    return NextResponse.json({
      success: true,
      order: finalOrder,
      order_token,
      message: "Order created and secured successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
