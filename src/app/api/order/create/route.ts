import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { sendOrderCreatedWebhook } from "@/lib/discordWebhook";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { getClientIp, checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS } from "@/lib/rateLimit";

const VALID_TIERS: Record<string, { duration: string; pricePhp: string }> = {
  "3days": { duration: "3 Days Pass", pricePhp: "₱150" },
  "7days": { duration: "7 Days Pass", pricePhp: "₱300" },
  "15days": { duration: "15 Days Pass", pricePhp: "₱550" },
  "month": { duration: "1 Month Pass", pricePhp: "₱1,000" },
  "lifetime": { duration: "Lifetime VIP", pricePhp: "₱1,500" },
};

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const ipRate = checkRateLimit(clientIp, RATE_LIMIT_PRESETS.ORDER_CREATE);
    if (!ipRate.allowed) {
      return createRateLimitResponse(
        ipRate,
        `Order submission rate limit reached. Please wait ${ipRate.resetSeconds}s before submitting again.`
      );
    }

    const body = await request.json();
    const {
      tier_id,
      discord_id,
      discord_username,
      reference_no,
      sender_name,
      currency = "PHP",
      receipt_image,
      receipt_name,
      referred_by,
    } = body;

    if (!discord_id || !discord_username) {
      return NextResponse.json({ success: false, error: "Discord authentication required" }, { status: 401 });
    }

    // Additional rate limit per Discord ID
    const userRate = checkRateLimit(`user_${String(discord_id).trim()}`, RATE_LIMIT_PRESETS.ORDER_CREATE);
    if (!userRate.allowed) {
      return createRateLimitResponse(
        userRate,
        `Too many orders submitted from this Discord account. Please wait ${userRate.resetSeconds}s before trying again.`
      );
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
    const price = tier.pricePhp;

    // Handle Optional Receipt Screenshot Upload
    let receiptRelativeUrl: string | null = null;
    let absoluteReceiptPath: string | null = null;

    if (receipt_image && typeof receipt_image === "string") {
      try {
        let base64Clean = receipt_image;
        let mimeType = "png";
        if (receipt_image.includes(";base64,")) {
          const parts = receipt_image.split(";base64,");
          const header = parts[0];
          base64Clean = parts[1];
          const m = header.match(/data:image\/([a-zA-Z0-9+.-]+)/i);
          if (m) mimeType = m[1].toLowerCase();
        }
        base64Clean = base64Clean.replace(/\s+/g, "");
        const buffer = Buffer.from(base64Clean, "base64");

        // Validate max 15MB
        if (buffer.length > 0 && buffer.length <= 15 * 1024 * 1024) {
          const ext = mimeType === "jpeg" || mimeType === "jpg" ? "jpg" : mimeType === "webp" ? "webp" : "png";
          const receiptDataUrl = receipt_image.startsWith("data:image/")
            ? receipt_image
            : `data:image/${mimeType};base64,${base64Clean}`;

          receiptRelativeUrl = receiptDataUrl;

          // Write local copy for Discord Webhook attachment (use /tmp on Vercel)
          try {
            const fileName = `receipt_${order_id}.${ext}`;
            const targetDir = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "public", "receipts");
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }
            absoluteReceiptPath = path.join(targetDir, fileName);
            fs.writeFileSync(absoluteReceiptPath, buffer);
          } catch (fErr) {
            console.warn("Notice writing receipt temp file:", fErr);
          }
        }
      } catch (uploadErr) {
        console.warn("Notice processing receipt screenshot upload:", uploadErr);
      }
    }

    const basePaymentMethod = "InstaPay / GCash (CCheats)";
    let paymentMethodWithReceipt = receiptRelativeUrl
      ? `${basePaymentMethod} [receipt:${receiptRelativeUrl}]`
      : basePaymentMethod;

    // Attach referral credit tag if buyer was invited by another member
    let cleanReferrer: string | null = null;
    if (referred_by && typeof referred_by === "string") {
      const sanitized = referred_by.trim().replace(/[\[\]]/g, "").slice(0, 32);
      const buyerHandle = discord_username.toLowerCase().trim();
      if (sanitized && sanitized.toLowerCase() !== buyerHandle && sanitized.toLowerCase() !== discord_id.toLowerCase().trim()) {
        cleanReferrer = sanitized;
        paymentMethodWithReceipt = `${paymentMethodWithReceipt} [ref:${cleanReferrer}]`;
      }
    }

    const orderRecord = {
      order_id,
      discord_id: discord_id.trim(),
      discord_username: discord_username.trim(),
      tier: tier.duration,
      price: price,
      payment_method: paymentMethodWithReceipt,
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

    // Dispatch Discord Webhook Notification (with receipt attachment if present)
    try {
      await sendOrderCreatedWebhook(finalOrder, absoluteReceiptPath);
    } catch (e) {
      console.warn("Order webhook notice:", e);
    }

    return NextResponse.json({
      success: true,
      order: {
        ...finalOrder,
        receipt_url: receiptRelativeUrl,
      },
      order_token,
      message: "Order created and secured successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
