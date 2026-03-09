"use client";
import React from "react";
import { useTheme } from "./providers/ThemeProvider";

interface PresenceUser {
  id: string;
  name: string;
  avatarUrl?: string;
  color?: string;
}

interface PresenceAvatarsProps {
  users: PresenceUser[];
  currentUserId?: string;
  maxVisible?: number;
}

export function PresenceAvatars({ users, currentUserId, maxVisible = 5 }: PresenceAvatarsProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  // Filter out current user
  const others = users.filter(u => u.id !== currentUserId);
  if (others.length === 0) return null;

  const visible = others.slice(0, maxVisible);
  const overflow = others.length - maxVisible;
  const borderColor = isLight ? "border-white" : "border-slate-900";

  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-2">
        {visible.map((user) => (
          <div
            key={user.id}
            className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 ${borderColor} text-[10px] font-bold text-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 hover:z-10 hover:shadow-lg`}
            style={{ backgroundColor: user.color || '#6366f1' }}
            title={`${user.name} is viewing`}
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              user.name.slice(0, 2).toUpperCase()
            )}
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center">
  <span className="absolute inline-flex h-full w-full animate-presence-ping rounded-full bg-emerald-400 opacity-50" />
  <span className={`relative inline-flex h-2 w-2 rounded-full border ${borderColor} bg-emerald-400`} />
</span>
          </div>
        ))}
        {overflow > 0 && (
          <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${borderColor} ${isLight ? "bg-slate-200 text-slate-600" : "bg-slate-700 text-slate-300"} text-[10px] font-bold`}>
            +{overflow}
          </div>
        )}
      </div>
      <span className={`ml-1.5 text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{others.length} online</span>
    </div>
  );
}
