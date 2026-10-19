import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get("order_id");

    if (!order_id) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }

    const receiptsDir = path.join(process.cwd(), "public", "receipts");
    const manifestPath = path.join(receiptsDir, "manifest.json");

    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        if (manifest[order_id]) {
          return NextResponse.json({
            success: true,
            has_receipt: true,
            receipt: manifest[order_id],
          });
        }
      } catch (e) {
        console.warn("Notice reading manifest:", e);
      }
    }

    // Direct check
    if (fs.existsSync(receiptsDir)) {
      for (const ext of ["png", "jpg", "jpeg", "webp"]) {
        const testFile = `receipt_${order_id}.${ext}`;
        if (fs.existsSync(path.join(receiptsDir, testFile))) {
          return NextResponse.json({
            success: true,
            has_receipt: true,
            receipt: {
              url: `/receipts/${testFile}`,
              fileName: testFile,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, has_receipt: false, message: "No receipt uploaded" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
