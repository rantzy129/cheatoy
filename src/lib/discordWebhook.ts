/**
 * ==============================================================================
 * CHAMELEON CHEATS — DISCORD WEBHOOK INTEGRATION (ORDERS & USERS)
 * ==============================================================================
 */

const ORDER_WEBHOOK_URL =
  process.env.DISCORD_ORDER_WEBHOOK_URL ||
  "https://discord.com/api/webhooks/1561414524576333895/Cidm6yTdcCV-qFZTxHDxwXc3F0FVEnFU57_-gJnAVpfVGiDSoNzoKI1fduykxkVRmsE1";

const USER_ACTIVITY_WEBHOOK_URL =
  process.env.DISCORD_USER_WEBHOOK_URL ||
  "https://discord.com/api/webhooks/1561418628979622011/5AZCipRSBBIG-NoWYGYGRmuhvaOg91IPbUh-DgsUjGHTPwigV_u05v_7Ug2PAoPuDIpF";

// Dedicated Webhook: LITERALLY THE USER LIST ONLY
const USER_LIST_WEBHOOK_URL =
  process.env.DISCORD_USER_LIST_WEBHOOK_URL ||
  "https://discord.com/api/webhooks/1561427589262999702/nkwPzgtON8LsGD9nRlsxq7nww2LzGXdepfi1IUDCcpOLMXi0eHQuy2RfV7xocN14Ko3M";

interface OrderWebhookData {
  order_id: string;
  discord_id: string;
  discord_username: string;
  tier: string;
  price: string;
  payment_method?: string;
  reference_no: string;
  sender_name?: string | null;
  status: string;
  created_at?: string;
}

interface UserAuthLogData {
  license_key: string;
  discord_id?: string;
  discord_username?: string;
  tier?: string;
  hwid?: string;
  expires_at?: string;
  success: boolean;
  message?: string;
}

interface UserStatusChangeData {
  license_key: string;
  discord_id?: string;
  discord_username?: string;
  action: "reset_hwid" | "ban" | "unban";
  details?: string;
}

/**
 * Sends a Discord Embed message via Webhook
 */
