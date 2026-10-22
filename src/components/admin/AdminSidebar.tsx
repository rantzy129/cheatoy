"use client";

import React from "react";
import {
  IconShieldLock,
  IconOrders,
  IconKeyVault,
  IconKeyMint,
  IconOverview,
  IconBell,
  IconLogout,
} from "./Icons";
import { AdminTab } from "./types";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingOrdersCount: number;
  licensesCount: number;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingOrdersCount,
  licensesCount,
  onLogout,
}: AdminSidebarProps) {
  return (
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
            <span style={{ fontSize: 11, color: "#64748b" }}>{licensesCount}</span>
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
              <span>Analytics</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <div className="admin-nav-item-left">
              <IconBell size={17} />
              <span>Broadcasts</span>
            </div>
          </button>
        </div>

        <div className="admin-nav-section" style={{ marginTop: "auto" }}>
          <button
            type="button"
            className="admin-nav-item admin-nav-item-logout"
            onClick={onLogout}
          >
            <div className="admin-nav-item-left">
              <IconLogout size={17} />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}