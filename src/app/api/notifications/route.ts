import { NextResponse } from "next/server";
import { verifyAdminSession, getAdminTokenFromRequest } from "@/lib/adminAuth";
import {
  NotificationItem,
  fetchAllNotifications,
  saveNotification,
  deleteNotification,
  getNotificationsForUser,
} from "@/lib/notifications";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const discordId = searchParams.get("discord_id") || undefined;
    const username = searchParams.get("username") || undefined;
    const hasLicense = searchParams.get("has_license") === "true";
    const inGuildParam = searchParams.get("in_guild");
    const inGuild = inGuildParam !== null ? inGuildParam === "true" : undefined;

    const token = getAdminTokenFromRequest(request);
    const isAdmin = verifyAdminSession(token);

    // If request comes from an authenticated admin console and without specific user filters, return all
    if (isAdmin && !discordId && !username && !hasLicense) {
      const { notifications, inDatabase, dbError } = await fetchAllNotifications();
      return NextResponse.json({ success: true, notifications, inDatabase, dbError });
    }

    // Filter notifications for this specific visitor/user
    const userNotifications = await getNotificationsForUser({
      discordId,
      username,
      hasActiveLicense: hasLicense,
      inGuild,
    });
    return NextResponse.json({ success: true, notifications: userNotifications });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = getAdminTokenFromRequest(request);
    const body = await request.json().catch(() => ({}));
    const credential = token || body?.token || body?.pin;

    if (!verifyAdminSession(credential)) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const {
      title,
      message,
      type = "announcement",
      target = "all",
      actionLabel,
      actionUrl,
    } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: "Title and message are required" },
        { status: 400 }
      );
    }

    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: "Chameleon Cheats", // Strictly marked as Chameleon Cheats
      title: title.trim(),
      message: message.trim(),
      type: ["alert", "announcement", "update"].includes(type) ? type : "announcement",
      target: target || "all",
      actionLabel: actionLabel?.trim() || undefined,
      actionUrl: actionUrl?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const result = await saveNotification(newNotification);

    return NextResponse.json({
      success: true,
      notification: newNotification,
      inDatabase: result.inDatabase,
      dbError: result.dbError,
      message: `Notification successfully broadcasted from Chameleon Cheats!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const token = getAdminTokenFromRequest(request);
    const body = await request.json().catch(() => ({}));
    const credential = token || body?.token || body?.pin;

    if (!verifyAdminSession(credential)) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Notification ID is required" }, { status: 400 });
    }

    const success = await deleteNotification(id);
    return NextResponse.json({ success, message: "Notification deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete notification" },
      { status: 500 }
    );
  }
}

