"use client";

import React, { useMemo, useState, useEffect } from "react";
import { IconReceipt, IconCopy, IconRefresh } from "./Icons";
import { Order, License } from "./types";
import PaginationBar from "./PaginationBar";

interface OrdersTabProps {
  orders: Order[];
  licenses: License[];
  searchQuery: string;
  orderFilter: "all" | "pending" | "approved" | "rejected";
  setOrderFilter: (v: "all" | "pending" | "approved" | "rejected") => void;
  actionLoading: string | null;
  selectedReceiptOrder: Order | null;
  setSelectedReceiptOrder: (o: Order | null) => void;
  receiptZoom: boolean;
  setReceiptZoom: (v: boolean) => void;
  copiedKey: string | null;
  setCopiedKey: (v: string | null) => void;
  handleApproveOrder: (order: Order) => Promise<void>;
  handleRejectOrder: (order: Order) => Promise<void>;
  handleAdminAttachSlip: (orderId: string, file: File) => Promise<void>;
  handleCopy: (val: string) => void;
  fetchOrders?: (silent?: boolean) => Promise<void>;
  isRefreshing?: boolean;
}

export default function OrdersTab({
  orders,
  licenses,
  searchQuery,
  orderFilter,
  setOrderFilter,
  actionLoading,
  selectedReceiptOrder,
  setSelectedReceiptOrder,
  receiptZoom,
  setReceiptZoom,
  copiedKey,
  setCopiedKey,
  handleApproveOrder,
  handleRejectOrder,
  handleAdminAttachSlip,
  handleCopy,
  fetchOrders,
  isRefreshing,
}: OrdersTabProps) {
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);

  const q = searchQuery.toLowerCase().trim();

  useEffect(() => {
    setOrdersPage(1);
  }, [searchQuery, orderFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesQuery =
        !q ||
        o.order_id.toLowerCase().includes(q) ||
        o.discord_username.toLowerCase().includes(q) ||
        o.discord_id.toLowerCase().includes(q) ||
        (o.reference_no && o.reference_no.toLowerCase().includes(q)) ||
        (o.referred_by && o.referred_by.toLowerCase().includes(q));

      const matchesFilter =
        orderFilter === "all" || o.status === orderFilter;

      return matchesQuery && matchesFilter;
    });
  }, [orders, searchQuery, orderFilter, q]);

  const paginatedOrders = useMemo(() => {
    const start = (ordersPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, ordersPage, ordersPerPage]);

  return (
    <div className="admin-orders-wrapper">
      <div className="admin-orders-header">
        <h2 className="admin-orders-title">GCash Approvals</h2>
        <div className="admin-orders-controls">
          <div className="admin-sync-badge" title="Real-time order synchronization active via Supabase & heartbeat">
            <span className="admin-sync-dot" />
            <span>Auto-Sync Active</span>
          </div>

          <select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value as any)}
            className="admin-form-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending Only</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {fetchOrders && (
            <button
              type="button"
              onClick={() => fetchOrders(false)}
              disabled={isRefreshing}
              className="admin-tab-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, padding: "6px 12px" }}
              title="Force refresh orders from database"
            >
              <span className={isRefreshing ? "admin-spin" : ""}>
                <IconRefresh size={13} />
              </span>
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Plan / Price</th>
              <th>Reference No</th>
              <th>Sender</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderOrders()}
          </tbody>
        </table>
      </div>

      {filteredOrders.length > 0 && (
        <PaginationBar
          currentPage={ordersPage}
          totalItems={filteredOrders.length}
          itemsPerPage={ordersPerPage}
          onPageChange={setOrdersPage}
          onItemsPerPageChange={(n) => {
            setOrdersPerPage(n);
            setOrdersPage(1);
          }}
          itemLabel="orders"
        />
      )}

      {filteredOrders.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: 13 }}>
          No orders found matching your filters.
        </div>
      )}
    </div>
  );
  function renderOrders() {
    return paginatedOrders.map((order) => {
      const refMatch = (order.payment_method || "").match(/\[ref:(.*?)\]/);
      const referredBy = refMatch && refMatch[1] ? refMatch[1].trim() : null;
      const hasSlip = order.payment_method?.includes("[receipt:");
      const isPending = order.status === "pending";

      return (
        <tr key={order.id} className="admin-table-row">
          <td>
            <div style={{ fontFamily: "monospace", color: "#00d2ff", fontWeight: 700 }}>
              {order.order_id}
            </div>
          </td>
          <td>
            <div style={{ fontWeight: 600, color: "#ffffff" }}>{order.discord_username}</div>
            {referredBy && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 4,
                  fontSize: 11,
                  color: "#ec4899",
                  background: "rgba(236, 72, 153, 0.12)",
                  border: "1px solid rgba(236, 72, 153, 0.3)",
                  borderRadius: 4,
                  padding: "2px 6px",
                  fontWeight: 600,
                }}
              >
                <span>🎁 Ref: @{referredBy}</span>
              </div>
            )}
          </td>
          <td>
            <span
              className={`admin-status-badge admin-status-badge-${order.status === "approved" ? "approved" : "pending"}`}
              style={{ marginBottom: 4 }}
            >
              {order.tier}
            </span>
            <div style={{ fontWeight: 700, color: "#ffffff", fontSize: 13 }}>
              {order.price}
            </div>
          </td>
          <td>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "monospace", color: "#00d2ff", fontWeight: 700 }}>
                {order.reference_no}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(order.reference_no)}
                className="admin-btn-copy-inline"
              >
                {copiedKey === order.reference_no ? "Copied" : "Copy"}
              </button>
            </div>
            {hasSlip ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedReceiptOrder(order);
                  setReceiptZoom(false);
                }}
                className="admin-btn-view-receipt"
                title="View GCash Payment Screenshot"
              >
                <IconReceipt size={12} />
                <span>View Slip</span>
              </button>
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span className="admin-no-receipt-label">No slip (Manual ref)</span>
                <label
                  htmlFor={`admin-slip-upload-${order.order_id}`}
                  className="admin-btn-copy-inline"
                  style={{ cursor: "pointer", fontSize: 10, padding: "2px 6px", textDecoration: "none" }}
                  title="Upload receipt screenshot received via Discord"
                >
                  + Attach
                  <input
                    id={`admin-slip-upload-${order.order_id}`}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleAdminAttachSlip(order.order_id, e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </td>
          <td style={{ color: order.sender_name ? "#f1f5f9" : "#556882" }}>
            {order.sender_name || "—"}
          </td>
          <td style={{ fontSize: 12, color: "#70849e", whiteSpace: "nowrap" }}>
            {new Date(order.created_at).toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </td>
          <td>
            <span className={`admin-status-badge admin-status-badge-${order.status}`}>
              {order.status}
            </span>
          </td>
          <td style={{ textAlign: "right" }}>
            {renderActions(order, isPending)}
          </td>
        </tr>
      );
    });
  }

  function renderActions(order: Order, isPending: boolean) {
    if (isPending) {
      return (
        <div style={{ display: "inline-flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => handleApproveOrder(order)}
            disabled={actionLoading === order.id}
            className="admin-btn-approve"
          >
            {actionLoading === order.id ? "Issuing..." : "Approve & Issue"}
          </button>
          <button
            type="button"
            onClick={() => handleRejectOrder(order)}
            disabled={actionLoading === order.id}
            className="admin-btn-reject"
            title="Reject Order"
          >
            ✕
          </button>
        </div>
      );
    }
    if (order.status === "approved") {
      return (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 12, color: "#ffffff" }}>
            {order.license_key}
          </span>
          {order.license_key && (
            <button
              type="button"
              onClick={() => handleCopy(order.license_key!)}
              className="admin-btn-copy-inline"
            >
              {copiedKey === order.license_key ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      );
    }
    return null;
  }
}