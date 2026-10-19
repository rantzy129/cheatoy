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

import fs from "fs";
import path from "path";

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
 * Sends a Discord Embed message with a local file attachment via multipart/form-data
 */
async function sendDiscordEmbedWithFile(
  targetWebhookUrl: string,
  embed: any,
  filePath: string,
  fileName = "receipt.png",
  botName = "Chameleon Vault"
) {
  if (!targetWebhookUrl) return;

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const mime =
      fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
        ? "image/jpeg"
        : fileName.endsWith(".webp")
        ? "image/webp"
        : "image/png";

    const formData = new FormData();
    const payload = {
      username: botName,
      avatar_url: "https://chameleoncheats.com/favicon.ico",
      embeds: [
        {
          ...embed,
          image: {
            url: `attachment://${fileName}`,
          },
        },
      ],
    };

    formData.append("payload_json", JSON.stringify(payload));
    const blob = new Blob([fileBuffer], { type: mime });
    formData.append("files[0]", blob, fileName);

    await fetch(targetWebhookUrl, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    console.warn("Notice: Failed to dispatch Discord Webhook with attachment, falling back to json:", err);
    await sendDiscordEmbed(targetWebhookUrl, embed, botName);
  }
}

/**
 * Dispatches a rich embed when a new customer order is submitted
 */
export async function sendOrderCreatedWebhook(order: OrderWebhookData, receiptFilePath?: string | null) {
  // Clean payment method display if it contains receipt tag
  const displayPaymentMethod = (order.payment_method || "InstaPay / GCash").replace(/\s*\[receipt:.*?\]/, "");

  const embed = {
    title: "📦 New VIP Order Submitted (Pending Verification)",
    description: `A customer has submitted a new payment for verification.${
      receiptFilePath ? "\n📎 **Official GCash payment receipt attached below.**" : ""
    }`,
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
        value: displayPaymentMethod,
        inline: true,
      },
      {
        name: "Status",
        value: "🟡 **Pending Admin Review**",
        inline: true,
      },
      {
        name: "Proof of Payment",
        value: receiptFilePath ? "✅ **Screenshot Slip Attached**" : "⚠️ *No screenshot uploaded (Manual Ref)*",
        inline: true,
      },
    ],
    footer: {
      text: "Chameleon Cheats Order Vault • Assault Fire PH VIP",
    },
    timestamp: new Date().toISOString(),
  };

  if (receiptFilePath && fs.existsSync(receiptFilePath)) {
    const fileName = path.basename(receiptFilePath);
    await sendDiscordEmbedWithFile(ORDER_WEBHOOK_URL, embed, receiptFilePath, fileName, "Chameleon Order Vault");
  } else {
    await sendDiscordEmbed(ORDER_WEBHOOK_URL, embed, "Chameleon Order Vault");
  }
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
export interface UserListPayload {
  licenses?: any[];
  orders?: any[];
  guildMembers?: any[];
}

/**
 * Dispatches a comprehensive Registered & VIP Member Directory to the dedicated USER LIST Discord Webhook
 */
