import { useState, useEffect, useMemo, useCallback } from "react";
import { Order, License, AdminTab } from "./types";
import { supabase } from "@/lib/supabase";

export interface UseAdminReturn {
  // Tab state
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;

  // Auth state
  isAuthenticated: boolean;
  isVerifying: boolean;
  pin: string;
  setPin: (v: string) => void;
  showPin: boolean;
  setShowPin: (v: boolean) => void;
  errorMessage: string | null;
  setErrorMessage: (v: string | null) => void;

  // Data state
  orders: Order[];
  licenses: License[];
  loading: boolean;
  isRefreshingOrders: boolean;
  actionLoading: string | null;
  setActionLoading: (id: string | null) => void;

  // Notification state
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
  setNotifStatusMsg: (v: string | null) => void;
  notifInDatabase: boolean | null;
  notifDbError: string | null;
  copiedSql: boolean;
  setCopiedSql: (v: boolean) => void;

  // Key generator state
  genTier: string;
  setGenTier: (v: string) => void;
  genUser: string;
  setGenUser: (v: string) => void;
  isMinting: boolean;
  mintedKey: string | null;
  setMintedKey: (v: string | null) => void;

  // Sync state
  isSyncingUsers: boolean;
  syncStatusMsg: string | null;
  syncCooldown: number;
  setSyncCooldown: (v: number) => void;

  // Version control state
  minLoaderVersion: string;
  setMinLoaderVersion: (v: string) => void;
  downloadPageUrl: string;
  setDownloadPageUrl: (v: string) => void;
  isSavingVersion: boolean;
  versionStatusMsg: string | null;
  setVersionStatusMsg: (v: string | null) => void;

  // Receipt lightbox state
  selectedReceiptOrder: Order | null;
  setSelectedReceiptOrder: (o: Order | null) => void;
  receiptZoom: boolean;
  setReceiptZoom: (v: boolean) => void;

  // Copy state
  copiedKey: string | null;
  setCopiedKey: (v: string | null) => void;

  // Order filter state
  orderFilter: "all" | "pending" | "approved" | "rejected";
  setOrderFilter: (v: "all" | "pending" | "approved" | "rejected") => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;

  // Methods
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleApproveOrder: (order: Order) => Promise<void>;
  handleRejectOrder: (order: Order) => Promise<void>;
  handleSendNotification: (e: React.FormEvent) => Promise<void>;
  handleDeleteNotification: (id: string) => Promise<void>;
  handleSaveLoaderVersion: (e?: React.FormEvent, customVersion?: string) => Promise<void>;
  handleSyncUserListToDiscord: () => Promise<void>;
  handleMintKey: (e: React.FormEvent) => Promise<void>;
  handleResetHWID: (licenseId: string) => Promise<void>;
  handleToggleBan: (licenseId: string) => Promise<void>;
  handleExtendDays: (lic: License, days?: number) => Promise<void>;
  handleAdminAttachSlip: (orderId: string, file: File) => Promise<void>;
  handleCopy: (val: string) => void;

  // Computed
  filteredOrders: Order[];
  filteredLicenses: License[];
  pendingOrdersCount: number;
  approvedOrdersCount: number;
  totalRevenue: number;
  loadAllData: () => void;
  fetchAdminNotifications: () => Promise<void>;
  fetchOrders: (silent?: boolean) => Promise<void>;
  fetchLicenses: () => Promise<void>;
  fetchLoaderVersion: () => Promise<void>;
}

