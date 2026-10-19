import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get("order_id");

    if (!order_id) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    if (!SUPABASE_ANON_KEY) {
      return new NextResponse("Database configuration error", { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: order } = await supabase
      .from("orders")
      .select("order_id, payment_method")
      .eq("order_id", order_id)
      .single();

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const match = (order.payment_method || "").match(/\[receipt:(.*?)\]/);
    if (match && match[1]) {
      const receiptData = match[1];
      if (receiptData.startsWith("data:image/")) {
        const parts = receiptData.split(";base64,");
        const header = parts[0];
        const base64 = parts[1];
        const mimeMatch = header.match(/data:image\/([a-zA-Z0-9+.-]+)/i);
        const mimeType = mimeMatch ? `image/${mimeMatch[1]}` : "image/jpeg";
        const buffer = Buffer.from(base64.replace(/\s+/g, ""), "base64");

        return new Response(buffer, {
          headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Disposition": `inline; filename="receipt_${order_id}.jpg"`,
          },
        });
      }
    }

    // Check local disk fallback (development)
    const receiptsDir = path.join(process.cwd(), "public", "receipts");
    if (fs.existsSync(receiptsDir)) {
      for (const ext of ["jpg", "jpeg", "png", "webp"]) {
        const filePath = path.join(receiptsDir, `receipt_${order_id}.${ext}`);
        if (fs.existsSync(filePath)) {
          const buffer = fs.readFileSync(filePath);
          const mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
          return new Response(buffer, {
            headers: {
              "Content-Type": mimeType,
              "Cache-Control": "public, max-age=31536000, immutable",
              "Content-Disposition": `inline; filename="receipt_${order_id}.${ext}"`,
            },
          });
        }
      }
    }

    return new NextResponse("Receipt not found for this order", { status: 404 });
  } catch (err: any) {
    return new NextResponse("Error retrieving receipt: " + err.message, { status: 500 });
  }
}
