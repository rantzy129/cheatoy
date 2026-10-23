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
    result.roleError = "DISCORD_BOT_TOKEN not configured in Vercel / environment";
    result.dmError = "DISCORD_BOT_TOKEN not configured in Vercel / environment";
    return result;
  }

  // Resolve target numeric snowflake ID
  let targetUserId = rawUserId;
  let isSnowflake = /^\d{17,20}$/.test(targetUserId);

  // If not a numeric snowflake, attempt auto-resolution by querying Discord guild members
  if (!isSnowflake && guildId) {
    const candidateName = (params.discordUsername || rawUserId).replace(/#.*$/, "").trim();
    if (candidateName) {
      try {
        console.log(`[Discord Bot] Resolving ID "${rawUserId}" via guild member search for "${candidateName}"...`);
        const searchRes = await fetch(
          `https://discord.com/api/v10/guilds/${guildId}/members/search?query=${encodeURIComponent(candidateName)}&limit=5`,
          {
            headers: {
              Authorization: `Bot ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (searchRes.ok) {
          const members = await searchRes.json();
          const cleanQ = candidateName.toLowerCase();
          const match = members.find((m: any) =>
            m.user?.username?.toLowerCase() === cleanQ ||
            m.user?.global_name?.toLowerCase() === cleanQ ||
            m.nick?.toLowerCase() === cleanQ
          ) || members[0];

          if (match?.user?.id) {
            targetUserId = match.user.id;
            isSnowflake = true;
            console.log(`[Discord Bot] Resolved "${candidateName}" to Snowflake ID: ${targetUserId}`);
          }
        }
      } catch (err: any) {
        console.warn(`[Discord Bot] Guild member auto-resolution failed:`, err);
      }
    }
  }

  if (!isSnowflake) {
    console.warn(`[Discord Bot] Invalid or non-numeric Discord user ID: "${rawUserId}". Cannot assign role or DM.`);
    result.roleError = `User ID "${rawUserId}" is not a numeric snowflake and was not found in the server.`;
    result.dmError = `User not found in server. Buyer must join https://discord.gg/Whwxq9QAEN`;
    return result;
  }

  // 1. Assign VIP Role via Discord REST API
  if (guildId && roleId) {
    try {
      const roleRes = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/${targetUserId}/roles/${roleId}`,
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
        console.log(`[Discord Bot] Successfully granted VIP role to user ${targetUserId}`);
      } else if (roleRes.status === 404) {
        result.roleError = "Buyer is not in your Discord server (Unknown Member). They must join https://discord.gg/Whwxq9QAEN";
        console.warn(`[Discord Bot] User ${targetUserId} not in guild ${guildId}`);
      } else if (roleRes.status === 403) {
        result.roleError = "Bot lacks permission to assign role. Ensure Bot role is ABOVE VIP role in Server Settings -> Roles.";
        console.warn(`[Discord Bot] Missing permissions to assign role to ${targetUserId}`);
      } else {
        const errText = await roleRes.text().catch(() => "");
        result.roleError = `Discord API returned HTTP ${roleRes.status}: ${errText}`;
        console.warn(`[Discord Bot] Failed to assign role to ${targetUserId}:`, errText);
      }
    } catch (e: any) {
      result.roleError = e.message;
      console.warn(`[Discord Bot] Role assignment exception:`, e);
    }
  } else {
    result.roleError = "DISCORD_GUILD_ID or DISCORD_VIP_ROLE_ID not configured in Vercel.";
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
      body: JSON.stringify({ recipient_id: targetUserId }),
    });

    if (!dmChannelRes.ok) {
      const errText = await dmChannelRes.text().catch(() => "");
      result.dmError = `Could not open DM channel (${dmChannelRes.status}): User has closed DMs or is not in server.`;
      console.warn(`[Discord Bot] Failed to create DM channel with ${targetUserId}:`, errText);
      return result;
    }

    const channelData = await dmChannelRes.json();
    const dmChannelId = channelData.id;

    const expiryText = params.expiresAt
      ? `<t:${Math.floor(new Date(params.expiresAt).getTime() / 1000)}:R> (${new Date(params.expiresAt).toLocaleDateString()})`
      : "♾️ **Permanent Lifetime Access**";

    // Step B: Send Rich Embed Message
    const embedPayload = {
      content: `Hello <@${targetUserId}>! Your **Chameleon Cheats** order has been verified and approved.`,
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
                "1. Download the loader from your [Profile Vault](https://www.chameleon-cheats.tech/profile)\n" +
                "2. Extract the RAR archive (Password: **`CC2026`**)\n" +
                "3. Right-click **`Chameleon.exe`** → **Run as Administrator**\n" +
                "4. Paste your key and launch **Assault Fire PH**",
              inline: false,
            },
          ],
          footer: {
            text: "Chameleon Cheats • Assault Fire PH VIP • Hardware Bound",
            icon_url: "https://www.chameleon-cheats.tech/logo.png",
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
      console.log(`[Discord Bot] Successfully sent DM to user ${targetUserId}`);
    } else {
      const errText = await msgRes.text().catch(() => "");
      result.dmError = `Failed to send DM message (${msgRes.status}): User likely has closed DMs from server members.`;
      console.warn(`[Discord Bot] Failed to send message to ${targetUserId}:`, errText);
    }
  } catch (e: any) {
    result.dmError = e.message;
    console.warn(`[Discord Bot] DM dispatch exception:`, e);
  }

  return result;
}

/**
 * Sends an automated DM to a customer when bonus time is credited (e.g. for vouching)
 */
export async function sendVouchBonusDm(params: {
  discordUserId: string;
  discordUsername?: string;
  licenseKey: string;
  daysAdded: number;
  newExpiresAt: string | null;
  reason?: string;
}): Promise<{ dmSent: boolean; dmError?: string }> {
  const result = { dmSent: false, dmError: undefined as string | undefined };
  const token = DISCORD_BOT_TOKEN.trim();
  const guildId = DISCORD_GUILD_ID.trim();
  const rawUserId = (params.discordUserId || "").trim();

  if (!token) {
    result.dmError = "DISCORD_BOT_TOKEN not configured";
    return result;
  }

  let targetUserId = rawUserId;
  let isSnowflake = /^\d{17,20}$/.test(targetUserId);

  if (!isSnowflake && guildId) {
    const candidateName = (params.discordUsername || rawUserId).replace(/#.*$/, "").trim();
    if (candidateName) {
      try {
        const searchRes = await fetch(
          `https://discord.com/api/v10/guilds/${guildId}/members/search?query=${encodeURIComponent(candidateName)}&limit=5`,
          {
            headers: {
              Authorization: `Bot ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (searchRes.ok) {
          const members = await searchRes.json();
          const cleanQ = candidateName.toLowerCase();
          const match = members.find((m: any) =>
            m.user?.username?.toLowerCase() === cleanQ ||
            m.user?.global_name?.toLowerCase() === cleanQ ||
            m.nick?.toLowerCase() === cleanQ
          ) || members[0];

          if (match?.user?.id) {
            targetUserId = match.user.id;
            isSnowflake = true;
          }
        }
      } catch (err: any) {
        console.warn(`[Discord Bot] Guild member resolution failed:`, err);
      }
    }
  }

  if (!isSnowflake) {
    result.dmError = `User ID "${rawUserId}" is not a valid snowflake.`;
    return result;
  }

  try {
    const dmChannelRes = await fetch("https://discord.com/api/v10/users/@me/channels", {
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipient_id: targetUserId }),
    });

    if (!dmChannelRes.ok) {
      result.dmError = "User has closed DMs or is not in server.";
      return result;
    }

    const channelData = await dmChannelRes.json();
    const dmChannelId = channelData.id;

    const expiryText = params.newExpiresAt
      ? `<t:${Math.floor(new Date(params.newExpiresAt).getTime() / 1000)}:R> (${new Date(params.newExpiresAt).toLocaleDateString()})`
      : "♾️ **Permanent Lifetime Access**";

    const embedPayload = {
      content: `🎉 Hello <@${targetUserId}>! An extra **+${params.daysAdded} VIP Day** has been added to your Chameleon VIP pass!`,
      embeds: [
        {
          title: "🌟 VOUCH REWARD CREDITED — CHAMELEON CHEATS",
          description: `Thank you for supporting **Chameleon Cheats**! Your ${params.reason || "Discord Vouch"} has been verified by staff, and your VIP pass has been extended.`,
          color: 0x10b981, // Emerald Green
          fields: [
            {
              name: "🎁 Reward Added",
              value: `**+${params.daysAdded} Extra Day (${params.daysAdded * 24} Hours)**`,
              inline: true,
            },
            {
              name: "⏳ Updated Expiration",
              value: expiryText,
              inline: true,
            },
            {
              name: "🔑 Your License Key",
              value: `\`\`\`${params.licenseKey}\`\`\``,
              inline: false,
            },
          ],
          footer: {
            text: "Chameleon Cheats • Assault Fire PH VIP • Community Promotion",
            icon_url: "https://www.chameleon-cheats.tech/logo.png",
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
    } else {
      result.dmError = "Failed to deliver DM (User may have DMs disabled).";
    }
  } catch (e: any) {
    result.dmError = e.message;
  }

  return result;
}
