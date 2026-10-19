"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  supabase,
  extractDiscordUser,
  getStoredUser,
  storeUser,
  clearStoredUser,
  signInWithDiscord,
  signOut,
  DiscordUser,
} from "@/lib/supabase";

function IconDiscord({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
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

export default function Navbar() {
  const pathname = usePathname();
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);

  useEffect(() => {
    // 1. Initial cached user
    const cached = getStoredUser();
    if (cached) {
      setDiscordUser(cached);
    }

    // 2. Live Supabase session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u = extractDiscordUser(session.user);
          if (u) {
            setDiscordUser(u);
            storeUser(u);
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u = extractDiscordUser(session.user);
          if (u) {
            setDiscordUser(u);
            storeUser(u);
          }
        } else if (_event === "SIGNED_OUT") {
          setDiscordUser(null);
          clearStoredUser();
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    await signOut();
    setDiscordUser(null);
    clearStoredUser();
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/profile")) {
      window.location.reload();
    }
  };

  return (
    <header className="site-global-header" id="main-navigation-bar">
      <div className="site-header-inner">
        {/* Brand identity */}
        <Link href="/" className="site-brand-link" title="Chameleon Cheats — Assault Fire PH">
          <Image
            src="/logo.png"
            alt="Chameleon Cheats Logo"
            width={38}
            height={38}
            className="brand-logo-img"
            priority
          />
          <div className="site-brand-text">
            <span className="site-brand-name">CHAMELEON CHEATS</span>
            <span className="site-brand-tagline">Assault Fire PH VIP</span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="site-nav-links" aria-label="Main Navigation">
          <Link
            href="/"
            className={`site-nav-item ${pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/#studio"
            className="site-nav-item"
          >
            Chams Studio
          </Link>
          <Link
            href="/#architecture"
            className="site-nav-item"
          >
            Architecture
          </Link>
          <Link
            href="/#pricing"
            className="site-nav-item"
          >
            Pricing
          </Link>
          <Link
            href="/#faq"
            className="site-nav-item"
          >
            FAQ
          </Link>
          <Link
            href="/profile"
            className={`site-nav-item ${pathname === "/profile" ? "active" : ""}`}
          >
            Profile & Vault
          </Link>
          <a
            href="https://discord.gg/Whwxq9QAEN"
            target="_blank"
            rel="noopener noreferrer"
            className="site-nav-item"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#5865F2" }}
            title="Join official Discord community"
          >
            <IconDiscord size={15} />
            <span>Discord Server</span>
          </a>
        </nav>

        {/* Right action section */}
        <div className="site-header-actions">
          {discordUser ? (
            <div className="site-user-auth-wrap">
              <Link
                href="/profile"
                className="site-user-profile-pill"
                id="header-user-profile-pill"
                title="View your VIP Profile & License Key"
              >
                {discordUser.avatar_url ? (
                  <img
                    src={discordUser.avatar_url}
                    alt={discordUser.username}
                    className="site-avatar-thumb"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://cdn.discordapp.com/embed/avatars/0.png";
                    }}
                  />
                ) : (
                  <div className="site-avatar-fallback">
                    {discordUser.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="site-user-labels">
                  <span className="site-user-name">{discordUser.username}</span>
                  <span className="site-user-sub">VIP Portal</span>
                </div>
              </Link>
              <button
                type="button"
                className="site-logout-action"
                onClick={handleLogout}
                title="Log out of Discord"
              >
                <IconLogout size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="site-discord-btn"
              onClick={() => signInWithDiscord()}
              id="header-discord-login-btn"
            >
              <IconDiscord size={18} />
              <span>Login with Discord</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
