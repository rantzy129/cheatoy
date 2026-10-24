import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { DISCORD_BOT_TOKEN } from "@/lib/discordBot";

export const dynamic = "force-dynamic";

interface CacheItem {
  url: string;
  cachedAt: number;
}

// In-memory cache for resolved Discord user avatars (TTL: 30 minutes)
const avatarCache = new Map<string, CacheItem>();
const CACHE_TTL_MS = 1000 * 60 * 30;

function getDefaultAvatar(snowflakeId: string): string {
  try {
    const idx = Number((BigInt(snowflakeId) >> 22n) % 6n);
    return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
  } catch {
    return "https://cdn.discordapp.com/embed/avatars/0.png";
  }
}

export async function GET() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Fetch all active, non-banned VIP licenses with a connected Discord account
    const { data: licenses, error } = await supabase
      .from("licenses")
      .select("discord_id, discord_username, created_at")
      .eq("is_banned", false)
      .order("created_at", { ascending: false });

    if (error || !licenses) {
      console.warn("[Members API] Failed to fetch active licenses:", error);
      return NextResponse.json({ success: false, avatars: [] }, { status: 500 });
    }

    // Extract unique numeric Discord IDs
    const seen = new Set<string>();
    const uniqueIds: string[] = [];

    for (const lic of licenses) {
      const rawId = (lic.discord_id || "").trim();
      if (rawId && /^\d{16,21}$/.test(rawId) && !seen.has(rawId)) {
        seen.add(rawId);
        uniqueIds.push(rawId);
      }
    }

    const now = Date.now();
    const botToken = (DISCORD_BOT_TOKEN || "").trim();

    // Resolve avatars concurrently
    const avatars = await Promise.all(
      uniqueIds.map(async (id) => {
        const cached = avatarCache.get(id);
        if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
          return cached.url;
        }

        if (botToken) {
          try {
            const res = await fetch(`https://discord.com/api/v10/users/${id}`, {
              headers: { Authorization: `Bot ${botToken}` },
              next: { revalidate: 1800 },
            });

            if (res.ok) {
              const u = await res.json();
              let finalUrl = "";
              if (u.avatar) {
                finalUrl = `https://cdn.discordapp.com/avatars/${id}/${u.avatar}.png?size=128`;
              } else {
                finalUrl = getDefaultAvatar(id);
              }

              avatarCache.set(id, { url: finalUrl, cachedAt: now });
              return finalUrl;
            }
          } catch {
            // Fallthrough to default avatar on network or Discord API hiccups
          }
        }

        const fallback = getDefaultAvatar(id);
        avatarCache.set(id, { url: fallback, cachedAt: now });
        return fallback;
      })
    );

    return NextResponse.json(
      {
        success: true,
        count: avatars.length,
        avatars,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err: any) {
    console.error("[Members API] Unhandled error:", err);
    return NextResponse.json({ success: false, avatars: [] }, { status: 500 });
  }
}
