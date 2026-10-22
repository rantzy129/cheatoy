"use client";

import React from "react";
import { Order, License } from "./types";

interface OverviewTabProps {
  orders: Order[];
  licenses: License[];
  totalRevenue: number;
  pendingOrdersCount: number;
  approvedOrdersCount: number;
}

export default function OverviewTab({
  orders,
  licenses,
  totalRevenue,
  pendingOrdersCount,
  approvedOrdersCount,
}: OverviewTabProps) {
  const activeLicenses = licenses.filter((l) => !l.is_banned).length;
  const hwidLocked = licenses.filter((l) => l.hwid).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <span className="admin-kpi-title">Gross Revenue</span>
          <div className="admin-kpi-value" style={{ color: "#10b981", marginTop: 6 }}>
            ₱{totalRevenue.toLocaleString()}
          </div>
          <span className="admin-kpi-sub">Total approved orders</span>
        </div>
        <div className="admin-kpi-card">
          <span className="admin-kpi-title">Active Licenses</span>
          <div className="admin-kpi-value" style={{ color: "#00d2ff", marginTop: 6 }}>
            {activeLicenses}
          </div>
          <span className="admin-kpi-sub">Valid keys in circulation</span>
        </div>
        <div className="admin-kpi-card">
          <span className="admin-kpi-title">Pending Backlog</span>
          <div className="admin-kpi-value" style={{ color: "#f59e0b", marginTop: 6 }}>
            {pendingOrdersCount}
          </div>
          <span className="admin-kpi-sub">Awaiting confirmation</span>
        </div>
        <div className="admin-kpi-card">
          <span className="admin-kpi-title">Bound Hardware Locks</span>
          <div className="admin-kpi-value" style={{ marginTop: 6 }}>
            {hwidLocked}
          </div>
          <span className="admin-kpi-sub">Locked to single PC</span>
        </div>
      </div>

      <div className="admin-architecture-card">
        <h3 className="admin-architecture-title">System Architecture & Enclave Status</h3>
        <div className="admin-arch-grid">
          <div className="admin-arch-item">
            <div className="admin-arch-item-title">Session Persistence</div>
            <div className="admin-arch-item-val" style={{ color: "#10b981" }}>
              HTTP-Only Secure Cookie
            </div>
            <span className="admin-arch-item-sub">Zero frontend storage footprint</span>
          </div>
          <div className="admin-arch-item">
            <div className="admin-arch-item-title">Anti-Cheat Driver</div>
            <div className="admin-arch-item-val" style={{ color: "#00d2ff" }}>
              Kernel Virtualization v4.2
            </div>
            <span className="admin-arch-item-sub">100% Undetected (Patch 2026.10)</span>
          </div>
          <div className="admin-arch-item">
            <div className="admin-arch-item-title">Security Gateway</div>
            <div className="admin-arch-item-val" style={{ color: "#f59e0b" }}>
              Active Rate Limiter (5 Max)
            </div>
            <span className="admin-arch-item-sub">15-minute brute-force lockout</span>
          </div>
        </div>
      </div>
    </div>
  );
}