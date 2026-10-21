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
  const [activeTab, setActiveTab] = useState<"orders" | "licenses" | "generator" | "overview">("orders");

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

  const handleSyncUserListToDiscord = async () => {
    setIsSyncingUsers(true);
    setSyncStatusMsg(null);
    try {
      const res = await fetch("/api/admin/licenses/sync-discord", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncStatusMsg(data.message || "User list synced to Discord!");
        setTimeout(() => setSyncStatusMsg(null), 5000);
      } else {
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
      .catch(() => {});

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
            <Link href="/" className="admin-return-link">
              ← Return to Storefront
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
                    onClick={() => setOrderFilter("pending")}
                  >
                    Pending ({pendingOrdersCount})
                  </button>
                  <button
                    type="button"
                    className={`admin-tab-btn ${orderFilter === "approved" ? "active" : ""}`}
                    onClick={() => setOrderFilter("approved")}
                  >
                    Approved ({approvedOrdersCount})
                  </button>
                  <button
                    type="button"
                    className={`admin-tab-btn ${orderFilter === "all" ? "active" : ""}`}
                    onClick={() => setOrderFilter("all")}
                  >
                    All ({orders.length})
                  </button>
                  <button
                    type="button"
                    className={`admin-tab-btn ${orderFilter === "rejected" ? "active" : ""}`}
                    onClick={() => setOrderFilter("rejected")}
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
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
                        {filteredOrders.map((order) => (
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
                )}
              </div>
            </>
          )}

          {/* ─── TAB 2: LICENSE VAULT & HWID MANAGER ─── */}
          {activeTab === "licenses" && (
            <>
              <div className="admin-toolbar">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#ffffff" }}>
                    Total Active Keys: {licenses.length}
                  </h3>
                  <button
                    type="button"
                    onClick={handleSyncUserListToDiscord}
                    disabled={isSyncingUsers}
                    className="admin-btn-discord-sync"
                  >
                    <IconDiscord size={15} />
                    <span>{isSyncingUsers ? "Broadcasting..." : "Sync User List to Discord"}</span>
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
                </div>
              </div>

              <div className="admin-card-table">
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
                      {filteredLicenses.map((lic) => (
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
                            <div style={{ display: "inline-flex", gap: 6 }}>
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
                    >
                      <IconExternalLink size={12} />
                      <span>Open Original ↗</span>
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
