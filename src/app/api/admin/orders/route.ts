import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const token = getAdminTokenFromRequest(request);

    if (!verifyAdminSession(token)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Protected Administrative Portal" },
        { status: 401 }
      );
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json({ success: false, error: "Database configuration error" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: rawOrders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Load receipts manifest if available
    const receiptsDir = path.join(process.cwd(), "public", "receipts");
    const manifestPath = path.join(receiptsDir, "manifest.json");
    let manifest: Record<string, any> = {};
    if (fs.existsSync(manifestPath)) {
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      } catch (e) {
        console.warn("Notice reading manifest.json:", e);
      }
    }

    // Enhance orders with receipt URLs
    const orders = (rawOrders || []).map((order) => {
      let receiptUrl: string | null = null;

      // 1. Check embedded tag in payment_method
      const match = (order.payment_method || "").match(/\[receipt:(.*?)\]/);
      if (match && match[1]) {
        const rawUrl = match[1];
        if (rawUrl.startsWith("/receipts/") && !fs.existsSync(path.join(receiptsDir, path.basename(rawUrl)))) {
          receiptUrl = `/api/order/receipt-image?order_id=${order.order_id}`;
        } else {
          receiptUrl = rawUrl;
        }
      }

      // 2. Check manifest
      if (!receiptUrl && manifest[order.order_id]?.url) {
        receiptUrl = manifest[order.order_id].url;
      }

      // 3. Check direct file existence on disk
      if (!receiptUrl && fs.existsSync(receiptsDir)) {
        for (const ext of ["png", "jpg", "jpeg", "webp"]) {
          const testFile = `receipt_${order.order_id}.${ext}`;
          if (fs.existsSync(path.join(receiptsDir, testFile))) {
            receiptUrl = `/receipts/${testFile}`;
            break;
          }
        }
      }

      const refMatch = (order.payment_method || "").match(/\[ref:(.*?)\]/);
      const referredBy = refMatch && refMatch[1] ? refMatch[1].trim() : null;

      return {
        ...order,
        receipt_url: receiptUrl,
        referred_by: referredBy,
        payment_method: (order.payment_method || "InstaPay / GCash")
          .replace(/\s*\[receipt:.*?\]/, "")
          .replace(/\s*\[ref:.*?\]/, "")
          .trim(),
      };
    });

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error: " + err.message },
      { status: 500 }
    );
  }
}

