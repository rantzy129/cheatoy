"use client";

import React from "react";
import { IconReceipt, IconZoomIn, IconZoomOut, IconExternalLink, IconCheck } from "./Icons";
import { Order } from "./types";

interface ReceiptLightboxProps {
  selectedReceiptOrder: Order | null;
  setSelectedReceiptOrder: (o: Order | null) => void;
  receiptZoom: boolean;
  setReceiptZoom: (v: boolean) => void;
  actionLoading: string | null;
  copiedKey: string | null;
  setCopiedKey: (v: string | null) => void;
  handleApproveOrder: (order: Order) => Promise<void>;
  handleRejectOrder: (order: Order) => Promise<void>;
  handleCopy: (val: string) => void;
}

export default function ReceiptLightbox({
  selectedReceiptOrder,
  setSelectedReceiptOrder,
  receiptZoom,
  setReceiptZoom,
  actionLoading,
  copiedKey,
  setCopiedKey,
  handleApproveOrder,
  handleRejectOrder,
  handleCopy,
}: ReceiptLightboxProps) {
  if (!selectedReceiptOrder) return null;

  return (
    <div
      className="admin-receipt-lightbox-overlay"
      onClick={() => setSelectedReceiptOrder(null)}
      role="dialog"
      aria-modal="true"
    >
      <div className="admin-receipt-lightbox-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-receipt-lightbox-header">
          <div className="admin-receipt-lightbox-header-left">
            <IconReceipt size={16} />
            <h3 className="admin-receipt-lightbox-title">GCash Payment Verification Slip</h3>
            <span className="admin-receipt-id-pill">{selectedReceiptOrder.order_id}</span>
            <span className={`admin-status-badge admin-status-badge-${selectedReceiptOrder.status}`}>
              {selectedReceiptOrder.status}
            </span>
          </div>
          <button
            type="button"
            className="admin-receipt-lightbox-close"
            onClick={() => setSelectedReceiptOrder(null)}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="admin-receipt-lightbox-body">
          <div className="admin-receipt-viewport-container">
            <div className="admin-receipt-viewport-toolbar">
              <span>Customer Transaction Screenshot</span>
              <div className="admin-receipt-toolbar-actions">
                <button
                  type="button"
                  className="admin-receipt-toolbar-btn"
                  onClick={() => setReceiptZoom(!receiptZoom)}
                >
                  {receiptZoom ? <IconZoomOut size={12} /> : <IconZoomIn size={12} />}
                  <span>{receiptZoom ? "Fit View" : "Zoom 100%"}</span>
                </button>
                <a
                  href={
                    selectedReceiptOrder.receipt_url?.startsWith("data:image/")
                      ? `/api/order/receipt-image?order_id=${selectedReceiptOrder.order_id}`
                      : selectedReceiptOrder.receipt_url || "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-receipt-toolbar-btn"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                >
                  <IconExternalLink size={12} />
                  <span>Open Original</span>
                </a>
              </div>
            </div>

            <div
              className="admin-receipt-image-stage"
              onClick={() => setReceiptZoom(!receiptZoom)}
              title="Click to toggle zoom"
            >
              <img
                src={selectedReceiptOrder.receipt_url || `/api/order/receipt-image?order_id=${selectedReceiptOrder.order_id}`}
                alt={`GCash Slip ${selectedReceiptOrder.order_id}`}
                className={receiptZoom ? "zoomed" : ""}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  const fallback = `/api/order/receipt-image?order_id=${selectedReceiptOrder.order_id}`;
                  if (!img.src.includes(fallback)) {
                    img.src = fallback;
                  }
                }}
              />
            </div>
          </div>
          <div className="admin-receipt-sidebar">
            <div className="admin-receipt-details-list">
              <div className="admin-receipt-detail-item">
                <span className="admin-receipt-detail-label">Product Plan</span>
                <span className="admin-receipt-detail-value" style={{ color: "#00d2ff" }}>
                  {selectedReceiptOrder.tier}
                </span>
              </div>

              {selectedReceiptOrder.referred_by && (
                <div className="admin-receipt-detail-item" style={{ background: "rgba(236, 72, 153, 0.08)", padding: "10px", borderRadius: 6, border: "1px solid rgba(236, 72, 153, 0.25)" }}>
                  <span className="admin-receipt-detail-label" style={{ color: "#f472b6" }}>🎁 Clanmate Referral</span>
                  <div style={{ marginTop: 3, fontSize: 13, color: "#ffffff", fontWeight: 600 }}>
                    Referred by: @{selectedReceiptOrder.referred_by}
                  </div>
                  <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 2 }}>
                    Perk: Buyer gets +1 Bonus Day. Referrer earns +1 Free Day (active VIP gets +1 day extended, non-VIP gets 1-day pass).
                  </div>
                </div>
              )}
              <div className="admin-receipt-detail-item">
                <span className="admin-receipt-detail-label">Amount Due / Sent</span>
                <span className="admin-receipt-detail-value" style={{ color: "#ffffff", fontSize: 16 }}>
                  {selectedReceiptOrder.price}
                </span>
              </div>

              <div className="admin-receipt-detail-item">
                <span className="admin-receipt-detail-label">GCash Reference No</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 14, color: "#38bdf8", fontWeight: 700 }}>
                    {selectedReceiptOrder.reference_no}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedReceiptOrder.reference_no)}
                    className="admin-btn-copy-inline"
                  >
                    {copiedKey === selectedReceiptOrder.reference_no ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="admin-receipt-detail-item">
                <span className="admin-receipt-detail-label">Sender Name</span>
                <span className="admin-receipt-detail-value" style={{ color: selectedReceiptOrder.sender_name ? "#f1f5f9" : "#64748b" }}>
                  {selectedReceiptOrder.sender_name || "Not specified"}
                </span>
              </div>

              <div className="admin-receipt-detail-item">
                <span className="admin-receipt-detail-label">Customer Discord</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                  <span style={{ fontWeight: 700, color: "#f1f5f9" }}>
                    @{selectedReceiptOrder.discord_username}
                  </span>
                  {selectedReceiptOrder.discord_id && (
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: "#556882" }}>
                      ({selectedReceiptOrder.discord_id})
                    </span>
                  )}
                </div>
              </div>

              <div className="admin-receipt-detail-item">
                <span className="admin-receipt-detail-label">Submitted At</span>
                <span className="admin-receipt-detail-value" style={{ fontSize: 12, color: "#94a3b8" }}>
                  {new Date(selectedReceiptOrder.created_at).toLocaleString()}
                </span>
              </div>

              {selectedReceiptOrder.license_key && (
                <div className="admin-receipt-detail-item" style={{ background: "rgba(16, 185, 129, 0.08)", padding: "10px", borderRadius: 6, border: "1px solid #065f46" }}>
                  <span className="admin-receipt-detail-label" style={{ color: "#34d399" }}>Issued License Key</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 13, color: "#ffffff", fontWeight: 700 }}>
                      {selectedReceiptOrder.license_key}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedReceiptOrder.license_key!)}
                      className="admin-btn-copy-inline"
                    >
                      {copiedKey === selectedReceiptOrder.license_key ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-receipt-actions-footer">
              {selectedReceiptOrder.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleApproveOrder(selectedReceiptOrder)}
                    disabled={actionLoading === selectedReceiptOrder.id}
                    className="admin-btn-lightbox-approve"
                  >
                    <IconCheck size={14} />
                    <span>{actionLoading === selectedReceiptOrder.id ? "Issuing Key…" : "Approve & Issue Key"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRejectOrder(selectedReceiptOrder)}
                    disabled={actionLoading === selectedReceiptOrder.id}
                    className="admin-btn-lightbox-reject"
                  >
                    <span>✕ Reject Order</span>
                  </button>
                </>
              )}
              {selectedReceiptOrder.status !== "pending" && (
                <button
                  type="button"
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="admin-btn-mint-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Close Window (Esc)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}