import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://emdjnrokrgotaxebqrpo.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

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
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: orders || [] });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error: " + err.message },
      { status: 500 }
    );
  }
}
