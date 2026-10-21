import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { getClientIp, checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp, RATE_LIMIT_PRESETS.RECEIPT_ATTACH);
    if (!rateCheck.allowed) {
      return createRateLimitResponse(
        rateCheck,
        `Too many receipt upload attempts. Please wait ${rateCheck.resetSeconds}s before trying again.`
      );
    }

    const body = await request.json();
    const { order_id, receipt_image, receipt_name } = body;

    if (!order_id) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }

    if (!receipt_image || typeof receipt_image !== "string") {
      return NextResponse.json({ success: false, error: "Receipt image data is required" }, { status: 400 });
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json({ success: false, error: "Database configuration error" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Verify order exists
    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", order_id)
      .single();

    if (orderErr || !orderData) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Process base64 data safely
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

    if (buffer.length === 0 || buffer.length > 15 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Invalid image buffer or file exceeds 15MB" }, { status: 400 });
    }

    const ext = mimeType === "jpeg" || mimeType === "jpg" ? "jpg" : mimeType === "webp" ? "webp" : "png";
    const receiptDataUrl = receipt_image.startsWith("data:image/")
      ? receipt_image
      : `data:image/${mimeType};base64,${base64Clean}`;

    // Write local copy if available
    try {
      const fileName = `receipt_${order_id}.${ext}`;
      const targetDir = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "public", "receipts");
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(path.join(targetDir, fileName), buffer);
    } catch (fErr) {
      console.warn("Notice writing receipt temp copy:", fErr);
    }

    // Update database order payment_method tag with data URL
    const currentMethod = (orderData.payment_method || "InstaPay / GCash").replace(/\s*\[receipt:.*?\]/, "");
    const updatedMethod = `${currentMethod} [receipt:${receiptDataUrl}]`;

    await supabase
      .from("orders")
      .update({ payment_method: updatedMethod })
      .eq("order_id", order_id);

    return NextResponse.json({
      success: true,
      message: "Receipt attached successfully",
      receipt_url: receiptDataUrl,
      order_id,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
