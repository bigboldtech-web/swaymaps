import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  href?: string;
}

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a80d5" />
          <stop offset="100%" stopColor="#29a5e5" />
        </linearGradient>
        <linearGradient id="logo-curve" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Background rounded square */}
      <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#logo-bg)" />
      {/* S-curve path */}
      <path
        d="M12 10 C12 10, 28 12, 20 20 C12 28, 28 30, 28 30"
        stroke="url(#logo-curve)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Three nodes on the curve */}
      <circle cx="12" cy="10" r="3.5" fill="#ffffff" />
      <circle cx="20" cy="20" r="3.5" fill="#ffffff" />
      <circle cx="28" cy="30" r="3.5" fill="#ffffff" />
    </svg>
  );
}

export default function Logo({ className = "", size = 32, showText = true, href = "/landing" }: LogoProps) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {showText && (
        <span
          className="text-[#e4e9f4] font-semibold tracking-tight"
          style={{ fontSize: size * 0.56, fontFamily: "'DM Sans', sans-serif" }}
        >
          SwayMaps
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center no-underline hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

export { LogoMark };