export async function sendUserListWebhook(
  dataOrLicenses: any[] | UserListPayload
) {
  let licenses: any[] = [];
  let orders: any[] = [];
  let guildMembers: any[] = [];

  if (Array.isArray(dataOrLicenses)) {
    licenses = dataOrLicenses;
  } else if (dataOrLicenses && typeof dataOrLicenses === "object") {
    licenses = dataOrLicenses.licenses || [];
    orders = dataOrLicenses.orders || [];
    guildMembers = dataOrLicenses.guildMembers || [];
  }

  const now = new Date();
  const nowUnix = Math.floor(now.getTime() / 1000);
  const vipRoleId = process.env.DISCORD_VIP_ROLE_ID || "1561635140126515230";

  interface DirectoryUser {
    discord_id?: string;
    discord_username?: string;
    global_name?: string;
    status: "vip" | "pending" | "rejected" | "registered" | "banned" | "expired";
    tier?: string;
    hwid?: string;
    expires_at?: string | null;
    is_banned?: boolean;
    order_id?: string;
    reference_no?: string;
    price?: string;
    joined_at?: string;
    source: "license" | "order" | "discord";
  }

  const userMap = new Map<string, DirectoryUser>();

  const getCleanKey = (id?: string, name?: string) => {
    if (id && String(id).trim() && !String(id).startsWith("CHAM-")) {
      return `id_${String(id).trim().toLowerCase()}`;
    }
    if (name && String(name).trim()) {
      return `name_${String(name).trim().toLowerCase().replace(/#0+$/, "")}`;
    }
    return null;
  };

  // 1. Ingest Licenses (Highest authority for VIP status)
  licenses.forEach((lic) => {
    const key = getCleanKey(lic.discord_id, lic.discord_username) || `lic_${lic.id || lic.license_key}`;
    const isBanned = Boolean(lic.is_banned);
    const isExpired = lic.expires_at && new Date(lic.expires_at) < now;

    let status: DirectoryUser["status"] = "vip";
    if (isBanned) status = "banned";
    else if (isExpired) status = "expired";

    userMap.set(key, {
      discord_id: lic.discord_id || undefined,
      discord_username: lic.discord_username || undefined,
      status,
      tier: lic.tier || "VIP Pass",
      hwid: lic.hwid || undefined,
      expires_at: lic.expires_at,
      is_banned: isBanned,
      source: "license",
    });
  });

  // 2. Ingest Orders (Customers & pending verification)
  orders.forEach((ord) => {
    const key = getCleanKey(ord.discord_id, ord.discord_username) || `ord_${ord.id || ord.order_id}`;
    const existing = userMap.get(key);

    if (existing) {
      if (!existing.discord_id && ord.discord_id) existing.discord_id = ord.discord_id;
      if (!existing.discord_username && ord.discord_username) existing.discord_username = ord.discord_username;
      if (!existing.tier && ord.tier) existing.tier = ord.tier;
      if (ord.order_id) existing.order_id = ord.order_id;
      if (ord.reference_no) existing.reference_no = ord.reference_no;
    } else {
      let status: DirectoryUser["status"] = "registered";
      if (ord.status === "approved") status = "vip";
      else if (ord.status === "pending") status = "pending";
      else if (ord.status === "rejected") status = "rejected";

      userMap.set(key, {
        discord_id: ord.discord_id || undefined,
        discord_username: ord.discord_username || undefined,
        status,
        tier: ord.tier || "VIP Pass",
        order_id: ord.order_id,
        reference_no: ord.reference_no,
        price: ord.price,
        source: "order",
      });
    }
  });

  // 3. Ingest Discord Server Members (Signed-in & Community Members)
  guildMembers.forEach((m) => {
    if (m.user?.bot) return; // skip bots
    const key = getCleanKey(m.user?.id, m.user?.username);
    if (!key) return;

    const existing = userMap.get(key);
    const hasVipRole = Array.isArray(m.roles) && m.roles.includes(vipRoleId);

    if (existing) {
      if (!existing.discord_id && m.user?.id) existing.discord_id = m.user.id;
      if (!existing.discord_username && m.user?.username) existing.discord_username = m.user.username;
      existing.global_name = m.user?.global_name || m.user?.username;
      existing.joined_at = m.joined_at;
      if (hasVipRole && existing.status !== "banned") {
        existing.status = "vip";
      }
    } else {
      userMap.set(key, {
        discord_id: m.user?.id,
        discord_username: m.user?.username,
        global_name: m.user?.global_name || m.user?.username,
        status: hasVipRole ? "vip" : "registered",
        joined_at: m.joined_at,
        source: "discord",
      });
    }
  });

  // Calculate Aggregates
  const allUsers = Array.from(userMap.values());
  const totalRegistered = allUsers.length;
  const activeVipCount = allUsers.filter((u) => u.status === "vip").length;
  const hwidBoundCount = allUsers.filter((u) => u.hwid && u.hwid.trim()).length;
  const pendingOrdersCount = allUsers.filter((u) => u.status === "pending").length;
  const registeredCommunityCount = allUsers.filter((u) => u.status === "registered" || u.status === "rejected").length;
  const bannedCount = allUsers.filter((u) => u.status === "banned" || u.is_banned).length;

  // Format VIP Roster Lines
  const vipUsers = allUsers.filter((u) => u.status === "vip");
  const vipLines: string[] = vipUsers.map((u, idx) => {
    const mention = u.discord_id ? `<@${u.discord_id}>` : `@${u.discord_username || "Unknown"}`;
    const nameStr = u.discord_username ? `(\`@${u.discord_username}\`)` : (u.global_name ? `(\`${u.global_name}\`)` : "");
    const tier = u.tier || "VIP Pass";
    const hwid = u.hwid ? `🔒 Locked (\`${u.hwid.substring(0, 16)}...\`)` : "🔓 *First Launch Pending*";
    const expiry = u.expires_at ? `<t:${Math.floor(new Date(u.expires_at).getTime() / 1000)}:R>` : "♾️ Permanent VIP";
    return `🟢 **${idx + 1}.** ${mention} ${nameStr}\n> 🏷️ **Tier**: ${tier} • 💻 **Device**: ${hwid}\n> ⏳ **Expires**: ${expiry}`;
  });

  // Format Registered & Pending Community Users
  const nonVipUsers = allUsers.filter((u) => u.status !== "vip");
  const communityLines: string[] = nonVipUsers.map((u, idx) => {
    const mention = u.discord_id ? `<@${u.discord_id}>` : `@${u.discord_username || "Unknown"}`;
    const nameStr = u.discord_username ? `(\`@${u.discord_username}\`)` : (u.global_name ? `(\`${u.global_name}\`)` : "");
    
    if (u.status === "pending") {
      return `🟡 **${idx + 1}.** ${mention} ${nameStr}\n> ⏳ **Payment Under Review** (Ref: \`${u.reference_no || "N/A"}\` • ${u.tier || "VIP"})\n> 🆔 Order: \`${u.order_id || "N/A"}\``;
    }
    if (u.status === "rejected") {
      return `🔴 **${idx + 1}.** ${mention} ${nameStr}\n> ❌ **Unverified Payment Reference** (Ref: \`${u.reference_no || "N/A"}\`)`;
    }
    if (u.status === "banned") {
      return `⛔ **${idx + 1}.** ${mention} ${nameStr}\n> 🚫 **Hardware / License Suspended**`;
    }
    const joinedStr = u.joined_at ? `<t:${Math.floor(new Date(u.joined_at).getTime() / 1000)}:R>` : "Signed In";
    return `⚪ **${idx + 1}.** ${mention} ${nameStr}\n> 🌐 **Registered Discord Account** • Joined: ${joinedStr}`;
  });

  const embedFields = [
    {
      name: "📅 Snapshot Time (As of)",
      value: `<t:${nowUnix}:F>\n(<t:${nowUnix}:R>)`,
      inline: true,
    },
    {
      name: "👥 Member Directory Overview",
      value: `👤 **${totalRegistered} Total Registered Users**\n🟢 **${activeVipCount} Active VIP Members**\n🔒 **${hwidBoundCount} PC Devices Bound**`,
      inline: true,
    },
    {
      name: "📊 Accounts & Pipeline",
      value: `🟡 **${pendingOrdersCount} Pending GCash Orders**\n⚪ **${registeredCommunityCount} Registered Community**${bannedCount > 0 ? `\n⛔ **${bannedCount} Suspended**` : ""}`,
      inline: false,
    },
  ];

  if (vipLines.length > 0) {
    embedFields.push({
      name: `👑 Active VIP Members (${vipLines.length})`,
      value: vipLines.slice(0, 15).join("\n\n") + (vipLines.length > 15 ? `\n\n*...and ${vipLines.length - 15} more VIP members*` : ""),
      inline: false,
    });
  } else {
    embedFields.push({
      name: "👑 Active VIP Members (0)",
      value: "*No active VIP keys minted yet.*",
      inline: false,
    });
  }

  if (communityLines.length > 0) {
    embedFields.push({
      name: `📑 Registered Users & Community Roster (${communityLines.length})`,
      value: communityLines.slice(0, 15).join("\n\n") + (communityLines.length > 15 ? `\n\n*...and ${communityLines.length - 15} more registered members*` : ""),
      inline: false,
    });
  }

  const embed = {
    title: "📋 Chameleon Cheats — Registered VIP Member Directory",
    description: `Official VIP & Registered Member Roster synchronized with database and Discord server.`,
    color: 0x00d2ff, // Cyan
    fields: embedFields,
    footer: {
      text: `Chameleon Cheats Member Directory • ${totalRegistered} Registered Users Tracked`,
    },
    timestamp: now.toISOString(),
  };

  await sendDiscordEmbed(USER_LIST_WEBHOOK_URL, embed, "Chameleon Member Directory");
}



