"use client";

import * as React from "react";
import { useYjsDoc } from "@/hooks/useYjsDoc";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";

interface PresenceUser {
  clientId: number;
  name: string;
  color: string;
  initials: string;
}

interface YjsPresenceBarProps {
  mapId: string | null | undefined;
  /** Whether to actually connect. False in share mode / when key not configured. */
  enabled?: boolean;
  /** Local user — shown with a "you" badge in the tooltip. */
  selfName: string;
  /** Local user color (hex). Random one is picked if absent. */
  selfColor?: string;
}

const PALETTE = [
  "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1",
];

function pickColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Live presence avatars driven by Yjs awareness. Drop this anywhere in
 * the editor chrome — it auto-connects to the map's WebSocket room and
 * shows everyone currently viewing the same map, with their names and a
 * "connected / connecting / offline" indicator.
 */
export function YjsPresenceBar({
  mapId,
  enabled = true,
  selfName,
  selfColor,
}: YjsPresenceBarProps) {
  const myColor = React.useMemo(
    () => selfColor ?? pickColor(selfName),
    [selfName, selfColor]
  );

  const { awareness, status } = useYjsDoc({
    mapId,
    enabled,
    awarenessState: {
      name: selfName,
      color: myColor,
      initials: initialsOf(selfName),
    },
  });

  const [users, setUsers] = React.useState<PresenceUser[]>([]);
  const [selfClientId, setSelfClientId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!awareness) {
      setUsers([]);
      return;
    }
    setSelfClientId(awareness.clientID);

    const refresh = () => {
      const states = awareness.getStates();
      const list: PresenceUser[] = [];
      states.forEach((s, clientId) => {
        const state = s as any;
        if (!state || typeof state !== "object") return;
        if (!state.name) return;
        list.push({
          clientId,
          name: state.name,
          color: state.color ?? "#71717a",
          initials: state.initials ?? initialsOf(state.name),
        });
      });
      // Self first, then alphabetical
      list.sort((a, b) => {
        if (a.clientId === awareness.clientID) return -1;
        if (b.clientId === awareness.clientID) return 1;
        return a.name.localeCompare(b.name);
      });
      setUsers(list);
    };

    refresh();
    awareness.on("update", refresh);
    awareness.on("change", refresh);
    return () => {
      awareness.off("update", refresh);
      awareness.off("change", refresh);
    };
  }, [awareness]);

  if (!enabled || !mapId) return null;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "connected"
            ? "bg-success"
            : status === "connecting"
            ? "bg-warning animate-pulse"
            : "bg-fg-disabled"
        )}
        title={`Realtime: ${status}`}
      />
      <div className="flex -space-x-1.5">
        {users.slice(0, 5).map((u) => (
          <Tooltip key={u.clientId}>
            <TooltipTrigger asChild>
              <Avatar
                className="h-6 w-6 border-2 border-bg"
                style={{ background: u.color }}
              >
                <AvatarFallback
                  className="text-[10px] font-semibold text-white"
                  style={{ background: u.color }}
                >
                  {u.initials}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              {u.name}
              {u.clientId === selfClientId && " (you)"}
            </TooltipContent>
          </Tooltip>
        ))}
        {users.length > 5 && (
          <div className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-bg bg-bg-muted px-1 text-[10px] font-semibold text-fg-muted">
            +{users.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}
