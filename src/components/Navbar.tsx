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
import NotificationBell from "@/components/NotificationBell";

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

function IconMenu({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconClose({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconHome({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconTag({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function IconCrosshair({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
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

function IconGift({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function IconKey({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.6 9.6" />
      <path d="M15.5 7.5l3 3L22 7l-3-3" />
    </svg>
  );
}

function IconChevronRight({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconExternalLink({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Automatically close mobile menu on page transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Auth synchronization
  useEffect(() => {
    const cached = getStoredUser();
    if (cached) {
      setDiscordUser(cached);
    }

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
    setIsMobileMenuOpen(false);
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/profile")) {
      window.location.reload();
    }
  };

  return (
    <header className="site-global-header" id="main-navigation-bar">
      <div className="site-header-inner">
        {/* Brand identity */}
        <Link href="/" className="site-brand-link" title="Chameleon Cheats — Assault Fire PH" onClick={() => setIsMobileMenuOpen(false)}>
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

        {/* Desktop Navigation Links */}
        <nav className="site-nav-links" aria-label="Main Navigation">
          <Link
            href="/"
            className={`site-nav-item ${pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/#pricing"
            className="site-nav-item"
          >
            Pricing
          </Link>
          <Link
            href="/profile?tab=referrals"
            className="site-nav-referral-highlight"
            title="Earn Free VIP Days by inviting clanmates"
          >
            <span>Referrals</span>
            <span className="site-nav-referral-badge">+1 Day</span>
          </Link>
          <Link
            href="/profile"
            className={`site-nav-item ${pathname === "/profile" ? "active" : ""}`}
          >
            Vault
          </Link>
        </nav>

        {/* Right Action Section */}
        <div className="site-header-actions">
          {/* Chameleon Cheats Official Notifications */}
          <NotificationBell currentUser={discordUser} />

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
                className="site-logout-action desktop-only-logout"
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
              <span className="site-discord-btn-text">Login with Discord</span>
            </button>
          )}

          {/* Mobile Navigation Toggle Button */}
          <button
            type="button"
            className="site-mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer Navigation */}
      {isMobileMenuOpen && (
        <>
          <div
            className="site-mobile-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav className="site-mobile-drawer" aria-label="Mobile Navigation Drawer">
            <div className="site-mobile-drawer-inner">
              {/* Navigation Items Group */}
              <div className="site-mobile-nav-group">
                <Link
                  href="/"
                  className={`site-mobile-nav-link ${pathname === "/" ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="mobile-nav-item-left">
                    <span className="mobile-nav-icon"><IconHome size={16} /></span>
                    <span className="mobile-nav-text">Home</span>
                  </div>
                  <IconChevronRight size={14} className="mobile-nav-arrow" />
                </Link>

                <Link
                  href="/#pricing"
                  className="site-mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="mobile-nav-item-left">
                    <span className="mobile-nav-icon"><IconTag size={16} /></span>
                    <span className="mobile-nav-text">VIP Pass Pricing</span>
                  </div>
                  <span className="mobile-nav-meta">From ₱150</span>
                </Link>

                <Link
                  href="/#features"
                  className="site-mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="mobile-nav-item-left">
                    <span className="mobile-nav-icon"><IconCrosshair size={16} /></span>
                    <span className="mobile-nav-text">Feature Arsenal</span>
                  </div>
                  <IconChevronRight size={14} className="mobile-nav-arrow" />
                </Link>

                <Link
                  href="/#proofs"
                  className="site-mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="mobile-nav-item-left">
                    <span className="mobile-nav-icon"><IconShield size={16} /></span>
                    <span className="mobile-nav-text">In-Game Combat Proofs</span>
                  </div>
                  <IconChevronRight size={14} className="mobile-nav-arrow" />
                </Link>

                <Link
                  href="/profile?tab=referrals"
                  className="site-mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="mobile-nav-item-left">
                    <span className="mobile-nav-icon"><IconGift size={16} /></span>
                    <span className="mobile-nav-text">Referral Program</span>
                  </div>
                  <span className="mobile-nav-badge-pill">+1 Day VIP</span>
                </Link>

                <Link
                  href="/profile"
                  className={`site-mobile-nav-link ${pathname === "/profile" ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="mobile-nav-item-left">
                    <span className="mobile-nav-icon"><IconKey size={16} /></span>
                    <span className="mobile-nav-text">VIP Key Vault</span>
                  </div>
                  <IconChevronRight size={14} className="mobile-nav-arrow" />
                </Link>
              </div>

              {/* Mobile Auth / Profile Action Card */}
              <div className="site-mobile-auth-card">
                {discordUser ? (
                  <div className="site-mobile-user-details">
                    <div className="site-mobile-user-row">
                      <div className="site-mobile-avatar-wrap">
                        {discordUser.avatar_url ? (
                          <img
                            src={discordUser.avatar_url}
                            alt={discordUser.username}
                            className="site-avatar-thumb"
                          />
                        ) : (
                          <div className="site-avatar-fallback">
                            {discordUser.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="site-mobile-online-status" title="Discord Connected" />
                      </div>
                      <div className="site-mobile-user-meta">
                        <div className="site-mobile-user-name">{discordUser.username}</div>
                        <div className="site-mobile-user-sub">Discord Connected • VIP Access</div>
                      </div>
                    </div>
                    <div className="site-mobile-auth-buttons">
                      <Link
                        href="/profile"
                        className="site-mobile-btn-profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <IconKey size={14} />
                        <span>Open VIP Vault</span>
                      </Link>
                      <button
                        type="button"
                        className="site-mobile-btn-logout"
                        onClick={handleLogout}
                      >
                        <IconLogout size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="site-mobile-login-box">
                    <div className="site-mobile-login-head">
                      <span className="site-mobile-login-title">VIP Access &amp; License Keys</span>
                      <span className="site-mobile-login-sub">
                        Connect with Discord to retrieve your active VIP license key, loader download link, and clan referral earnings.
                      </span>
                    </div>
                    <button
                      type="button"
                      className="site-mobile-discord-login"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signInWithDiscord();
                      }}
                    >
                      <IconDiscord size={18} />
                      <span>Connect with Discord</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Community Link */}
              <a
                href="https://discord.gg/Whwxq9QAEN"
                target="_blank"
                rel="noopener noreferrer"
                className="site-mobile-discord-community"
              >
                <div className="site-mobile-community-left">
                  <IconDiscord size={18} />
                  <div className="site-mobile-community-text">
                    <span className="site-mobile-community-name">Official Discord Server</span>
                    <span className="site-mobile-community-desc">Combat proofs, updates &amp; live support</span>
                  </div>
                </div>
                <IconExternalLink size={14} />
              </a>

              {/* Status & Version Footer */}
              <div className="site-mobile-drawer-footer">
                <span className="site-mobile-status-dot" />
                <span className="site-mobile-status-text">Chameleon VIP • Undetected on AFPH</span>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
