"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { NotificationItem } from "@/lib/notifications";
import { DiscordUser } from "@/lib/supabase";

interface NotificationBellProps {
  currentUser: DiscordUser | null;
  hasActiveLicense?: boolean;
}

function IconBell({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconVerifiedShield({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function IconArrowUpRight({ size = 12, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function IconArrowRight({ size = 12, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconCheck({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function NotificationBell({ currentUser, hasActiveLicense }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [isInGuild, setIsInGuild] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load read notification IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cham_read_notifs");
      if (stored) {
        setReadIds(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Check Discord guild membership if user is signed in
  useEffect(() => {
    if (!currentUser?.id && !currentUser?.username) {
      setIsInGuild(null);
      return;
    }

    let isMounted = true;
    const checkGuild = async () => {
      try {
        const params = new URLSearchParams();
        if (currentUser.id) params.set("discord_id", currentUser.id);
        if (currentUser.username) params.set("username", currentUser.username);

        const res = await fetch(`/api/discord/check-member?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setIsInGuild(data.in_guild);
          }
        }
      } catch (e) {
        console.warn("[NotificationBell] Failed checking guild:", e);
      }
    };

    checkGuild();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Fetch notifications for the user
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentUser?.id) params.set("discord_id", currentUser.id);
      if (currentUser?.username) params.set("username", currentUser.username);
      if (hasActiveLicense) params.set("has_license", "true");
      if (isInGuild !== null) params.set("in_guild", String(isInGuild));

      const res = await fetch(`/api/notifications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      }
    } catch (err) {
      console.warn("[NotificationBell] Failed fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser, hasActiveLicense, isInGuild]);

  // Close dropdown on click outside or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setReadIds((prev) => {
      const updated = Array.from(new Set([...prev, id]));
      try {
        localStorage.setItem("cham_read_notifs", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem("cham_read_notifs", JSON.stringify(allIds));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  return (
    <div className="notif-wrapper" ref={containerRef}>
      <button
        type="button"
        className={`notif-trigger-btn ${isOpen ? "active" : ""}`}
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) fetchNotifications();
        }}
        aria-label="Chameleon Cheats Notifications"
        aria-expanded={isOpen}
      >
        <IconBell size={17} />
        {unreadCount > 0 && (
          <span className="notif-badge-counter">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notif-flyout" role="dialog" aria-label="Notifications from Chameleon Cheats">
          {/* Header */}
          <div className="notif-head">
            <div className="notif-head-title-wrap">
              <span className="notif-head-title">NOTIFICATIONS</span>
              <span className="notif-head-sub">Official from Chameleon Cheats</span>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notif-mark-all-btn"
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                <IconCheck size={12} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="notif-body">
            {isLoading && notifications.length === 0 ? (
              <div className="notif-empty">
                <span className="notif-empty-text">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <IconVerifiedShield size={20} />
                <span className="notif-empty-title">All caught up</span>
                <span className="notif-empty-text">No active alerts from Chameleon Cheats.</span>
              </div>
            ) : (
              notifications.map((item) => {
                const isRead = readIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`notif-card ${isRead ? "read" : "unread"} ${item.type}`}
                  >
                    {/* Card Meta Header */}
                    <div className="notif-card-header">
                      <div className="notif-sender-pill">
                        <IconVerifiedShield size={12} />
                        <span className="notif-sender-name">Chameleon Cheats</span>
                      </div>
                      {!isRead && (
                        <button
                          type="button"
                          className="notif-dismiss-btn"
                          onClick={() => markAsRead(item.id)}
                          title="Mark as read"
                        >
                          Mark read
                        </button>
                      )}
                    </div>

                    {/* Card Title & Content */}
                    <div className="notif-card-title">{item.title}</div>
                    <div className="notif-card-msg">{item.message}</div>

                    {/* Action Link / Button */}
                    {item.actionUrl && (
                      <div className="notif-card-action">
                        {item.actionUrl.startsWith("http") ? (
                          <a
                            href={item.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="notif-action-link"
                            onClick={() => {
                              markAsRead(item.id);
                              setIsOpen(false);
                            }}
                          >
                            <span>{item.actionLabel || "Open Action"}</span>
                            <IconArrowUpRight size={12} className="btn-arrow-external" />
                          </a>
                        ) : (
                          <Link
                            href={item.actionUrl}
                            className="notif-action-link"
                            onClick={() => {
                              markAsRead(item.id);
                              setIsOpen(false);
                            }}
                          >
                            <span>{item.actionLabel || "View Details"}</span>
                            <IconArrowRight size={12} className="btn-arrow-right" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="notif-foot">
            <span className="notif-foot-dot" />
            <span>Chameleon Broadcast Enclave • AFPH VIP</span>
          </div>
        </div>
      )}
    </div>
  );
}