async function sendDiscordEmbed(targetWebhookUrl: string, embed: any, botName = "Chameleon Vault") {
  if (!targetWebhookUrl) return;

  try {
    const payload = {
      username: botName,
      avatar_url: "https://chameleoncheats.com/favicon.ico",
      embeds: [embed],
    };

    await fetch(targetWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Failed to dispatch Discord Webhook log:", err);
  }
}


/**
 * Dispatches a rich embed when a new customer order is submitted
 */
export async function sendOrderCreatedWebhook(order: OrderWebhookData) {
  const embed = {
    title: "📦 New VIP Order Submitted (Pending Verification)",
    description: `A customer has submitted a new payment for verification.`,
    color: 0x00d2ff, // Neon Cyan
    fields: [
      {
        name: "Order ID",
        value: `\`${order.order_id}\``,
        inline: true,
      },
      {
        name: "Product Pass",
        value: `**${order.tier}**`,
        inline: true,
      },
      {
        name: "Amount Due",
        value: `**${order.price}**`,
        inline: true,
      },
      {
        name: "Customer (Discord)",
        value: `<@${order.discord_id}> (@${order.discord_username})`,
        inline: true,
      },
      {
        name: "Reference Number",
        value: `\`${order.reference_no}\``,
        inline: true,
      },
      {
        name: "Sender Name",
        value: order.sender_name || "—",
        inline: true,
      },
      {
        name: "Payment Gateway",
        value: order.payment_method || "InstaPay / GCash",
        inline: true,
      },
      {
        name: "Status",
        value: "🟡 **Pending Admin Review**",
        inline: true,
      },
    ],
    footer: {
      text: "Chameleon Cheats Order Vault • Assault Fire PH VIP",
    },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordEmbed(ORDER_WEBHOOK_URL, embed, "Chameleon Order Vault");
}

/**
 * Dispatches a rich embed when an admin approves an order and issues a license key
 */
export async function sendOrderApprovedWebhook(
  order: OrderWebhookData,
  licenseKey: string,
  expiresAt: string | null
) {
  const expiryDisplay = expiresAt
    ? `<t:${Math.floor(new Date(expiresAt).getTime() / 1000)}:R> (${new Date(expiresAt).toLocaleDateString()})`
    : "♾️ **Permanent Lifetime Access**";

  const embed = {
    title: "✅ Order Approved & License Key Minted",
    description: `Payment confirmed. VIP license key has been bound to customer's Discord account.`,
    color: 0x10b981, // Emerald Green
    fields: [
      {
        name: "Order ID",
        value: `\`${order.order_id}\``,
        inline: true,
      },
      {
        name: "VIP Tier",
        value: `**${order.tier}**`,
        inline: true,
      },
      {
        name: "Customer",
        value: `<@${order.discord_id}> (@${order.discord_username})`,
        inline: true,
      },
      {
        name: "Generated License Key",
        value: `\`\`\`${licenseKey}\`\`\``,
        inline: false,
      },
      {
        name: "Reference No.",
        value: `\`${order.reference_no}\``,
        inline: true,
      },
      {
        name: "Subscription Validity",
        value: expiryDisplay,
        inline: true,
      },
      {
        name: "Account Status",
        value: "🟢 **VIP Active**",
        inline: true,
      },
    ],
    footer: {
      text: "Chameleon Cheats Security Gateway • Key Mint Log",
    },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordEmbed(ORDER_WEBHOOK_URL, embed, "Chameleon Order Vault");
}

/**
 * Dispatches a rich embed when an admin rejects an order
 */
export async function sendOrderRejectedWebhook(order: OrderWebhookData) {
  const embed = {
    title: "❌ Order Rejected / Declined",
    description: `Order was declined by administrator.`,
    color: 0xef4444, // Crimson Red
    fields: [
      {
        name: "Order ID",
        value: `\`${order.order_id}\``,
        inline: true,
      },
      {
        name: "Customer",
        value: `<@${order.discord_id}> (@${order.discord_username})`,
        inline: true,
      },
      {
        name: "Product Tier",
        value: order.tier,
        inline: true,
      },
      {
        name: "Submitted Reference",
        value: `\`${order.reference_no}\``,
        inline: true,
      },
      {
        name: "Decision",
        value: "🔴 **Declined (Invalid Ref / Unverified)**",
        inline: true,
      },
    ],
    footer: {
      text: "Chameleon Cheats Order Vault",
    },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordEmbed(ORDER_WEBHOOK_URL, embed, "Chameleon Order Vault");
}

/**
 * ==============================================================================
 * USER VAULT & USER LIST DISCORD WEBHOOK LOGS
 * ==============================================================================
 */

/**
 * Logs a User Authentication / Game Launch event from the Injector
 */
export async function sendUserAuthWebhook(log: UserAuthLogData) {
  const userMention = log.discord_id ? `<@${log.discord_id}>` : `\`${log.discord_username || "Unknown"}\``;
  const usernameClean = log.discord_username ? `@${log.discord_username}` : "Unbound";
  
  const expiryDisplay = log.expires_at && log.expires_at !== "Lifetime"
    ? `<t:${Math.floor(new Date(log.expires_at).getTime() / 1000)}:R>`
    : "♾️ Lifetime";

  const isSuccess = log.success;

  const embed = {
    title: isSuccess ? "🎮 VIP User Launched Game" : "⚠️ License Auth Blocked / Failed",
    description: isSuccess
      ? `User ${userMention} successfully authenticated and injected into Assault Fire PH.`
      : `Authentication failed for license \`${log.license_key}\`: **${log.message || "Unknown error"}**`,
    color: isSuccess ? 0x8b5cf6 : 0xf59e0b, // Violet for launch, Amber for warning
    fields: [
      {
        name: "User (Discord)",
        value: `${userMention} (${usernameClean})`,
        inline: true,
      },
      {
        name: "VIP Tier",
        value: `**${log.tier || "VIP Pass"}**`,
        inline: true,
      },
      {
        name: "Subscription Validity",
        value: expiryDisplay,
        inline: true,
      },
      {
        name: "Hardware ID (HWID)",
        value: log.hwid ? `\`${log.hwid}\`` : "*Unbound (First Launch)*",
        inline: true,
      },
      {
        name: "Auth Status",
        value: isSuccess ? "🟢 **Authenticated & Active**" : `🔴 **Denied (${log.message || "Invalid"})**`,
        inline: true,
      },
    ],
    footer: {
      text: "Chameleon Cheats User Vault • Security Monitor",
    },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordEmbed(USER_ACTIVITY_WEBHOOK_URL, embed, "Chameleon User Vault");
}

/**
 * Logs an Admin modification to a user (Reset HWID, Ban, Unban)
 */
export async function sendUserStatusChangeWebhook(data: UserStatusChangeData) {
  const userMention = data.discord_id ? `<@${data.discord_id}>` : `\`${data.discord_username || "Unbound"}\``;
  
  let actionTitle = "⚙️ User Status Updated";
  let actionColor = 0x3b82f6; // Blue

  if (data.action === "reset_hwid") {
    actionTitle = "🔄 User HWID Reset";
    actionColor = 0x06b6d4; // Cyan
  } else if (data.action === "ban") {
    actionTitle = "🔨 User License Banned";
    actionColor = 0xef4444; // Red
  } else if (data.action === "unban") {
    actionTitle = "🔓 User License Restored";
    actionColor = 0x10b981; // Green
  }

  const embed = {
    title: actionTitle,
    description: `Administrative update applied to ${userMention}.`,
    color: actionColor,
    fields: [
      {
        name: "User (Discord)",
        value: `${userMention} (@${data.discord_username || "N/A"})`,
        inline: true,
      },
      {
        name: "License Key",
        value: `\`${data.license_key}\``,
        inline: true,
      },
      {
        name: "Action Taken",
        value: `**${data.action.toUpperCase()}**`,
        inline: true,
      },
      {
        name: "Details",
        value: data.details || "Action confirmed by Administrator.",
        inline: false,
      },
    ],
    footer: {
      text: "Chameleon Cheats Admin Audit Log",
    },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordEmbed(USER_ACTIVITY_WEBHOOK_URL, embed, "Chameleon User Vault");
}

/**
 * Dispatches a formatted User List / VIP Roster summary to the dedicated USER LIST Discord Webhook
 */
export async function sendUserListWebhook(licenses: any[]) {
  const total = licenses.length;
  const now = new Date();
  const nowUnix = Math.floor(now.getTime() / 1000);
  
  let activeBoundCount = 0; // Logged-in / HWID-bound
  let pendingLaunchCount = 0; // Has license, not launched yet
  let bannedCount = 0;
  let expiredCount = 0;

  const rosterLines: string[] = [];

  licenses.forEach((lic, idx) => {
    const isBanned = Boolean(lic.is_banned);
    const isExpired = lic.expires_at && new Date(lic.expires_at) < now;
    const isBound = Boolean(lic.hwid && lic.hwid.trim());

    if (isBanned) {
      bannedCount++;
    } else if (isExpired) {
      expiredCount++;
    } else {
      if (isBound) activeBoundCount++;
      else pendingLaunchCount++;
    }

    // Format roster item
    const statusIcon = isBanned ? "🔴" : isExpired ? "🟡" : isBound ? "🟢" : "⚪";
    const tag = lic.discord_id ? `<@${lic.discord_id}>` : `@${lic.discord_username || "Unknown"}`;
    const usernameDisplay = lic.discord_username ? `(@${lic.discord_username})` : "";
    const tier = lic.tier || "VIP Pass";
    const hwidDisplay = isBound ? `🔒 Bound (\`${lic.hwid}\`)` : "🔓 *First Launch Pending*";
    const expiryDisplay = lic.expires_at
      ? `<t:${Math.floor(new Date(lic.expires_at).getTime() / 1000)}:R>`
      : "♾️ Lifetime VIP";

    rosterLines.push(
      `${statusIcon} **${idx + 1}.** ${tag} ${usernameDisplay}\n> 🏷️ **Tier**: ${tier} • ⏳ **Expires**: ${expiryDisplay}\n> 💻 **Device**: ${hwidDisplay}`
    );
  });

  const embed = {
    title: "📋 Chameleon Cheats — Registered VIP Member Directory",
    description: `Official VIP Roster snapshot synchronized with database vault.`,
    color: 0x6366f1, // Indigo
    fields: [
      {
        name: "📅 Snapshot Time (As of)",
        value: `<t:${nowUnix}:F>\n(<t:${nowUnix}:R>)`,
        inline: true,
      },
      {
        name: "👥 Logged-in / Bound Users",
        value: `🟢 **${activeBoundCount} Active on Device**`,
        inline: true,
      },
      {
        name: "📊 Total Registered Keys",
        value: `**${total} Keys** (${pendingLaunchCount} Pending | ${bannedCount} Banned | ${expiredCount} Expired)`,
        inline: false,
      },
      {
        name: "📜 VIP Members List",
        value: rosterLines.length > 0 ? rosterLines.join("\n\n") : "*No users registered yet.*",
        inline: false,
      },
    ],
    footer: {
      text: "Chameleon Cheats Member Directory • User List Stream",
    },
    timestamp: now.toISOString(),
  };

  await sendDiscordEmbed(USER_LIST_WEBHOOK_URL, embed, "Chameleon Member Directory");
}


