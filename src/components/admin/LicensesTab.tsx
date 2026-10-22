"use client";

import React, { useMemo, useState, useEffect } from "react";
import { IconHardware, IconCopy, IconShieldLock, IconArrowRight } from "./Icons";
import { License } from "./types";
import PaginationBar from "./PaginationBar";

interface LicensesTabProps {
  licenses: License[];
  searchQuery: string;
  actionLoading: string | null;
  copiedKey: string | null;
  setCopiedKey: (v: string | null) => void;
  handleResetHWID: (licenseId: string) => Promise<void>;
  handleToggleBan: (licenseId: string) => Promise<void>;
  handleExtendDays: (lic: License, days?: number) => Promise<void>;
  minLoaderVersion?: string;
  setMinLoaderVersion?: (v: string) => void;
  downloadPageUrl?: string;
  setDownloadPageUrl?: (v: string) => void;
  isSavingVersion?: boolean;
  versionStatusMsg?: string | null;
  handleSaveLoaderVersion?: (e?: React.FormEvent, customVersion?: string) => Promise<void>;
}

export default function LicensesTab({
  licenses,
  searchQuery,
  actionLoading,
  copiedKey,
  setCopiedKey,
  handleResetHWID,
  handleToggleBan,
  handleExtendDays,
  minLoaderVersion = "v1.0.7",
  setMinLoaderVersion,
  downloadPageUrl = "https://www.chameleon-cheats.tech/profile",
  setDownloadPageUrl,
  isSavingVersion = false,
  versionStatusMsg = null,
  handleSaveLoaderVersion,
}: LicensesTabProps) {
  const [licensesPage, setLicensesPage] = useState(1);
  const [licensesPerPage, setLicensesPerPage] = useState(10);

  const q = searchQuery.toLowerCase().trim();

  useEffect(() => {
    setLicensesPage(1);
  }, [searchQuery]);

  const filteredLicenses = useMemo(() => {
    return licenses.filter((l) =>
      !q ||
      l.license_key.toLowerCase().includes(q) ||
      l.discord_id?.toLowerCase().includes(q) ||
      l.discord_username?.toLowerCase().includes(q) ||
      (l.hwid && l.hwid.toLowerCase().includes(q))
    );
  }, [licenses, searchQuery, q]);

  const paginatedLicenses = useMemo(() => {
    const start = (licensesPage - 1) * licensesPerPage;
    return filteredLicenses.slice(start, start + licensesPerPage);
  }, [filteredLicenses, licensesPage, licensesPerPage]);

  const onEmergencyKill = () => {
    if (window.confirm("⚠️ WARNING: This will immediately enforce version 99.9.9, causing ALL active loaders in circulation to terminate (ExitProcess) on their next heartbeat. Proceed?")) {
      handleSaveLoaderVersion?.(undefined, "99.9.9");
    }
  };

  const onResetDefault = () => {
    handleSaveLoaderVersion?.(undefined, "v1.0.7");
  };

  return (
    <div className="admin-licenses-wrapper">
      {/* ─── Remote Version Control & Kill Switch Card ─── */}
      <div style={{
        background: "rgba(9, 14, 24, 0.85)",
        border: "1px solid rgba(0, 210, 255, 0.25)",
        borderRadius: 12,
        padding: "18px 20px",
        marginBottom: 20,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 16,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          paddingBottom: 12,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{
                color: "#00d2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0, 210, 255, 0.12)",
                padding: 6,
                borderRadius: 8,
              }}>
                <IconShieldLock size={18} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#ffffff", letterSpacing: "-0.01em" }}>
                Remote Loader Version Control &amp; Killswitch
              </h3>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: minLoaderVersion === "99.9.9" ? "#ef4444" : "#00d2ff",
                background: minLoaderVersion === "99.9.9" ? "rgba(239, 68, 68, 0.15)" : "rgba(0, 210, 255, 0.12)",
                border: minLoaderVersion === "99.9.9" ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(0, 210, 255, 0.3)",
                padding: "2px 8px",
                borderRadius: 9999,
                fontFamily: "monospace",
              }}>
                {minLoaderVersion === "99.9.9" ? "🚨 ALL BUILDS KILLED (v99.9.9)" : `v${minLoaderVersion} Enforced`}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "6px 0 0 0", lineHeight: 1.45 }}>
              Enforces minimum loader version on every launch and background heartbeat check. Outdated builds return HTTP 403 and immediately execute <code>ExitProcess(0)</code>.
            </p>
          </div>

          {versionStatusMsg && (
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#10b981",
              background: "rgba(16, 185, 129, 0.12)",
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid rgba(16, 185, 129, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <span>✓</span>
              <span>{versionStatusMsg}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveLoaderVersion} style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 150 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Minimum Version
            </label>
            <input
              type="text"
              value={minLoaderVersion}
              onChange={(e) => setMinLoaderVersion?.(e.target.value)}
              placeholder="e.g. v1.0.7"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 8,
                padding: "8px 12px",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 700,
                outline: "none",
                fontFamily: "monospace",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 260 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Update Download URL (Opened on Outdated Error)
            </label>
            <input
              type="text"
              value={downloadPageUrl}
              onChange={(e) => setDownloadPageUrl?.(e.target.value)}
              placeholder="https://www.chameleon-cheats.tech/profile"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 8,
                padding: "8px 12px",
                color: "#ffffff",
                fontSize: 12,
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={isSavingVersion}
              style={{
                background: "linear-gradient(135deg, #00d2ff 0%, #0077ff 100%)",
                color: "#04070e",
                fontWeight: 700,
                fontSize: 12,
                border: "none",
                borderRadius: 8,
                padding: "9px 16px",
                cursor: isSavingVersion ? "wait" : "pointer",
                opacity: isSavingVersion ? 0.7 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 38,
              }}
            >
              <span>{isSavingVersion ? "Enforcing..." : "Save & Enforce Version"}</span>
              <IconArrowRight size={13} />
            </button>

            <button
              type="button"
              onClick={onResetDefault}
              disabled={isSavingVersion}
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#cbd5e1",
                fontWeight: 600,
                fontSize: 12,
                borderRadius: 8,
                padding: "9px 12px",
                cursor: "pointer",
                height: 38,
              }}
              title="Reset minimum version to standard default (v1.0.7)"
            >
              Reset v1.0.7
            </button>

            <button
              type="button"
              onClick={onEmergencyKill}
              disabled={isSavingVersion}
              style={{
                background: "rgba(239, 68, 68, 0.18)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                color: "#f87171",
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 8,
                padding: "9px 14px",
                cursor: "pointer",
                height: 38,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
              title="Emergency: Immediately kill and block all circulating VIP loaders"
            >
              <span>🚨 Kill All (v99.9.9)</span>
            </button>
          </div>
        </form>
      </div>

      <div className="admin-licenses-header">
        <h2 className="admin-licenses-title">License Vault</h2>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>License Key</th>
              <th>Bound Discord User</th>
              <th>Tier</th>
              <th>Hardware ID (HWID)</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderLicenses()}
          </tbody>
        </table>
      </div>

      {filteredLicenses.length > 0 && (
        <PaginationBar
          currentPage={licensesPage}
          totalItems={filteredLicenses.length}
          itemsPerPage={licensesPerPage}
          onPageChange={setLicensesPage}
          onItemsPerPageChange={(n) => {
            setLicensesPerPage(n);
            setLicensesPage(1);
          }}
          itemLabel="licenses"
        />
      )}

      {filteredLicenses.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: 13 }}>
          No licenses found matching your filters.
        </div>
      )}
    </div>
  );
  function renderLicenses() {
    return paginatedLicenses.map((lic) => {
      const isLifetime = !lic.expires_at;
      const isActive = !isLifetime && new Date(lic.expires_at!).getTime() > Date.now();
      const userLabel = lic.discord_username || lic.discord_id || lic.license_key;

      return (
        <tr key={lic.id} className="admin-table-row">
          <td>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#ffffff", fontWeight: 700 }}>
              {lic.license_key}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
              {lic.discord_id ? `ID: ${lic.discord_id}` : "Unbound"}
            </div>
          </td>
          <td>
            <div style={{ fontWeight: 600, color: "#ffffff" }}>{lic.discord_username || "Unassigned"}</div>
            {lic.discord_id && (
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#556882", marginTop: 2 }}>
                {lic.discord_id}
              </div>
            )}
          </td>
          <td>
            <span style={{ fontWeight: 600, color: "#ffffff", fontSize: 13 }}>
              {lic.tier || "VIP Pass"}
            </span>
          </td>
          <td>
            {lic.hwid ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IconHardware size={14} />
                <span style={{ fontFamily: "monospace", fontSize: 12, color: "#f59e0b" }}>
                  {lic.hwid.substring(0, 12)}…
                </span>
              </div>
            ) : (
              <span style={{ color: "#64748b", fontSize: 12 }}>—</span>
            )}
          </td>
          <td>
            {isLifetime ? (
              <span style={{ fontSize: 12, color: "#00d2ff", fontWeight: 700 }}>Permanent VIP</span>
            ) : (
              <>
                <div style={{ fontSize: 11, color: "#70849e" }}>
                  {new Date(lic.expires_at!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: isActive ? "#10b981" : "#ef4444",
                    marginTop: 2,
                    fontWeight: 700,
                  }}
                >
                  {isActive
                    ? `● ${Math.max(1, Math.ceil((new Date(lic.expires_at!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining`
                    : "● Expired"}
                </div>
              </>
            )}
          </td>
          <td>
            <span className={`admin-status-badge ${lic.is_banned ? "admin-status-badge-rejected" : "admin-status-badge-approved"}`}>
              {lic.is_banned ? "BANNED" : "ACTIVE"}
            </span>
          </td>
          <td style={{ textAlign: "right" }}>
            {renderActions(lic)}
          </td>
        </tr>
      );
    });
  }

  function renderActions(lic: License) {
    return (
      <div style={{ display: "inline-flex", gap: 6 }}>
        {lic.expires_at !== null && (
          <button
            type="button"
            onClick={() => handleExtendDays(lic, 1)}
            disabled={actionLoading === lic.id}
            className="admin-btn-extend-day"
            title="Add +1 Extra Day for Discord Vouch"
          >
            {actionLoading === lic.id ? "Adding…" : "+1 Day"}
          </button>
        )}
        {lic.hwid && (
          <button
            type="button"
            onClick={() => handleResetHWID(lic.id)}
            className="admin-btn-hwid-reset"
            title="Unbind HWID"
          >
            Reset HWID
          </button>
        )}
        <button
          type="button"
          onClick={() => handleToggleBan(lic.id)}
          className={`admin-btn-ban-toggle ${lic.is_banned ? "unban" : "ban"}`}
        >
          {lic.is_banned ? "Unban" : "Ban Key"}
        </button>
      </div>
    );
  }
}
