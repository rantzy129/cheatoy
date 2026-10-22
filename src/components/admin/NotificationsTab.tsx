"use client";

import React, { useState, useMemo } from "react";
import { IconRefresh, IconCheck, IconArrowUpRight } from "./Icons";
import PaginationBar from "./PaginationBar";

interface NotificationsTabProps {
  adminNotifs: any[];
  notifTitle: string;
  setNotifTitle: (v: string) => void;
  notifMessage: string;
  setNotifMessage: (v: string) => void;
  notifType: "alert" | "announcement" | "update";
  setNotifType: (v: "alert" | "announcement" | "update") => void;
  notifTarget: string;
  setNotifTarget: (v: string) => void;
  notifActionLabel: string;
  setNotifActionLabel: (v: string) => void;
  notifActionUrl: string;
  setNotifActionUrl: (v: string) => void;
  isSendingNotif: boolean;
  notifStatusMsg: string | null;
  setNotifStatusMsg?: (v: string | null) => void;
  notifInDatabase: boolean | null;
  notifDbError: string | null;
  copiedSql: boolean;
  setCopiedSql: (v: boolean) => void;
  handleSendNotification: (e: React.FormEvent) => Promise<void>;
  handleDeleteNotification: (id: string) => Promise<void>;
  fetchAdminNotifications?: () => Promise<void>;
}

