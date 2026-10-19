/**
 * ==============================================================================
 * CHAMELEON CHEATS — DISCORD BOT INTEGRATION (ROLE SYNC & DIRECT MESSAGES)
 * ==============================================================================
 * Automatically grants @VIP role to customers in the Discord server and sends
 * them an automated private DM with their license key and download instructions.
 */

export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";
export const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || "";
export const DISCORD_VIP_ROLE_ID = process.env.DISCORD_VIP_ROLE_ID || "";

interface AssignVipParams {
  discordUserId: string; // e.g. "751658690196537464" (numeric Discord snowflake)
  discordUsername?: string;
  tier: string;
  licenseKey: string;
  expiresAt: string | null;
}

export interface AssignVipResult {
  roleAssigned: boolean;
  dmSent: boolean;
  roleError?: string;
  dmError?: string;
}

/**
 * Assigns VIP role to a guild member and sends them an automated DM with their key
 */
export async function assignDiscordVipRoleAndSendDm(
  params: AssignVipParams
): Promise<AssignVipResult> {
  const result: AssignVipResult = {
    roleAssigned: false,
    dmSent: false,
  };

  const token = DISCORD_BOT_TOKEN.trim();
  const guildId = DISCORD_GUILD_ID.trim();
  const roleId = DISCORD_VIP_ROLE_ID.trim();
  const rawUserId = (params.discordUserId || "").trim();

  // If no bot token configured, log and gracefully return
  if (!token) {
    console.warn("[Discord Bot] DISCORD_BOT_TOKEN is not configured in environment variables.");
    result.roleError = "DISCORD_BOT_TOKEN not configured";
    result.dmError = "DISCORD_BOT_TOKEN not configured";
    return result;
  }

  // Check if userId is a numeric snowflake (17-20 digits)
  const isSnowflake = /^\d{17,20}$/.test(rawUserId);
  if (!isSnowflake) {
    console.warn(`[Discord Bot] Invalid or non-numeric Discord user ID: "${rawUserId}". Cannot assign role or DM.`);
    result.roleError = `Invalid user ID format (${rawUserId}). Must be a numeric snowflake.`;
    result.dmError = `Invalid user ID format (${rawUserId}).`;
    return result;
  }

  // 1. Assign VIP Role via Discord REST API
  if (guildId && roleId) {
    try {
      const roleRes = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/${rawUserId}/roles/${roleId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bot ${token}`,
            "Content-Type": "application/json",
            "X-Audit-Log-Reason": `Chameleon Cheats: VIP Pass Activated (${params.tier})`,
          },
        }
      );

      if (roleRes.status === 204) {
        result.roleAssigned = true;
        console.log(`[Discord Bot] Successfully granted VIP role to user ${rawUserId}`);
      } else {
        const errText = await roleRes.text().catch(() => "");
        result.roleError = `Discord API returned ${roleRes.status}: ${errText}`;
        console.warn(`[Discord Bot] Failed to assign role to ${rawUserId}:`, errText);
      }
    } catch (e: any) {
      result.roleError = e.message;
      console.warn(`[Discord Bot] Role assignment exception:`, e);
    }
  } else {
    result.roleError = "DISCORD_GUILD_ID or DISCORD_VIP_ROLE_ID not set.";
  }

  // 2. Send Automated DM with License Key & Instructions
  try {
    // Step A: Open DM channel with recipient
    const dmChannelRes = await fetch("https://discord.com/api/v10/users/@me/channels", {
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipient_id: rawUserId }),
    });

    if (!dmChannelRes.ok) {
      const errText = await dmChannelRes.text().catch(() => "");
      result.dmError = `Could not open DM channel: ${errText}`;
      console.warn(`[Discord Bot] Failed to create DM channel with ${rawUserId}:`, errText);
      return result;
    }

    const channelData = await dmChannelRes.json();
    const dmChannelId = channelData.id;

    const expiryText = params.expiresAt
      ? `<t:${Math.floor(new Date(params.expiresAt).getTime() / 1000)}:R> (${new Date(params.expiresAt).toLocaleDateString()})`
      : "♾️ **Permanent Lifetime Access**";

    // Step B: Send Rich Embed Message
    const embedPayload = {
      content: `Hello <@${rawUserId}>! Your **Chameleon Cheats** order has been verified and approved.`,
      embeds: [
        {
          title: "🦎 CHAMELEON CHEATS — VIP LICENSE ACTIVATED",
          description: "Thank you for purchasing! Your private VIP access key has been generated and bound to your Discord account.",
          color: 0x00d2ff, // Neon Cyan
          fields: [
            {
              name: "👑 VIP Pass",
              value: `**${params.tier}**`,
              inline: true,
            },
            {
              name: "⏳ Expiry Date",
              value: expiryText,
              inline: true,
            },
            {
              name: "🔑 Your Private VIP License Key",
              value: `\`\`\`${params.licenseKey}\`\`\`*(Keep this key private. Locked to your PC's hardware)*`,
              inline: false,
            },
            {
              name: "📥 Quick Setup & Download",
              value:
                "1. Download the loader from your [Profile Vault](https://chameleon-cheats.vercel.app/profile)\n" +
                "2. Extract the zip folder\n" +
                "3. Right-click **`Chameleon.exe`** → **Run as Administrator**\n" +
                "4. Paste your key and launch **Assault Fire PH**",
              inline: false,
            },
          ],
          footer: {
            text: "Chameleon Cheats • Assault Fire PH VIP • Hardware Bound",
            icon_url: "https://chameleon-cheats.vercel.app/logo.png",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const msgRes = await fetch(`https://discord.com/api/v10/channels/${dmChannelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(embedPayload),
    });

    if (msgRes.ok) {
      result.dmSent = true;
      console.log(`[Discord Bot] Successfully sent DM to user ${rawUserId}`);
    } else {
      const errText = await msgRes.text().catch(() => "");
      result.dmError = `Failed to send DM message: ${errText}`;
      console.warn(`[Discord Bot] Failed to send message to ${rawUserId}:`, errText);
    }
  } catch (e: any) {
    result.dmError = e.message;
    console.warn(`[Discord Bot] DM dispatch exception:`, e);
  }

  return result;
}
