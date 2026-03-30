import { nodeColors, statusColors } from "@/lib/marketing-constants";

interface NodeBadgeProps {
  type: string;
  className?: string;
}

export function NodeBadge({ type, className = "" }: NodeBadgeProps) {
  const color = nodeColors[type.toLowerCase()] || "#8091b3";
  const label = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md ${className}`}
      style={{
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ background: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

interface StatusBadgeProps {
  status: "healthy" | "warning" | "critical";
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const colors = statusColors[status];
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md ${className}`}
      style={{
        background: colors.bg,
        color: colors.text,
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ background: colors.dot }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
