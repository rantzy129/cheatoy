import { NextResponse } from "next/server";
import { DISCORD_BOT_TOKEN, DISCORD_GUILD_ID } from "@/lib/discordBot";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const discordId = searchParams.get("discord_id")?.trim();
    const username = searchParams.get("username")?.trim();

    if (!discordId && !username) {
      return NextResponse.json(
        { success: false, in_guild: false, error: "Missing discord_id or username" },
        { status: 400 }
      );
    }

    const token = DISCORD_BOT_TOKEN.trim();
    const guildId = DISCORD_GUILD_ID.trim();

    if (!token || !guildId) {
      // If bot token not configured, gracefully treat as in_guild: null so it doesn't block users
      return NextResponse.json({
        success: true,
        in_guild: null,
        message: "Bot token not configured",
      });
    }

    let targetSnowflake = discordId && /^\d{17,20}$/.test(discordId) ? discordId : null;

    // If no snowflake ID, attempt to search guild member by username
    if (!targetSnowflake && (username || discordId)) {
      const queryName = (username || discordId || "").replace(/#.*$/, "").trim();
      try {
        const searchRes = await fetch(
          `https://discord.com/api/v10/guilds/${guildId}/members/search?query=${encodeURIComponent(queryName)}&limit=1`,
          {
            headers: { Authorization: `Bot ${token}` },
            cache: "no-store",
          }
        );
        if (searchRes.ok) {
          const members = await searchRes.json();
          if (Array.isArray(members) && members.length > 0) {
            targetSnowflake = members[0]?.user?.id || null;
          }
        }
      } catch (err) {
        console.warn("[check-member] Search error:", err);
      }
    }

    if (!targetSnowflake) {
      // User was not found in guild
      return NextResponse.json({
        success: true,
        in_guild: false,
        message: "User was not found in guild members directory",
      });
    }

    // Direct check by snowflake
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/${targetSnowflake}`,
      {
        headers: { Authorization: `Bot ${token}` },
        cache: "no-store",
      }
    );

    if (res.status === 200) {
      const memberData = await res.json();
      return NextResponse.json({
        success: true,
        in_guild: true,
        roles: memberData.roles || [],
        joined_at: memberData.joined_at,
      });
    } else if (res.status === 404) {
      return NextResponse.json({
        success: true,
        in_guild: false,
        message: "User has not joined the Discord server yet",
      });
    } else {
      const errText = await res.text().catch(() => "");
      return NextResponse.json({
        success: true,
        in_guild: false,
        error: `Discord API returned ${res.status}: ${errText}`,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, in_guild: false, error: err.message || "Failed to check Discord membership" },
      { status: 500 }
    );
  }
}
