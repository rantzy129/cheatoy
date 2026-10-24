import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { sendExpiryWarningDm } from "@/lib/discordBot";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

/**
 * 24-HOUR VIP EXPIRATION NOTICE WORKER
 *
 * Scans active licenses and sends an automated courtesy Discord DM to players
 * whose VIP passes expire within the next 24 hours.
 *
 * Can be triggered by:
 * 1. Vercel Cron: HTTP GET/POST with Header `Authorization: Bearer <CRON_SECRET>`
 * 2. Admin Dashboard: HTTP POST with Admin token
 */
export async function GET(request: Request) {
  return handleCheck(request);
}

export async function POST(request: Request) {
  return handleCheck(request);
}

async function handleCheck(request: Request) {
  try {
    // 1. Authenticate Request
    const authHeader = request.headers.get("authorization") || "";
    const cronSecretHeader = request.headers.get("x-cron-secret") || "";
    const cronSecret = process.env.CRON_SECRET || "";

    const isCronAuthorized =
      cronSecret &&
      (authHeader === `Bearer ${cronSecret}` || cronSecretHeader === cronSecret);

    const adminToken = getAdminTokenFromRequest(request);
    const isAdminAuthorized = adminToken ? verifyAdminSession(adminToken) : false;

    // In local dev without CRON_SECRET configured, allow execution
    const isDev = process.env.NODE_ENV !== "production";

    if (!isCronAuthorized && !isAdminAuthorized && !isDev) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Provide valid CRON_SECRET or Admin Token." },
        { status: 401 }
      );
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { success: false, error: "Database not configured." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isDryRun = searchParams.get("dry_run") === "true";

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 2. Query all non-banned licenses with an expiration date
    const { data: licenses, error: licErr } = await supabase
      .from("licenses")
      .select("*")
      .eq("is_banned", false)
      .not("expires_at", "is", null);

    if (licErr || !licenses) {
      return NextResponse.json(
        { success: false, error: licErr?.message || "Failed to fetch licenses" },
        { status: 500 }
      );
    }

    // 3. Query existing sent warnings from notifications table to ensure NO duplicate messages
    const { data: warnedRecords } = await supabase
      .from("notifications")
      .select("id")
      .eq("target", "expiry_warning");

    const alreadyWarnedIds = new Set<string>((warnedRecords || []).map((r: any) => String(r.id)));

    const now = Date.now();
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

    // Group licenses by discord_id to verify if player already has an upgraded / longer pass active
    const userPassesMap = new Map<string, any[]>();
    for (const lic of licenses) {
      const dId = (lic.discord_id || "").trim();
      if (dId) {
        if (!userPassesMap.has(dId)) {
          userPassesMap.set(dId, []);
        }
        userPassesMap.get(dId)!.push(lic);
      }
    }

    const eligibleForWarning: Array<{
      license: any;
      hoursRemaining: number;
    }> = [];

    for (const lic of licenses) {
      const dId = (lic.discord_id || "").trim();
      if (!dId) continue;

      const expiryMs = new Date(lic.expires_at).getTime();
      const diffMs = expiryMs - now;

      // Check if expiring in the 0 to 24 hour window
      if (diffMs > 0 && diffMs <= TWENTY_FOUR_HOURS_MS) {
        const warnKey = `expiry-warning-24h-${lic.id}`;

        // Skip if already notified
        if (alreadyWarnedIds.has(warnKey)) {
          continue;
        }

        // Check if player has another active unexpired license with > 24 hours remaining
        const allUserLicenses = userPassesMap.get(dId) || [];
        const hasLongerActivePass = allUserLicenses.some((other) => {
          if (other.id === lic.id) return false;
          if (!other.expires_at) return true; // Lifetime pass!
          const otherRemaining = new Date(other.expires_at).getTime() - now;
          return otherRemaining > TWENTY_FOUR_HOURS_MS;
        });

        if (hasLongerActivePass) {
          // Player already renewed or has a lifetime pass; do not bother with warning
          continue;
        }

        eligibleForWarning.push({
          license: lic,
          hoursRemaining: diffMs / (1000 * 60 * 60),
        });
      }
    }

    if (isDryRun) {
      return NextResponse.json({
        success: true,
        dry_run: true,
        eligible_count: eligibleForWarning.length,
        eligible_players: eligibleForWarning.map((item) => ({
          id: item.license.id,
          discord_username: item.license.discord_username,
          discord_id: item.license.discord_id,
          tier: item.license.tier,
          hours_remaining: Math.round(item.hoursRemaining * 10) / 10,
          expires_at: item.license.expires_at,
        })),
      });
    }

    // 4. Dispatch Warnings Concurrently
    const results: Array<{
      licenseId: string;
      discordId: string;
      dmSent: boolean;
      dmError?: string;
    }> = [];

    for (const item of eligibleForWarning) {
      const { license, hoursRemaining } = item;
      const warnKey = `expiry-warning-24h-${license.id}`;

      const dmResult = await sendExpiryWarningDm({
        discordUserId: license.discord_id,
        discordUsername: license.discord_username,
        tier: license.tier || "VIP Pass",
        licenseKey: license.license_key,
        expiresAt: license.expires_at,
        hoursRemaining,
      });

      // Record in notifications table so duplicate warning is never sent for this pass
      await supabase.from("notifications").upsert({
        id: warnKey,
        title: `24h Warning: ${license.discord_username || license.discord_id}`,
        message: `VIP ${license.tier} (${license.license_key}) expiring in ~${Math.round(hoursRemaining)}h. Status: ${dmResult.dmSent ? "Delivered" : dmResult.dmError}`,
        type: "alert",
        target: "expiry_warning",
        created_at: new Date().toISOString(),
        expires_at: license.expires_at,
      });

      results.push({
        licenseId: license.id,
        discordId: license.discord_id,
        dmSent: dmResult.dmSent,
        dmError: dmResult.dmError,
      });
    }

    const sentCount = results.filter((r) => r.dmSent).length;
    const failedCount = results.filter((r) => !r.dmSent).length;

    return NextResponse.json({
      success: true,
      scanned_licenses: licenses.length,
      eligible_warnings: eligibleForWarning.length,
      sent_count: sentCount,
      failed_count: failedCount,
      details: results,
      message: `24-Hour Expiration Check Complete: ${sentCount} DMs sent, ${failedCount} failed/closed DMs.`,
    });
  } catch (err: any) {
    console.error("[Cron Expiration Notice] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
