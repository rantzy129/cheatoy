"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import "./admin.css";

/* ─── Vector SVG Icons (Zero Emojis, Pure SVG) ─────────────────── */
function IconShieldLock({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <rect x="9" y="11" width="6" height="5" rx="1" />
      <path d="M10 11V9a2 2 0 0 1 4 0v2" />
    </svg>
  );
}

function IconOrders({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconKeyVault({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );
}

function IconKeyMint({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
      <line x1="18" y1="2" x2="18" y2="6" />
      <line x1="16" y1="4" x2="20" y2="4" />
    </svg>
  );
}

function IconBell({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconOverview({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function IconSearch({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconRefresh({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15.55-6.36L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15.55 6.36L3 16" />
    </svg>
  );
}

function IconZap({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconCheck({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCopy({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconExternalLink({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconArrowLeft({ size = 13, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconArrowUpRight({ size = 13, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function IconLogout({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconHardware({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function IconDiscord({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function IconEye({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function IconKey({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1.5-1.5L8 9l-1.5-1.5L5 9l-1.5-1.5L2 9l6 6c1.66 1.66 4.34 1.66 6 0l7-7-2-2z" />
    </svg>
  );
}

function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconChevronLeft({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconChevronsLeft({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  );
}

function IconChevronsRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  );
}

function PaginationBar({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemLabel = "entries",
}: {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (p: number) => void;
  onItemsPerPageChange: (n: number) => void;
  itemLabel?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="admin-pagination-container">
      <div className="admin-pagination-info">
        <span className="admin-pagination-counter">
          Showing <strong>{startIdx}</strong> to <strong>{endIdx}</strong> of <strong>{totalItems}</strong> {itemLabel}
        </span>
        <div className="admin-pagination-select-wrap">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="admin-pagination-select"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>per page</span>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination-nav">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="admin-pagination-btn"
            title="First Page"
          >
            <IconChevronsLeft size={13} />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="admin-pagination-btn"
            title="Previous Page"
          >
            <IconChevronLeft size={13} />
          </button>

          {getPageNumbers().map((p, i) =>
            typeof p === "number" ? (
              <button
                key={i}
                type="button"
                onClick={() => onPageChange(p)}
                className={`admin-pagination-btn ${currentPage === p ? "active" : ""}`}
              >
                {p}
              </button>
            ) : (
              <span key={i} className="admin-pagination-ellipsis">
                •••
              </span>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="admin-pagination-btn"
            title="Next Page"
          >
            <IconChevronRight size={13} />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="admin-pagination-btn"
            title="Last Page"
          >
            <IconChevronsRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

function IconReceipt({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-8" />
      <path d="M16 12h-8" />
      <path d="M13 16h-5" />
    </svg>
  );
}

function IconZoomIn({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function IconZoomOut({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

interface Order {
  id: string;
  order_id: string;
  discord_id: string;
  discord_username: string;
  tier: string;
  price: string;
  payment_method: string;
  reference_no: string;
  sender_name?: string;
  status: "pending" | "approved" | "rejected";
  license_key?: string;
  created_at: string;
  approved_at?: string;
  receipt_url?: string | null;
  referred_by?: string | null;
}

interface License {
  id: string;
  license_key: string;
  discord_id?: string;
  discord_username?: string;
  tier?: string;
  expires_at?: string;
  hwid?: string | null;
  is_banned: boolean;
  created_at: string;
}

export default function AdminPage() {
  // Navigation View State
  const [activeTab, setActiveTab] = useState<"orders" | "licenses" | "generator" | "overview" | "notifications">("orders");

  // Chameleon Cheats Notification System State
  const [adminNotifs, setAdminNotifs] = useState<any[]>([]);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"alert" | "announcement" | "update">("alert");
  const [notifTarget, setNotifTarget] = useState<string>("all");
  const [notifActionLabel, setNotifActionLabel] = useState("Join Official Discord");
  const [notifActionUrl, setNotifActionUrl] = useState("https://discord.gg/Whwxq9QAEN");
  const [isSendingNotif, setIsSendingNotif] = useState(false);
  const [notifStatusMsg, setNotifStatusMsg] = useState<string | null>(null);
  const [notifInDatabase, setNotifInDatabase] = useState<boolean | null>(null);
  const [notifDbError, setNotifDbError] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const fetchAdminNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.notifications)) {
          setAdminNotifs(data.notifications);
        }
        if (typeof data.inDatabase === "boolean") {
          setNotifInDatabase(data.inDatabase);
        }
        if (data.dbError) {
          setNotifDbError(data.dbError);
        }
      }
    } catch (err) {
      console.warn("Failed fetching notifications:", err);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) {
      alert("Please provide both a title and a message body.");
      return;
    }
    setIsSendingNotif(true);
    setNotifStatusMsg(null);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage,
          type: notifType,
          target: notifTarget,
          actionLabel: notifActionLabel,
          actionUrl: notifActionUrl,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.inDatabase === false) {
          setNotifStatusMsg("Broadcast saved! Note: Supabase table is not yet created, so notice is held in memory. Run the SQL script below to sync to all Vercel users.");
        } else {
          setNotifStatusMsg(data.message || "Notification sent from Chameleon Cheats!");
        }
        if (typeof data.inDatabase === "boolean") {
          setNotifInDatabase(data.inDatabase);
        }
        setNotifTitle("");
        setNotifMessage("");
        fetchAdminNotifications();
        setTimeout(() => setNotifStatusMsg(null), 8000);
      } else {
        alert(data.error || "Failed to broadcast notification");
      }
    } catch {
      alert("Network error sending notification");
    } finally {
      setIsSendingNotif(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchAdminNotifications();
      } else {
        alert(data.error || "Failed to delete notification");
      }
    } catch {
      alert("Network error deleting notification");
    }
  };

  // Quick preset helper
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

  // Authentication State (100% HTTP-Only Cookie, Zero Frontend Storage)
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Search & Filter
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Receipt Inspection Lightbox State
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [receiptZoom, setReceiptZoom] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedReceiptOrder(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Key Generator State
  const [genTier, setGenTier] = useState("1 Month Pass");
  const [genUser, setGenUser] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintedKey, setMintedKey] = useState<string | null>(null);

  // User List Discord Sync State
  const [isSyncingUsers, setIsSyncingUsers] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [syncCooldown, setSyncCooldown] = useState<number>(0);

  // Loader Version Control & Kill-Switch State
  const [minLoaderVersion, setMinLoaderVersion] = useState("1.0.6");
  const [enforcedVersion, setEnforcedVersion] = useState("1.0.6");
  const [downloadPageUrl, setDownloadPageUrl] = useState("https://chameleon-cheats.vercel.app/profile");
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [versionStatusMsg, setVersionStatusMsg] = useState<string | null>(null);

  // Pagination States
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [licensesPage, setLicensesPage] = useState(1);
  const [licensesPerPage, setLicensesPerPage] = useState(10);
  const [notifsPage, setNotifsPage] = useState(1);
  const [notifsPerPage, setNotifsPerPage] = useState(5);

  const fetchLoaderVersion = async () => {
    try {
      const res = await fetch("/api/admin/version");
      const data = await res.json();
      if (res.ok && data.success && data.minVersion) {
        setMinLoaderVersion(data.minVersion);
        setEnforcedVersion(data.minVersion);
        if (data.downloadUrl) setDownloadPageUrl(data.downloadUrl);
      }
    } catch { }
  };

  const handleSaveLoaderVersion = async () => {
    if (!minLoaderVersion.trim()) return;
    setIsSavingVersion(true);
    setVersionStatusMsg(null);
    try {
      const res = await fetch("/api/admin/version", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minVersion: minLoaderVersion.trim(),
          downloadUrl: downloadPageUrl.trim(),
          pin: pin || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEnforcedVersion(data.minVersion);
        setVersionStatusMsg(`Enforced v${data.minVersion}! All older versions blocked.`);
        setTimeout(() => setVersionStatusMsg(null), 6000);
      } else {
        alert(data.error || "Failed to update loader version");
      }
    } catch {
      alert("Network error updating version");
    } finally {
      setIsSavingVersion(false);
    }
  };

  // Active countdown timer for Discord sync cooldown
  useEffect(() => {
    if (syncCooldown <= 0) return;
    const timer = setInterval(() => {
      setSyncCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [syncCooldown]);

  const handleSyncUserListToDiscord = async () => {
    if (syncCooldown > 0) return;
    setIsSyncingUsers(true);
    setSyncStatusMsg(null);
    try {
      const res = await fetch("/api/admin/licenses/sync-discord", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncStatusMsg(data.message || "User list synced to Discord!");
        setSyncCooldown(15); // 15-second cooldown between live directory broadcasts
        setTimeout(() => setSyncStatusMsg(null), 5000);
      } else {
        if (res.status === 429) {
          setSyncCooldown(data.retryAfter || 20);
        }
        alert(data.error || "Failed to sync user list to Discord");
      }
    } catch {
      alert("Network error syncing to Discord");
    } finally {
      setIsSyncingUsers(false);
    }
  };

  // Verify Session on Mount via HTTP-Only cookie check
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/session")
      .then((res) => {
        if (!res.ok) return { authenticated: false };
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data?.authenticated) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => { });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch data on authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = () => {
    fetchOrders();
    fetchLicenses();
    fetchAdminNotifications();
    fetchLoaderVersion();
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.orders)) {
        setOrders(data.orders as Order[]);
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLicenses = async () => {
    try {
      const res = await fetch("/api/admin/licenses");
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.licenses)) {
        setLicenses(data.licenses as License[]);
      }
    } catch (err) {
      console.error("Error fetching licenses:", err);
    }
  };

  // Login handler (Zero local storage, sets HTTP-Only cookie)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPin(""); // Clear local input state
        setErrorMessage(null);
      } else {
        setErrorMessage(data.error || "Authentication Denied: Invalid Security Pin");
      }
    } catch {
      setErrorMessage("Network error: Could not reach security gateway.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Logout handler (Clears HTTP-Only cookie)
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Continue client cleanup
    }
    setIsAuthenticated(false);
    setOrders([]);
    setLicenses([]);
    setPin("");
  };

  // Approve Order
  const handleApproveOrder = async (order: Order) => {
    setActionLoading(order.id);
    try {
      const res = await fetch("/api/order/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.order_id,
          action: "approve",
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert("Failed to approve order: " + data.error);
      } else {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? { ...o, status: "approved", license_key: data.license_key, approved_at: new Date().toISOString() }
              : o
          )
        );
        setSelectedReceiptOrder((prev) =>
          prev?.id === order.id
            ? { ...prev, status: "approved", license_key: data.license_key, approved_at: new Date().toISOString() }
            : prev
        );
        fetchLicenses();

        if (data.referral_reward?.referrer) {
          const rewardDays = data.referral_reward.daysAdded || 1;
          const statusDesc = data.referral_reward.isExistingVip
            ? `Active VIP: +${rewardDays} Free VIP Days extended onto pass`
            : `Non-VIP / Unbought: +${rewardDays} Free VIP Day pass awarded`;
          alert(`🎉 Order Approved!\nLicense Key: ${data.license_key}\n\n🎁 Clanmate Referral Credited:\n• Buyer (@${order.discord_username}): +1 Bonus Day\n• Referrer (@${data.referral_reward.referrer}): ${statusDesc}`);
        }

        if (data.discord_bot) {
          const { roleAssigned, dmSent, roleError, dmError } = data.discord_bot;
          if (!roleAssigned || !dmSent) {
            const errs = [];
            if (!roleAssigned && roleError) errs.push(`• Role: ${roleError}`);
            if (!dmSent && dmError) errs.push(`• DM: ${dmError}`);
            if (errs.length > 0) {
              alert(`Key issued successfully (${data.license_key})!\n\n⚠️ Discord Notification Notice:\n${errs.join("\n")}`);
            }
          }
        }
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Reject Order
  const handleRejectOrder = async (order: Order) => {
    if (!confirm(`Reject order ${order.order_id} from ${order.discord_username}?`)) return;
    setActionLoading(order.id);
    try {
      const res = await fetch("/api/order/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.order_id,
          action: "reject",
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert("Failed to reject order: " + data.error);
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, status: "rejected" } : o))
        );
        setSelectedReceiptOrder((prev) =>
          prev?.id === order.id ? { ...prev, status: "rejected" } : prev
        );
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Admin attach slip to order
  const handleAdminAttachSlip = async (orderId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawData = e.target?.result as string;
      try {
        const res = await fetch("/api/order/attach-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            receipt_image: rawData,
            receipt_name: file.name,
          }),
        });
        const data = await res.json();
        if (data.success && data.receipt_url) {
          setOrders((prev) =>
            prev.map((o) =>
              o.order_id === orderId ? { ...o, receipt_url: data.receipt_url } : o
            )
          );
          alert("Slip attached successfully! You can now click 'View Slip'.");
        } else {
          alert("Failed to attach slip: " + (data.error || "Unknown error"));
        }
      } catch (err: any) {
        alert("Upload error: " + err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset HWID Binding
  const handleResetHWID = async (licenseId: string) => {
    if (!confirm("Reset hardware lock for this license key? The user can bind a new PC.")) return;
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: licenseId, action: "reset_hwid" }),
      });
      const data = await res.json();
      if (data.success) {
        setLicenses((prev) => prev.map((l) => (l.id === licenseId ? { ...l, hwid: null } : l)));
        alert("Hardware ID unlocked successfully.");
      } else {
        alert("Failed to reset HWID: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Toggle Ban License
  const handleToggleBan = async (licenseId: string) => {
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: licenseId, action: "toggle_ban" }),
      });
      const data = await res.json();
      if (data.success) {
        setLicenses((prev) =>
          prev.map((l) => (l.id === licenseId ? { ...l, is_banned: data.is_banned } : l))
        );
      } else {
        alert("Failed: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Extend License Duration (+1 Day / Custom Days)
  const handleExtendDays = async (lic: License, days: number = 1) => {
    if (lic.expires_at === null) {
      alert("This license has Lifetime VIP (Permanent) and does not expire.");
      return;
    }
    const userLabel = lic.discord_username || lic.discord_id || lic.license_key;
    if (!confirm(`Credit +${days} Extra VIP Day (Vouch Promotion) to @${userLabel}?`)) return;

    setActionLoading(lic.id);
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lic.id,
          action: "add_days",
          days,
          reason: "Discord Vouch Promotion (+1 Day)",
        }),
      });
      const data = await res.json();
      if (data.success && data.new_expires_at) {
        setLicenses((prev) =>
          prev.map((l) =>
            l.id === lic.id
              ? {
                ...l,
                expires_at: data.new_expires_at,
                tier: data.tier || l.tier,
                is_banned: false,
              }
              : l
          )
        );
        let alertMsg = `🎉 +${days} Day credited successfully to @${userLabel}!\n\nNew Expiration: ${new Date(data.new_expires_at).toLocaleString()}`;
        if (data.discord_dm?.dmSent) {
          alertMsg += "\n✓ Automated Discord DM sent to customer.";
        } else if (data.discord_dm?.dmError) {
          alertMsg += `\n(Customer DMs were closed, but license was successfully extended in database)`;
        }
        alert(alertMsg);
        fetchLicenses();
      } else {
        alert("Failed to extend license: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Mint VIP Key Handler
  const handleMintKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMinting(true);
    setMintedKey(null);
    try {
      const res = await fetch("/api/admin/keys/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: genTier,
          discord_username: genUser.trim() || "Staff Issue",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.license?.license_key) {
        setMintedKey(data.license.license_key);
        fetchLicenses();
      } else {
        alert("Key generation failed: " + (data.error || "Unknown"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsMinting(false);
    }
  };

  // Copy helper
  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(val);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderFilter !== "all" && o.status !== orderFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          o.order_id.toLowerCase().includes(q) ||
          o.reference_no.toLowerCase().includes(q) ||
          o.discord_username.toLowerCase().includes(q) ||
          (o.sender_name && o.sender_name.toLowerCase().includes(q)) ||
          (o.license_key && o.license_key.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [orders, orderFilter, searchQuery]);

  // Filtered Licenses
  const filteredLicenses = useMemo(() => {
    if (!searchQuery.trim()) return licenses;
    const q = searchQuery.toLowerCase().trim();
    return licenses.filter(
      (l) =>
        l.license_key.toLowerCase().includes(q) ||
        (l.discord_username && l.discord_username.toLowerCase().includes(q)) ||
        (l.discord_id && l.discord_id.toLowerCase().includes(q)) ||
        (l.hwid && l.hwid.toLowerCase().includes(q))
    );
  }, [licenses, searchQuery]);

  // Paginated Orders
  const paginatedOrders = useMemo(() => {
    const start = (ordersPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, ordersPage, ordersPerPage]);

  // Paginated Licenses
  const paginatedLicenses = useMemo(() => {
    const start = (licensesPage - 1) * licensesPerPage;
    return filteredLicenses.slice(start, start + licensesPerPage);
  }, [filteredLicenses, licensesPage, licensesPerPage]);

  // Paginated Notifications
  const paginatedNotifs = useMemo(() => {
    const start = (notifsPage - 1) * notifsPerPage;
    return adminNotifs.slice(start, start + notifsPerPage);
  }, [adminNotifs, notifsPage, notifsPerPage]);

  // Metrics
  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
  const approvedOrdersCount = orders.filter((o) => o.status === "approved").length;
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === "approved")
      .reduce((acc, curr) => acc + parseInt(curr.price?.replace(/[^0-9]/g, "") || "0", 10), 0);
  }, [orders]);

  /* ─────────────────────────────────────────────────────────────
     STANDALONE RESTRICTED ACCESS GATE (No Customer Navbar/Footer)
     ───────────────────────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="admin-login-fullscreen">
        <div className="admin-login-card">
          <div className="admin-login-brand">
            <div className="admin-login-logo">
              <Image
                src="/logo.png"
                alt="Chameleon Cheats Logo"
                width={36}
                height={36}
                priority
              />
            </div>
          </div>

          <h1 className="admin-login-title">Staff Console Access</h1>
          <p className="admin-login-desc">
            Enter master security key to manage licenses, verify GCash transactions, and issue VIP passes.
          </p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-input-group">
              <label className="admin-input-label" htmlFor="admin-pin-field">
                Master Security Key
              </label>
              <div className="admin-input-container">
                <div className="admin-input-lead-icon">
                  <IconKey size={16} />
                </div>
                <input
                  id="admin-pin-field"
                  type={showPin ? "text" : "password"}
                  placeholder="Enter security key..."
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="admin-pin-field"
                  autoFocus
                  disabled={isVerifying}
                  autoComplete="off"
                  spellCheck="false"
                />
                <button
                  type="button"
                  className="admin-input-toggle-btn"
                  onClick={() => setShowPin(!showPin)}
                  tabIndex={-1}
                  aria-label={showPin ? "Hide key" : "Show key"}
                >
                  {showPin ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="admin-login-error" role="alert">
                <span className="admin-error-icon">!</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="admin-btn-auth"
              disabled={isVerifying || !pin.trim()}
            >
              {isVerifying ? (
                <span className="admin-btn-content">
                  <span className="admin-button-spinner" />
                  <span>Verifying Credentials...</span>
                </span>
              ) : (
                <span className="admin-btn-content">
                  <IconShieldLock size={16} />
                  <span>Authenticate Console</span>
                </span>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <Link href="/" className="admin-return-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <IconArrowLeft size={13} className="btn-arrow-left" />
              <span>Return to Storefront</span>
            </Link>
            <span className="admin-security-badge">
              HTTP-Only Encrypted
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     3. STANDALONE ENTERPRISE ADMIN DASHBOARD
     ───────────────────────────────────────────────────────────── */
  return (
    <div className="admin-shell">
      {/* ─── DEDICATED ADMIN SIDEBAR ─── */}
      <aside className="admin-sidebar" aria-label="Admin Navigation">
        <div>
          {/* Brand Emblem */}
          <div className="admin-sidebar-brand">
            <div className="admin-brand-icon">
              <IconShieldLock size={22} />
            </div>
            <div className="admin-brand-info">
              <h2>CHAMELEON</h2>
              <span>Command Center v4.2</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="admin-nav-section">
            <span className="admin-nav-label">OPERATIONS</span>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <div className="admin-nav-item-left">
                <IconOrders size={17} />
                <span>GCash Approvals</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="admin-nav-badge">{pendingOrdersCount}</span>
              )}
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === "licenses" ? "active" : ""}`}
              onClick={() => setActiveTab("licenses")}
            >
              <div className="admin-nav-item-left">
                <IconKeyVault size={17} />
                <span>License Vault</span>
              </div>
              <span style={{ fontSize: 11, color: "#64748b" }}>{licenses.length}</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === "generator" ? "active" : ""}`}
              onClick={() => setActiveTab("generator")}
            >
              <div className="admin-nav-item-left">
                <IconKeyMint size={17} />
                <span>Key Minting</span>
              </div>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <div className="admin-nav-item-left">
                <IconOverview size={17} />
                <span>Analytics Overview</span>
              </div>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              <div className="admin-nav-item-left">
                <IconBell size={17} />
                <span>Broadcast &amp; Notices</span>
              </div>
              {adminNotifs.length > 0 && (
                <span className="admin-nav-badge">{adminNotifs.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-enclave-pill">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            <span>Enclave: HTTP-Only Active</span>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-storefront-link"
          >
            <span>Live Storefront</span>
            <IconExternalLink size={12} />
          </Link>

          <button type="button" onClick={handleLogout} className="admin-logout-btn">
            <IconLogout size={14} />
            <span>Lock Console</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT VIEWPORT ─── */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-title">
            <div className="admin-header-breadcrumb">
              <span>Admin</span>
              <span>/</span>
              <span className="admin-breadcrumb-active">
                {activeTab === "orders" && "GCash Orders & Approvals"}
                {activeTab === "licenses" && "License Vault & HWID Management"}
                {activeTab === "generator" && "Instant VIP Key Minting"}
                {activeTab === "overview" && "Executive Analytics & Metrics"}
              </span>
            </div>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              onClick={loadAllData}
              disabled={loading}
              className="admin-btn-sync"
            >
              <IconRefresh size={13} />
              <span>{loading ? "Syncing..." : "Sync DB"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("generator")}
              className="admin-btn-mint-cta"
            >
              <IconKeyMint size={14} />
              <span>Mint Key</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Views */}
        <div className="admin-content-area">
          {/* ─── TAB 1: ORDERS & GCASH APPROVALS ─── */}
          {activeTab === "orders" && (
            <>
              {/* KPI Quick Cards */}
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                  <div className="admin-kpi-header">
                    <span className="admin-kpi-title">Pending Validations</span>
                    <div className="admin-kpi-icon admin-kpi-icon-amber">
                      <IconOrders size={15} />
                    </div>
                  </div>
                  <div className="admin-kpi-value" style={{ color: pendingOrdersCount > 0 ? "#f59e0b" : "#ffffff" }}>
                    {pendingOrdersCount}
                  </div>
                  <span className="admin-kpi-sub">GCash receipts awaiting review</span>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-header">
                    <span className="admin-kpi-title">Verified Revenue</span>
                    <div className="admin-kpi-icon admin-kpi-icon-green">
                      ₱
                    </div>
                  </div>
                  <div className="admin-kpi-value" style={{ color: "#10b981" }}>
                    ₱{totalRevenue.toLocaleString()}
                  </div>
                  <span className="admin-kpi-sub">Total validated revenue</span>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-header">
                    <span className="admin-kpi-title">Approved Passes</span>
                    <div className="admin-kpi-icon admin-kpi-icon-cyan">
                      <IconCheck size={15} />
                    </div>
                  </div>
                  <div className="admin-kpi-value">{approvedOrdersCount}</div>
                  <span className="admin-kpi-sub">Discord-linked deliveries</span>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-header">
                    <span className="admin-kpi-title">Total Submissions</span>
                    <div className="admin-kpi-icon">
                      <IconOverview size={15} />
                    </div>
                  </div>
                  <div className="admin-kpi-value">{orders.length}</div>
                  <span className="admin-kpi-sub">All-time order submissions</span>
                </div>
              </div>

              {/* Toolbar */}
              <div className="admin-toolbar">
                <div className="admin-status-tabs">
                  <button
                    type="button"
                    className={`admin-tab-btn ${orderFilter === "pending" ? "active" : ""}`}
                    onClick={() => {
                      setOrderFilter("pending");
                      setOrdersPage(1);
                    }}
                  >
                    Pending ({pendingOrdersCount})
                  </button>
                  <button
                    type="button"
                    className={`admin-tab-btn ${orderFilter === "approved" ? "active" : ""}`}
                    onClick={() => {
                      setOrderFilter("approved");
                      setOrdersPage(1);
                    }}
                  >
                    Approved ({approvedOrdersCount})
                  </button>
                  <button
                    type="button"
                    className={`admin-tab-btn ${orderFilter === "all" ? "active" : ""}`}
                    onClick={() => {
                      setOrderFilter("all");
                      setOrdersPage(1);
                    }}
                  >
                    All ({orders.length})
                  </button>
                  <button
                    type="button"
                    className={`admin-tab-btn ${orderFilter === "rejected" ? "active" : ""}`}
                    onClick={() => {
                      setOrderFilter("rejected");
                      setOrdersPage(1);
                    }}
                  >
                    Rejected
                  </button>
                </div>

                <div className="admin-search-wrapper">
                  <div className="admin-search-icon">
                    <IconSearch size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search Reference, Order ID, User..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setOrdersPage(1);
                      setLicensesPage(1);
                    }}
                    className="admin-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setOrdersPage(1);
                        setLicensesPage(1);
                      }}
                      className="admin-search-clear-btn"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Orders Table */}
              <div className="admin-card-table">
                {filteredOrders.length === 0 ? (
                  <div className="admin-table-empty">
                    <p className="admin-table-empty-title">
                      No orders found
                    </p>
                    <span style={{ fontSize: 13 }}>
                      {searchQuery
                        ? `No transactions match "${searchQuery}"`
                        : `No transactions currently categorized under "${orderFilter}".`}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="admin-table-container">
                      <table className="admin-custom-table">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Discord User</th>
                            <th>Tier & Price</th>
                            <th>GCash Reference #</th>
                            <th>Sender Name</th>
                            <th>Submitted</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedOrders.map((order) => (
                          <tr key={order.id}>
                            <td style={{ fontFamily: "monospace", fontSize: 12, color: "#8da0b8" }}>
                              {order.order_id}
                            </td>

                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div
                                  style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: "50%",
                                    background: "#5865f2",
                                    color: "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 800,
                                    fontSize: 11,
                                    flexShrink: 0,
                                  }}
                                >
                                  {order.discord_username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: "#f1f5f9" }}>
                                    {order.discord_username}
                                  </div>
                                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "#556882" }}>
                                    {order.discord_id}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className="admin-status-badge admin-status-badge-approved" style={{ marginBottom: 4 }}>
                                {order.tier}
                              </span>
                              <div style={{ fontWeight: 700, color: "#ffffff", fontSize: 13 }}>
                                {order.price}
                              </div>
                              {order.referred_by && (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 11, color: "#ec4899", background: "rgba(236, 72, 153, 0.12)", border: "1px solid rgba(236, 72, 153, 0.3)", borderRadius: 4, padding: "2px 6px", fontWeight: 600 }}>
                                  <span>🎁 Ref: @{order.referred_by}</span>
                                </div>
                              )}
                            </td>

                            <td>
                              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontFamily: "monospace", color: "#00d2ff", fontWeight: 700 }}>
                                    {order.reference_no}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(order.reference_no)}
                                    className="admin-btn-copy-inline"
                                  >
                                    {copiedKey === order.reference_no ? "Copied" : "Copy"}
                                  </button>
                                </div>
                                {order.receipt_url ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedReceiptOrder(order);
                                      setReceiptZoom(false);
                                    }}
                                    className="admin-btn-view-receipt"
                                    title="View GCash Payment Screenshot"
                                  >
                                    <IconReceipt size={12} />
                                    <span>View Slip</span>
                                  </button>
                                ) : (
                                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                    <span className="admin-no-receipt-label">No slip (Manual ref)</span>
                                    <label
                                      htmlFor={`admin-slip-upload-${order.order_id}`}
                                      className="admin-btn-copy-inline"
                                      style={{ cursor: "pointer", fontSize: 10, padding: "2px 6px", textDecoration: "none" }}
                                      title="Upload receipt screenshot received via Discord"
                                    >
                                      + Attach
                                      <input
                                        id={`admin-slip-upload-${order.order_id}`}
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            handleAdminAttachSlip(order.order_id, e.target.files[0]);
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                )}
                              </div>
                            </td>

                            <td style={{ color: order.sender_name ? "#f1f5f9" : "#556882" }}>
                              {order.sender_name || "—"}
                            </td>

                            <td style={{ fontSize: 12, color: "#70849e", whiteSpace: "nowrap" }}>
                              {new Date(order.created_at).toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>

                            <td>
                              <span className={`admin-status-badge admin-status-badge-${order.status}`}>
                                {order.status}
                              </span>
                            </td>

                            <td style={{ textAlign: "right" }}>
                              {order.status === "pending" && (
                                <div style={{ display: "inline-flex", gap: 6 }}>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveOrder(order)}
                                    disabled={actionLoading === order.id}
                                    className="admin-btn-approve"
                                  >
                                    {actionLoading === order.id ? "Issuing..." : "Approve & Issue"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectOrder(order)}
                                    disabled={actionLoading === order.id}
                                    className="admin-btn-reject"
                                    title="Reject Order"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}

                              {order.status === "approved" && (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "#ffffff" }}>
                                    {order.license_key}
                                  </span>
                                  {order.license_key && (
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(order.license_key!)}
                                      className="admin-btn-copy-inline"
                                    >
                                      {copiedKey === order.license_key ? "Copied" : "Copy"}
                                    </button>
                                  )}
                                </div>
                              )}

                              {order.status === "rejected" && (
                                <span style={{ fontSize: 12, color: "#ef4444" }}>Declined</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationBar
                    currentPage={ordersPage}
                    totalItems={filteredOrders.length}
                    itemsPerPage={ordersPerPage}
                    onPageChange={setOrdersPage}
                    onItemsPerPageChange={(n) => {
                      setOrdersPerPage(n);
                      setOrdersPage(1);
                    }}
                    itemLabel="orders"
                  />
                </>
              )}
            </div>
            </>
          )}

          {/* ─── TAB 2: LICENSE VAULT & HWID MANAGER ─── */}
          {activeTab === "licenses" && (
            <>
              {/* Loader Version & Remote Kill-Switch Card */}
              <div
                style={{
                  background: "rgba(10, 16, 26, 0.75)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(0, 210, 255, 0.22)",
                  borderRadius: 14,
                  padding: "18px 22px",
                  marginBottom: 18,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: "rgba(0, 210, 255, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#00d2ff",
                        }}
                      >
                        <IconZap size={14} />
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "#00d2ff",
                          fontWeight: 700,
                        }}
                      >
                        Loader Version Control & Remote Kill-Switch
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          background: "rgba(0, 210, 255, 0.12)",
                          color: "#00d2ff",
                          padding: "3px 9px",
                          borderRadius: 6,
                          fontWeight: 700,
                          border: "1px solid rgba(0, 210, 255, 0.25)",
                        }}
                      >
                        v{enforcedVersion} Active
                      </span>
                      {minLoaderVersion.trim() !== enforcedVersion && (
                        <span
                          style={{
                            fontSize: 11,
                            background: "rgba(245, 158, 11, 0.15)",
                            color: "#f59e0b",
                            padding: "3px 9px",
                            borderRadius: 6,
                            fontWeight: 700,
                            border: "1px solid rgba(245, 158, 11, 0.3)",
                          }}
                        >
                          ● Unsaved (Click Save)
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.6)",
                        margin: "4px 0 0 0",
                      }}
                    >
                      Loaders below this version are blocked on launch and prompted to download the latest update.
                    </p>
                  </div>

                  {versionStatusMsg && (
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#10b981",
                        background: "rgba(16, 185, 129, 0.12)",
                        padding: "5px 12px",
                        borderRadius: 6,
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      ✓ {versionStatusMsg}
                    </div>
                  )}
                </div>

                <div className="admin-version-grid">
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <label
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "rgba(255, 255, 255, 0.55)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Minimum Version
                    </label>
                    <input
                      type="text"
                      value={minLoaderVersion}
                      onChange={(e) => setMinLoaderVersion(e.target.value)}
                      placeholder="e.g. 1.0.6"
                      style={{
                        background: "rgba(0, 0, 0, 0.45)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: 8,
                        padding: "8px 12px",
                        height: 38,
                        color: "#ffffff",
                        fontSize: 13,
                        fontWeight: 700,
                        outline: "none",
                        fontFamily: "monospace",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <label
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "rgba(255, 255, 255, 0.55)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Update Download Page URL
                    </label>
                    <input
                      type="text"
                      value={downloadPageUrl}
                      onChange={(e) => setDownloadPageUrl(e.target.value)}
                      placeholder="https://chameleon-cheats.vercel.app/profile"
                      style={{
                        background: "rgba(0, 0, 0, 0.45)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        borderRadius: 8,
                        padding: "8px 12px",
                        height: 38,
                        color: "#ffffff",
                        fontSize: 12.5,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleSaveLoaderVersion}
                      disabled={isSavingVersion}
                      style={{
                        background: "linear-gradient(135deg, #00d2ff 0%, #0077ff 100%)",
                        color: "#000000",
                        fontWeight: 700,
                        fontSize: 12.5,
                        border: "none",
                        borderRadius: 8,
                        padding: "0 18px",
                        height: 38,
                        cursor: isSavingVersion ? "wait" : "pointer",
                        opacity: isSavingVersion ? 0.7 : 1,
                        boxShadow: "0 4px 14px rgba(0, 210, 255, 0.25)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        whiteSpace: "nowrap",
                        boxSizing: "border-box",
                      }}
                    >
                      <span>{isSavingVersion ? "Saving..." : "Save & Enforce Version"}</span>
                      <IconArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-toolbar">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#ffffff" }}>
                    Total Active Keys: {licenses.length}
                  </h3>
                  <button
                    type="button"
                    onClick={handleSyncUserListToDiscord}
                    disabled={isSyncingUsers || syncCooldown > 0}
                    className="admin-btn-discord-sync"
                    style={syncCooldown > 0 ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
                  >
                    <IconDiscord size={15} />
                    <span>
                      {isSyncingUsers
                        ? "Broadcasting..."
                        : syncCooldown > 0
                          ? `Cooldown (${syncCooldown}s)`
                          : "Sync User List to Discord"}
                    </span>
                  </button>
                  {syncStatusMsg && (
                    <span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>
                      ✓ {syncStatusMsg}
                    </span>
                  )}
                </div>

                <div className="admin-search-wrapper">
                  <div className="admin-search-icon">
                    <IconSearch size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search License Key, Discord User, HWID..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setLicensesPage(1);
                      setOrdersPage(1);
                    }}
                    className="admin-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setLicensesPage(1);
                        setOrdersPage(1);
                      }}
                      className="admin-search-clear-btn"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="admin-card-table">
                {filteredLicenses.length === 0 ? (
                  <div className="admin-table-empty">
                    <p className="admin-table-empty-title">
                      No licenses found
                    </p>
                    <span style={{ fontSize: 13 }}>
                      {searchQuery
                        ? `No licenses match "${searchQuery}"`
                        : "No license keys found in database."}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="admin-table-container">
                      <table className="admin-custom-table">
                        <thead>
                          <tr>
                            <th>License Key</th>
                            <th>Bound Discord User</th>
                            <th>Tier</th>
                            <th>Hardware ID (HWID)</th>
                            <th>Expires</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedLicenses.map((lic) => (
                            <tr key={lic.id}>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#00d2ff" }}>
                                    {lic.license_key}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(lic.license_key)}
                                    className="admin-btn-copy-inline"
                                  >
                                    {copiedKey === lic.license_key ? "Copied" : "Copy"}
                                  </button>
                                </div>
                              </td>

                              <td>
                                <span style={{ color: "#ffffff", fontWeight: 600 }}>
                                  {lic.discord_username || "Unassigned"}
                                </span>
                                {lic.discord_id && (
                                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "#556882" }}>
                                    {lic.discord_id}
                                  </div>
                                )}
                              </td>

                              <td>
                                <div style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 600 }}>
                                  {lic.tier || "Standard Pass"}
                                </div>
                                {lic.tier && (lic.tier.includes("Vouch") || lic.tier.includes("Bonus")) && (
                                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 3, fontSize: 10.5, color: "#34d399", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 4, padding: "1px 6px", fontWeight: 700 }}>
                                    <span>🎁 Vouch Bonus Active</span>
                                  </div>
                                )}
                              </td>

                              <td>
                                {lic.hwid ? (
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <IconHardware size={14} />
                                    <span style={{ fontFamily: "monospace", fontSize: 12, color: "#f59e0b" }}>
                                      {lic.hwid.substring(0, 12)}...
                                    </span>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: 12, color: "#10b981" }}>Unbound (Any PC)</span>
                                )}
                              </td>

                              <td>
                                {lic.expires_at ? (
                                  <div>
                                    <div style={{ fontSize: 12, color: "#ffffff", fontWeight: 600, fontFamily: "monospace" }}>
                                      {new Date(lic.expires_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}{" "}
                                      <span style={{ color: "#70849e", fontSize: 11 }}>
                                        {new Date(lic.expires_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: 10.5, color: new Date(lic.expires_at).getTime() > Date.now() ? "#10b981" : "#ef4444", marginTop: 2, fontWeight: 700 }}>
                                      {new Date(lic.expires_at).getTime() > Date.now()
                                        ? `● ${Math.max(1, Math.ceil((new Date(lic.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining`
                                        : "● Expired"}
                                    </div>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: 12, color: "#00d2ff", fontWeight: 700 }}>Permanent VIP</span>
                                )}
                              </td>

                              <td>
                                <span className={`admin-status-badge ${lic.is_banned ? "admin-status-badge-rejected" : "admin-status-badge-approved"}`}>
                                  {lic.is_banned ? "BANNED" : "ACTIVE"}
                                </span>
                              </td>

                              <td style={{ textAlign: "right" }}>
                                <div className="admin-actions-cell">
                                  {lic.expires_at !== null && (
                                    <button
                                      type="button"
                                      onClick={() => handleExtendDays(lic, 1)}
                                      disabled={actionLoading === lic.id}
                                      className="admin-btn-extend-day"
                                      title="Add +1 Extra Day for Discord Vouch"
                                    >
                                      {actionLoading === lic.id ? "Adding..." : "+1 Day"}
                                    </button>
                                  )}
                                  {lic.hwid && (
                                    <button
                                      type="button"
                                      onClick={() => handleResetHWID(lic.id)}
                                      className="admin-btn-hwid-reset"
                                      title="Unbind HWID"
                                    >
                                      Reset HWID
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleBan(lic.id)}
                                    className={`admin-btn-ban-toggle ${lic.is_banned ? "unban" : "ban"}`}
                                  >
                                    {lic.is_banned ? "Unban" : "Ban Key"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <PaginationBar
                      currentPage={licensesPage}
                      totalItems={filteredLicenses.length}
                      itemsPerPage={licensesPerPage}
                      onPageChange={setLicensesPage}
                      onItemsPerPageChange={(n) => {
                        setLicensesPerPage(n);
                        setLicensesPage(1);
                      }}
                      itemLabel="licenses"
                    />
                  </>
                )}
              </div>
            </>
          )}

          {/* ─── TAB 3: INSTANT KEY MINTING ─── */}
          {activeTab === "generator" && (
            <div className="admin-mint-wrapper">
              <div className="admin-mint-card">
                <div className="admin-mint-header">
                  <div className="admin-mint-icon">
                    <IconKeyMint size={20} />
                  </div>
                  <div>
                    <h2 className="admin-mint-title">
                      Mint VIP Access Key
                    </h2>
                    <span className="admin-mint-sub">
                      Issue manual loader license key for customer or giveaway
                    </span>
                  </div>
                </div>

                <form onSubmit={handleMintKey}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Tier Duration
                    </label>
                    <select
                      value={genTier}
                      onChange={(e) => setGenTier(e.target.value)}
                      className="admin-form-select"
                    >
                      <option value="1 Day Pass">1 Day Pass (24 Hours Promo / Vouch)</option>
                      <option value="3 Days Pass">3 Days Pass (₱150)</option>
                      <option value="7 Days Pass">7 Days Pass (₱300)</option>
                      <option value="15 Days Pass">15 Days Pass (₱550)</option>
                      <option value="1 Month Pass">1 Month Pass (₱850)</option>
                      <option value="Lifetime VIP">Lifetime VIP (₱1,000)</option>
                    </select>
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 20 }}>
                    <label className="admin-form-label">
                      Recipient / Discord Handle (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. somaris1 or Staff Issue"
                      value={genUser}
                      onChange={(e) => setGenUser(e.target.value)}
                      className="admin-form-input"
                    />
                  </div>

                  {mintedKey && (
                    <div className="admin-mint-result">
                      <div>
                        <span className="admin-mint-key-label">
                          Generated Key:
                        </span>
                        <div className="admin-mint-key-val">
                          {mintedKey}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(mintedKey)}
                        className="admin-btn-approve"
                      >
                        {copiedKey === mintedKey ? "Copied!" : "Copy Key"}
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isMinting}
                    className="admin-btn-mint-submit"
                  >
                    {isMinting ? "Minting Key..." : "Mint License Key"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ─── TAB 4: ANALYTICS OVERVIEW ─── */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                  <span className="admin-kpi-title">Gross Revenue</span>
                  <div className="admin-kpi-value" style={{ color: "#10b981", marginTop: 6 }}>
                    ₱{totalRevenue.toLocaleString()}
                  </div>
                  <span className="admin-kpi-sub">Total approved orders</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-title">Active Licenses</span>
                  <div className="admin-kpi-value" style={{ color: "#00d2ff", marginTop: 6 }}>
                    {licenses.filter((l) => !l.is_banned).length}
                  </div>
                  <span className="admin-kpi-sub">Valid keys in circulation</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-title">Pending Backlog</span>
                  <div className="admin-kpi-value" style={{ color: "#f59e0b", marginTop: 6 }}>
                    {pendingOrdersCount}
                  </div>
                  <span className="admin-kpi-sub">Awaiting confirmation</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-title">Bound Hardware Locks</span>
                  <div className="admin-kpi-value" style={{ marginTop: 6 }}>
                    {licenses.filter((l) => l.hwid).length}
                  </div>
                  <span className="admin-kpi-sub">Locked to single PC</span>
                </div>
              </div>

              {/* Security Health Box */}
              <div className="admin-architecture-card">
                <h3 className="admin-architecture-title">
                  System Architecture & Enclave Status
                </h3>
                <div className="admin-arch-grid">
                  <div className="admin-arch-item">
                    <div className="admin-arch-item-title">Session Persistence</div>
                    <div className="admin-arch-item-val" style={{ color: "#10b981" }}>
                      HTTP-Only Secure Cookie
                    </div>
                    <span className="admin-arch-item-sub">Zero frontend storage footprint</span>
                  </div>

                  <div className="admin-arch-item">
                    <div className="admin-arch-item-title">Anti-Cheat Driver</div>
                    <div className="admin-arch-item-val" style={{ color: "#00d2ff" }}>
                      Kernel Virtualization v4.2
                    </div>
                    <span className="admin-arch-item-sub">100% Undetected (Patch 2026.10)</span>
                  </div>

                  <div className="admin-arch-item">
                    <div className="admin-arch-item-title">Security Gateway</div>
                    <div className="admin-arch-item-val" style={{ color: "#f59e0b" }}>
                      Active Rate Limiter (5 Max)
                    </div>
                    <span className="admin-arch-item-sub">15-minute brute-force lockout</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 5: BROADCAST & NOTIFICATIONS (CHAMELEON CHEATS) ─── */}
          {activeTab === "notifications" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Header */}
              <div className="admin-view-header">
                <div>
                  <h1 className="admin-view-title">Broadcast &amp; Notifications</h1>
                  <span className="admin-view-sub">
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
                  <div className="admin-card-head">
                    <h3 className="admin-card-title">Compose Official Message</h3>
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
                        className="admin-tab-btn"
                        style={{ padding: "6px 10px", fontSize: 11 }}
                      >
                        Join Discord Reminder
                      </button>
                      <button
                        type="button"
                        onClick={() => applyNotifPreset("build_update")}
                        className="admin-tab-btn"
                        style={{ padding: "6px 10px", fontSize: 11 }}
                      >
                        Loader v4.2 Update (Global)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyNotifPreset("maintenance")}
                        className="admin-tab-btn"
                        style={{ padding: "6px 10px", fontSize: 11 }}
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
                          ? "Every visitor and registered Discord account (including Free Members like @somaris1) will see this announcement."
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
                        <label className="admin-form-label">Action Button Label</label>
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
                <div className="admin-card-head">
                  <h3 className="admin-card-title">Active Dispatched Notifications ({adminNotifs.length})</h3>
                  <button
                    type="button"
                    onClick={fetchAdminNotifications}
                    className="admin-refresh-btn"
                  >
                    <IconRefresh size={13} />
                    <span>Refresh List</span>
                  </button>
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
                                Target: {item.target}
                              </span>
                              <span style={{ fontSize: 10, color: "#64748b" }}>
                                {new Date(item.createdAt).toLocaleString()}
                              </span>
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
          )}
        </div>
      </div>

      {/* ─── ADMIN RECEIPT INSPECTION LIGHTBOX MODAL ─── */}
      {selectedReceiptOrder && selectedReceiptOrder.receipt_url && (
        <div
          className="admin-receipt-lightbox-overlay"
          onClick={() => setSelectedReceiptOrder(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="admin-receipt-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="admin-receipt-lightbox-header">
              <div className="admin-receipt-lightbox-header-left">
                <IconReceipt size={16} />
                <h3 className="admin-receipt-lightbox-title">GCash Payment Verification Slip</h3>
                <span className="admin-receipt-id-pill">
                  {selectedReceiptOrder.order_id}
                </span>
                <span className={`admin-status-badge admin-status-badge-${selectedReceiptOrder.status}`}>
                  {selectedReceiptOrder.status}
                </span>
              </div>
              <button
                type="button"
                className="admin-receipt-lightbox-close"
                onClick={() => setSelectedReceiptOrder(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Lightbox Body */}
            <div className="admin-receipt-lightbox-body">
              {/* Image Viewport */}
              <div className="admin-receipt-viewport-container">
                <div className="admin-receipt-viewport-toolbar">
                  <span>Customer Transaction Screenshot</span>
                  <div className="admin-receipt-toolbar-actions">
                    <button
                      type="button"
                      className="admin-receipt-toolbar-btn"
                      onClick={() => setReceiptZoom(!receiptZoom)}
                    >
                      {receiptZoom ? <IconZoomOut size={12} /> : <IconZoomIn size={12} />}
                      <span>{receiptZoom ? "Fit View" : "Zoom 100%"}</span>
                    </button>
                    <a
                      href={selectedReceiptOrder.receipt_url?.startsWith("data:image/")
                        ? `/api/order/receipt-image?order_id=${selectedReceiptOrder.order_id}`
                        : selectedReceiptOrder.receipt_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-receipt-toolbar-btn"
                      style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                    >
                      <IconExternalLink size={12} />
                      <span>Open Original</span>
                    </a>
                  </div>
                </div>

                <div
                  className="admin-receipt-image-stage"
                  onClick={() => setReceiptZoom(!receiptZoom)}
                  title="Click to toggle zoom"
                >
                  <img
                    src={selectedReceiptOrder.receipt_url || `/api/order/receipt-image?order_id=${selectedReceiptOrder.order_id}`}
                    alt={`GCash Slip ${selectedReceiptOrder.order_id}`}
                    className={receiptZoom ? "zoomed" : ""}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      const fallback = `/api/order/receipt-image?order_id=${selectedReceiptOrder.order_id}`;
                      if (!img.src.includes(fallback)) {
                        img.src = fallback;
                      }
                    }}
                  />
                </div>
              </div>

              {/* Sidebar Details & Quick Actions */}
              <div className="admin-receipt-sidebar">
                <div className="admin-receipt-details-list">
                  <div className="admin-receipt-detail-item">
                    <span className="admin-receipt-detail-label">Product Plan</span>
                    <span className="admin-receipt-detail-value" style={{ color: "#00d2ff" }}>
                      {selectedReceiptOrder.tier}
                    </span>
                  </div>

                  {selectedReceiptOrder.referred_by && (
                    <div className="admin-receipt-detail-item" style={{ background: "rgba(236, 72, 153, 0.08)", padding: "10px", borderRadius: 6, border: "1px solid rgba(236, 72, 153, 0.25)" }}>
                      <span className="admin-receipt-detail-label" style={{ color: "#f472b6" }}>🎁 Clanmate Referral</span>
                      <div style={{ marginTop: 3, fontSize: 13, color: "#ffffff", fontWeight: 600 }}>
                        Referred by: @{selectedReceiptOrder.referred_by}
                      </div>
                      <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 2 }}>
                        Perk: Buyer gets +1 Bonus Day. Referrer earns +3 Days if active VIP, or +1 Day if non-VIP / unbought (on 3+ day purchase).
                      </div>
                    </div>
                  )}

                  <div className="admin-receipt-detail-item">
                    <span className="admin-receipt-detail-label">Amount Due / Sent</span>
                    <span className="admin-receipt-detail-value" style={{ color: "#ffffff", fontSize: 16 }}>
                      {selectedReceiptOrder.price}
                    </span>
                  </div>

                  <div className="admin-receipt-detail-item">
                    <span className="admin-receipt-detail-label">GCash Reference No</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 14, color: "#38bdf8", fontWeight: 700 }}>
                        {selectedReceiptOrder.reference_no}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedReceiptOrder.reference_no)}
                        className="admin-btn-copy-inline"
                      >
                        {copiedKey === selectedReceiptOrder.reference_no ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="admin-receipt-detail-item">
                    <span className="admin-receipt-detail-label">Sender Name</span>
                    <span className="admin-receipt-detail-value" style={{ color: selectedReceiptOrder.sender_name ? "#f1f5f9" : "#64748b" }}>
                      {selectedReceiptOrder.sender_name || "Not specified"}
                    </span>
                  </div>

                  <div className="admin-receipt-detail-item">
                    <span className="admin-receipt-detail-label">Customer Discord</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                      <span style={{ fontWeight: 700, color: "#f1f5f9" }}>
                        @{selectedReceiptOrder.discord_username}
                      </span>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#556882" }}>
                        ({selectedReceiptOrder.discord_id})
                      </span>
                    </div>
                  </div>

                  <div className="admin-receipt-detail-item">
                    <span className="admin-receipt-detail-label">Submitted At</span>
                    <span className="admin-receipt-detail-value" style={{ fontSize: 12, color: "#94a3b8" }}>
                      {new Date(selectedReceiptOrder.created_at).toLocaleString()}
                    </span>
                  </div>

                  {selectedReceiptOrder.license_key && (
                    <div className="admin-receipt-detail-item" style={{ background: "rgba(16, 185, 129, 0.08)", padding: "10px", borderRadius: 6, border: "1px solid #065f46" }}>
                      <span className="admin-receipt-detail-label" style={{ color: "#34d399" }}>Issued License Key</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 13, color: "#ffffff", fontWeight: 700 }}>
                          {selectedReceiptOrder.license_key}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedReceiptOrder.license_key!)}
                          className="admin-btn-copy-inline"
                        >
                          {copiedKey === selectedReceiptOrder.license_key ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Quick Actions */}
                <div className="admin-receipt-actions-footer">
                  {selectedReceiptOrder.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApproveOrder(selectedReceiptOrder)}
                        disabled={actionLoading === selectedReceiptOrder.id}
                        className="admin-btn-lightbox-approve"
                      >
                        <IconCheck size={14} />
                        <span>{actionLoading === selectedReceiptOrder.id ? "Issuing Key..." : "Approve & Issue Key"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectOrder(selectedReceiptOrder)}
                        disabled={actionLoading === selectedReceiptOrder.id}
                        className="admin-btn-lightbox-reject"
                      >
                        <span>✕ Reject Order</span>
                      </button>
                    </>
                  )}
                  {selectedReceiptOrder.status !== "pending" && (
                    <button
                      type="button"
                      onClick={() => setSelectedReceiptOrder(null)}
                      className="admin-btn-mint-secondary"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      Close Window (Esc)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
