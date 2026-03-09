"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "./providers/ThemeProvider";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

interface NotificationCenterProps {
  onNavigate?: (link: string) => void;
}

export function NotificationCenter({ onNavigate }: NotificationCenterProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside, true);
    return () => document.removeEventListener("mousedown", handleOutside, true);
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const markRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {};
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <path strokeLinecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />;
      case "invite":
        return <path strokeLinecap="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />;
      case "share":
        return <path strokeLinecap="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />;
      default:
        return <path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        className={`relative flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 active:scale-90 ${isLight ? "border-slate-300/50 text-slate-500 hover:bg-slate-200/60 hover:text-slate-700" : "border-slate-700/50 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
        onClick={() => setOpen(!open)}
        title="Notifications"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white animate-bounce-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl glass-panel-solid shadow-2xl animate-scale-in overflow-hidden">
          {/* Header */}
          <div className={`flex items-center justify-between border-b px-4 py-3 ${isLight ? "border-slate-200/60" : "border-slate-700/30"}`}>
            <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Notifications</span>
            {unreadCount > 0 && (
              <button
                className="text-[11px] font-medium text-brand-400 transition hover:text-brand-300"
                onClick={markAllRead}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl border ${isLight ? "border-slate-200/60 bg-slate-100/60 text-slate-400" : "border-slate-700/30 bg-slate-800/40 text-slate-600"}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className={`text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-all duration-200 ${isLight ? "hover:bg-slate-100/60" : "hover:bg-slate-800/30"} ${
                    !n.read ? "bg-brand-500/5" : ""
                  }`}
                  onClick={() => {
                    markRead(n.id);
                    if (n.link && onNavigate) onNavigate(n.link);
                  }}
                >
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                    !n.read
                      ? "border-brand-500/30 bg-brand-500/10 text-brand-400"
                      : isLight
                        ? "border-slate-200/60 bg-slate-100/60 text-slate-400"
                        : "border-slate-700/30 bg-slate-800/40 text-slate-500"
                  }`}>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      {typeIcon(n.type)}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium truncate ${!n.read ? (isLight ? "text-slate-800" : "text-slate-100") : (isLight ? "text-slate-500" : "text-slate-400")}`}>
                        {n.title}
                      </span>
                      {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />}
                    </div>
                    <p className={`mt-0.5 text-xs line-clamp-2 ${isLight ? "text-slate-400" : "text-slate-500"}`}>{n.body}</p>
                    <span className={`mt-1 text-[10px] ${isLight ? "text-slate-400" : "text-slate-600"}`}>{formatTime(n.createdAt)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
