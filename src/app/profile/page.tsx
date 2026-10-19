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
  signOut,
  DiscordUser,
  SUPABASE_URL,
} from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Discord SVG Icon
function IconDiscord({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
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

function IconDocument({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

// Shield Check SVG Icon
function IconShieldCheck({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
function IconDownload({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// Key SVG Icon
function IconKey({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        if (user.id && licData[0].discord_id !== user.id) {
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
        if (user.id) {
          ordData.forEach((ord) => {
            if (ord.discord_id !== user.id) {
              supabase
                .from("orders")
                .update({ discord_id: user.id })
                .eq("id", ord.id)
                .then(() => {});
            }
          });
        }
      }
    } catch (err) {
      console.warn("Notice fetching profile data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auth Initialization on Mount
  useEffect(() => {
    // 1. Check URL parameters for OAuth return or Demo mode
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const demoParam = searchParams.get("demo") || searchParams.get("user") || searchParams.get("preview");

      if (demoParam) {
        const demoUser: DiscordUser = {
          id: "417244901234567890",
          username: demoParam === "1" ? "somaris1" : demoParam,
          global_name: demoParam === "1" ? "Somaris" : demoParam,
          tag: "Discord",
          avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
          email: `${demoParam === "1" ? "somaris1" : demoParam}@gmail.com`,
        };
        setDiscordUser(demoUser);
        storeUser(demoUser);
        fetchUserData(demoUser);
        return;
      }

      const code = searchParams.get("code");

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

  const handleCopyKey = (key: string) => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  const handleLogout = async () => {
    await signOut();
    setDiscordUser(null);
    setActiveLicense(null);
    setUserOrders([]);
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
    <div className="profile-page-root">
      {/* Global Unified Navigation (Taste-Skill) */}
      <Navbar />

      {/* Main Profile Page Content */}
      <main className="profile-page-container">
        {!discordUser ? (
          /* ================= GUEST / LOGIN PROMPT SCREEN ================= */
          <div className="profile-guest-card">
            <div className="guest-discord-icon-large">
              <IconDiscord size={44} />
            </div>
            <h2>Member Profile & License Vault</h2>
            <p>
              Sign in with your Discord account to view your active VIP subscriptions,
              retrieve your undetected Assault Fire PH license keys, and download the latest loader.
            </p>

            <button
              type="button"
              className="btn-discord-login-large"
              onClick={() => signInWithDiscord()}
              id="profile-discord-login-btn"
            >
              <IconDiscord size={22} />
              <span>Continue with Discord</span>
            </button>

            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                <Link href="/" className="btn-profile-secondary">
                  ← Back to Home
                </Link>
                <Link href="/#pricing" className="btn-profile-secondary">
                  View VIP Pricing
                </Link>
              </div>

              <div>
                <Link
                  href="/profile?demo=somaris1"
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  id="preview-vip-demo-link"
                >
                  Preview VIP Profile for somaris1 (1 Month Pass) →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* ================= AUTHENTICATED PROFILE VIEW ================= */
          <>
            {/* 1. DISCORD PROFILE HERO CARD (Actual Discord Avatar & Info) */}
            <section className="profile-hero-card" aria-label="Discord Profile">
              <div className="profile-hero-inner">
                <div className="profile-user-summary">
                  {/* Actual Discord Avatar Frame */}
                  <div className="discord-avatar-frame">
                    {discordUser.avatar_url ? (
                      <img
                        src={discordUser.avatar_url}
                        alt={`${discordUser.username}'s Discord Avatar`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
                        }}
                      />
                    ) : (
                      <div className="discord-avatar-fallback">
                        {discordUser.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="discord-online-badge" title="Discord Account Active" />
                  </div>

                  <div className="profile-names-wrap">
                    <h1>
                      <span>{discordUser.global_name || discordUser.username}</span>
                      <span className="profile-badge-discord">
                        <IconDiscord size={14} />
                        <span>Verified Discord</span>
                      </span>
                    </h1>

                    <div className="profile-meta-pills">
                      <span className="profile-sub-pill" title="Discord Username Handle">
                        @{discordUser.username}
                        {discordUser.tag && discordUser.tag !== "Discord" && discordUser.tag !== "0"
                          ? `#${discordUser.tag}`
                          : ""}
                      </span>
                      {discordUser.id && (
                        <span className="profile-sub-pill" title="Discord Unique ID">
                          ID: {discordUser.id}
                        </span>
                      )}
                      <span
                        className="profile-sub-pill"
                        style={{
                          background: activeLicense ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          color: activeLicense ? "#10b981" : "#f59e0b",
                          borderColor: activeLicense ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)",
                        }}
                      >
                        {activeLicense ? "● VIP Member" : "● No Active VIP Pass"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="profile-hero-actions">
                  <button
                    type="button"
                    className="btn-profile-secondary"
                    onClick={() => fetchUserData(discordUser)}
                    title="Refresh subscription status from database"
                  >
                    <span>↻ Refresh Status</span>
                  </button>
                  <Link href="/#pricing" className="btn-profile-secondary">
                    <span>+ Extend Pass</span>
                  </Link>
                  <button
                    type="button"
                    className="btn-profile-logout"
                    onClick={handleLogout}
                    title="Sign Out"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 2. TWO-COLUMN GRID: VIP SUBSCRIPTION & LOADER DOWNLOAD */}
            <div className="profile-grid">
              {/* Left Column: Active Subscription & Hidden License Key */}
              <div className="profile-vip-card">
                <div className="profile-card-header">
                  <div className="profile-card-title">
                    <IconShieldCheck size={18} />
                    <span>Active Subscription & License Key</span>
                  </div>

                  {activeLicense ? (
                    <span className="subscription-status-badge status-active-pill">
                      ● {remaining?.isExpired ? "EXPIRED" : "ACTIVE VIP"}
                    </span>
                  ) : (
                    <span className="subscription-status-badge status-none-pill">
                      ● INACTIVE
                    </span>
                  )}
                </div>

                {activeLicense ? (
                  <>
                    {/* Live Remaining Time Box */}
                    <div className="vip-countdown-display">
                      <div className="vip-countdown-label">
                        {activeLicense.tier || "VIP PASS"} • REMAINING TIME
                      </div>
                      <div className="vip-countdown-timer">
                        {remaining ? remaining.text : "Calculating..."}
                      </div>
                      <div className="vip-expiry-detail">
                        <span>
                          {activeLicense.expires_at
                            ? `Valid until ${new Date(activeLicense.expires_at).toLocaleString()}`
                            : "Lifetime Access • Unlimited Duration"}
                        </span>
                      </div>
                    </div>

                    {/* License Key Vault (Taste-Skill Requirement: DEFAULT AS HIDDEN) */}
                    <div className="profile-key-vault">
                      <div className="vault-top">
                        <div className="vault-top-title">
                          <IconKey size={14} />
                          <span>Private Loader License Key</span>
                        </div>
                        <span style={{ fontSize: 11, color: "#64748b" }}>
                          Bound to @{discordUser.username}
                        </span>
                      </div>

                      <div className="vault-key-box">
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {isKeyRevealed ? (
                            <span className="vault-key-string" id="user-license-key-text">
                              {activeLicense.license_key}
                            </span>
                          ) : (
                            <span className="vault-key-masked" id="user-license-key-masked">
                              {getMaskedKey(activeLicense.license_key)}
                            </span>
                          )}
                        </div>

                        <div className="vault-btn-group">
                          {/* Toggle View / Hide Button */}
                          <button
                            type="button"
                            className="btn-vault-action"
                            onClick={() => setIsKeyRevealed(!isKeyRevealed)}
                            id="toggle-license-visibility-btn"
                            title={isKeyRevealed ? "Hide private license key" : "Click to view full license key"}
                          >
                            {isKeyRevealed ? (
                              <>
                                <IconEyeOff size={16} />
                                <span>Hide Key</span>
                              </>
                            ) : (
                              <>
                                <IconEye size={16} />
                                <span>Click to View</span>
                              </>
                            )}
                          </button>

                          {/* Copy Button */}
                          <button
                            type="button"
                            className="btn-vault-copy"
                            onClick={() => handleCopyKey(activeLicense.license_key)}
                            id="copy-license-key-btn"
                            title="Copy license key to clipboard"
                          >
                            <IconCopy size={16} />
                            <span>{isCopied ? "Copied!" : "Copy Key"}</span>
                          </button>
                        </div>
                      </div>

                      <div className="vault-tip-row">
                        <IconShield size={14} />
                        <span>
                          Keep this key private. It locks automatically to your PC HWID on first injection.
                        </span>
                      </div>
                    </div>

                    {/* Machine HWID Lock Status */}
                    <div
                      style={{
                        background: "rgba(15, 23, 42, 0.5)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: 14,
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
                          Machine HWID Binding
                        </div>
                        <div style={{ fontSize: 13, color: "#ffffff", fontWeight: 600, marginTop: 2 }}>
                          {activeLicense.hwid ? (
                            <span style={{ color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
                              Locked: {activeLicense.hwid.substring(0, 16)}...
                            </span>
                          ) : (
                            <span style={{ color: "#10b981" }}>
                              ● Unbound (Auto-locks on first loader launch)
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        Need HWID reset? Open a ticket in Discord.
                      </div>
                    </div>
                  </>
                ) : (
                  /* No Active License Found */
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 18,
                        background: "rgba(245, 158, 11, 0.1)",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px auto",
                        color: "#f59e0b",
                      }}
                    >
                      <IconKey size={28} />
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
                      No Active VIP Pass
                    </h3>
                    <p style={{ fontSize: 13, color: "#94a3b8", maxWidth: 400, margin: "0 auto 20px auto", lineHeight: 1.5 }}>
                      You don't have an active Assault Fire PH license key bound to this Discord account yet.
                      Choose a pass below to start dominating.
                    </p>
                    <Link
                      href="/#pricing"
                      className="btn-vault-copy"
                      style={{ textDecoration: "none", display: "inline-flex" }}
                    >
                      Browse Passes (From ₱500)
                    </Link>
                  </div>
                )}
              </div>

              {/* Right Column: Loader Download & Injection Guide */}
              <div className="profile-side-card">
                <div>
                  <div className="loader-badge-banner">
                    <h3>
                      <IconShield size={16} />
                      <span>Chameleon Loader v2.6.4</span>
                    </h3>
                    <p>
                      Official Undetected Memory Virtualization Loader for Assault Fire PH (Legacy/Reborn/etc).
                    </p>
                  </div>

                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Downloading Chameleon Loader v2.6.4...\nEnsure your anti-virus adds an exclusion for game injector memory virtualization.");
                    }}
                    className="btn-download-loader"
                    id="download-loader-profile-btn"
                  >
                    <IconDownload size={20} />
                    <span>Download Loader (ZIP)</span>
                  </a>

                  <div style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.06em", marginBottom: 12 }}>
                    Quick Setup Guide
                  </div>

                  <div className="step-guide-list">
                    <div className="step-guide-item">
                      <span className="step-num-pill">1</span>
                      <div>
                        <strong>Extract Loader</strong>: Extract the downloaded archive into a private folder on your PC.
                      </div>
                    </div>
                    <div className="step-guide-item">
                      <span className="step-num-pill">2</span>
                      <div>
                        <strong>Run as Admin</strong>: Right click <code>ChameleonLoader.exe</code> and select Run as Administrator.
                      </div>
                    </div>
                    <div className="step-guide-item">
                      <span className="step-num-pill">3</span>
                      <div>
                        <strong>Input License</strong>: Paste your license key from this profile page.
                      </div>
                    </div>
                    <div className="step-guide-item">
                      <span className="step-num-pill">4</span>
                      <div>
                        <strong>Launch Game</strong>: Start Assault Fire PH. Press <kbd style={{ background: "#1e293b", padding: "2px 6px", borderRadius: 4, color: "#00d2ff" }}>F8</kbd> for Chams, <kbd style={{ background: "#1e293b", padding: "2px 6px", borderRadius: 4, color: "#a855f7" }}>F7</kbd> to change colors, and <kbd style={{ background: "#1e293b", padding: "2px 6px", borderRadius: 4, color: "#10b981" }}>INSERT</kbd> for Snaplines.
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#64748b" }}>
                  <span style={{ color: "#00ff87" }}>Status: Undetected ●</span>
                  <span>Patch: 2026.10</span>
                </div>
              </div>
            </div>

            {/* 3. ORDER HISTORY TABLE */}
            <section className="profile-orders-section" aria-label="Order History">
              <div className="profile-card-header" style={{ marginBottom: 16 }}>
                <div className="profile-card-title">
                  <IconDocument size={16} />
                  <span>Your Order & Payment History</span>
                </div>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  {userOrders.length} transaction{userOrders.length !== 1 ? "s" : ""}
                </span>
              </div>

              {userOrders.length > 0 ? (
                <div className="orders-table-wrapper">
                  <table className="profile-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Tier</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Reference / TXN</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>License Key</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userOrders.map((order) => (
                        <tr key={order.id || order.order_id}>
                          <td style={{ fontFamily: "var(--font-mono)", color: "#00d2ff" }}>
                            {order.order_id}
                          </td>
                          <td style={{ fontWeight: 700 }}>{order.tier}</td>
                          <td>
                            ₱{order.amount_php || order.amount}
                            {order.amount_usd ? ` ($${order.amount_usd})` : ""}
                          </td>
                          <td>
                            <span style={{ color: "#007dfe", fontWeight: 700 }}>
                              {order.payment_method || "GCash"}
                            </span>
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", color: "#94a3b8" }}>
                            {order.gcash_ref_no || "N/A"}
                          </td>
                          <td style={{ color: "#94a3b8", fontSize: 12 }}>
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
                                Pending Approval
                              </span>
                            )}
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)" }}>
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
                                Copy Key
                              </button>
                            ) : (
                              <span style={{ color: "#64748b" }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "30px", color: "#64748b", fontSize: 13 }}>
                  No payment orders found for this Discord user yet.
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Global Unified Footer (Taste-Skill) */}
      <Footer />
    </div>
  );
}
