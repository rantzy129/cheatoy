"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

function IconShield({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="site-global-footer">
      <div className="site-footer-inner">
        {/* Brand and Mission */}
        <div className="site-footer-col brand-col">
          <div className="site-footer-brand">
            <Image
              src="/logo.png"
              alt="Chameleon Cheats Logo"
              width={34}
              height={34}
              className="brand-logo-img"
            />
            <div>
              <span className="footer-brand-title">CHAMELEON CHEATS</span>
              <span className="footer-brand-sub">Assault Fire PH VIP</span>
            </div>
          </div>
          <p className="footer-brand-desc">
            Next-generation undetected Chams and Wallhack for Assault Fire PH.
            Built with hardware-level memory virtualization to ensure zero FPS drop and 100% anti-cheat evasion.
          </p>
          <div className="footer-status-pill">
            <span className="footer-status-dot" />
            <span>Anti-Cheat Status: Undetected (Patch 2026.10)</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="site-footer-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links-list">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#studio">Live Chams Studio</Link></li>
            <li><Link href="/#architecture">Kernel Architecture</Link></li>
            <li><Link href="/#pricing">Pass Pricing (₱500+)</Link></li>
            <li><Link href="/#faq">Frequently Asked Questions</Link></li>
            <li><Link href="/profile">VIP Profile & Key Vault</Link></li>
            <li>
              <a
                href="https://discord.gg/Whwxq9QAEN"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#5865F2", fontWeight: 700 }}
              >
                Join Discord Server ↗
              </a>
            </li>
          </ul>
        </div>

        {/* Available Passes */}
        <div className="site-footer-col">
          <h4 className="footer-col-title">VIP Passes</h4>
          <ul className="footer-links-list">
            <li><Link href="/#pricing">7 Days Pass  ₱500</Link></li>
            <li><Link href="/#pricing">15 Days Pass  ₱1,000</Link></li>
            <li><Link href="/#pricing">1 Month Pass  ₱1,500</Link></li>
            <li><Link href="/#pricing">Lifetime VIP  ₱2,500</Link></li>
          </ul>
        </div>

        {/* Technical Guarantee */}
        <div className="site-footer-col">
          <h4 className="footer-col-title">Security & Tech</h4>
          <ul className="footer-specs-list">
            <li>
              <IconCheck size={14} />
              <span>External Virtualization (Zero memory hook)</span>
            </li>
            <li>
              <IconCheck size={14} />
              <span>Single PC HWID Locked Protection</span>
            </li>
            <li>
              <IconCheck size={14} />
              <span>Discord Account Verification Bound</span>
            </li>
            <li>
              <IconCheck size={14} />
              <span>Instant GCash / InstaPay QR Ph Activation</span>
            </li>
            <li>
              <IconCheck size={14} />
              <span>Windows 10 / 11 (64-bit) Full Support</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Legal Bar */}
      <div className="site-footer-bottom">
        <div className="footer-bottom-inner">
          <span className="footer-copy">
            © {new Date().getFullYear()} Chameleon Cheats. All rights reserved.
          </span>
          <span className="footer-disclaimer">
            Assault Fire PH is a registered trademark of PlayPark / Tencent Games. Chameleon Cheats is not affiliated with PlayPark.
          </span>
        </div>
      </div>
    </footer>
  );
}
