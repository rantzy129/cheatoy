import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { sendUserAuthWebhook } from "@/lib/discordWebhook";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { getClientIp, checkRateLimit, RATE_LIMIT_PRESETS } from "@/lib/rateLimit";
import { getMinLoaderVersion, isVersionOutdated } from "@/lib/versionControl";

const SIGNING_SECRET =
  process.env.LICENSE_SIGNING_SECRET;

// Launch notifications are claimed atomically in Postgres so concurrent Vercel
// requests cannot both emit a Discord message. This window also covers the
// client's 10-minute license heartbeat.
const SESSION_DEBOUNCE_WINDOW_SECONDS = 60 * 60;

async function shouldDispatchSessionLaunchWebhook(
  supabase: any,
  licenseKey: string,
  hwid?: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("claim_license_launch_event", {
      p_license_key: licenseKey.trim(),
      p_hwid: hwid || "unbound",
      p_debounce_seconds: SESSION_DEBOUNCE_WINDOW_SECONDS,
    });
    if (error) throw error;
    return data === true;
  } catch (err) {
    console.warn("Session launch deduplication check error:", err);
    // Fail closed: a database issue must not fan out duplicate launch alerts.
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!SIGNING_SECRET) {
      console.error("LICENSE_SIGNING_SECRET is not configured");
      return NextResponse.json({ valid: false, error: "License service configuration error" }, { status: 500 });
    }

    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp, RATE_LIMIT_PRESETS.LICENSE_VERIFY);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          valid: false,
          error: `Verification rate limit exceeded. Please wait ${rateCheck.resetSeconds}s.`,
          rateLimited: true,
          retryAfter: rateCheck.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateCheck.resetSeconds.toString(),
            "X-RateLimit-Limit": rateCheck.limit.toString(),
            "X-RateLimit-Remaining": rateCheck.remaining.toString(),
          },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { license_key, discord_id, hwid, version } = body;

    // Mandatory Loader Version Enforcement (Forces outdated loaders to update)
    const { minVersion, downloadUrl } = await getMinLoaderVersion();
    if (isVersionOutdated(version, minVersion)) {
      return NextResponse.json(
        {
          valid: false,
          outdated: true,
          current_version: version || "legacy",
          required_version: minVersion,
          download_url: downloadUrl || "https://www.chameleon-cheats.tech/profile",
          error: `UPDATE REQUIRED: Your version (${version || "outdated build"}) is no longer supported. Please download the latest update (v${minVersion}) from the website.`,
        },
        { status: 403 }
      );
    }

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
      await sendUserAuthWebhook({
        license_key: license.license_key,
        discord_id: license.discord_id || discord_id,
        discord_username: license.discord_username || "Suspended Member",
        tier: license.tier || "VIP",
        hwid,
        expires_at: license.expires_at || undefined,
        success: false,
        message: "Attempted injection with suspended/banned license key",
      }).catch((e) => console.warn("User auth block webhook error:", e));

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
        await sendUserAuthWebhook({
          license_key: license.license_key,
          discord_id: license.discord_id || discord_id,
          discord_username: license.discord_username || "VIP Member",
          tier: license.tier || "VIP",
          hwid,
          expires_at: license.expires_at || undefined,
          success: false,
          message: `Hardware ID (HWID) mismatch. Bound: \`${license.hwid.slice(0, 16)}...\` vs Attempt: \`${hwid.slice(0, 16)}...\``,
        }).catch((e) => console.warn("User auth block webhook error:", e));

        return NextResponse.json({
          valid: false,
          error: "Hardware ID (HWID) mismatch. Reset required.",
        }, { status: 403 });
      }
    }

    // Generate Cryptographic HMAC-SHA256 Signature for Anti-Proxy / Anti-Tamper & Payload Decryption Key
    const PAYLOAD_KEY = process.env.PAYLOAD_SERVER_KEY || "0x27";
    const timestamp = Math.floor(Date.now() / 1000);
    const signPayload = `${license.license_key.trim()}:${(hwid || "").trim()}:${timestamp}:${PAYLOAD_KEY}`;
    const signature = crypto.createHmac("sha256", SIGNING_SECRET).update(signPayload).digest("hex");

    // The endpoint is also used by the client's periodic license heartbeat.
    // The atomic claim limits this notification to at most once per license/hour.
    const activeHwid = hwid || license.hwid;
    const isNewSession = await shouldDispatchSessionLaunchWebhook(supabase, license.license_key, activeHwid);
    if (isNewSession) {
      try {
        await sendUserAuthWebhook({
          license_key: license.license_key,
          discord_id: license.discord_id || discord_id,
          discord_username: license.discord_username || "Verified VIP",
          tier: license.tier || "VIP",
          hwid: activeHwid,
          expires_at: license.expires_at || "Lifetime",
          success: true,
          message: "License validated successfully",
        });
      } catch (e) {
        console.warn("User auth webhook error:", e);
      }
    }

    return NextResponse.json({
      valid: true,
      tier: license.tier || "VIP",
      discord_username: license.discord_username || "Verified User",
      expires_at: license.expires_at || "Lifetime",
      timestamp,
      payload_key: PAYLOAD_KEY,
      signature,
      message: "License validated successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
