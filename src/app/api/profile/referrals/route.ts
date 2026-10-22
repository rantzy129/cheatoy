import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { getClientIp, checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS } from "@/lib/rateLimit";

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp, RATE_LIMIT_PRESETS.PROFILE_REFERRALS);
    if (!rateCheck.allowed) {
      return createRateLimitResponse(
        rateCheck,
        `Too many referral lookups. Please wait ${rateCheck.resetSeconds}s before refreshing.`
      );
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.trim();
    const discordId = searchParams.get("id")?.trim();

    if (!username && !discordId) {
      return NextResponse.json(
        { success: false, error: "Missing username or discord ID parameter" },
        { status: 400 }
      );
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { success: false, error: "Database configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Clean username variants to match [ref:handle]
    const cleanUser = (username || "").replace(/#0+$/, "").replace(/[^a-zA-Z0-9_.-]/g, "").trim();

    const orClauses: string[] = [];
    if (cleanUser) {
      orClauses.push(`payment_method.ilike.%[ref:${cleanUser}]%`);
    }
    if (username && username !== cleanUser) {
      const sanitized = username.replace(/[^a-zA-Z0-9_.-]/g, "");
      if (sanitized) {
        orClauses.push(`payment_method.ilike.%[ref:${sanitized}]%`);
      }
    }
    if (discordId) {
      orClauses.push(`payment_method.ilike.%[ref:${discordId}]%`);
    }

    if (orClauses.length === 0) {
      return NextResponse.json({
        success: true,
        referrals: [],
        stats: { total_referrals: 0, approved_referrals: 0, total_reward_days_earned: 0 },
      });
    }

    const { data: rawOrders, error } = await supabase
      .from("orders")
      .select("id, order_id, discord_username, tier, price, status, created_at, approved_at, payment_method")
      .or(orClauses.join(","))
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Also check if this referrer has an active VIP license to properly calculate days
    const { data: refLicenses } = await supabase
      .from("licenses")
      .select("id, expires_at")
      .ilike("discord_username", `%${cleanUser || username}%`)
      .eq("is_banned", false)
      .order("created_at", { ascending: false })
      .limit(1);

    const hasActiveVip = Boolean(
      refLicenses &&
      refLicenses.length > 0 &&
      (refLicenses[0].expires_at === null || new Date(refLicenses[0].expires_at).getTime() > Date.now())
    );

    let totalRewardDays = 0;
    let approvedCount = 0;

    const referrals = (rawOrders || []).map((ord) => {
      const isApproved = ord.status === "approved";
      // All referrals give 1 day free
      const rewardDays = isApproved ? 1 : 0;
      if (isApproved) {
        approvedCount += 1;
        totalRewardDays += rewardDays;
      }

      return {
        id: ord.id,
        order_id: ord.order_id,
        clanmate_username: ord.discord_username || "Anonymous Clanmate",
        tier: ord.tier,
        price: ord.price,
        status: ord.status,
        created_at: ord.created_at,
        approved_at: ord.approved_at,
        reward_days: rewardDays,
        potential_reward_days: 1,
      };
    });

    return NextResponse.json({
      success: true,
      referrals,
      stats: {
        total_referrals: referrals.length,
        approved_referrals: approvedCount,
        total_reward_days_earned: totalRewardDays,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error: " + err.message },
      { status: 500 }
    );
  }
}
