"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

function IconHome({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconZap({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="nf-container">
      {/* Cyber Background Mesh */}
      <div className="nf-grid-bg" />
      <div className="nf-orb-cyan" />
      <div className="nf-orb-emerald" />

      <div className="nf-card">
        {/* Tactical Corner Crosshairs */}
        <span className="nf-corner nf-tl" />
        <span className="nf-corner nf-tr" />
        <span className="nf-corner nf-bl" />
        <span className="nf-corner nf-br" />

        {/* Logo Emblem */}
        <div className="nf-emblem-wrapper">
          <div className="nf-emblem-ring" />
          <div className="nf-emblem">
            <Image
              src="/logo.png"
              alt="Chameleon Logo"
              width={46}
              height={46}
              priority
            />
          </div>
        </div>

        <div className="nf-badge">ENCLAVE ERROR &bull; CODE 404</div>

        <h1 className="nf-title">404</h1>
        <h2 className="nf-subtitle">GATEWAY NOT FOUND</h2>
        <p className="nf-desc">
          The route, resource, or enclave you are attempting to access does not
          exist, has been restricted, or was permanently relocated.
        </p>

        {/* Improved Dual Action Buttons */}
        <div className="nf-buttons-row">
          <Link href="/" className="nf-btn-primary">
            <IconHome size={16} />
            <span>Return to Storefront</span>
          </Link>
          <Link href="/#pricing" className="nf-btn-secondary">
            <IconZap size={15} />
            <span>VIP Passes & Pricing</span>
          </Link>
        </div>

        <div className="nf-foot-tag">
          <span>SECURITY PROTOCOL ENFORCED &bull; CHAM-OS</span>
        </div>
      </div>
    </div>
  );
}
