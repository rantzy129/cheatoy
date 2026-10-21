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

// Dedicated Webhook: CURRENT USERS (COUNT ONLY — PUBLIC-SAFE CHANNEL)
const CURRENT_USERS_WEBHOOK_URL =
  process.env.DISCORD_CURRENT_USERS_WEBHOOK_URL ||
  "https://discord.com/api/webhooks/1562463968822431756/V_mlQ4OBJ8rVRrq5bXvY8lAr_pBwqd_cdPGtwKWX92y4au0W_k67zO7hb-CuLXxqROti";

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
async function sendDiscordEmbed(
  targetWebhookUrl: string,
  embed: any,
  botName = "Chameleon Vault",
  throwOnError = false
) {
  if (!targetWebhookUrl) {
    if (throwOnError) throw new Error("Discord webhook URL is not configured");
    return;
  }

  try {
    const payload = {
      username: botName,
      avatar_url: "https://chameleoncheats.com/favicon.ico",
      embeds: [embed],
    };

    const res = await fetch(targetWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`Discord Webhook failed [HTTP ${res.status}]:`, errText);
      if (throwOnError) {
        throw new Error(`Discord Webhook HTTP ${res.status}: ${errText || res.statusText}`);
      }
    }
  } catch (err) {
    if (throwOnError) throw err;
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
      ...((() => {
        const refMatch = (order.payment_method || "").match(/\[ref:(.*?)\]/);
        return refMatch && refMatch[1]
          ? [{ name: "Referral Affiliate", value: `🎁 Invited by **@${refMatch[1]}** *(+1 Day applied to pass)*`, inline: true }]
          : [];
      })()),
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
  expiresAt: string | null,
  referralReward?: { rewarded: boolean; referrer?: string; daysAdded?: number; isExistingVip?: boolean } | null
) {
  const expiryDisplay = expiresAt
    ? `<t:${Math.floor(new Date(expiresAt).getTime() / 1000)}:R> (${new Date(expiresAt).toLocaleDateString()})`
    : "♾️ **Permanent Lifetime Access**";

  const fields: any[] = [
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
  ];

  if (referralReward?.referrer) {
    const days = referralReward.daysAdded || 1;
    const referrerPerk = referralReward.isExistingVip
      ? `+${days} Free VIP Days extended onto their active pass`
      : `+${days} Free VIP Day pass awarded (Free/Non-VIP Member)`;

    fields.push({
      name: "🎁 Referral Bonus Credited",
      value: `• **Buyer (@${order.discord_username})**: +1 Bonus Day added to pass\n• **Referrer (@${referralReward.referrer})**: ${referrerPerk}!`,
      inline: false,
    });
  }

  const embed = {
    title: "✅ Order Approved & License Key Minted",
    description: `Payment confirmed. VIP license key has been bound to customer's Discord account.`,
    color: 0x10b981, // Emerald Green
    fields,
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

  // Helper to chunk lines into separate fields strictly <= 900 chars (Discord max: 1024)
  function chunkLinesIntoFields(
    titlePrefix: string,
    lines: string[],
    maxCharsPerField = 900
  ): { name: string; value: string; inline: boolean }[] {
    if (!lines || lines.length === 0) return [];
    const fields: { name: string; value: string; inline: boolean }[] = [];
    let currentChunk: string[] = [];
    let currentLen = 0;

    for (const line of lines) {
      const lineLen = line.length + 2; // +2 for \n\n
      if (currentLen + lineLen > maxCharsPerField && currentChunk.length > 0) {
        const partIndex = fields.length + 1;
        fields.push({
          name: partIndex === 1 ? titlePrefix : `${titlePrefix} (Part ${partIndex})`,
          value: currentChunk.join("\n\n"),
          inline: false,
        });
        currentChunk = [line];
        currentLen = line.length;
      } else {
        currentChunk.push(line);
        currentLen += lineLen;
      }
    }

    if (currentChunk.length > 0) {
      const partIndex = fields.length + 1;
      fields.push({
        name: fields.length === 0 ? titlePrefix : `${titlePrefix} (Part ${partIndex})`,
        value: currentChunk.join("\n\n"),
        inline: false,
      });
    }

    return fields;
  }

  if (vipLines.length > 0) {
    const maxVipDisplay = 25;
    const displayedVip = vipLines.slice(0, maxVipDisplay);
    if (vipLines.length > maxVipDisplay) {
      displayedVip[displayedVip.length - 1] += `\n\n*...and ${vipLines.length - maxVipDisplay} more VIP members*`;
    }
    embedFields.push(...chunkLinesIntoFields(`👑 Active VIP Members (${vipLines.length})`, displayedVip));
  } else {
    embedFields.push({
      name: "👑 Active VIP Members (0)",
      value: "*No active VIP keys minted yet.*",
      inline: false,
    });
  }

  if (communityLines.length > 0) {
    const maxCommunityDisplay = 25;
    const displayedCommunity = communityLines.slice(0, maxCommunityDisplay);
    if (communityLines.length > maxCommunityDisplay) {
      displayedCommunity[displayedCommunity.length - 1] += `\n\n*...and ${communityLines.length - maxCommunityDisplay} more registered members*`;
    }
    embedFields.push(...chunkLinesIntoFields(`📑 Registered Users & Community Roster (${communityLines.length})`, displayedCommunity));
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

  await sendDiscordEmbed(USER_LIST_WEBHOOK_URL, embed, "Chameleon Member Directory", true);
}

const CURRENT_USERS_STATE_FILE = path.join(process.cwd(), "data", "discord_current_users.json");

function getCurrentUsersMessageId(): string | null {
  if (process.env.DISCORD_CURRENT_USERS_MESSAGE_ID) {
    return process.env.DISCORD_CURRENT_USERS_MESSAGE_ID.trim();
  }
  try {
    if (fs.existsSync(CURRENT_USERS_STATE_FILE)) {
      const content = fs.readFileSync(CURRENT_USERS_STATE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed?.messageId) return String(parsed.messageId).trim();
    }
  } catch {}
  return "1562469590842220635";
}

function saveCurrentUsersMessageId(messageId: string) {
  try {
    const dir = path.dirname(CURRENT_USERS_STATE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      CURRENT_USERS_STATE_FILE,
      JSON.stringify({ messageId, updatedAt: new Date().toISOString() }, null, 2),
      "utf-8"
    );
  } catch (e) {
    console.warn("Notice saving current users message id:", e);
  }
}

/**
 * Updates the Live Active VIP Count on Discord by EDITING the existing message in-place.
 * STRICT REQUIREMENT: COUNT ONLY — NO personal details, usernames, IDs, or HWIDs (Publicly visible).
 * If the message doesn't exist yet or was deleted, it creates a new one and tracks the message ID.
 */
export async function sendCurrentUsersCountWebhook(passedLicenses?: any[]) {
  if (!CURRENT_USERS_WEBHOOK_URL) return;

  const now = new Date();
  const nowUnix = Math.floor(now.getTime() / 1000);
  let activeCount = 0;

  if (passedLicenses && Array.isArray(passedLicenses)) {
    activeCount = passedLicenses.filter(
      (lic) => !lic.is_banned && lic.expires_at && new Date(lic.expires_at) > now
    ).length;
  } else {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const { SUPABASE_URL, SUPABASE_ANON_KEY } = await import("./supabase");
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: licenses } = await supabase.from("licenses").select("is_banned, expires_at");
        activeCount = (licenses || []).filter(
          (lic: any) => !lic.is_banned && lic.expires_at && new Date(lic.expires_at) > now
        ).length;
      }
    } catch (e) {
      console.warn("Notice querying live licenses for current users count:", e);
    }
  }

  const embed = {
    title: "⚡ Chameleon Cheats — Live Active VIP Status",
    description: "Official real-time counter of current active VIP subscribers. Fully verified and operational.",
    color: 0x00d2ff, // Neon Cyan
    fields: [
      {
        name: "👥 Current Active VIPs",
        value: `\`\`\`css\n[ ${activeCount} ACTIVE SUBSCRIBERS ]\n\`\`\``,
        inline: false,
      },
      {
        name: "🛡️ Cheat Status",
        value: "🟢 **Undetected & Online**",
        inline: true,
      },
      {
        name: "⚡ System Health",
        value: "🟢 **100% Operational**",
        inline: true,
      },
      {
        name: "📅 Last Synced",
        value: `<t:${nowUnix}:F>\n(<t:${nowUnix}:R>)`,
        inline: false,
      },
    ],
    footer: {
      text: "Chameleon Cheats • Public Status Channel (Live Auto-Sync)",
      icon_url: "https://chameleoncheats.com/favicon.ico",
    },
    timestamp: now.toISOString(),
  };

  const messageId = getCurrentUsersMessageId();

  // 1. Attempt to EDIT the existing message in-place
  if (messageId) {
    try {
      const res = await fetch(`${CURRENT_USERS_WEBHOOK_URL}/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });

      if (res.ok) {
        return; // Successfully edited existing message in-place!
      }
      console.warn(`Discord Webhook PATCH returned HTTP ${res.status}, creating new message...`);
    } catch (err) {
      console.warn("Notice editing current users webhook message:", err);
    }
  }

  // 2. Fallback: POST a new message with wait=true to capture the message ID for future edits
  try {
    const res = await fetch(`${CURRENT_USERS_WEBHOOK_URL}?wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Chameleon VIP Live Status",
        avatar_url: "https://chameleoncheats.com/favicon.ico",
        embeds: [embed],
      }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data?.id) {
        saveCurrentUsersMessageId(data.id);
      }
    }
  } catch (err) {
    console.warn("Notice creating new current users webhook message:", err);
  }
}

