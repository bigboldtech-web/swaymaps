import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  accentColor?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  accentColor,
  hover = true,
}: CardProps) {
  return (
    <div
      className={[
        "relative bg-[#0f1629] border border-[#1a2340] overflow-hidden",
        hover
          ? "transition-all duration-300 ease-out hover:border-[#253060] hover:shadow-[0_0_30px_rgba(0,194,255,0.05)]"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ borderRadius: 14 }}
    >
      {accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: accentColor }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}
