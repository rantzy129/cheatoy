"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  supabase,
  extractDiscordUser,
  getStoredUser,
  storeUser,
  clearStoredUser,
  signInWithDiscord,
  DiscordUser,
  SUPABASE_URL,
} from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Discord SVG Icon
function IconDiscord({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function IconShield({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconDocument({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function IconLock({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Shield Check SVG Icon
function IconShieldCheck({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// Eye SVG Icon (View / Hide)
function IconEye({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
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
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

// Copy SVG Icon
function IconCopy({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

// Download SVG Icon
function IconDownload({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// Key SVG Icon
function IconKey({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );
}

export default function ProfilePage() {
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [activeLicense, setActiveLicense] = useState<any | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Taste-Skill requirement: Key is DEFAULT AS HIDDEN
  const [isKeyRevealed, setIsKeyRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [ticker, setTicker] = useState(0);

  // Attach slip state
  const [attachingOrderId, setAttachingOrderId] = useState<string | null>(null);
  const [attachStatus, setAttachStatus] = useState<{ id: string; msg: string; isError?: boolean } | null>(null);

  // Active Vault Tab: "license" | "referrals" | "orders"
  const [activeTab, setActiveTab] = useState<"license" | "referrals" | "orders">("license");
  const [isClanPitchCopied, setIsClanPitchCopied] = useState(false);

  // Referral State
  const [isRefCopied, setIsRefCopied] = useState(false);
  const [referralHistory, setReferralHistory] = useState<any[]>([]);
  const [referralStats, setReferralStats] = useState({
    total_referrals: 0,
    approved_referrals: 0,
    total_reward_days_earned: 0,
  });
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);

  const getReferralUrl = () => {
    if (typeof window === "undefined" || !discordUser) return "";
    const handle = discordUser.username || discordUser.id || "";
    return `${window.location.origin}/?ref=${encodeURIComponent(handle)}`;
  };

  const handleCopyReferralUrl = () => {
    const url = getReferralUrl();
    if (url) {
      navigator.clipboard.writeText(url);
      setIsRefCopied(true);
      setTimeout(() => setIsRefCopied(false), 2500);
    }
  };

  const handleCopyClanPitch = () => {
    const url = getReferralUrl();
    if (url) {
      const pitch = `Laro tayo Assault Fire PH! Gamitin mo VIP referral link ko para may +1 Extra Bonus Day ka agad sa pass mo: ${url}`;
      navigator.clipboard.writeText(pitch);
      setIsClanPitchCopied(true);
      setTimeout(() => setIsClanPitchCopied(false), 2500);
    }
  };

  const fetchReferralHistory = async (user: DiscordUser) => {
    setIsLoadingReferrals(true);
    try {
      const res = await fetch(
        `/api/profile/referrals?username=${encodeURIComponent(user.username)}&id=${encodeURIComponent(user.id || "")}`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.referrals)) {
        setReferralHistory(data.referrals);
        if (data.stats) {
          setReferralStats(data.stats);
        }
      }
    } catch (e) {
      console.warn("Notice fetching referral history:", e);
    } finally {
      setIsLoadingReferrals(false);
    }
  };


  const formatOrderPrice = (price?: string | null, tier?: string) => {
    if (!price) {
      if (tier?.includes("3")) return "₱150";
      if (tier?.includes("7")) return "₱300";
      if (tier?.includes("15")) return "₱550";
      if (tier?.includes("Month")) return "₱850";
      if (tier?.includes("Lifetime")) return "₱1,000";
      return "₱150";
    }
    const isUsd = price.includes("$");
    const digits = price.replace(/[^\d,.]/g, "");
    if (!digits) {
      if (tier?.includes("3")) return "₱150";
      if (tier?.includes("7")) return "₱300";
      if (tier?.includes("15")) return "₱550";
      if (tier?.includes("Month")) return "₱850";
      if (tier?.includes("Lifetime")) return "₱1,000";
      return "₱150";
    }
    return isUsd ? `$${digits}` : `₱${digits}`;
  };

  const handleAttachSlipToOrder = async (orderId: string, file: File) => {
    setAttachingOrderId(orderId);
    setAttachStatus({ id: orderId, msg: "Reading & attaching slip..." });

    try {
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
          if (data.success) {
            setAttachStatus({ id: orderId, msg: "Slip attached! Admin will review shortly." });
            if (discordUser) {
              fetchUserData(discordUser);
            }
          } else {
            setAttachStatus({ id: orderId, msg: data.error || "Failed to attach slip", isError: true });
          }
        } catch (err: any) {
          setAttachStatus({ id: orderId, msg: "Upload failed: " + err.message, isError: true });
        } finally {
          setAttachingOrderId(null);
          setTimeout(() => setAttachStatus(null), 5000);
        }
      };
      reader.onerror = () => {
        setAttachingOrderId(null);
        setAttachStatus({ id: orderId, msg: "Could not read file", isError: true });
      };
      reader.readAsDataURL(file);
    } catch {
      setAttachingOrderId(null);
      setAttachStatus({ id: orderId, msg: "File selection error", isError: true });
    }
  };

  // Live countdown ticker (updates every second for smooth seconds ticking)
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch licenses and orders for user
  const fetchUserData = async (user: DiscordUser) => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const cleanUser = (user.username || "").replace(/#0+$/, "").trim();
      const orConditions: string[] = [];
      
      // Match by Discord ID (Snowflake or username fallback)
      if (user.id) {
        orConditions.push(`discord_id.eq.${user.id}`);
      }
      if (cleanUser) {
        orConditions.push(`discord_id.eq.${cleanUser}`);
        orConditions.push(`discord_username.eq.${cleanUser}`);
        orConditions.push(`discord_username.eq.${cleanUser}#Discord`);
        orConditions.push(`discord_username.ilike.${cleanUser}#%`);
        orConditions.push(`discord_username.ilike.%${cleanUser}%`);
      }
      if (user.username && user.username !== cleanUser) {
        orConditions.push(`discord_id.eq.${user.username}`);
        orConditions.push(`discord_username.eq.${user.username}`);
        orConditions.push(`discord_username.eq.${user.username}#Discord`);
      }
      if (user.tag && user.tag !== "Discord" && user.tag !== "0") {
        orConditions.push(`discord_username.eq.${cleanUser}#${user.tag}`);
      }

      const orFilter = orConditions.join(",");

      // 1. Fetch license from licenses table
      const { data: licData } = await supabase
        .from("licenses")
        .select("*")
        .or(orFilter)
        .order("created_at", { ascending: false });

      if (licData && licData.length > 0) {
        setActiveLicense(licData[0]);
        // Auto-link real Discord Snowflake ID if missing
        if (user.id && licData[0].discord_id !== user.id && supabase) {
          supabase
            .from("licenses")
            .update({ discord_id: user.id })
            .eq("id", licData[0].id)
            .then(() => {});
        }
      } else {
        setActiveLicense(null);
      }

      // 2. Fetch orders from orders table
      const { data: ordData } = await supabase
        .from("orders")
        .select("*")
        .or(orFilter)
        .order("created_at", { ascending: false });

      if (ordData) {
        setUserOrders(ordData);
        // Fallback: If user has an approved order with license_key but license record is missing
        if (!licData || licData.length === 0) {
          const approved = ordData.find((o) => o.status === "approved" && o.license_key);
          if (approved) {
            setActiveLicense({
              license_key: approved.license_key,
              tier: approved.tier,
              expires_at: null, // Lifetime or calculate
              hwid: null,
            });
          }
        }
        // Auto-link real Discord Snowflake ID on orders
        if (user.id && supabase) {
          const client = supabase;
          ordData.forEach((ord) => {
            if (ord.discord_id !== user.id) {
              client
                .from("orders")
                .update({ discord_id: user.id })
                .eq("id", ord.id)
                .then(() => {});
            }
          });
        }
      }
      // Also fetch user's referral history
      fetchReferralHistory(user);
    } catch (err) {
      console.warn("Notice fetching profile data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auth Initialization on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Check URL parameters for OAuth return or direct tab link (?tab=referrals)
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      const tabParam = searchParams.get("tab");

      if (tabParam === "referrals" || tabParam === "orders" || tabParam === "license") {
        setActiveTab(tabParam as any);
      } else if (window.location.hash === "#referrals") {
        setActiveTab("referrals");
      } else if (window.location.hash === "#orders") {
        setActiveTab("orders");
      }

      if (code && supabase) {
        supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
          if (!error && data?.session?.user) {
            const u = extractDiscordUser(data.session.user);
            if (u) {
              setDiscordUser(u);
              storeUser(u);
              fetchUserData(u);
              window.history.replaceState(null, "", window.location.pathname);
            }
          }
        });
      }

      // Hash token check
      if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");

        if (accessToken) {
          fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data && (data.user_metadata || data.email)) {
                const u = extractDiscordUser(data);
                if (u) {
                  setDiscordUser(u);
                  storeUser(u);
                  fetchUserData(u);
                  window.history.replaceState(null, "", window.location.pathname);
                }
              }
            })
            .catch((err) => console.warn("Supabase user fetch info:", err));
        }
      }
    }

    // 2. Check Supabase client active session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u = extractDiscordUser(session.user);
          if (u) {
            setDiscordUser(u);
            storeUser(u);
            fetchUserData(u);
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u = extractDiscordUser(session.user);
          if (u) {
            setDiscordUser(u);
            storeUser(u);
            fetchUserData(u);
          }
        }
      });

      // 3. Fallback to cached local storage user
      const cached = getStoredUser();
      if (cached) {
        setDiscordUser(cached);
        fetchUserData(cached);
      } else {
        setIsLoading(false);
      }

      return () => subscription.unsubscribe();
    } else {
      const cached = getStoredUser();
      if (cached) {
        setDiscordUser(cached);
        fetchUserData(cached);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  // Real-time listener for pending orders on Profile page
  useEffect(() => {
    const hasPending = userOrders.some((o) => o.status === "pending");
    if (!discordUser || !hasPending) return;

    let channel: any = null;
    if (supabase) {
      channel = supabase
        .channel(`profile-orders-${discordUser.id || discordUser.username}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
          },
          () => {
            fetchUserData(discordUser);
          }
        )
        .subscribe();
    }

    const interval = setInterval(() => {
      fetchUserData(discordUser);
    }, 4000);

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
      clearInterval(interval);
    };
  }, [userOrders, discordUser]);

  const handleCopyKey = (key: string) => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  // Remaining time calculation
  const getRemainingTime = () => {
    if (!activeLicense) return null;
    if (!activeLicense.expires_at) {
      return {
        text: "Permanent VIP • Never Expires",
        isLifetime: true,
        isExpired: false,
        days: 999,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const diff = new Date(activeLicense.expires_at).getTime() - Date.now();
    if (diff <= 0) {
      return {
        text: "Subscription Expired",
        isLifetime: false,
        isExpired: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n: number) => String(n).padStart(2, "0");

    let formatted = "";
    if (days > 0) {
      formatted = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s remaining`;
    } else {
      formatted = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s remaining`;
    }

    return {
      text: formatted,
      isLifetime: false,
      isExpired: false,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const remaining = getRemainingTime();
  const isVip = Boolean(activeLicense && !remaining?.isExpired);

  // Mask license key helper (e.g. CHAM-••••-••••-••••)
  const getMaskedKey = (key: string) => {
    if (!key) return "••••-••••-••••-••••";
    const parts = key.split("-");
    if (parts.length >= 4) {
      return `${parts[0]}-••••-••••-••••`;
    }
    return "CHAM-••••-••••-••••";
  };

  return (
    <div className="vault-page-root">
      {/* Global Unified Navigation */}
      <Navbar />

      {/* Main Vault Workspace Container */}
      <main className="vault-container">
        {!discordUser ? (
          /* ================= GUEST / LOGIN PROMPT SCREEN (Anti-Slop Clean Auth) ================= */
          <div className="vault-guest-station">
            <h1>Member Vault</h1>
            <p className="vault-guest-subtext">
              Sign in with your verified Discord account to view your private Assault Fire PH license key, download the VIP loader, and manage clan referrals.
            </p>

            <button
              type="button"
              className="btn-discord-login-prominent"
              onClick={() => signInWithDiscord()}
              id="profile-discord-login-btn"
            >
              <IconDiscord size={20} />
              <span>Continue with Discord</span>
            </button>

            <div className="vault-guest-actions-bar">
              <Link href="/" className="btn-vault-action-secondary">
                <span>← Return to Storefront</span>
              </Link>
              <Link href="/#pricing" className="btn-vault-action-secondary">
                <span>Browse Passes (₱150+) →</span>
              </Link>
              <a
                href="https://discord.gg/Whwxq9QAEN"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-vault-action-secondary"
              >
                <span>Discord Support ↗</span>
              </a>
            </div>
          </div>
        ) : (
          /* ================= AUTHENTICATED WORKSPACE VIEW ================= */
          <>
            {/* 1. TOP WORKSPACE HEADER & USER IDENTITY STRIP */}
            <header className="vault-header" aria-label="Member Vault Header">
              <div className="vault-header-title">
                <h1>Member Vault</h1>
                <p>
                  Assault Fire PH VIP licenses, PC hardware binding, and loader distribution.
                </p>
              </div>

              <div className="vault-user-console">
                <div className="vault-user-info">
                  {discordUser.avatar_url ? (
                    <img
                      src={discordUser.avatar_url}
                      alt={`${discordUser.username}'s avatar`}
                      className="vault-avatar"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
                      }}
                    />
                  ) : (
                    <div className="vault-avatar-fallback">
                      {discordUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="vault-user-meta">
                    <span className="vault-user-name">
                      @{discordUser.username}
                      {discordUser.global_name && discordUser.global_name !== discordUser.username && (
                        <span style={{ color: "#94a3b8", fontWeight: 400 }}> ({discordUser.global_name})</span>
                      )}
                    </span>
                    <span className="vault-user-sub">
                      {isVip ? (
                        <span className="vault-status-dot-active">● Active VIP</span>
                      ) : (
                        <span className="vault-status-dot-none">
                          ● {remaining?.isExpired ? "Pass Expired" : "Free Member"}
                        </span>
                      )}
                      {discordUser.id && <span>ID: {discordUser.id}</span>}
                    </span>
                  </div>
                </div>

                <div className="vault-header-actions">
                  <button
                    type="button"
                    className="btn-vault-subtle"
                    onClick={() => fetchUserData(discordUser)}
                    title="Refresh subscription status from database"
                  >
                    <span>↻ Refresh</span>
                  </button>
                  <Link href="/#pricing" className="btn-vault-subtle">
                    <span>+ Extend Pass</span>
                  </Link>
                </div>
              </div>
            </header>

            {/* Vault Workspace Segmented Tabs */}
            <div className="vault-tabs-nav" role="tablist" aria-label="Vault Sections">
              <button
                type="button"
                className={`vault-tab-btn ${activeTab === "license" ? "active" : ""}`}
                onClick={() => setActiveTab("license")}
                id="vault-tab-license-btn"
                role="tab"
                aria-selected={activeTab === "license"}
              >
                <IconShieldCheck size={16} />
                <span>License &amp; Loader</span>
              </button>

              <button
                type="button"
                className={`vault-tab-btn vault-tab-btn-referral ${activeTab === "referrals" ? "active" : ""}`}
                onClick={() => setActiveTab("referrals")}
                id="vault-tab-referrals-btn"
                role="tab"
                aria-selected={activeTab === "referrals"}
              >
                <span>🎁</span>
                <span>Referral Program</span>
                {referralStats.total_reward_days_earned > 0 ? (
                  <span className="vault-tab-badge">+{referralStats.total_reward_days_earned}D Earned</span>
                ) : (
                  <span className="vault-tab-badge-subtle">Earn Free VIP</span>
                )}
              </button>

              <button
                type="button"
                className={`vault-tab-btn ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
                id="vault-tab-orders-btn"
                role="tab"
                aria-selected={activeTab === "orders"}
              >
                <IconDocument size={16} />
                <span>Order History</span>
                {userOrders.length > 0 && (
                  <span className="vault-tab-badge-subtle">{userOrders.length}</span>
                )}
              </button>
            </div>

            {/* TAB 1: VIP COMMAND DESK (LICENSE & LOADER) */}
            {activeTab === "license" && (
              isVip && activeLicense ? (
                /* VIP MEMBERS ONLY: 2-Column Command Desk with Active License & Loader Download */
                <div className="vault-grid">
                {/* Left Column: Subscription Telemetry, Private Key, HWID */}
                <div className="vault-card">
                  <div className="vault-card-head">
                    <div className="vault-card-title">
                      <IconShieldCheck size={18} />
                      <span>Active Subscription &amp; License Key</span>
                    </div>

                    <span className="subscription-status-badge status-active-pill">
                      ● Active VIP
                    </span>
                  </div>

                  {/* Live Remaining Time Box */}
                  <div className="vault-telemetry-box">
                    <div className="vault-telemetry-label">
                      {activeLicense.tier || "VIP Pass"} • Remaining duration
                    </div>
                    <div className="vault-telemetry-value">
                      {remaining ? remaining.text : "Calculating..."}
                    </div>
                    <div className="vault-telemetry-sub">
                      {activeLicense.expires_at
                        ? `Valid until ${new Date(activeLicense.expires_at).toLocaleString()}`
                        : "Lifetime Access • Unlimited Duration"}
                    </div>
                  </div>

                  {/* Private License Key Box */}
                  <div className="vault-key-container">
                    <div className="vault-key-header">
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#cbd5e1" }}>
                        <IconKey size={14} />
                        <span>Private Loader License Key</span>
                      </span>
                      <span>Bound to @{discordUser.username}</span>
                    </div>

                    <div className="vault-key-row">
                      <div>
                        {isKeyRevealed ? (
                          <span className="vault-key-code" id="user-license-key-text">
                            {activeLicense.license_key}
                          </span>
                        ) : (
                          <span className="vault-key-masked-code" id="user-license-key-masked">
                            {getMaskedKey(activeLicense.license_key)}
                          </span>
                        )}
                      </div>

                      <div className="vault-key-buttons">
                        <button
                          type="button"
                          className="btn-key-action"
                          onClick={() => setIsKeyRevealed(!isKeyRevealed)}
                          id="toggle-license-visibility-btn"
                          title={isKeyRevealed ? "Hide private license key" : "Click to view full license key"}
                        >
                          {isKeyRevealed ? (
                            <>
                              <IconEyeOff size={15} />
                              <span>Hide Key</span>
                            </>
                          ) : (
                            <>
                              <IconEye size={15} />
                              <span>Show Key</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="btn-key-copy"
                          onClick={() => handleCopyKey(activeLicense.license_key)}
                          id="copy-license-key-btn"
                          title="Copy license key to clipboard"
                        >
                          <IconCopy size={15} />
                          <span>{isCopied ? "Copied!" : "Copy Key"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="vault-key-hint">
                      Keep this key private. It locks automatically to your PC motherboard on first injection.
                    </div>
                  </div>

                  {/* HWID Binding Telemetry */}
                  <div className="vault-hwid-box">
                    <div className="vault-hwid-detail">
                      <div className="vault-hwid-title">Machine HWID Binding</div>
                      <div className="vault-hwid-status">
                        {activeLicense.hwid ? (
                          <span style={{ color: "#38bdf8", fontVariantNumeric: "tabular-nums" }}>
                            Locked: {activeLicense.hwid.substring(0, 16)}...
                          </span>
                        ) : (
                          <span style={{ color: "#10b981" }}>
                            ● Unbound (Auto-locks on first loader launch)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="vault-hwid-discord">
                      Need HWID reset?{" "}
                      <a
                        href="https://discord.gg/Whwxq9QAEN"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open a ticket in Discord ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column: Loader Deployment & Setup Guide */}
                <div className="vault-card">
                  <div>
                    <div className="vault-loader-status-banner">
                      <h3>
                        <IconShield size={16} />
                        <span>Chameleon Loader v2.6.4</span>
                      </h3>
                      <p>
                        Official memory virtualization loader for Assault Fire PH (Legacy &amp; Reborn).
                      </p>
                    </div>

                    <a
                      href="/downloads/Chameleon_VIP.zip"
                      download="Chameleon_VIP.zip"
                      className="btn-vault-download"
                      id="download-loader-profile-btn"
                    >
                      <IconDownload size={18} />
                      <span>Download Loader (ZIP)</span>
                    </a>

                    <div className="vault-instructions-block">
                      <div className="vault-instructions-title">Setup Guide</div>

                      <ol className="vault-instructions-list">
                        <li>
                          <strong>Extract</strong>: Extract archive to a secure folder.
                        </li>
                        <li>
                          <strong>Run as Admin</strong>: Launch <code>ChameleonLoader.exe</code>.
                        </li>
                        <li>
                          <strong>Activate</strong>: Paste license key and press <kbd>INSERT</kbd> in-game.
                        </li>
                      </ol>

                      <div className="vault-keybinds-row">
                        <span>Menu keybind:</span>
                        <kbd>INSERT</kbd>
                        <span style={{ color: "#94a3b8", marginLeft: "auto", fontSize: 11 }}>
                          Toggles In-Game VIP Overlay
                        </span>
                      </div>

                      {/* Real In-Game Menu Capture */}
                      <div style={{ marginTop: 12, borderRadius: 6, overflow: "hidden", border: "1px solid var(--border-subtle)", background: "#000000" }}>
                        <Image
                          src="/proofs/proof2.png"
                          alt="Chameleon VIP in-game menu overlay preview"
                          width={480}
                          height={270}
                          style={{ width: "100%", height: "auto", display: "block" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#64748b" }}>
                    <span style={{ color: "#00ff87", fontWeight: 600 }}>Status: Undetected ●</span>
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>Patch: 2026.10</span>
                  </div>
                </div>
              </div>
            ) : (
              /* NON-VIP OR EXPIRED: Clean, dignified empty state without slop */
              <div className="vault-card" style={{ marginBottom: 28 }}>
                <div className="vault-card-head">
                  <div className="vault-card-title">
                    <IconShieldCheck size={18} />
                    <span>VIP License Status</span>
                  </div>

                  <span className="subscription-status-badge status-none-pill">
                    ● {remaining?.isExpired ? "Pass Expired" : "Free Member"}
                  </span>
                </div>

                <div style={{ padding: "32px 20px", textAlign: "center", maxWidth: 540, margin: "0 auto" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginBottom: 8, letterSpacing: "-0.015em" }}>
                    {remaining?.isExpired ? "VIP Pass Expired" : "No Active VIP License"}
                  </h2>

                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.55, marginBottom: 20 }}>
                    {remaining?.isExpired
                      ? "Your VIP pass has expired. Extend your pass to immediately re-unlock private loader downloads and license key generation."
                      : "This Discord account does not currently hold an active VIP pass. Acquire a pass below to generate your private key and download the loader."}
                  </p>

                  <Link
                    href="/#pricing"
                    className="btn-key-copy"
                    style={{ textDecoration: "none", display: "inline-flex", padding: "10px 24px", fontSize: 13 }}
                  >
                    {remaining?.isExpired ? "Extend VIP Pass" : "Browse Passes (From ₱150)"}
                  </Link>
                </div>
              </div>
            )
          )}

            {/* TAB 2: CLANMATE REFERRAL & AFFILIATE REWARDS */}
            {activeTab === "referrals" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Top KPI Cards Row */}
                <div className="vault-referral-kpi-grid">
                  <div className="vault-referral-kpi-card">
                    <span className="vault-referral-kpi-label">Clanmates Invited</span>
                    <span className="vault-referral-kpi-value">{referralStats.total_referrals}</span>
                    <span className="vault-referral-kpi-sub">{referralStats.approved_referrals} verified</span>
                  </div>

                  <div className="vault-referral-kpi-card vault-referral-kpi-card-highlight">
                    <span className="vault-referral-kpi-label" style={{ color: "#f472b6" }}>Free VIP Days Earned</span>
                    <span className="vault-referral-kpi-value" style={{ color: "#f472b6" }}>+{referralStats.total_reward_days_earned} Days</span>
                    <span className="vault-referral-kpi-sub">Added to license duration</span>
                  </div>

                  <div className="vault-referral-kpi-card">
                    <span className="vault-referral-kpi-label">Reward Rate</span>
                    <span className="vault-referral-kpi-value" style={{ fontSize: 18, color: isVip ? "#10b981" : "#38bdf8" }}>
                      {isVip ? "+3 Days / Sale" : "+1 Day / Sale"}
                    </span>
                    <span className="vault-referral-kpi-sub">
                      {isVip ? "Active VIP rate (Maximum)" : "Upgrade to VIP for +3 days/sale"}
                    </span>
                  </div>
                </div>

                {/* Main Referral Card */}
                <div className="vault-referral-card" style={{ margin: 0 }}>
                  <div className="vault-referral-grid">
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", marginBottom: 6, letterSpacing: "-0.015em" }}>
                        Clanmate Referral Program
                      </h2>
                      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                        Share your unique referral link with clan members and friends.
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#cbd5e1" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "#38bdf8", fontWeight: 700 }}>● Buyer Perk:</span>
                          <span>Gets <strong>+1 Extra Bonus Day</strong> added onto their VIP pass automatically.</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "#f472b6", fontWeight: 700 }}>● Your Reward:</span>
                          <span>
                            {isVip ? (
                              <>Earn <strong style={{ color: "#ffffff" }}>+3 Free VIP Days</strong> extended onto your license per referral.</>
                            ) : (
                              <>Earn <strong style={{ color: "#ffffff" }}>+1 Free VIP Day</strong> per referral (or <strong style={{ color: "#f472b6" }}>+3 Free Days</strong> with an active VIP pass).</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="vault-referral-link-box">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>
                          Your Referral Link
                        </span>
                        <span style={{ fontSize: 11, color: "#ec4899", fontWeight: 600 }}>
                          @{discordUser.username}
                        </span>
                      </div>

                      <div className="vault-referral-input-group">
                        <input
                          type="text"
                          readOnly
                          value={getReferralUrl()}
                          className="vault-referral-input"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                          aria-label="Your Referral Link"
                        />
                        <button
                          type="button"
                          onClick={handleCopyReferralUrl}
                          className="btn-vault-copy-ref"
                          title="Copy referral link to clipboard"
                        >
                          <IconCopy size={13} />
                          <span>{isRefCopied ? "Copied!" : "Copy Link"}</span>
                        </button>
                      </div>

                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button
                          type="button"
                          onClick={handleCopyClanPitch}
                          className="btn-vault-copy-secondary"
                          style={{ width: "100%", justifyContent: "center" }}
                          title="Copy ready-to-paste message for clan chat"
                        >
                          <span>💬</span>
                          <span>{isClanPitchCopied ? "Pitch Copied!" : "Copy Clan Chat Pitch"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clanmates Invited & Referral History Table */}
                <div className="vault-orders-card" style={{ margin: 0 }}>
                  <div className="vault-card-head">
                    <div className="vault-card-title">
                      <IconDocument size={16} />
                      <span>Clanmates Invited &amp; Referral History</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      {referralHistory.length} referral{referralHistory.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {isLoadingReferrals ? (
                    <div style={{ textAlign: "center", padding: "28px", color: "#64748b", fontSize: 13 }}>
                      Loading referral history...
                    </div>
                  ) : referralHistory.length > 0 ? (
                    <div className="vault-orders-table-wrapper">
                      <table className="vault-table">
                        <thead>
                          <tr>
                            <th>Clanmate</th>
                            <th>VIP Pass Tier</th>
                            <th>Amount</th>
                            <th>Purchase Date</th>
                            <th>Verification Status</th>
                            <th style={{ textAlign: "right" }}>Your Reward</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referralHistory.map((item) => (
                            <tr key={item.id || item.order_id}>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <div style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    background: "rgba(236, 72, 153, 0.2)",
                                    color: "#f472b6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 800,
                                    fontSize: 11
                                  }}>
                                    {item.clanmate_username?.charAt(0).toUpperCase()}
                                  </div>
                                  <span style={{ fontWeight: 700, color: "#f1f5f9" }}>
                                    @{item.clanmate_username}
                                  </span>
                                </div>
                              </td>
                              <td style={{ fontWeight: 600, color: "#cbd5e1" }}>
                                {item.tier}
                              </td>
                              <td style={{ fontVariantNumeric: "tabular-nums" }}>
                                {formatOrderPrice(item.price, item.tier)}
                              </td>
                              <td style={{ color: "#94a3b8", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
                                {new Date(item.created_at).toLocaleDateString()}
                              </td>
                              <td>
                                {item.status === "approved" ? (
                                  <span className="subscription-status-badge status-active-pill" style={{ fontSize: 11, padding: "3px 8px" }}>
                                    ● Verified &amp; Credited
                                  </span>
                                ) : item.status === "pending" ? (
                                  <span style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    background: "rgba(245, 158, 11, 0.12)",
                                    border: "1px solid rgba(245, 158, 11, 0.3)",
                                    color: "#f59e0b",
                                    padding: "3px 8px",
                                    borderRadius: 9999,
                                    fontSize: 11,
                                    fontWeight: 600
                                  }}>
                                    ● Pending Review
                                  </span>
                                ) : (
                                  <span style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    background: "rgba(239, 68, 68, 0.12)",
                                    border: "1px solid rgba(239, 68, 68, 0.3)",
                                    color: "#ef4444",
                                    padding: "3px 8px",
                                    borderRadius: 9999,
                                    fontSize: 11,
                                    fontWeight: 600
                                  }}>
                                    ● Rejected
                                  </span>
                                )}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.status === "approved" ? (
                                  <span style={{ color: "#10b981", fontWeight: 800, fontSize: 13 }}>
                                    +{item.reward_days} Free Day{item.reward_days !== 1 ? "s" : ""}
                                  </span>
                                ) : item.status === "pending" ? (
                                  <span style={{ color: "#f59e0b", fontSize: 12, fontWeight: 600 }}>
                                    +{item.potential_reward_days} Days (Pending)
                                  </span>
                                ) : (
                                  <span style={{ color: "#64748b", fontSize: 12 }}>—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "32px 16px", color: "#64748b", fontSize: 13 }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>🎁</div>
                      <div style={{ color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>
                        No clanmate referral purchases yet
                      </div>
                      <div>
                        Share your unique referral link above in clan chats &amp; Facebook groups to earn free VIP days!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: ORDER & PAYMENT HISTORY */}
            {activeTab === "orders" && (
              <section className="vault-orders-card" aria-label="Order History">
              <div className="vault-card-head">
                <div className="vault-card-title">
                  <IconDocument size={16} />
                  <span>Your Order &amp; Payment History</span>
                </div>
                <span style={{ fontSize: 12, color: "#64748b", fontVariantNumeric: "tabular-nums" }}>
                  {userOrders.length} transaction{userOrders.length !== 1 ? "s" : ""}
                </span>
              </div>

              {userOrders.length > 0 ? (
                <div className="vault-orders-table-wrapper">
                  <table className="vault-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Tier</th>
                        <th>Amount</th>
                        <th>Payment method</th>
                        <th>Reference / TXN</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>License key</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userOrders.map((order) => {
                        const hasSlip = order.payment_method?.includes("[receipt:");
                        const isPending = order.status === "pending";

                        return (
                          <tr key={order.id || order.order_id}>
                            <td style={{ fontVariantNumeric: "tabular-nums", color: "#00d2ff", fontWeight: 600 }}>
                              {order.order_id}
                            </td>
                            <td style={{ fontWeight: 700 }}>{order.tier}</td>
                            <td style={{ fontVariantNumeric: "tabular-nums" }}>
                              {formatOrderPrice(order.price, order.tier)}
                            </td>
                            <td>
                              <span style={{ color: "#007dfe", fontWeight: 700 }}>
                                {(order.payment_method || "InstaPay / GCash").replace(/\s*\[receipt:.*?\]/, "")}
                              </span>
                            </td>
                            <td style={{ fontVariantNumeric: "tabular-nums", color: "#94a3b8" }}>
                              <div>{order.reference_no || order.gcash_ref_no || "N/A"}</div>
                              {hasSlip ? (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#10b981", fontSize: 11, marginTop: 4 }}>
                                  ● Slip Attached
                                </span>
                              ) : isPending ? (
                                <div style={{ marginTop: 4 }}>
                                  <label
                                    htmlFor={`attach-slip-${order.order_id}`}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 4,
                                      background: "rgba(56, 189, 248, 0.12)",
                                      color: "#38bdf8",
                                      padding: "3px 8px",
                                      borderRadius: 4,
                                      fontSize: 11,
                                      cursor: attachingOrderId === order.order_id ? "wait" : "pointer",
                                      border: "1px solid rgba(56, 189, 248, 0.3)",
                                      userSelect: "none",
                                    }}
                                  >
                                    <span>{attachingOrderId === order.order_id ? "Uploading..." : "📎 Attach Slip"}</span>
                                    <input
                                      id={`attach-slip-${order.order_id}`}
                                      type="file"
                                      accept="image/png,image/jpeg,image/jpg,image/webp"
                                      style={{ display: "none" }}
                                      disabled={attachingOrderId === order.order_id}
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleAttachSlipToOrder(order.order_id, e.target.files[0]);
                                        }
                                      }}
                                    />
                                  </label>
                                  {attachStatus && attachStatus.id === order.order_id && (
                                    <span style={{ display: "block", fontSize: 10, color: attachStatus.isError ? "#ef4444" : "#38bdf8", marginTop: 2 }}>
                                      {attachStatus.msg}
                                    </span>
                                  )}
                                </div>
                              ) : null}
                            </td>
                            <td style={{ color: "#94a3b8", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td>
                              {order.status === "approved" ? (
                                <span className="subscription-status-badge status-active-pill">
                                  Approved
                                </span>
                              ) : order.status === "rejected" ? (
                                <span
                                  className="subscription-status-badge"
                                  style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}
                                >
                                  Rejected
                                </span>
                              ) : (
                                <span className="subscription-status-badge status-pending-pill">
                                  Pending approval
                                </span>
                              )}
                            </td>
                            <td style={{ fontVariantNumeric: "tabular-nums" }}>
                              {order.license_key ? (
                                <button
                                  type="button"
                                  onClick={() => handleCopyKey(order.license_key)}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#38bdf8",
                                    cursor: "pointer",
                                    fontSize: 12,
                                    textDecoration: "underline",
                                  }}
                                  title="Click to copy key"
                                >
                                  Copy key
                                </button>
                              ) : (
                                <span style={{ color: "#64748b" }}>—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "30px", color: "#64748b", fontSize: 13 }}>
                  No payment orders found for this Discord user yet.
                </div>
              )}
            </section>
            )}
          </>
        )}
      </main>

      {/* Global Unified Footer */}
      <Footer />
    </div>
  );
}