export default function useAdmin(): UseAdminReturn {
  // ── Tab state ──
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");

  // ── Auth state ──
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Data state ──
  const [orders, setOrders] = useState<Order[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ── Notification state ──
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

  // ── Key generator state ──
  const [genTier, setGenTier] = useState("1 Month Pass");
  const [genUser, setGenUser] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintedKey, setMintedKey] = useState<string | null>(null);

  // ── Discord sync state ──
  const [isSyncingUsers, setIsSyncingUsers] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [syncCooldown, setSyncCooldown] = useState<number>(0);

  // ── Version control state ──
  const [minLoaderVersion, setMinLoaderVersion] = useState("v1.0.9");
  const [downloadPageUrl, setDownloadPageUrl] = useState("https://www.chameleon-cheats.tech/profile");
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [versionStatusMsg, setVersionStatusMsg] = useState<string | null>(null);

  // ── Receipt lightbox state ──
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [receiptZoom, setReceiptZoom] = useState(false);

  // ── Copy feedback state ──
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ── Filter & Search state ──
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Data fetching ──
  const fetchAdminNotifications = useCallback(async () => {
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
  }, []);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) {
      setIsRefreshingOrders(true);
      setLoading(true);
    }
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
      if (!silent) {
        setIsRefreshingOrders(false);
        setLoading(false);
      }
    }
  }, []);

  const fetchLicenses = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/licenses");
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.licenses)) {
        setLicenses(data.licenses as License[]);
      }
    } catch (err) {
      console.error("Error fetching licenses:", err);
    }
  }, []);

  const fetchLoaderVersion = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/version");
      const data = await res.json();
      if (res.ok && data.success && data.minVersion) {
        setMinLoaderVersion(data.minVersion);
        if (data.downloadUrl) setDownloadPageUrl(data.downloadUrl);
      }
    } catch { }
  }, []);

  const loadAllData = useCallback(() => {
    fetchOrders(false);
    fetchLicenses();
    fetchAdminNotifications();
    fetchLoaderVersion();
  }, [fetchOrders, fetchLicenses, fetchAdminNotifications, fetchLoaderVersion]);

  // ── Auth ──
  const handleLogin = useCallback(async (e: React.FormEvent) => {
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
        setPin("");
        setErrorMessage(null);
      } else {
        setErrorMessage(data.error || "Authentication Denied: Invalid Security Pin");
      }
    } catch {
      setErrorMessage("Network error: Could not reach security gateway.");
    } finally {
      setIsVerifying(false);
    }
  }, [pin]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Continue client cleanup
    }
    setIsAuthenticated(false);
    setOrders([]);
    setLicenses([]);
    setPin("");
  }, []);

  // ── Order actions ──
  const handleApproveOrder = useCallback(async (order: Order) => {
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
            ? `Active VIP: +${rewardDays} Free VIP Day${rewardDays > 1 ? "s" : ""} extended onto pass`
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
  }, [fetchLicenses]);

  const handleRejectOrder = useCallback(async (order: Order) => {
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
  }, []);
  // ── Notification actions ──
  const handleSendNotification = useCallback(async (e: React.FormEvent) => {
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
  }, [notifTitle, notifMessage, notifType, notifTarget, notifActionLabel, notifActionUrl, fetchAdminNotifications]);

  const handleDeleteNotification = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminNotifications();
      } else {
        alert(data.error || "Failed to delete notification");
      }
    } catch {
      alert("Network error deleting notification");
    }
  }, [fetchAdminNotifications]);

  // ── Version control & Remote Killswitch ──
  const handleSaveLoaderVersion = useCallback(async (e?: React.FormEvent, customVersion?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetVer = (customVersion || minLoaderVersion || "").trim();
    if (!targetVer) return;

    setIsSavingVersion(true);
    setVersionStatusMsg(null);
    try {
      const res = await fetch("/api/admin/version", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minVersion: targetVer, downloadUrl: downloadPageUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (customVersion) setMinLoaderVersion(customVersion);
        setVersionStatusMsg(data.message || `Minimum loader version set to v${data.minVersion}`);
        setTimeout(() => setVersionStatusMsg(null), 6000);
      } else {
        alert(data.error || "Failed to update loader version");
      }
    } catch {
      alert("Network error updating version");
    } finally {
      setIsSavingVersion(false);
    }
  }, [minLoaderVersion, downloadPageUrl]);

  // ── Discord sync ──
  const handleSyncUserListToDiscord = useCallback(async () => {
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
        setSyncCooldown(15);
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
  }, [syncCooldown]);
  // ── Key minting ──
  const handleMintKey = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMinting(true);
    setMintedKey(null);
    try {
      const res = await fetch("/api/admin/keys/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: genTier, discord_username: genUser || undefined }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMintedKey(data.license?.license_key || data.license_key);
      } else {
        alert(data.error || "Failed to mint key");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsMinting(false);
    }
  }, [genTier, genUser]);

  // ── License actions ──
  const handleResetHWID = useCallback(async (licenseId: string) => {
    setActionLoading(licenseId);
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: licenseId, action: "reset_hwid" }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to reset HWID");
      } else {
        fetchLicenses();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  }, [fetchLicenses]);

  const handleToggleBan = useCallback(async (licenseId: string) => {
    setActionLoading(licenseId);
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: licenseId, action: "toggle_ban" }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to toggle ban");
      } else {
        fetchLicenses();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  }, [fetchLicenses]);

  const handleExtendDays = useCallback(async (lic: License, days: number = 1) => {
    setActionLoading(lic.id);
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lic.id, action: "add_days", days, reason: "Discord Vouch Promotion (+1 Day)" }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to extend license");
      } else {
        fetchLicenses();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  }, [fetchLicenses]);

  // ── Receipt attach ──
  const handleAdminAttachSlip = useCallback(async (orderId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawData = e.target?.result as string;
      try {
        const res = await fetch("/api/order/attach-receipt", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId, receipt_image: rawData, receipt_name: file.name }),
        });
        const data = await res.json();
        if (!data.success) {
          alert(data.error || "Failed to attach receipt");
        } else {
          fetchOrders();
        }
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    };
    reader.readAsDataURL(file);
  }, [fetchOrders]);

  // ── Copy ──
  const handleCopy = useCallback((val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(val);
    setTimeout(() => setCopiedKey(null), 2200);
  }, []);

  // ── Computed ──
  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === "pending").length;
  }, [orders]);

  const approvedOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === "approved").length;
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === "approved")
      .reduce((sum, o) => sum + (parseFloat(o.price?.replace(/[^\d.]/g, "")) || 0), 0);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return orders.filter((o) => {
      const matchesQuery =
        !q ||
        o.order_id?.toLowerCase().includes(q) ||
        o.discord_username?.toLowerCase().includes(q) ||
        o.discord_id?.toLowerCase().includes(q) ||
        (o.reference_no && o.reference_no.toLowerCase().includes(q)) ||
        (o.referred_by && o.referred_by.toLowerCase().includes(q));

      const matchesFilter = orderFilter === "all" || o.status === orderFilter;
      return matchesQuery && matchesFilter;
    });
  }, [orders, searchQuery, orderFilter]);

  const filteredLicenses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return licenses.filter((l) =>
      !q ||
      l.license_key?.toLowerCase().includes(q) ||
      l.discord_id?.toLowerCase().includes(q) ||
      l.discord_username?.toLowerCase().includes(q) ||
      (l.hwid && l.hwid.toLowerCase().includes(q))
    );
  }, [licenses, searchQuery]);

  // ── Session verification on mount ──
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

    return () => { isMounted = false; };
  }, []);

  // ── Auto-Sync & Real-Time Orders on authentication ──
  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Initial full fetch
    loadAllData();

    // 2. Real-time subscription to Supabase orders table
    const channel = supabase
      .channel("gate14-orders-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders(true);
        }
      )
      .subscribe();

    // 3. Heartbeat auto-poll every 8 seconds (when active in viewport)
    const pollTimer = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchOrders(true);
      }
    }, 8000);

    // 4. Tab visibility / focus revalidation
    const handleRevalidate = () => {
      if (document.visibilityState === "visible") {
        fetchOrders(true);
      }
    };
    window.addEventListener("focus", handleRevalidate);
    document.addEventListener("visibilitychange", handleRevalidate);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollTimer);
      window.removeEventListener("focus", handleRevalidate);
      document.removeEventListener("visibilitychange", handleRevalidate);
    };
  }, [isAuthenticated, loadAllData, fetchOrders]);

  // ── Sync cooldown timer ──
  useEffect(() => {
    if (syncCooldown <= 0) return;
    const timer = setInterval(() => {
      setSyncCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [syncCooldown]);

  return {
    // Tab
    activeTab,
    setActiveTab,
    // Auth
    isAuthenticated,
    isVerifying,
    pin,
    setPin,
    showPin,
    setShowPin,
    errorMessage,
    setErrorMessage,
    // Data
    orders,
    licenses,
    loading,
    isRefreshingOrders,
    actionLoading,
    setActionLoading,
    // Notifications
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
    // Key gen
    genTier,
    setGenTier,
    genUser,
    setGenUser,
    isMinting,
    mintedKey,
    setMintedKey,
    // Sync
    isSyncingUsers,
    syncStatusMsg,
    syncCooldown,
    setSyncCooldown,
    // Version
    minLoaderVersion,
    setMinLoaderVersion,
    downloadPageUrl,
    setDownloadPageUrl,
    isSavingVersion,
    versionStatusMsg,
    setVersionStatusMsg,
    // Receipt
    selectedReceiptOrder,
    setSelectedReceiptOrder,
    receiptZoom,
    setReceiptZoom,
    // Copy
    copiedKey,
    setCopiedKey,
    // Filter
    orderFilter,
    setOrderFilter,
    searchQuery,
    setSearchQuery,
    // Methods
    handleLogin,
    handleLogout,
    handleApproveOrder,
    handleRejectOrder,
    handleSendNotification,
    handleDeleteNotification,
    handleSaveLoaderVersion,
    handleSyncUserListToDiscord,
    handleMintKey,
    handleResetHWID,
    handleToggleBan,
    handleExtendDays,
    handleAdminAttachSlip,
    handleCopy,
    // Computed
    filteredOrders,
    filteredLicenses,
    pendingOrdersCount,
    approvedOrdersCount,
    totalRevenue,
    loadAllData,
    fetchAdminNotifications,
    fetchOrders,
    fetchLicenses,
    fetchLoaderVersion,
  };
}