export default function NotificationsTab({
  adminNotifs,
  notifTitle,
  setNotifTitle,
  notifMessage,
  setNotifMessage,
  notifType,
  setNotifType,
  notifTarget,
  setNotifTarget,
  notifActionLabel,
  setNotifActionLabel,
  notifActionUrl,
  setNotifActionUrl,
  isSendingNotif,
  notifStatusMsg,
  setNotifStatusMsg,
  notifInDatabase,
  notifDbError,
  copiedSql,
  setCopiedSql,
  handleSendNotification,
  handleDeleteNotification,
  fetchAdminNotifications,
}: NotificationsTabProps) {
  const [notifsPage, setNotifsPage] = useState(1);
  const [notifsPerPage, setNotifsPerPage] = useState(5);

  const paginatedNotifs = useMemo(() => {
    const start = (notifsPage - 1) * notifsPerPage;
    return adminNotifs.slice(start, start + notifsPerPage);
  }, [adminNotifs, notifsPage, notifsPerPage]);

  const applyNotifPreset = (preset: "discord_join" | "build_update" | "maintenance") => {
    if (preset === "discord_join") {
      setNotifTitle("Action Required: Join Official Discord Server");
      setNotifMessage("We noticed your VIP Pass is active, but you have not joined our Discord server. Join now to claim your VIP role and get live loader updates.");
      setNotifType("alert");
      setNotifTarget("buyers_not_discord");
      setNotifActionLabel("Join Official Discord");
      setNotifActionUrl("https://discord.gg/Whwxq9QAEN");
    } else if (preset === "build_update") {
      setNotifTitle("Chameleon Cheat Loader v4.2 Undetected & Live");
      setNotifMessage("Latest kernel bypass patch applied for Assault Fire PH. Download the fresh build from your VIP Key Vault or Discord.");
      setNotifType("update");
      setNotifTarget("all");
      setNotifActionLabel("Open VIP Vault");
      setNotifActionUrl("/profile");
    } else if (preset === "maintenance") {
      setNotifTitle("Scheduled Game Maintenance Alert");
      setNotifMessage("AFPH game servers are currently undergoing maintenance. Avoid injecting until our official Discord marks servers as clear.");
      setNotifType("alert");
      setNotifTarget("all");
      setNotifActionLabel("Check Discord Status");
      setNotifActionUrl("https://discord.gg/Whwxq9QAEN");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title" style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", margin: "0 0 6px" }}>
            Broadcast &amp; Notifications
          </h1>
          <span className="admin-view-sub" style={{ fontSize: 13, color: "#70849e", lineHeight: 1.5 }}>
            Dispatch official messages stamped from &quot;Chameleon Cheats&quot; directly to buyers who haven&apos;t joined Discord, VIP pass holders, or all storefront visitors.
          </span>
        </div>
      </div>

      {/* Database Connection Status / SQL Migration helper for Vercel */}
      {notifInDatabase === false && (
        <div style={{
          padding: "16px 20px",
          background: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>
                  Supabase Cloud Persistence Setup (Required for Vercel)
                </span>
                <span style={{ fontSize: 10, background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                  1-STEP SETUP
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4, marginBottom: 0, lineHeight: 1.5 }}>
                On Vercel, serverless containers do not persist local files across visits. Run this 1-click SQL script in your Supabase SQL Editor to store notifications globally so all users receive them instantly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const sql = `CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  sender TEXT NOT NULL DEFAULT 'Chameleon Cheats',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'announcement',
  target TEXT NOT NULL DEFAULT 'all',
  action_label TEXT,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.notifications FOR DELETE USING (true);`;
                navigator.clipboard.writeText(sql);
                setCopiedSql(true);
                setTimeout(() => setCopiedSql(false), 3000);
              }}
              className="admin-tab-btn"
              style={{
                background: copiedSql ? "#10b981" : "#f59e0b",
                color: "#000000",
                fontWeight: 700,
                fontSize: 12,
                padding: "8px 14px",
                flexShrink: 0,
              }}
            >
              {copiedSql ? "Copied SQL to Clipboard!" : "Copy Supabase SQL Script"}
            </button>
          </div>
        </div>
      )}

      {notifInDatabase === true && (
        <div style={{
          padding: "10px 16px",
          background: "rgba(16, 185, 129, 0.08)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "#10b981",
          fontWeight: 600
        }}>
          <IconCheck size={14} />
          <span>Supabase Cloud Database connected: All broadcasts sync across Vercel production and all user devices in real-time.</span>
        </div>
      )}

      {notifStatusMsg && (
        <div style={{ padding: "12px 16px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 8, color: "#10b981", fontSize: 13, fontWeight: 600 }}>
          ✓ {notifStatusMsg}
        </div>
      )}

      {/* 2-Column Grid: Form + Live Preview */}
      <div className="admin-broadcast-grid">
        {/* Left: Compose Form */}
        <div className="admin-mint-card">
          <div className="admin-card-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 className="admin-card-title" style={{ fontSize: 14, fontWeight: 800, color: "#ffffff", margin: 0 }}>
              Compose Official Message
            </h3>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#00d2ff", background: "rgba(0, 210, 255, 0.1)", border: "1px solid rgba(0, 210, 255, 0.3)", padding: "3px 8px", borderRadius: 4 }}>
              <IconCheck size={12} />
              <span>Sender: Chameleon Cheats</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 6 }}>
              QUICK FILL PRESETS
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button
                type="button"
                onClick={() => applyNotifPreset("discord_join")}
                className="admin-preset-btn"
              >
                Join Discord Reminder
              </button>
              <button
                type="button"
                onClick={() => applyNotifPreset("build_update")}
                className="admin-preset-btn"
              >
                Loader v4.2 Update (Global)
              </button>
              <button
                type="button"
                onClick={() => applyNotifPreset("maintenance")}
                className="admin-preset-btn"
              >
                AFPH Maintenance Alert
              </button>
            </div>
          </div>

          <form onSubmit={handleSendNotification} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Target Audience */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="admin-form-label" style={{ margin: 0 }}>Target Audience</label>
                {notifTarget === "buyers" && (
                  <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>
                    VIP Pass Holders only (Excludes Free Members)
                  </span>
                )}
                {notifTarget === "all" && (
                  <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>
                    100% of Users &amp; Free Members
                  </span>
                )}
                {notifTarget === "buyers_not_discord" && (
                  <span style={{ fontSize: 11, color: "#00d2ff", fontWeight: 600 }}>
                    VIP buyers not in Discord only
                  </span>
                )}
              </div>
              <select
                value={notifTarget}
                onChange={(e) => setNotifTarget(e.target.value)}
                className="admin-form-select"
              >
                <option value="all">All Storefront Visitors &amp; Free Members (Global Broadcast)</option>
                <option value="buyers_not_discord">Buyers Who Haven&apos;t Joined Discord Server</option>
                <option value="buyers">All Active VIP Pass Holders Only (Excludes Free Members)</option>
              </select>
              <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0 0" }}>
                {notifTarget === "all"
                  ? "Every visitor and registered Discord account (including Free Members) will see this announcement."
                  : notifTarget === "buyers"
                    ? "Only accounts with an unexpired VIP License will receive this. Accounts marked as 'Free Member' are excluded."
                    : "Only users with an active VIP license whose Discord snowflake is not found in your server will see this."}
              </p>
            </div>

            {/* Notification Type */}
            <div>
              <label className="admin-form-label">Category</label>
              <select
                value={notifType}
                onChange={(e) => setNotifType(e.target.value as any)}
                className="admin-form-select"
              >
                <option value="alert">Action Required / Priority Alert (Amber Accent)</option>
                <option value="announcement">Official Announcement (Cyan Accent)</option>
                <option value="update">Cheat Build &amp; Loader Update (Green Accent)</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="admin-form-label">Notice Title</label>
              <input
                type="text"
                placeholder="e.g. Action Required: Join Official Discord Server"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="admin-form-input"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="admin-form-label">Message Content</label>
              <textarea
                rows={4}
                placeholder="Type the message that buyers will see in their notification center..."
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="admin-form-input"
                style={{ resize: "vertical", fontFamily: "inherit" }}
                required
              />
            </div>

            {/* Call to Action Button */}
            <div className="admin-dual-inputs">
              <div>
                <label className="admin-form-label">Button Label (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Join Official Discord"
                  value={notifActionLabel}
                  onChange={(e) => setNotifActionLabel(e.target.value)}
                  className="admin-form-input"
                />
              </div>
              <div>
                <label className="admin-form-label">Action Destination URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://discord.gg/Whwxq9QAEN"
                  value={notifActionUrl}
                  onChange={(e) => setNotifActionUrl(e.target.value)}
                  className="admin-form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSendingNotif}
              className="admin-btn-mint-submit"
              style={{ marginTop: 6 }}
            >
              {isSendingNotif ? "Broadcasting..." : "Broadcast from Chameleon Cheats"}
            </button>
          </form>
        </div>

        {/* Right: Live Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="admin-architecture-card">
            <h3 className="admin-architecture-title">Recipient View Preview</h3>
            <span style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 12 }}>
              How customers will see this notice in their Notification Center:
            </span>

            <div className={`notif-card ${notifType}`} style={{ background: "#080e1a" }}>
              <div className="notif-card-header">
                <div className="notif-sender-pill">
                  <IconCheck size={12} />
                  <span className="notif-sender-name">Chameleon Cheats</span>
                </div>
                <span style={{ fontSize: 10, color: "#64748b" }}>Just now</span>
              </div>
              <div className="notif-card-title">{notifTitle || "Notice Title Preview"}</div>
              <div className="notif-card-msg">
                {notifMessage || "This is a preview of the message content dispatched from Chameleon Cheats."}
              </div>
              {notifActionUrl && (
                <div className="notif-card-action">
                  <span className="notif-action-link" style={{ pointerEvents: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span>{notifActionLabel || "Open Action"}</span>
                    <IconArrowUpRight size={12} />
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="admin-architecture-card">
            <h3 className="admin-architecture-title">Why Web Notifications?</h3>
            <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
              When buyers haven&apos;t joined your Discord server yet, Discord Bot API calls return <code style={{ color: "#f87171" }}>404 Unknown Member</code> and Direct Messages are blocked.
              By using this in-app Notification Center, 100% of buyers receive your alert when they log in to retrieve their license key or download the loader.
            </p>
          </div>
        </div>
      </div>

      {/* Active Broadcasts History */}
      <div className="admin-orders-card">
        <div className="admin-card-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #142034" }}>
          <h3 className="admin-card-title" style={{ fontSize: 14, fontWeight: 800, color: "#ffffff", margin: 0 }}>
            Active Dispatched Notifications ({adminNotifs.length})
          </h3>
          {fetchAdminNotifications && (
            <button
              type="button"
              onClick={fetchAdminNotifications}
              className="admin-tab-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, padding: "6px 12px" }}
            >
              <IconRefresh size={13} />
              <span>Refresh List</span>
            </button>
          )}
        </div>

        {adminNotifs.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#64748b", fontSize: 13 }}>
            No dispatched notifications found in store.
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "16px 20px" }}>
              {paginatedNotifs.map((item) => (
                <div
                  key={item.id}
                  className="admin-broadcast-item"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#00d2ff" }}>
                        Chameleon Cheats
                      </span>
                      <span style={{ fontSize: 10, background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4, color: "#94a3b8" }}>
                        Target: {item.target || "all"}
                      </span>
                      {item.createdAt && (
                        <span style={{ fontSize: 10, color: "#64748b" }}>
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>
                      {item.message}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteNotification(item.id)}
                    className="admin-broadcast-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {adminNotifs.length > notifsPerPage && (
              <PaginationBar
                currentPage={notifsPage}
                totalItems={adminNotifs.length}
                itemsPerPage={notifsPerPage}
                onPageChange={setNotifsPage}
                onItemsPerPageChange={(n) => {
                  setNotifsPerPage(n);
                  setNotifsPage(1);
                }}
                itemLabel="broadcasts"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}