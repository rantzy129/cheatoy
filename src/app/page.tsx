"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  supabase,
  SUPABASE_URL,
  signInWithDiscord,
  signOut as supabaseSignOut,
  extractDiscordUser,
  DiscordUser,
} from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── SVG Icons (Zero Emojis) ─────────────────────────────── */
function IconCheck({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`icon-svg ${className}`}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconDiscord({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`icon-svg ${className}`}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function IconShield({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon-svg ${className}`}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconEye({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon-svg ${className}`}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon-svg ${className}`}>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function IconArrowUpRight({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`icon-svg ${className}`}>
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function IconRefresh({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`icon-svg ${className}`}>
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15.55-6.36L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15.55 6.36L3 16" />
    </svg>
  );
}

function IconClock({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon-svg ${className}`}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconZap({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon-svg ${className}`}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconCrosshair({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon-svg ${className}`}>
      <circle cx="12" cy="12" r="10" />
      <line x1="22" x2="18" y1="12" y2="12" />
      <line x1="6" x2="2" y1="12" y2="12" />
      <line x1="12" x2="12" y1="6" y2="2" />
      <line x1="12" x2="12" y1="22" y2="18" />
    </svg>
  );
}

function IconKey({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon-svg ${className}`}>
      <path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1.5-1.5L8 9l-1.5-1.5L5 9l-1.5-1.5L2 9l6 6c1.66 1.66 4.34 1.66 6 0l7-7-2-2z" />
    </svg>
  );
}

function IconLock({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`icon-svg ${className}`}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ─── Product Tiers (Assault Fire PH Chams) ───────────────── */
const TIERS = [
  {
    id: "7days",
    duration: "7 Days Pass",
    priceUsd: "$9.99",
    pricePhp: "₱500",
    desc: "Starter access for weekly matches & climbing",
  },
  {
    id: "15days",
    duration: "15 Days Pass",
    priceUsd: "$18.99",
    pricePhp: "₱1,000",
    desc: "Popular mid-tier pass for competitive play",
  },
  {
    id: "month",
    duration: "1 Month Pass",
    priceUsd: "$27.99",
    pricePhp: "₱1,500",
    desc: "Best monthly value with priority updates",
  },
  {
    id: "lifetime",
    duration: "Lifetime VIP",
    priceUsd: "$45.99",
    pricePhp: "₱2,500",
    desc: "Permanent loader access & all future updates",
  },
];

/* ─── FAQs ────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "Why do I need to log in with Discord before purchasing?",
    a: "Your license key and VIP role are securely attached to your Discord account. This ensures you can always recover your key and get automated update notifications.",
  },
  {
    q: "Does this work on the official Assault Fire PH client?",
    a: "Yes. Our Chams and Wallhack are fully updated and tested on the official PlayPark Assault Fire PH server.",
  },
  {
    q: "How do Chams work in Assault Fire PH?",
    a: "Chams (chameleon textures) render player models in bright solid colors visible through walls. You can distinguish enemies behind cover (blue) versus in line-of-sight (red).",
  },
  {
    q: "Will my Assault Fire account be banned?",
    a: "Our build uses external memory virtualization that does not modify game files, keeping it 100% undetected by the game's security system.",
  },
  {
    q: "What are the PC system requirements?",
    a: "Works on Windows 10 and Windows 11 (64-bit). Compatible with all Intel and AMD processors and all graphics cards.",
  },
];

export default function Home() {
  const [selectedTier, setSelectedTier] = useState(TIERS[0]); // 7 Days default (₱500)
  const [currency, setCurrency] = useState<"PHP" | "USD">("PHP");

  // Discord Auth State
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);

  // User Profile & Subscription State (Taste-Skill)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isKeyRevealed, setIsKeyRevealed] = useState(false); // DEFAULT AS HIDDEN
  const [activeLicense, setActiveLicense] = useState<any | null>(null);
  const [ticker, setTicker] = useState(0);

  // GCash Payment & Order State
  const [userOrder, setUserOrder] = useState<any | null>(null);
  const [isGcashModalOpen, setIsGcashModalOpen] = useState(false);
  const [gcashRefNo, setGcashRefNo] = useState("");
  const [senderName, setSenderName] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // License Key Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Real-time ticker for remaining time updates
  useEffect(() => {
    const timer = setInterval(() => setTicker((t) => t + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch latest order and active license for this user from Supabase
  const fetchUserOrder = async (user: DiscordUser) => {
    if (!supabase) return;
    try {
      const cleanUser = (user.username || "").replace(/#0+$/, "").trim();
      const orConditions: string[] = [];

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
        .order("created_at", { ascending: false })
        .limit(1);

      if (licData && licData.length > 0) {
        setActiveLicense(licData[0]);
        setGeneratedKey(licData[0].license_key);
        if (user.id && licData[0].discord_id !== user.id) {
          supabase
            .from("licenses")
            .update({ discord_id: user.id })
            .eq("id", licData[0].id)
            .then(() => {});
        }
      }

      // 2. Fetch order from orders table
      const { data: ordData } = await supabase
        .from("orders")
        .select("*")
        .or(orFilter)
        .order("created_at", { ascending: false })
        .limit(1);

      if (ordData && ordData.length > 0) {
        const latest = ordData[0];
        setUserOrder(latest);
        if (latest.status === "approved" && latest.license_key) {
          setGeneratedKey(latest.license_key);
          if (!licData || licData.length === 0) {
            setActiveLicense({
              license_key: latest.license_key,
              tier: latest.tier,
              expires_at: null,
            });
          }
        }
      }
    } catch (e) {
      console.warn("Notice fetching user data:", e);
    }
  };

  // Remaining time calculation helper
  const getRemainingTime = () => {
    if (!activeLicense) return null;
    if (!activeLicense.expires_at) {
      return { text: "Permanent VIP • Never Expires", isLifetime: true, isExpired: false };
    }
    const diff = new Date(activeLicense.expires_at).getTime() - Date.now();
    if (diff <= 0) {
      return { text: "Subscription Expired", isLifetime: false, isExpired: true };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      return { text: `${days}d ${hours}h ${minutes}m remaining`, isLifetime: false, isExpired: false };
    }
    return { text: `${hours}h ${minutes}m ${seconds}s remaining`, isLifetime: false, isExpired: false };
  };

  // Check saved session & Supabase Discord redirect on mount
  useEffect(() => {
    // 1. Check if returning from Supabase Discord callback with code or token hash
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");

      if (code && supabase) {
        supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
          if (!error && data?.session?.user) {
            const user = extractDiscordUser(data.session.user);
            if (user) {
              setDiscordUser(user);
              localStorage.setItem("af_discord_user", JSON.stringify(user));
              fetchUserOrder(user);
              window.history.replaceState(null, "", window.location.pathname);
            }
          }
        });
      }

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
                const user = extractDiscordUser(data);
                if (user) {
                  setDiscordUser(user);
                  localStorage.setItem("af_discord_user", JSON.stringify(user));
                  fetchUserOrder(user);
                  window.history.replaceState(null, "", window.location.pathname);
                }
              }
            })
            .catch((err) => console.warn("Supabase user fetch info:", err));
        }
      }
    }

    // 2. Check Supabase client session if available
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const user = extractDiscordUser(session.user);
          if (user) {
            setDiscordUser(user);
            localStorage.setItem("af_discord_user", JSON.stringify(user));
            fetchUserOrder(user);
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const user = extractDiscordUser(session.user);
          if (user) {
            setDiscordUser(user);
            localStorage.setItem("af_discord_user", JSON.stringify(user));
            fetchUserOrder(user);
          }
        }
      });

      return () => subscription.unsubscribe();
    }

    // 3. Fallback to localStorage
    const saved = localStorage.getItem("af_discord_user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setDiscordUser(u);
        fetchUserOrder(u);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleDiscordLogin = () => {
    signInWithDiscord();
  };

  const handleLogout = async () => {
    setDiscordUser(null);
    setUserOrder(null);
    localStorage.removeItem("af_discord_user");
    await supabaseSignOut();
  };

  const handleCheckout = () => {
    // REQUIRE LOGIN BEFORE PURCHASING
    if (!discordUser) {
      signInWithDiscord();
      return;
    }

    if (userOrder?.status === "approved" && userOrder.license_key) {
      setGeneratedKey(userOrder.license_key);
      setIsModalOpen(true);
      return;
    }

    setIsGcashModalOpen(true);
  };

  const handleSubmitGcashOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordUser) {
      signInWithDiscord();
      return;
    }
    if (!gcashRefNo.trim() || gcashRefNo.trim().length < 6) {
      setOrderError("Please enter a valid GCash / Bank reference number (at least 6 digits)");
      return;
    }

    setIsSubmittingOrder(true);
    setOrderError("");

    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier_id: selectedTier.id,
          discord_id: discordUser.id || discordUser.username,
          discord_username: discordUser.tag ? `${discordUser.username}#${discordUser.tag}` : discordUser.username,
          reference_no: gcashRefNo.trim(),
          sender_name: senderName.trim(),
          currency: currency,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setOrderError(data.error || "Failed to submit order");
      } else {
        setUserOrder(data.order);
        if (data.order_token) {
          localStorage.setItem("af_order_token", data.order_token);
        }
        setGcashRefNo("");
        setSenderName("");
      }
    } catch (err: any) {
      setOrderError("Submission failed: " + err.message);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleCopyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const currentPrice = currency === "PHP" ? selectedTier.pricePhp : selectedTier.priceUsd;

  return (
    <>
      {/* ─── Global Unified Navigation Header (Taste-Skill) ─── */}
      <Navbar />

      <main id="top">
        {/* ─── 1. Hero Section (Taste-Skill Anti-Slop Discipline) ─── */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Assault Fire PH Chams & Wallhack
            </h1>

            <p className="hero-desc">
              Direct memory virtualization for Assault Fire Philippines. Undetected player silhouettes through every wall with zero frame-rate impact and instant Discord key delivery.
            </p>

            <div className="hero-buttons">
              <a href="#pricing" className="btn-primary" id="hero-get-access">
                <span>Get VIP Pass</span>
                <span>↗</span>
              </a>
              <a href="#architecture" className="btn-secondary">
                <span>Kernel Architecture</span>
                <span>↓</span>
              </a>
            </div>
          </div>

          {/* ─── In-Game Verification Preview (Real Subject Asset) ── */}
          <div className="hero-preview-box">
            <div className="preview-header">
              <span className="preview-title">
                <Image
                  src="/af-logo.png"
                  alt="Assault Fire Logo"
                  width={20}
                  height={20}
                  className="game-logo-tag"
                />
                <span>Assault Fire PH • In-Game Proof</span>
              </span>
              <span className="preview-status">
                <span className="status-dot" /> Live Verified
              </span>
            </div>

            <div className="showcase-frame">
              <Image
                src="/proof.png"
                alt="Assault Fire PH Chams in-game proof showcase showing glowing character model"
                width={640}
                height={360}
                className="showcase-img"
                priority
              />
            </div>

            <div className="preview-meta-grid">
              <div className="preview-meta-item">
                <div className="preview-meta-label">Game Engine</div>
                <div className="preview-meta-val">DirectX 9 Hookless</div>
              </div>
              <div className="preview-meta-item">
                <div className="preview-meta-label">Render Mode</div>
                <div className="preview-meta-val">Silhouette DWM</div>
              </div>
              <div className="preview-meta-item">
                <div className="preview-meta-label">Status</div>
                <div className="preview-meta-val" style={{ color: "#10b981" }}>Undetected ●</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. Trust Metric Strip ────────────────────────────── */}
        <div className="trust-tape">
          <div className="trust-tape-inner">
            <div className="trust-item">
              <IconShield size={18} />
              <span>100% Kernel Memory Virtualization</span>
            </div>
            <div className="trust-item">
              <IconZap size={18} />
              <span>Zero Lag (60–240+ FPS Maintained)</span>
            </div>
            <div className="trust-item">
              <IconDiscord size={18} />
              <span>Instant Discord Bot Dispatch (&lt;1s)</span>
            </div>
            <div className="trust-item">
              <IconCrosshair size={18} />
              <span>PlayPark Official Server Ready</span>
            </div>
          </div>
        </div>

        {/* ─── 3. Kernel Bypass Architecture (Substantive Blueprint) ─ */}
        <section className="section" id="architecture">
          <div className="section-header-clean">
            <h2 className="section-heading">
              Kernel Bypass Architecture
            </h2>
            <p className="section-subtext">
              Conventional cheats hook game binaries directly and trigger detection within hours. Chameleon operates as an external, read-only memory virtualizer.
            </p>
          </div>

          <div className="arch-grid">
            {/* Column A: Conventional Detected Cheats */}
            <div className="arch-col-detected">
              <h3 className="arch-title">
                Direct Process Modification <span className="arch-badge-danger">Detected</span>
              </h3>
              <p className="arch-desc">
                Public tools inject untrusted DLL libraries into the Assault Fire game process, triggering automated anti-cheat signatures and server-side tripwires.
              </p>

              <ul className="arch-point-list">
                <li className="arch-point-item">
                  <span className="arch-point-bullet arch-bullet-danger" />
                  <div>
                    <strong>Process Memory Tampering</strong>: Writes to game memory space, instantly alerting client watchdog integrity scanners.
                  </div>
                </li>
                <li className="arch-point-item">
                  <span className="arch-point-bullet arch-bullet-danger" />
                  <div>
                    <strong>DirectX VTable Hooks</strong>: Overwrites graphics engine function pointers, causing detection by routine hash inspections.
                  </div>
                </li>
                <li className="arch-point-item">
                  <span className="arch-point-bullet arch-bullet-danger" />
                  <div>
                    <strong>File Modification</strong>: Replaces .rez archives and executable headers, failing launcher verification checks.
                  </div>
                </li>
              </ul>
            </div>

            {/* Column B: Chameleon Kernel Virtualization */}
            <div className="arch-col-safe">
              <h3 className="arch-title">
                External Read-Only Pipeline <span className="arch-badge-safe">Undetected</span>
              </h3>
              <p className="arch-desc">
                Chameleon never modifies or writes to Assault Fire process memory. Entity matrices are decoded externally and projected onto Windows DWM.
              </p>

              <ul className="arch-point-list">
                <li className="arch-point-item">
                  <span className="arch-point-bullet arch-bullet-safe" />
                  <div>
                    <strong>Zero Process Writing</strong>: Game memory space remains bit-for-bit identical to an unmodded, official PlayPark installation.
                  </div>
                </li>
                <li className="arch-point-item">
                  <span className="arch-point-bullet arch-bullet-safe" />
                  <div>
                    <strong>Untouched Game Files</strong>: Zero alterations to original .rez archives, executables, or launcher registry keys.
                  </div>
                </li>
                <li className="arch-point-item">
                  <span className="arch-point-bullet arch-bullet-safe" />
                  <div>
                    <strong>Desktop Window Manager Blit</strong>: Overlays render onto Windows desktop composition, remaining invisible to anti-cheat screenshot buffers and OBS streams.
                  </div>
                </li>
              </ul>

              <div className="arch-metrics-bar">
                <div>
                  <div className="arch-metric-num">0</div>
                  <div className="arch-metric-label">Account Bans</div>
                </div>
                <div>
                  <div className="arch-metric-num">&lt;0.18ms</div>
                  <div className="arch-metric-label">Frame Latency</div>
                </div>
                <div>
                  <div className="arch-metric-num">0.0</div>
                  <div className="arch-metric-label">FPS Drop</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5. VIP Access Passes (Single Product Suite) ───────── */}
        <section className="pricing-section" id="pricing">
          <div className="pricing-container">
            <div className="pricing-info-col">
              <h2>VIP Access Passes</h2>
              <p>
                Get full access to the undetected Assault Fire PH build. Login with Discord to bind your license key to your account, receive instant automated role assignment, and access our VIP downloads.
              </p>

              <ul className="checklist">
                <li>
                  <span className="check-icon">
                    <IconCheck size={14} />
                  </span>
                  <span>Full Enemy Chams (Custom Colors: Visible & Occluded)</span>
                </li>
                <li>
                  <span className="check-icon">
                    <IconCheck size={14} />
                  </span>
                  <span>Clean Player ESP & Distance Indicators</span>
                </li>
                <li>
                  <span className="check-icon">
                    <IconCheck size={14} />
                  </span>
                  <span>Undetected Anti-Cheat Protection for Assault Fire PH</span>
                </li>
                <li>
                  <span className="check-icon">
                    <IconCheck size={14} />
                  </span>
                  <span>Lightweight 1-Click Loader with Instant Injection</span>
                </li>
                <li>
                  <span className="check-icon">
                    <IconCheck size={14} />
                  </span>
                  <span>Discord-Bound Automated Key Delivery & VIP Role</span>
                </li>
              </ul>
            </div>

            {/* Single Product Checkout Box */}
            <div className="checkout-box">
              <div className="checkout-box-top">
                <div className="checkout-header-left">
                  <Image
                    src="/af-logo.png"
                    alt="AF Badge"
                    width={36}
                    height={36}
                    className="checkout-af-thumb"
                  />
                  <div className="product-tag-wrap">
                    <h3>Assault Fire PH Chams</h3>
                    <span>Private Direct-Memory Edition</span>
                  </div>
                </div>
              </div>

              <div className="selector-heading">
                <span>Select access duration</span>
                <button
                  type="button"
                  className="currency-toggle"
                  onClick={() => setCurrency(currency === "PHP" ? "USD" : "PHP")}
                >
                  Switch to {currency === "PHP" ? "USD ($)" : "PHP (₱)"}
                </button>
              </div>

              {/* Tiers Grid */}
              <div className="duration-grid">
                {TIERS.slice(0, 3).map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    className={`duration-btn ${selectedTier.id === tier.id ? "active" : ""}`}
                    onClick={() => setSelectedTier(tier)}
                  >
                    <span className="btn-duration-name">{tier.duration}</span>
                    <span className="btn-duration-price">
                      {currency === "PHP" ? tier.pricePhp : tier.priceUsd}
                    </span>
                  </button>
                ))}
              </div>

              {/* Lifetime Pass Button */}
              <button
                type="button"
                className={`lifetime-btn ${selectedTier.id === "lifetime" ? "active" : ""}`}
                onClick={() => setSelectedTier(TIERS[3])}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-title)" }}>
                    Lifetime VIP Pass
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    One-time payment • All future patches included
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17, color: "var(--blue-bright)" }}>
                  {currency === "PHP" ? TIERS[3].pricePhp : TIERS[3].priceUsd}
                </span>
              </button>

              {/* Price Summary */}
              <div className="price-summary-box">
                <div className="price-summary-title">
                  Selected License:
                  <strong>{selectedTier.duration}</strong>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="price-tag-big">{currentPrice}</span>
                  <span className="price-tag-sub">{currency}</span>
                </div>
              </div>

              {/* Discord Login Requirement Gate */}
              {discordUser ? (
                <div className="logged-in-user-tag">
                  <div className="logged-in-user-left">
                    <IconCheck size={14} />
                    <span>Logged in as <b>{discordUser.username}#{discordUser.tag}</b></span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: 11 }}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="auth-gate-notice">
                  <IconDiscord size={18} />
                  <span>Discord login required to bind license key and access download.</span>
                </div>
              )}

              {discordUser ? (
                activeLicense || userOrder?.status === "approved" ? (
                  <button
                    type="button"
                    className="buy-key-btn"
                    onClick={() => setIsProfileOpen(true)}
                    id="purchase-key-button"
                    style={{ background: "#10b981", color: "#ffffff" }}
                  >
                    <IconKey size={18} />
                    <span>View Profile & Active Key</span>
                    <IconCheck size={16} />
                  </button>
                ) : userOrder?.status === "pending" ? (
                  <button
                    type="button"
                    className="buy-key-btn"
                    onClick={() => setIsGcashModalOpen(true)}
                    id="purchase-key-button"
                    style={{ background: "#f59e0b", color: "#000000" }}
                  >
                    <IconClock size={16} />
                    <span>Order Pending Validation (Check Status)</span>
                    <IconArrowUpRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="buy-key-btn"
                    onClick={handleCheckout}
                    id="purchase-key-button"
                  >
                    <IconKey size={18} />
                    <span>Pay with GCash QR ({currentPrice})</span>
                    <IconArrowUpRight size={16} />
                  </button>
                )
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                  <button
                    type="button"
                    className="btn-discord-checkout"
                    onClick={handleDiscordLogin}
                    id="checkout-discord-button"
                  >
                    <IconDiscord size={20} />
                    <span>Login with Discord to Purchase</span>
                  </button>
                  <div className="discord-server-banner">
                    <span>Make sure you are in our server for instant @VIP role &amp; DM:</span>
                    <a
                      href="https://discord.gg/Whwxq9QAEN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="discord-banner-link"
                    >
                      Join Server ↗
                    </a>
                  </div>
                </div>
              )}

              <div className="checkout-trust-row">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <IconLock size={12} /> Secure Checkout
                </span>
                <span>•</span>
                <span>Instant Discord Linked Dispatch</span>
                <span>•</span>
                <span>24/7 Access</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6. Frequently Answered Questions ──────────────────── */}
        <section className="section" id="faq">
          <div className="section-header-clean">
            <h2 className="section-heading">
              Frequently Answered Questions
            </h2>
            <p className="section-subtext">
              Common questions regarding Assault Fire Philippines memory virtualization, anti-cheat detection safety, and installation.
            </p>
          </div>

          <div className="faq-wrap">
            {FAQS.map((item, index) => (
              <details className="faq-item" key={index} open={index === 0}>
                <summary className="faq-question">
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* ─── Global Unified Footer (Taste-Skill) ─── */}
      <Footer />

      {/* ─── GCash Payment & Order Status Modal ───────────── */}
      {isGcashModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGcashModalOpen(false)}>
          <div className="gcash-modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button
              className="modal-close"
              onClick={() => setIsGcashModalOpen(false)}
              aria-label="Close modal"
            >
              ×
            </button>

            {userOrder && userOrder.status === "pending" ? (
              // Order Pending State
              <div>
                <div className="gcash-modal-header">
                  <h3 className="gcash-modal-title">Payment Under Review</h3>
                  <p className="gcash-modal-sub">
                    Your GCash transaction reference is awaiting administrator validation.
                  </p>
                </div>

                <div className="order-status-card">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#94a3b8" }}>Order ID:</span>
                    <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#00d2ff" }}>
                      {userOrder.order_id}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#94a3b8" }}>License Plan:</span>
                    <span style={{ fontWeight: 700, color: "#f8fafc" }}>{userOrder.tier}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#94a3b8" }}>Amount:</span>
                    <span style={{ fontWeight: 700, color: "#00d2ff" }}>{userOrder.price}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#94a3b8" }}>GCash Reference No:</span>
                    <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#f8fafc" }}>
                      {userOrder.reference_no}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#94a3b8" }}>Bound Discord Tag:</span>
                    <span style={{ fontWeight: 700, color: "#5865f2" }}>
                      {userOrder.discord_username}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, textAlign: "center", marginBottom: 14 }}>
                  Our admin verifies incoming GCash merchant payments manually. Once validated, your license key will activate automatically and appear here.
                </p>

                <div className="modal-discord-banner">
                  <div className="modal-discord-banner-info">
                    <IconDiscord size={20} className="modal-discord-icon" />
                    <div>
                      <span className="modal-discord-banner-title">
                        Joined our Discord Server?
                      </span>
                      <span className="modal-discord-banner-sub">
                        Server members receive automated @VIP role &amp; private key DM in &lt;1s.
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://discord.gg/Whwxq9QAEN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-discord-banner-btn"
                  >
                    Join Server ↗
                  </a>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="gcash-btn-submit"
                    style={{ flex: 1 }}
                    onClick={() => discordUser && fetchUserOrder(discordUser)}
                  >
                    <span>↻ Refresh Status</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    style={{ padding: "12px 18px", borderRadius: 10 }}
                    onClick={() => setUserOrder(null)}
                  >
                    New Order
                  </button>
                </div>
              </div>
            ) : (
              // GCash QR Merchant Payment Form
              <div>
                <div className="gcash-modal-header">
                  <h3 className="gcash-modal-title">Scan to Pay via QR Ph</h3>
                  <p className="gcash-modal-sub">
                    Scan with GCash, Maya, or any InstaPay-supported banking application.
                  </p>
                </div>

                <div className="gcash-amount-banner">
                  <div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>Amount to Send:</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>{selectedTier.duration}</span>
                  </div>
                  <span className="gcash-amount-val">{currentPrice}</span>
                </div>

                <div className="gcash-qr-box">
                  <Image
                    src="/qr-code.jpg"
                    alt="CCheats InstaPay QR Ph Merchant Code"
                    width={240}
                    height={350}
                    className="gcash-qr-img"
                    priority
                  />
                  <span className="gcash-qr-caption">Merchant Name: CCheats</span>
                </div>

                <form onSubmit={handleSubmitGcashOrder}>
                  <div className="gcash-form-group">
                    <label className="gcash-form-label">
                      GCash Reference Number <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="gcash-input"
                      placeholder="e.g. 9012 3456 7890 (from receipt)"
                      value={gcashRefNo}
                      onChange={(e) => setGcashRefNo(e.target.value)}
                      required
                    />
                  </div>

                  <div className="gcash-form-group">
                    <label className="gcash-form-label">
                      Sender Name (Optional, for faster verification)
                    </label>
                    <input
                      type="text"
                      className="gcash-input"
                      placeholder="e.g. Juan D."
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                    />
                  </div>

                  <div style={{ fontSize: 11, color: "#64748b", margin: "10px 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                    <IconDiscord size={14} />
                    <span>Key will be bound to Discord: <b>{discordUser?.username}#{discordUser?.tag}</b></span>
                  </div>

                  <div className="modal-discord-banner">
                    <div className="modal-discord-banner-info">
                      <IconDiscord size={20} className="modal-discord-icon" />
                      <div>
                        <span className="modal-discord-banner-title">
                          Joined our Discord Server?
                        </span>
                        <span className="modal-discord-banner-sub">
                          Server members receive automated @VIP role &amp; private key DM in &lt;1s.
                        </span>
                      </div>
                    </div>
                    <a
                      href="https://discord.gg/Whwxq9QAEN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-discord-banner-btn"
                    >
                      Join Server ↗
                    </a>
                  </div>

                  {orderError && (
                    <span style={{ color: "#ef4444", fontSize: 12, display: "block", marginBottom: 10 }}>
                      {orderError}
                    </span>
                  )}

                  <button
                    type="submit"
                    className="gcash-btn-submit"
                    disabled={isSubmittingOrder}
                  >
                    <span>{isSubmittingOrder ? "Submitting Order..." : "Submit Payment for Admin Approval"}</span>
                    <IconArrowUpRight size={15} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ─── User Profile & Subscription Modal (Taste-Skill Art Direction) ─── */}
      {isProfileOpen && discordUser && (
        <div className="modal-overlay" onClick={() => setIsProfileOpen(false)}>
          <div className="profile-modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button
              className="modal-close"
              onClick={() => setIsProfileOpen(false)}
              aria-label="Close modal"
            >
              ×
            </button>

            {/* User Profile Header */}
            <div className="profile-header-section">
              <div className="profile-avatar-large">
                {discordUser.avatar_url ? (
                  <img
                    src={discordUser.avatar_url}
                    alt={discordUser.username}
                    style={{ width: "100%", height: "100%", borderRadius: 16, objectFit: "cover" }}
                  />
                ) : (
                  discordUser.username.charAt(0).toUpperCase()
                )}
                <span className="profile-status-indicator" title="Connected" />
              </div>
              <div className="profile-user-info">
                <h3>{discordUser.username}</h3>
                <div className="profile-meta-row">
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>#{discordUser.tag}</span>
                  <span className="profile-id-badge">ID: {discordUser.username}</span>
                  <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>● Discord Verified</span>
                </div>
              </div>
            </div>

            {/* Active Subscription & Remaining Time */}
            {activeLicense ? (
              <div className="subscription-card">
                <div className="subscription-top-row">
                  <span className="subscription-plan-title">
                    {activeLicense.tier || "VIP Pass"}
                  </span>
                  <span className="subscription-status-badge status-active-pill">
                    ● Active Subscription
                  </span>
                </div>

                <div className="remaining-time-box">
                  <div className="remaining-time-val">
                    <IconClock size={24} />
                    <span>{getRemainingTime()?.text}</span>
                  </div>
                  <div className="remaining-time-sub">
                    {activeLicense.expires_at ? (
                      <span>Valid until: {new Date(activeLicense.expires_at).toLocaleString()}</span>
                    ) : (
                      <span>Permanent Access • All future Assault Fire PH updates included</span>
                    )}
                  </div>
                </div>

                {/* Key Vault: Hidden by default, click to view */}
                <div className="key-vault-box">
                  <div className="key-vault-header">
                    <span className="key-vault-label">Assault Fire PH Private License Key</span>
                    <button
                      type="button"
                      className="btn-toggle-mask"
                      onClick={() => setIsKeyRevealed(!isKeyRevealed)}
                      title={isKeyRevealed ? "Click to hide key" : "Click to view key"}
                    >
                      {isKeyRevealed ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                      <span>{isKeyRevealed ? "Hide Key" : "Click to View"}</span>
                    </button>
                  </div>

                  <div className="key-display-row">
                    <span className="license-secret-text">
                      {isKeyRevealed
                        ? activeLicense.license_key
                        : (activeLicense.license_key ? "CHAM-••••-••••-••••" : "••••-••••-••••-••••")}
                    </span>
                    <button
                      type="button"
                      className="btn-profile-copy"
                      onClick={() => {
                        if (activeLicense.license_key) {
                          navigator.clipboard.writeText(activeLicense.license_key);
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2500);
                        }
                      }}
                    >
                      {isCopied ? "✓ Copied" : "Copy Key"}
                    </button>
                  </div>
                </div>

                <div className="profile-guide-box">
                  <h4>Quick Injection Instructions:</h4>
                  <ol>
                    <li>Download the <b>Chameleon AF Loader</b> below.</li>
                    <li>Right-click and <b>Run as Administrator</b>.</li>
                    <li>Paste your license key and press <b>Inject</b>.</li>
                    <li>Launch <b>Assault Fire PH</b> — player Chams will glow through walls automatically.</li>
                  </ol>
                </div>

                <a
                  href="/downloads/Chameleon_VIP.zip"
                  download="Chameleon_VIP.zip"
                  className="buy-key-btn"
                  style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}
                  id="download-loader-home-btn"
                >
                  <span>Download Loader (AF PH Build v2.6.4)</span>
                  <IconArrowUpRight size={16} />
                </a>
              </div>
            ) : userOrder && userOrder.status === "pending" ? (
              <div className="subscription-card">
                <div className="subscription-top-row">
                  <span className="subscription-plan-title">{userOrder.tier}</span>
                  <span className="subscription-status-badge status-pending-pill">
                    <IconClock size={14} />
                    <span>Order Pending Approval</span>
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5, margin: "10px 0" }}>
                  Your GCash payment (Ref: <b style={{ color: "#00d2ff", fontVariantNumeric: "tabular-nums" }}>{userOrder.reference_no}</b>) is being reviewed by the admin. Once approved, your subscription and license key will activate here automatically.
                </p>
                <button
                  type="button"
                  className="gcash-btn-submit"
                  onClick={() => fetchUserOrder(discordUser)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <IconRefresh size={14} />
                  <span>Refresh Status</span>
                </button>
              </div>
            ) : (
              <div className="subscription-card" style={{ textAlign: "center", padding: "28px 20px" }}>
                <span className="subscription-status-badge status-none-pill" style={{ marginBottom: 12 }}>
                  No Active Subscription
                </span>
                <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 18 }}>
                  You do not have an active Assault Fire PH Chams license yet. Select a pass below to purchase with GCash / InstaPay.
                </p>
                <button
                  type="button"
                  className="buy-key-btn"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsGcashModalOpen(true);
                  }}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <span>Purchase Pass with GCash</span>
                  <IconArrowUpRight size={16} />
                </button>
              </div>
            )}

            {/* Link to Dedicated Profile Page */}
            <div style={{ marginTop: 16 }}>
              <Link
                href="/profile"
                className="btn-profile-secondary"
                style={{ width: "100%", justifyContent: "center", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}
              >
                <span>Open Full Profile & License Vault Page</span>
                <IconArrowUpRight size={15} />
              </Link>
            </div>

            {/* Logout Option */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>
                Logged in as {discordUser.username}#{discordUser.tag}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  handleLogout();
                }}
                className="user-logout-btn"
                style={{ fontSize: 12, color: "#ef4444" }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
