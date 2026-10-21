import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

export interface NotificationItem {
  id: string;
  sender: "Chameleon Cheats";
  title: string;
  message: string;
  type: "alert" | "announcement" | "update";
  actionLabel?: string;
  actionUrl?: string;
  target: "all" | "buyers" | "buyers_not_discord" | string;
  createdAt: string;
  expiresAt?: string | null;
}

const STORAGE_FILE = path.join(process.cwd(), "data", "notifications.json");

function ensureStorageDir(): void {
  const dir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.warn("[Notifications] Could not create storage directory:", e);
    }
  }
}

// Default initial announcement from Chameleon Cheats
const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "cham-system-welcome",
    sender: "Chameleon Cheats",
    title: "Official Discord Community & Support",
    message: "Welcome to Chameleon Cheats! Join our official Discord server to receive automated VIP role verification, loader download builds, and priority technical support.",
    type: "announcement",
    actionLabel: "Join Official Discord",
    actionUrl: "https://discord.gg/Whwxq9QAEN",
    target: "all",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function getLocalNotifications(): NotificationItem[] {
  try {
    ensureStorageDir();
    if (!fs.existsSync(STORAGE_FILE)) {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(DEFAULT_NOTIFICATIONS, null, 2), "utf-8");
      return DEFAULT_NOTIFICATIONS;
    }
    const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_NOTIFICATIONS;
  } catch (err) {
    console.warn("[Notifications] Error reading notifications store, using defaults:", err);
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveLocalNotification(item: NotificationItem): void {
  try {
    ensureStorageDir();
    const existing = getLocalNotifications();
    const filtered = existing.filter((n) => n.id !== item.id);
    const updated = [item, ...filtered];
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Notifications] Error saving notification to file:", err);
  }
}

export function deleteLocalNotification(id: string): boolean {
  try {
    ensureStorageDir();
    const existing = getLocalNotifications();
    const updated = existing.filter((n) => n.id !== id);
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("[Notifications] Error deleting notification:", err);
    return false;
  }
}

/**
 * Fetch all notifications matching a specific user's status:
 * - All broadcasts
 * - Buyer notices (if hasActiveLicense)
 * - "Buyer not joined Discord" notice (if hasActiveLicense and not in Discord)
 * - Direct targeted notices (by discordId or username)
 */
export async function getNotificationsForUser(params: {
  discordId?: string;
  username?: string;
  hasActiveLicense?: boolean;
  inGuild?: boolean;
}): Promise<NotificationItem[]> {
  const allNotifications = getLocalNotifications();
  const cleanUser = (params.username || "").replace(/#0+$/, "").toLowerCase().trim();
  const targetId = (params.discordId || "").trim();

  const results: NotificationItem[] = [];

  // Check if an automated "Join Discord" alert should be dynamically surfaced for buyers not in Discord
  if (params.hasActiveLicense && params.inGuild === false) {
    const autoDiscordAlert: NotificationItem = {
      id: `auto-discord-alert-${targetId || cleanUser || "guest"}`,
      sender: "Chameleon Cheats",
      title: "Action Required: Join Official Discord Server",
      message: "We noticed your VIP Pass is active, but your account is not in our official Discord community. Join now to claim your VIP rank, combat loader access, and 24/7 technical assistance.",
      type: "alert",
      actionLabel: "Join Official Discord Server",
      actionUrl: "https://discord.gg/Whwxq9QAEN",
      target: "buyers_not_discord",
      createdAt: new Date().toISOString(),
    };
    results.push(autoDiscordAlert);
  }

  for (const n of allNotifications) {
    // Check expiration
    if (n.expiresAt && new Date(n.expiresAt).getTime() < Date.now()) {
      continue;
    }

    if (n.target === "all") {
      results.push(n);
    } else if (n.target === "buyers" && params.hasActiveLicense) {
      results.push(n);
    } else if (n.target === "buyers_not_discord" && params.hasActiveLicense && params.inGuild === false) {
      if (!results.some((r) => r.id === n.id)) {
        results.push(n);
      }
    } else if (
      targetId &&
      n.target.toLowerCase() === targetId.toLowerCase()
    ) {
      results.push(n);
    } else if (
      cleanUser &&
      n.target.toLowerCase() === cleanUser
    ) {
      results.push(n);
    }
  }

  // Sort descending by creation date
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
