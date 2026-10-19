"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
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
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setIsAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => {
        if (isMounted) setIsAuthenticated(false);
      });

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
        fetchLicenses();
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
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
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
     1. INITIAL LOADING SPLASH
     ───────────────────────────────────────────────────────────── */
  /* ─────────────────────────────────────────────────────────────
     1. INITIAL LOADING SPLASH
     ───────────────────────────────────────────────────────────── */
  if (isAuthenticated === null) {
    return (
      <div className="admin-login-fullscreen">
        <div className="admin-bg-grid" />
        <div className="admin-bg-orb admin-bg-orb-cyan" />
        <div className="admin-bg-orb admin-bg-orb-emerald" />
        <div className="admin-loading-container">
          <div className="admin-loading-emblem">
            <IconShieldLock size={32} />
          </div>
          <div className="admin-loading-spinner-ring" />
          <p className="admin-loading-text">INITIALIZING SECURE ENCLAVE...</p>
          <span className="admin-loading-sub">Zero-Knowledge Cryptographic Authentication</span>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     2. STANDALONE RESTRICTED ACCESS GATE (No Customer Navbar/Footer)
     ───────────────────────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="admin-login-fullscreen">
        {/* Ambient Atmosphere */}
        <div className="admin-bg-grid" />
        <div className="admin-bg-scanlines" />
        <div className="admin-bg-orb admin-bg-orb-cyan" />
        <div className="admin-bg-orb admin-bg-orb-emerald" />

        <div className="admin-login-wrapper">
          {/* Top Status Telemetry Pill */}
          <div className="admin-login-top-badge">
            <span className="admin-status-pulse" />
            <span className="admin-status-text">SECURE ENCLAVE NODE &bull; RESTRICTED ENVIRONMENT</span>
          </div>

          <div className="admin-login-box">
            {/* Tactical Corner Crosshairs */}
            <span className="card-corner corner-tl" />
            <span className="card-corner corner-tr" />
            <span className="card-corner corner-bl" />
            <span className="card-corner corner-br" />

            {/* Emblem with Rotating Holographic Ring */}
            <div className="admin-emblem-wrapper">
              <div className="admin-emblem-ring" />
              <div className="admin-login-emblem">
                <IconShieldLock size={30} />
              </div>
            </div>

            <div className="admin-chip-badge">LEVEL 5 ACCESS GATEWAY</div>

            <h2 className="admin-login-title">COMMAND CENTER</h2>
            <p className="admin-login-desc">
              Restricted Administrative Enclave &bull; Chameleon Cheats Staff Only
            </p>

            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="admin-input-group">
                <label className="admin-input-label">MASTER SECURITY KEY</label>
                <div className="admin-input-container">
                  <div className="admin-input-lead-icon">
                    <IconKey size={18} />
                  </div>
                  <input
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
                    {showPin ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="admin-login-error">
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
                    <span>Verifying Cryptographic Credentials...</span>
                  </span>
                ) : (
                  <span className="admin-btn-content">
                    <IconShieldLock size={17} />
                    <span>Authenticate & Unlock</span>
                    <IconArrowRight size={16} />
                  </span>
                )}
              </button>

              {/* Security Specs Checklist */}
              <div className="admin-login-specs">
                <div className="spec-item">
                  <IconCheck size={12} />
                  <span>HTTP-Only Cookie</span>
                </div>
                <div className="spec-dot" />
                <div className="spec-item">
                  <IconCheck size={12} />
                  <span>Zero Local Storage</span>
                </div>
                <div className="spec-dot" />
                <div className="spec-item">
                  <IconCheck size={12} />
                  <span>Hardware Bound</span>
                </div>
              </div>

              {/* Navigation Back */}
              <div className="admin-login-foot-links">
                <Link href="/" className="admin-return-link">
                  <span>&larr;</span> Return to Storefront
                </Link>
                <span className="admin-version-tag">CHAM-OS v4.2.0</span>
              </div>
            </form>
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
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 12,
              color: "#94a3b8",
              textDecoration: "none",
              background: "rgba(255, 255, 255, 0.02)",
            }}
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
              <span style={{ color: "#ffffff", fontWeight: 700 }}>
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
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#94a3b8",
                padding: "7px 12px",
                borderRadius: 8,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              <IconRefresh size={13} />
              <span>{loading ? "Syncing..." : "Sync DB"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("generator")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "linear-gradient(135deg, #00d2ff, #00b4d8)",
                color: "#020610",
                border: "none",
                padding: "7px 14px",
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: "pointer",
              }}
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
                    <div className="admin-kpi-icon" style={{ color: "#f59e0b" }}>
                      <IconOrders size={16} />
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
                    <div className="admin-kpi-icon" style={{ color: "#10b981" }}>
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
                    <div className="admin-kpi-icon" style={{ color: "#00d2ff" }}>
                      <IconCheck size={16} />
                    </div>
                  </div>
                  <div className="admin-kpi-value">{approvedOrdersCount}</div>
                  <span className="admin-kpi-sub">Discord-linked deliveries</span>
                </div>

                <div className="admin-kpi-card">
                  <div className="admin-kpi-header">
                    <span className="admin-kpi-title">Total Submissions</span>
                    <div className="admin-kpi-icon">
                      <IconOverview size={16} />
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
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc", marginBottom: 6 }}>
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
                            <td style={{ fontFamily: "monospace", fontSize: 12.5, color: "#94a3b8" }}>
                              {order.order_id}
                            </td>

                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div
                                  style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    background: "#5865f2",
                                    color: "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 800,
                                    fontSize: 12,
                                  }}
                                >
                                  {order.discord_username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                                    {order.discord_username}
                                  </div>
                                  <div style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>
                                    {order.discord_id}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span
                                style={{
                                  background: order.tier?.includes("Lifetime")
                                    ? "rgba(16, 185, 129, 0.15)"
                                    : "rgba(0, 210, 255, 0.12)",
                                  color: order.tier?.includes("Lifetime") ? "#10b981" : "#00d2ff",
                                  padding: "3px 8px",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  display: "inline-block",
                                  marginBottom: 4,
                                }}
                              >
                                {order.tier}
                              </span>
                              <div style={{ fontWeight: 800, color: "#ffffff", fontSize: 13 }}>
                                {order.price}
                              </div>
                            </td>

                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontFamily: "monospace", color: "#00d2ff", fontWeight: 700 }}>
                                  {order.reference_no}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(order.reference_no)}
                                  style={{
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    color: copiedKey === order.reference_no ? "#10b981" : "#94a3b8",
                                    padding: "3px 8px",
                                    borderRadius: 6,
                                    fontSize: 11,
                                    cursor: "pointer",
                                  }}
                                >
                                  {copiedKey === order.reference_no ? "Copied" : "Copy"}
                                </button>
                              </div>
                            </td>

                            <td style={{ color: order.sender_name ? "#f1f5f9" : "#64748b" }}>
                              {order.sender_name || "—"}
                            </td>

                            <td style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
                              {new Date(order.created_at).toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>

                            <td>
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: 999,
                                  fontSize: 11,
                                  fontWeight: 800,
                                  letterSpacing: "0.05em",
                                  textTransform: "uppercase",
                                  background:
                                    order.status === "approved"
                                      ? "rgba(16, 185, 129, 0.15)"
                                      : order.status === "pending"
                                      ? "rgba(245, 158, 11, 0.15)"
                                      : "rgba(239, 68, 68, 0.15)",
                                  color:
                                    order.status === "approved"
                                      ? "#10b981"
                                      : order.status === "pending"
                                      ? "#f59e0b"
                                      : "#ef4444",
                                  border: `1px solid ${
                                    order.status === "approved"
                                      ? "rgba(16, 185, 129, 0.3)"
                                      : order.status === "pending"
                                      ? "rgba(245, 158, 11, 0.3)"
                                      : "rgba(239, 68, 68, 0.3)"
                                  }`,
                                }}
                              >
                                {order.status}
                              </span>
                            </td>

                            <td style={{ textAlign: "right" }}>
                              {order.status === "pending" && (
                                <div style={{ display: "inline-flex", gap: 8 }}>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveOrder(order)}
                                    disabled={actionLoading === order.id}
                                    style={{
                                      background: "#10b981",
                                      color: "#020610",
                                      border: "none",
                                      padding: "6px 14px",
                                      borderRadius: 6,
                                      fontWeight: 800,
                                      fontSize: 12,
                                      cursor: "pointer",
                                    }}
                                  >
                                    {actionLoading === order.id ? "Issuing..." : "Approve & Issue"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectOrder(order)}
                                    disabled={actionLoading === order.id}
                                    style={{
                                      background: "rgba(239, 68, 68, 0.15)",
                                      border: "1px solid rgba(239, 68, 68, 0.3)",
                                      color: "#fca5a5",
                                      padding: "6px 10px",
                                      borderRadius: 6,
                                      fontSize: 12,
                                      cursor: "pointer",
                                    }}
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
                                      style={{
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        color: copiedKey === order.license_key ? "#10b981" : "#94a3b8",
                                        padding: "3px 8px",
                                        borderRadius: 6,
                                        fontSize: 11,
                                        cursor: "pointer",
                                      }}
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
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: "#ffffff" }}>
                    Total Active Keys: {licenses.length}
                  </h3>
                  <button
                    type="button"
                    onClick={handleSyncUserListToDiscord}
                    disabled={isSyncingUsers}
                    style={{
                      background: "rgba(99, 102, 241, 0.15)",
                      border: "1px solid rgba(99, 102, 241, 0.35)",
                      color: "#a5b4fc",
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      cursor: isSyncingUsers ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                    }}
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
                              <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#00d2ff" }}>
                                {lic.license_key}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(lic.license_key)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: copiedKey === lic.license_key ? "#10b981" : "#64748b",
                                  cursor: "pointer",
                                }}
                              >
                                {copiedKey === lic.license_key ? <IconCheck size={14} /> : <IconCopy size={14} />}
                              </button>
                            </div>
                          </td>

                          <td>
                            <span style={{ color: "#ffffff", fontWeight: 600 }}>
                              {lic.discord_username || "Unassigned"}
                            </span>
                            {lic.discord_id && (
                              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#64748b" }}>
                                {lic.discord_id}
                              </div>
                            )}
                          </td>

                          <td>
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>{lic.tier || "Standard Pass"}</span>
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

                          <td style={{ fontSize: 12, color: "#94a3b8" }}>
                            {lic.expires_at ? new Date(lic.expires_at).toLocaleDateString() : "Permanent VIP"}
                          </td>

                          <td>
                            <span
                              style={{
                                padding: "3px 8px",
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 800,
                                background: lic.is_banned ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.15)",
                                color: lic.is_banned ? "#ef4444" : "#10b981",
                              }}
                            >
                              {lic.is_banned ? "BANNED" : "ACTIVE"}
                            </span>
                          </td>

                          <td style={{ textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: 6 }}>
                              {lic.hwid && (
                                <button
                                  type="button"
                                  onClick={() => handleResetHWID(lic.id)}
                                  style={{
                                    background: "rgba(245, 158, 11, 0.15)",
                                    border: "1px solid rgba(245, 158, 11, 0.3)",
                                    color: "#f59e0b",
                                    padding: "4px 8px",
                                    borderRadius: 6,
                                    fontSize: 11,
                                    cursor: "pointer",
                                  }}
                                  title="Unbind HWID"
                                >
                                  Reset HWID
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleToggleBan(lic.id)}
                                style={{
                                  background: lic.is_banned ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                  border: `1px solid ${lic.is_banned ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                                  color: lic.is_banned ? "#10b981" : "#ef4444",
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  cursor: "pointer",
                                }}
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
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              <div
                style={{
                  background: "#070d1a",
                  border: "1px solid rgba(0, 210, 255, 0.25)",
                  borderRadius: 16,
                  padding: 32,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(0, 210, 255, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#00d2ff",
                    }}
                  >
                    <IconKeyMint size={22} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#ffffff" }}>
                      Mint Assault Fire PH VIP Key
                    </h2>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      Cryptographic loader activation license generator
                    </span>
                  </div>
                </div>

                <form onSubmit={handleMintKey}>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>
                      TIER DURATION
                    </label>
                    <select
                      value={genTier}
                      onChange={(e) => setGenTier(e.target.value)}
                      style={{
                        width: "100%",
                        background: "#03060d",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 8,
                        padding: "12px 14px",
                        color: "#ffffff",
                        fontSize: 14,
                        outline: "none",
                      }}
                    >
                      <option value="7 Days Pass">7 Days Pass (₱500 / $9.99)</option>
                      <option value="15 Days Pass">15 Days Pass (₱1,000 / $18.99)</option>
                      <option value="1 Month Pass">1 Month Pass (₱1,500 / $27.99)</option>
                      <option value="Lifetime VIP">Lifetime VIP (₱2,500 / $45.99)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>
                      RECIPIENT / DISCORD HANDLE (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. somaris1 or Giveaway Winner"
                      value={genUser}
                      onChange={(e) => setGenUser(e.target.value)}
                      style={{
                        width: "100%",
                        background: "#03060d",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 8,
                        padding: "12px 14px",
                        color: "#ffffff",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>

                  {mintedKey && (
                    <div
                      style={{
                        background: "rgba(16, 185, 129, 0.12)",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                        borderRadius: 12,
                        padding: 18,
                        marginBottom: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981", textTransform: "uppercase" }}>
                          Generated Key:
                        </span>
                        <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 900, color: "#ffffff", marginTop: 4 }}>
                          {mintedKey}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(mintedKey)}
                        style={{
                          background: "#10b981",
                          color: "#020610",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: 8,
                          fontWeight: 800,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        {copiedKey === mintedKey ? "Copied!" : "Copy Key"}
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isMinting}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "linear-gradient(135deg, #00d2ff, #00b4d8)",
                      color: "#020610",
                      border: "none",
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    {isMinting ? "Minting Cryptographic Key..." : "Mint License Key"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ─── TAB 4: ANALYTICS OVERVIEW ─── */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                  <span className="admin-kpi-title">Gross Revenue</span>
                  <div className="admin-kpi-value" style={{ color: "#10b981", marginTop: 8 }}>
                    ₱{totalRevenue.toLocaleString()}
                  </div>
                  <span className="admin-kpi-sub">Total approved orders</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-title">Active Licenses</span>
                  <div className="admin-kpi-value" style={{ color: "#00d2ff", marginTop: 8 }}>
                    {licenses.filter((l) => !l.is_banned).length}
                  </div>
                  <span className="admin-kpi-sub">Valid keys in circulation</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-title">Pending Backlog</span>
                  <div className="admin-kpi-value" style={{ color: "#f59e0b", marginTop: 8 }}>
                    {pendingOrdersCount}
                  </div>
                  <span className="admin-kpi-sub">Awaiting confirmation</span>
                </div>
                <div className="admin-kpi-card">
                  <span className="admin-kpi-title">Bound Hardware Locks</span>
                  <div className="admin-kpi-value" style={{ marginTop: 8 }}>
                    {licenses.filter((l) => l.hwid).length}
                  </div>
                  <span className="admin-kpi-sub">Locked to single PC</span>
                </div>
              </div>

              {/* Security Health Box */}
              <div
                style={{
                  background: "#070d19",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 14,
                  padding: 24,
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", marginBottom: 12 }}>
                  System Architecture & Enclave Status
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                  <div style={{ background: "#040812", padding: 16, borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>SESSION PERSISTENCE</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#10b981", marginTop: 4 }}>
                      HTTP-Only Secure Cookie
                    </div>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Zero frontend storage footprint</span>
                  </div>

                  <div style={{ background: "#040812", padding: 16, borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>ANTI-CHEAT DRIVER</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#00d2ff", marginTop: 4 }}>
                      Kernel Virtualization v4.2
                    </div>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>100% Undetected (Patch 2026.10)</span>
                  </div>

                  <div style={{ background: "#040812", padding: 16, borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>SECURITY GATEWAY</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", marginTop: 4 }}>
                      Active Rate Limiter (5 Max)
                    </div>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>15-minute brute-force lockout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
