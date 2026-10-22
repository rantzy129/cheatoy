"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconShieldLock,
  IconKey,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
} from "./Icons";

interface AdminLoginFormProps {
  isAuthenticated: boolean;
  pin: string;
  setPin: (v: string) => void;
  showPin: boolean;
  setShowPin: (v: boolean) => void;
  isVerifying: boolean;
  errorMessage: string | null;
  setErrorMessage: (v: string | null) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
}

export default function AdminLoginForm({
  isAuthenticated,
  pin,
  setPin,
  showPin,
  setShowPin,
  isVerifying,
  errorMessage,
  setErrorMessage,
  handleLogin,
}: AdminLoginFormProps) {
  if (isAuthenticated) return null;

  return (
    <div className="admin-login-fullscreen">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-logo">
            <Image
              src="/logo.png"
              alt="Chameleon Cheats Logo"
              width={36}
              height={36}
              priority
            />
          </div>
        </div>

        <h1 className="admin-login-title">Staff Console Access</h1>
        <p className="admin-login-desc">
          Enter master security key to manage licenses, verify GCash transactions, and issue VIP passes.
        </p>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-input-group">
            <label className="admin-input-label" htmlFor="admin-pin-field">
              Master Security Key
            </label>
            <div className="admin-input-container">
              <div className="admin-input-lead-icon">
                <IconKey size={16} />
              </div>
              <input
                id="admin-pin-field"
                type={showPin ? "text" : "password"}
                placeholder="Enter security key..."
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMessage(null);
                }}
                className="admin-pin-field"
                autoFocus
                disabled={isVerifying}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                className="admin-input-toggle-btn"
                onClick={() => setShowPin(!showPin)}
                tabIndex={-1}
                aria-label={showPin ? "Hide key" : "Show key"}
              >
                {showPin ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="admin-login-error" role="alert">
              <span className="admin-error-icon">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="admin-btn-auth"
            disabled={isVerifying || !pin.trim()}
          >
            {isVerifying ? (
              <span className="admin-btn-content">
                <span className="admin-button-spinner" />
                <span>Verifying Credentials...</span>
              </span>
            ) : (
              <span className="admin-btn-content">
                <IconShieldLock size={16} />
                <span>Authenticate Console</span>
              </span>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link href="/" className="admin-return-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <IconArrowLeft size={13} className="btn-arrow-left" />
            <span>Return to Storefront</span>
          </Link>
          <span className="admin-security-badge">HTTP-Only Encrypted</span>
        </div>
      </div>
    </div>
  );
}