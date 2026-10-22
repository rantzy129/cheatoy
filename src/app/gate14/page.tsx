"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./admin.css";

import useAdmin from "@/components/admin/useAdmin";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OrdersTab from "@/components/admin/OrdersTab";
import LicensesTab from "@/components/admin/LicensesTab";
import KeyGeneratorTab from "@/components/admin/KeyGeneratorTab";
import OverviewTab from "@/components/admin/OverviewTab";
import NotificationsTab from "@/components/admin/NotificationsTab";
import ReceiptLightbox from "@/components/admin/ReceiptLightbox";
import { IconDiscord, IconKeyMint } from "@/components/admin/Icons";

export default function AdminPage() {
  const {
    activeTab,
    setActiveTab,
    isAuthenticated,
    isVerifying,
    pin,
    setPin,
    showPin,
    setShowPin,
    errorMessage,
    setErrorMessage,
    orders,
    licenses,
    loading,
    isRefreshingOrders,
    actionLoading,
    setActionLoading,
    adminNotifs,
    notifTitle,
    setNotifTitle,
    notifMessage,
    setNotifMessage,
    notifType,
    setNotifType,
    notifTarget,
    setNotifTarget,
    notifActionLabel,
    setNotifActionLabel,
    notifActionUrl,
    setNotifActionUrl,
    isSendingNotif,
    notifStatusMsg,
    setNotifStatusMsg,
    notifInDatabase,
    notifDbError,
    copiedSql,
    setCopiedSql,
    genTier,
    setGenTier,
    genUser,
    setGenUser,
    isMinting,
    mintedKey,
    setMintedKey,
    isSyncingUsers,
    syncStatusMsg,
    syncCooldown,
    setSyncCooldown,
    minLoaderVersion,
    setMinLoaderVersion,
    downloadPageUrl,
    setDownloadPageUrl,
    isSavingVersion,
    versionStatusMsg,
    setVersionStatusMsg,
    selectedReceiptOrder,
    setSelectedReceiptOrder,
    receiptZoom,
    setReceiptZoom,
    copiedKey,
    setCopiedKey,
    orderFilter,
    setOrderFilter,
    searchQuery,
    setSearchQuery,
    handleLogin,
    handleLogout,
    handleApproveOrder,
    handleRejectOrder,
    handleSendNotification,
    handleDeleteNotification,
    handleSaveLoaderVersion,
    handleSyncUserListToDiscord,
    handleMintKey,
    handleResetHWID,
    handleToggleBan,
    handleExtendDays,
    handleAdminAttachSlip,
    handleCopy,
    filteredOrders,
    filteredLicenses,
    pendingOrdersCount,
    approvedOrdersCount,
    totalRevenue,
    loadAllData,
    fetchAdminNotifications,
    fetchOrders,
    fetchLicenses,
    fetchLoaderVersion,
  } = useAdmin();

  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        isAuthenticated={false}
        pin={pin}
        setPin={setPin}
        showPin={showPin}
        setShowPin={setShowPin}
        isVerifying={isVerifying}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        handleLogin={handleLogin}
      />
    );
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
        licensesCount={licenses.length}
        onLogout={handleLogout}
      />

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">
            <div className="admin-header-breadcrumb">
              <span>Command Center</span>
              <span>/</span>
              <span className="admin-breadcrumb-active">
                {activeTab === "orders" && "GCash Approvals"}
                {activeTab === "licenses" && "License Vault"}
                {activeTab === "generator" && "Key Minting"}
                {activeTab === "overview" && "Analytics"}
                {activeTab === "notifications" && "Broadcasts"}
              </span>
            </div>
          </div>
          <div className="admin-header-actions">
            <button
              type="button"
              onClick={handleSyncUserListToDiscord}
              disabled={isSyncingUsers || syncCooldown > 0}
              className="admin-btn-sync"
              title="Sync VIP Roles to Discord"
            >
              <IconDiscord size={14} />
              <span>
                {isSyncingUsers
                  ? "Syncing..."
                  : syncCooldown > 0
                  ? `Cooldown (${syncCooldown}s)`
                  : "Sync Discord VIPs"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("generator")}
              className="admin-btn-mint-cta"
            >
              <IconKeyMint size={13} />
              <span>Mint Key</span>
            </button>
          </div>
        </header>

        <div className="admin-content-area">
          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              licenses={licenses}
              searchQuery={searchQuery}
              orderFilter={orderFilter}
              setOrderFilter={setOrderFilter}
              actionLoading={actionLoading}
              selectedReceiptOrder={selectedReceiptOrder}
              setSelectedReceiptOrder={setSelectedReceiptOrder}
              receiptZoom={receiptZoom}
              setReceiptZoom={setReceiptZoom}
              copiedKey={copiedKey}
              setCopiedKey={setCopiedKey}
              handleApproveOrder={handleApproveOrder}
              handleRejectOrder={handleRejectOrder}
              handleAdminAttachSlip={handleAdminAttachSlip}
              handleCopy={handleCopy}
              fetchOrders={fetchOrders}
              isRefreshing={isRefreshingOrders}
            />
          )}

          {activeTab === "licenses" && (
            <LicensesTab
              licenses={licenses}
              searchQuery={searchQuery}
              actionLoading={actionLoading}
              copiedKey={copiedKey}
              setCopiedKey={setCopiedKey}
              handleResetHWID={handleResetHWID}
              handleToggleBan={handleToggleBan}
              handleExtendDays={handleExtendDays}
              minLoaderVersion={minLoaderVersion}
              setMinLoaderVersion={setMinLoaderVersion}
              downloadPageUrl={downloadPageUrl}
              setDownloadPageUrl={setDownloadPageUrl}
              isSavingVersion={isSavingVersion}
              versionStatusMsg={versionStatusMsg}
              handleSaveLoaderVersion={handleSaveLoaderVersion}
            />
          )}

          {activeTab === "generator" && (
            <KeyGeneratorTab
              genTier={genTier}
              setGenTier={setGenTier}
              genUser={genUser}
              setGenUser={setGenUser}
              isMinting={isMinting}
              mintedKey={mintedKey}
              setMintedKey={setMintedKey}
              copiedKey={copiedKey}
              setCopiedKey={setCopiedKey}
              handleMintKey={handleMintKey}
              handleCopy={handleCopy}
            />
          )}

          {activeTab === "overview" && (
            <OverviewTab
              orders={orders}
              licenses={licenses}
              totalRevenue={totalRevenue}
              pendingOrdersCount={pendingOrdersCount}
              approvedOrdersCount={approvedOrdersCount}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsTab
              adminNotifs={adminNotifs}
              notifTitle={notifTitle}
              setNotifTitle={setNotifTitle}
              notifMessage={notifMessage}
              setNotifMessage={setNotifMessage}
              notifType={notifType}
              setNotifType={setNotifType}
              notifTarget={notifTarget}
              setNotifTarget={setNotifTarget}
              notifActionLabel={notifActionLabel}
              setNotifActionLabel={setNotifActionLabel}
              notifActionUrl={notifActionUrl}
              setNotifActionUrl={setNotifActionUrl}
              isSendingNotif={isSendingNotif}
              notifStatusMsg={notifStatusMsg}
              setNotifStatusMsg={setNotifStatusMsg}
              notifInDatabase={notifInDatabase}
              notifDbError={notifDbError}
              copiedSql={copiedSql}
              setCopiedSql={setCopiedSql}
              handleSendNotification={handleSendNotification}
              handleDeleteNotification={handleDeleteNotification}
              fetchAdminNotifications={fetchAdminNotifications}
            />
          )}
        </div>

        {selectedReceiptOrder && (
          <ReceiptLightbox
            selectedReceiptOrder={selectedReceiptOrder}
            setSelectedReceiptOrder={setSelectedReceiptOrder}
            receiptZoom={receiptZoom}
            setReceiptZoom={setReceiptZoom}
            actionLoading={actionLoading}
            copiedKey={copiedKey}
            setCopiedKey={setCopiedKey}
            handleApproveOrder={handleApproveOrder}
            handleRejectOrder={handleRejectOrder}
            handleCopy={handleCopy}
          />
        )}
      </main>
    </div>
  );
}
