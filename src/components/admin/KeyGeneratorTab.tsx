"use client";

import React from "react";
import { IconKeyMint, IconCopy } from "./Icons";
import { License } from "./types";

interface KeyGeneratorTabProps {
  genTier: string;
  setGenTier: (v: string) => void;
  genUser: string;
  setGenUser: (v: string) => void;
  isMinting: boolean;
  mintedKey: string | null;
  setMintedKey: (v: string | null) => void;
  copiedKey: string | null;
  setCopiedKey: (v: string | null) => void;
  handleMintKey: (e: React.FormEvent) => Promise<void>;
  handleCopy: (val: string) => void;
}

export default function KeyGeneratorTab({
  genTier,
  setGenTier,
  genUser,
  setGenUser,
  isMinting,
  mintedKey,
  setMintedKey,
  copiedKey,
  setCopiedKey,
  handleMintKey,
  handleCopy,
}: KeyGeneratorTabProps) {
  return (
    <div className="admin-mint-wrapper">
      <div className="admin-mint-card">
        <div className="admin-mint-header">
          <div className="admin-mint-icon">
            <IconKeyMint size={20} />
          </div>
          <div>
            <h2 className="admin-mint-title">Mint VIP Access Key</h2>
            <span className="admin-mint-sub">
              Issue manual loader license key for customer or giveaway
            </span>
          </div>
        </div>

        <form onSubmit={handleMintKey}>
          <div className="admin-form-group">
            <label className="admin-form-label">Tier Duration</label>
            <select
              value={genTier}
              onChange={(e) => setGenTier(e.target.value)}
              className="admin-form-select"
            >
              <option value="1 Day Pass">1 Day Pass (24 Hours Promo / Vouch)</option>
              <option value="3 Days Pass">3 Days Pass (₱150)</option>
              <option value="7 Days Pass">7 Days Pass (₱300)</option>
              <option value="15 Days Pass">15 Days Pass (₱550)</option>
              <option value="1 Month Pass">1 Month Pass (₱850)</option>
              <option value="Lifetime VIP">Lifetime VIP (₱1,500)</option>
            </select>
          </div>

          <div className="admin-form-group" style={{ marginBottom: 20 }}>
            <label className="admin-form-label">Recipient / Discord Handle (Optional)</label>
            <input
              type="text"
              placeholder="e.g. somaris1 or Staff Issue"
              value={genUser}
              onChange={(e) => setGenUser(e.target.value)}
              className="admin-form-input"
            />
          </div>

          {mintedKey && (
            <div className="admin-mint-result">
              <div>
                <span className="admin-mint-key-label">Generated Key:</span>
                <div className="admin-mint-key-val">{mintedKey}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(mintedKey)}
                className="admin-btn-approve"
              >
                {copiedKey === mintedKey ? "Copied!" : "Copy Key"}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isMinting}
            className="admin-btn-mint-submit"
          >
            {isMinting ? "Minting Key..." : "Mint License Key"}
          </button>
        </form>
      </div>
    </div>
  );
}
