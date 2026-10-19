import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
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
    const receiptsDir = path.join(process.cwd(), "public", "receipts");
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }

    const fileName = `receipt_${order_id}.${ext}`;
    const absoluteReceiptPath = path.join(receiptsDir, fileName);
    fs.writeFileSync(absoluteReceiptPath, buffer);
    const receiptRelativeUrl = `/receipts/${fileName}`;

    // Update manifest.json
    try {
      const manifestPath = path.join(receiptsDir, "manifest.json");
      let manifest: Record<string, any> = {};
      if (fs.existsSync(manifestPath)) {
        manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      }
      manifest[order_id] = {
        url: receiptRelativeUrl,
        fileName,
        originalName: receipt_name || null,
        size: buffer.length,
        createdAt: new Date().toISOString(),
      };
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
    } catch (mErr) {
      console.warn("Notice updating manifest:", mErr);
    }

    // Update database order payment_method tag
    const currentMethod = (orderData.payment_method || "InstaPay / GCash").replace(/\s*\[receipt:.*?\]/, "");
    const updatedMethod = `${currentMethod} [receipt:${receiptRelativeUrl}]`;

    await supabase
      .from("orders")
      .update({ payment_method: updatedMethod })
      .eq("order_id", order_id);

    return NextResponse.json({
      success: true,
      message: "Receipt attached successfully",
      receipt_url: receiptRelativeUrl,
      order_id,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
