import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { sendUserAuthWebhook } from "@/lib/discordWebhook";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

const SIGNING_SECRET =
  process.env.LICENSE_SIGNING_SECRET ||
  process.env.ADMIN_SECRET_KEY ||
  "4f2e2368fc5f669483af135071a355d4130a9832f8b304024d6cddc7b28c9351";

// In-memory debounce cache to prevent duplicate Discord webhook spam
// (e.g. Loader verifying followed immediately by Injected DLL verifying)
const recentSuccessWebhooks = new Map<string, number>();
const WEBHOOK_DEBOUNCE_WINDOW_MS = 60 * 1000; // 60 seconds debounce window

function shouldDispatchSuccessWebhook(licenseKey: string, hwid?: string): boolean {
  const key = `${licenseKey.trim().toUpperCase()}:${(hwid || "").trim().toUpperCase()}`;
  const now = Date.now();

  // Prune cache if it grows large
  if (recentSuccessWebhooks.size > 1000) {
    for (const [k, time] of recentSuccessWebhooks.entries()) {
      if (now - time > WEBHOOK_DEBOUNCE_WINDOW_MS) {
        recentSuccessWebhooks.delete(k);
      }
    }
  }

  const lastSent = recentSuccessWebhooks.get(key);
  if (lastSent && now - lastSent < WEBHOOK_DEBOUNCE_WINDOW_MS) {
    return false; // Suppress duplicate webhook within 60s
  }

  recentSuccessWebhooks.set(key, now);
  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { license_key, discord_id, hwid } = body;

    if (!license_key) {
      return NextResponse.json({ valid: false, error: "License key is required" }, { status: 400 });
    }

    if (!SUPABASE_ANON_KEY) {
      return NextResponse.json({ valid: false, error: "Database configuration error" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Query license from Supabase
    const { data: license, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("license_key", license_key.trim())
      .single();

    if (error || !license) {
      return NextResponse.json({ valid: false, error: "License key not found" }, { status: 404 });
    }

    // Check if banned
    if (license.is_banned) {
      return NextResponse.json({ valid: false, error: "This license key has been suspended" }, { status: 403 });
    }

    // Check expiration date
    if (license.expires_at) {
      const now = new Date();
      const expiry = new Date(license.expires_at);
      if (now > expiry) {
        return NextResponse.json({ valid: false, error: "License key has expired" }, { status: 403 });
      }
    }

    // Check Discord User binding
    const dbId = (license.discord_id || "").toLowerCase().trim();
    const dbUser = (license.discord_username || "").toLowerCase().trim();
    const isBound = Boolean(dbId || dbUser);

    if (isBound) {
      if (!discord_id) {
        return NextResponse.json({
          valid: false,
          error: "Discord verification required. This license is bound to a Discord account.",
        }, { status: 403 });
      }

      const reqClean = String(discord_id).toLowerCase().replace(/#0+$/, "").replace(/#$/, "").trim();
      const reqBase = reqClean.split("#")[0];
      const dbUserBase = dbUser.split("#")[0];

      const matchesId = dbId && (dbId === reqClean || dbId.includes(reqClean));
      const matchesUser = dbUser && (
        dbUser === reqClean ||
        dbUserBase === reqBase ||
        dbUser.startsWith(reqClean) ||
        reqClean.startsWith(dbUserBase)
      );

      if (!matchesId && !matchesUser) {
        return NextResponse.json({
          valid: false,
          error: "License key is bound to Discord account (@" + (license.discord_username || license.discord_id) + "). Mismatch detected.",
        }, { status: 403 });
      }
    } else if (discord_id) {
      // If unassigned or missing Discord ID, bind it on first verification
      const reqClean = String(discord_id).toLowerCase().replace(/#0+$/, "").replace(/#$/, "").trim();
      await supabase
        .from("licenses")
        .update({ discord_id: reqClean })
        .eq("id", license.id);
    }

    // HWID Binding check
    if (hwid) {
      if (!license.hwid) {
        // First injection: bind HWID to license
        await supabase
          .from("licenses")
          .update({ hwid: hwid.trim() })
          .eq("id", license.id);
      } else if (license.hwid.trim() !== hwid.trim()) {
        return NextResponse.json({
          valid: false,
          error: "Hardware ID (HWID) mismatch. Reset required.",
        }, { status: 403 });
      }
    }

    // Generate Cryptographic HMAC-SHA256 Signature for Anti-Proxy / Anti-Tamper
    const timestamp = Math.floor(Date.now() / 1000);
    const signPayload = `${license.license_key.trim()}:${(hwid || "").trim()}:${timestamp}`;
    const signature = crypto.createHmac("sha256", SIGNING_SECRET).update(signPayload).digest("hex");

    // Dispatch User Activity Webhook (Injector Launch Log) with debounce deduplication
    const activeHwid = hwid || license.hwid;
    if (shouldDispatchSuccessWebhook(license.license_key, activeHwid)) {
      sendUserAuthWebhook({
        license_key: license.license_key,
        discord_id: license.discord_id || discord_id,
        discord_username: license.discord_username || "Verified VIP",
        tier: license.tier || "VIP",
        hwid: activeHwid,
        expires_at: license.expires_at || "Lifetime",
        success: true,
        message: "License validated successfully",
      }).catch((e) => console.warn("User auth webhook error:", e));
    }

    return NextResponse.json({
      valid: true,
      tier: license.tier || "VIP",
      discord_username: license.discord_username || "Verified User",
      expires_at: license.expires_at || "Lifetime",
      timestamp,
      signature,
      message: "License validated successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
