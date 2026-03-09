"use client";
import React from "react";

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
  // Filter out current user
  const others = users.filter(u => u.id !== currentUserId);
  if (others.length === 0) return null;

  const visible = others.slice(0, maxVisible);
  const overflow = others.length - maxVisible;

  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-2">
        {visible.map((user) => (
          <div
            key={user.id}
            className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 text-[10px] font-bold text-white shadow-sm transition-transform hover:scale-110 hover:z-10"
            style={{ backgroundColor: user.color || '#6366f1' }}
            title={`${user.name} is viewing`}
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              user.name.slice(0, 2).toUpperCase()
            )}
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
          </div>
        ))}
        {overflow > 0 && (
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-700 text-[10px] font-bold text-slate-300">
            +{overflow}
          </div>
        )}
      </div>
      <span className="ml-1.5 text-xs text-slate-400">{others.length} online</span>
    </div>
  );
}
