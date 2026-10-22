"use client";

import React, { useState, useMemo } from "react";
import { IconRefresh } from "./Icons";
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

const PRESETS: { title: string; message: string; type: "alert" | "announcement" | "update"; target: string; actionLabel: string; actionUrl: string }[] = [
  {
    title: "Discord Join Alert",
    message: "Join our official Discord server for VIP role verification, loader downloads, and priority support.",
    type: "alert",
    target: "all",
    actionLabel: "Join Official Discord",
    actionUrl: "https://discord.gg/Whwxq9QAEN",
  },
  {
    title: "Chameleon Cheat Loader v4.2 Undetected & Live",
    message: "Latest kernel bypass patch applied for Assault Fire PH. Download the fresh build from your VIP Key Vault or Discord.",
    type: "update",
    target: "all",
    actionLabel: "Open VIP Vault",
    actionUrl: "/profile",
  },
  {
    title: "Scheduled Game Maintenance Alert",
    message: "AFPH game servers are currently undergoing maintenance. Avoid injecting until our official Discord marks servers as clear.",
    type: "alert",
    target: "all",
    actionLabel: "Check Discord Status",
    actionUrl: "https://discord.gg/Whwxq9QAEN",
  },
];

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

  const applyNotifPreset = (kind: "discord_join" | "build_update" | "maintenance") => {
    const p = kind === "discord_join" ? PRESETS[0] : kind === "build_update" ? PRESETS[1] : PRESETS[2];
    setNotifTitle(p.title);
    setNotifMessage(p.message);
    setNotifType(p.type);
    setNotifTarget(p.target);
    setNotifActionLabel(p.actionLabel);
    setNotifActionUrl(p.actionUrl);
  };

  return (
    <div className="admin-notif-wrapper">
      <div className="admin-notif-card">
        <div className="admin-notif-card-header">
          <h3 className="admin-notif-card-title">Send Notification</h3>
        </div>
        <form onSubmit={handleSendNotification} className="admin-notif-form">
          <div className="admin-notif-row">
            <label className="admin-notif-label">Title</label>
            <input
              type="text"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              className="admin-notif-input"
              placeholder="e.g. Loader Update Available"
            />
          </div>
          <div className="admin-notif-row">
            <label className="admin-notif-label">Message</label>
            <textarea
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              className="admin-notif-textarea"
              rows={3}
              placeholder="Enter your announcement message..."
            />
          </div>
          <div className="admin-notif-row admin-notif-row-grid">
            <div className="admin-notif-col">
              <label className="admin-notif-label">Type</label>
              <select
                value={notifType}
                onChange={(e) => setNotifType(e.target.value as any)}
                className="admin-notif-select"
              >
                <option value="announcement">Announcement</option>
                <option value="alert">Alert</option>
                <option value="update">Update</option>
              </select>
            </div>
            <div className="admin-notif-col">
              <label className="admin-notif-label">Target</label>
              <select
                value={notifTarget}
                onChange={(e) => setNotifTarget(e.target.value)}
                className="admin-notif-select"
              >
                <option value="all">All Users</option>
                <option value="buyers">Buyers Only</option>
                <option value="buyers_not_discord">Buyers Not in Discord</option>
              </select>
            </div>
          </div>
          <div className="admin-notif-row admin-notif-row-grid">
            <div className="admin-notif-col">
              <label className="admin-notif-label">Action Label</label>
              <input
                type="text"
                value={notifActionLabel}
                onChange={(e) => setNotifActionLabel(e.target.value)}
                className="admin-notif-input"
                placeholder="e.g. Join Discord"
              />
            </div>
            <div className="admin-notif-col">
              <label className="admin-notif-label">Action URL</label>
              <input
                type="text"
                value={notifActionUrl}
                onChange={(e) => setNotifActionUrl(e.target.value)}
                className="admin-notif-input"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="admin-notif-presets">
            <span className="admin-notif-presets-label">Quick Presets:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyNotifPreset(idx === 0 ? "discord_join" : idx === 1 ? "build_update" : "maintenance")}
                className="admin-notif-preset-btn"
              >
                {p.title}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={isSendingNotif}
            className="admin-notif-submit"
          >
            {isSendingNotif ? "Broadcasting..." : "Send Notification"}
          </button>
          {notifStatusMsg && (
            <div className="admin-notif-status" style={{ marginTop: 12 }}>
              {notifStatusMsg}
            </div>
          )}
          {notifDbError && (
            <div className="admin-notif-error" style={{ marginTop: 8, color: "#f87171" }}>
              DB: {notifDbError}
            </div>
          )}
          {notifInDatabase === false && (
            <div className="admin-notif-info" style={{ marginTop: 8, fontSize: 11, color: "#94a3b8" }}>
              Stored locally only. Supabase "notifications" table not yet created.
            </div>
          )}
        </form>
      </div>

      {/* Active Broadcasts History */}
      <div className="admin-orders-card" style={{ marginTop: 20 }}>
        <div className="admin-card-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #142034" }}>
          <h3 className="admin-card-title" style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>
            Active Dispatched Notifications ({adminNotifs.length})
          </h3>
          {fetchAdminNotifications && (
            <button
              type="button"
              onClick={fetchAdminNotifications}
              className="admin-refresh-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0d1524", border: "1px solid #1c2b44", color: "#94a3b8", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
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
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    background: "#080e1a",
                    border: "1px solid #142034",
                    borderRadius: 8,
                    gap: 16,
                  }}
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
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#f87171",
                      padding: "6px 10px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {adminNotifs.length > notifsPerPage && (
              <div style={{ padding: "0 20px 16px" }}>
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}