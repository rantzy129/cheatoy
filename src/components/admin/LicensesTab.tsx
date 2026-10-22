"use client";

import React, { useMemo, useState, useEffect } from "react";
import { IconHardware, IconCopy } from "./Icons";
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

  return (
    <div className="admin-licenses-wrapper">
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