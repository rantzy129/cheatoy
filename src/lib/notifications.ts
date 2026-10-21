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

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
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
      try {
        fs.writeFileSync(STORAGE_FILE, JSON.stringify(DEFAULT_NOTIFICATIONS, null, 2), "utf-8");
      } catch {}
      return DEFAULT_NOTIFICATIONS;
    }
    const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_NOTIFICATIONS;
  } catch (err) {
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
    return false;
  }
}

/**
 * Fetch all notifications:
 * 1. Queries Supabase "notifications" table (real cloud database for Vercel & localhost).
 * 2. If table is not yet created or returns error, falls back to local storage file + defaults.
 */
export async function fetchAllNotifications(): Promise<{ notifications: NotificationItem[]; inDatabase: boolean; dbError?: string }> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      const mapped: NotificationItem[] = data.map((row: any) => ({
        id: String(row.id),
        sender: "Chameleon Cheats",
        title: row.title || "Notification",
        message: row.message || "",
        type: ["alert", "announcement", "update"].includes(row.type) ? row.type : "announcement",
        target: row.target || "all",
        actionLabel: row.action_label || undefined,
        actionUrl: row.action_url || undefined,
        createdAt: row.created_at || new Date().toISOString(),
        expiresAt: row.expires_at || null,
      }));

      // If database is empty, merge with default welcome announcement
      if (mapped.length === 0) {
        return { notifications: DEFAULT_NOTIFICATIONS, inDatabase: true };
      }

      return { notifications: mapped, inDatabase: true };
    }

    if (error) {
      console.warn("[Notifications] Supabase query notice:", error.message);
      return {
        notifications: getLocalNotifications(),
        inDatabase: false,
        dbError: error.code === "PGRST205" ? "TABLE_NOT_FOUND" : error.message,
      };
    }
  } catch (err: any) {
    console.warn("[Notifications] Supabase fetch exception:", err.message);
  }

  return { notifications: getLocalNotifications(), inDatabase: false };
}

/**
 * Save notification:
 * Tries Supabase cloud database first, with local fallback.
 */
export async function saveNotification(item: NotificationItem): Promise<{ success: boolean; inDatabase: boolean; dbError?: string }> {
  saveLocalNotification(item);

  try {
    const { error } = await supabase.from("notifications").upsert({
      id: item.id,
      sender: "Chameleon Cheats",
      title: item.title,
      message: item.message,
      type: item.type,
      target: item.target,
      action_label: item.actionLabel || null,
      action_url: item.actionUrl || null,
      created_at: item.createdAt,
      expires_at: item.expiresAt || null,
    });

    if (error) {
      console.warn("[Notifications] Supabase insert notice:", error.message);
      return {
        success: true,
        inDatabase: false,
        dbError: error.code === "PGRST205" ? "TABLE_NOT_FOUND" : error.message,
      };
    }

    return { success: true, inDatabase: true };
  } catch (err: any) {
    return { success: true, inDatabase: false, dbError: err.message };
  }
}

/**
 * Delete notification:
 * Deletes from Supabase cloud database and local fallback.
 */
export async function deleteNotification(id: string): Promise<boolean> {
  deleteLocalNotification(id);
  try {
    await supabase.from("notifications").delete().eq("id", id);
    return true;
  } catch {
    return true;
  }
}

/**
 * Fetch all notifications matching a specific user's status:
 * - All broadcasts ('all')
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
  const { notifications: allNotifications } = await fetchAllNotifications();
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

    // TARGET: 'all' -> Sent to EVERYONE (Free Members, Guests, VIPs)
    if (n.target === "all") {
      results.push(n);
    } 
    // TARGET: 'buyers' -> Sent ONLY to users with an active VIP license
    else if (n.target === "buyers" && params.hasActiveLicense) {
      results.push(n);
    } 
    // TARGET: 'buyers_not_discord' -> Sent to VIP buyers who haven't joined Discord
    else if (n.target === "buyers_not_discord" && params.hasActiveLicense && params.inGuild === false) {
      if (!results.some((r) => r.id === n.id)) {
        results.push(n);
      }
    } 
    // TARGET: specific user by Discord snowflake ID
    else if (
      targetId &&
      n.target.toLowerCase() === targetId.toLowerCase()
    ) {
      results.push(n);
    } 
    // TARGET: specific user by username
    else if (
      cleanUser &&
      n.target.toLowerCase() === cleanUser
    ) {
      results.push(n);
    }
  }

  // Sort descending by creation date
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
