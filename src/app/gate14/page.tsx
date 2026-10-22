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