export const updateCurrentUsersCountWebhook = sendCurrentUsersCountWebhook;

/**
 * Sends a webhook notification when bonus days are added to a license (e.g. Vouch reward)
 */
export async function sendLicenseExtendedWebhook(data: {
  license_key: string;
  discord_id?: string;
  discord_username?: string;
  daysAdded: number;
  new_expires_at: string | null;
  reason?: string;
}) {
  const embed = {
    title: "🌟 VIP PASS EXTENDED — PROMO REWARD",
    description: `Staff credited bonus VIP access to **@${data.discord_username || "VIP Customer"}**.`,
    color: 0x10b981, // Emerald Green
    fields: [
      {
        name: "👤 VIP Customer",
        value: `**@${data.discord_username || "Customer"}**${data.discord_id ? ` (<@${data.discord_id}>)` : ""}`,
        inline: true,
      },
      {
        name: "🎁 Bonus Added",
        value: `**+${data.daysAdded} Extra Day (${data.daysAdded * 24}h)**`,
        inline: true,
      },
      {
        name: "⏳ Updated Expiry",
        value: data.new_expires_at ? new Date(data.new_expires_at).toLocaleString() : "Permanent Lifetime VIP",
        inline: true,
      },
      {
        name: "🔑 License Key",
        value: `\`${data.license_key}\``,
        inline: true,
      },
      {
        name: "📝 Reason",
        value: data.reason || "Discord Vouch Promotion",
        inline: true,
      },
    ],
    footer: {
      text: "Chameleon Cheats • Community & Marketing Promotions",
    },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordEmbed(USER_ACTIVITY_WEBHOOK_URL, embed, "Chameleon Vault").catch((e) =>
    console.warn("License extended webhook notice:", e)
  );
}



