interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && (
        <p
          className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.15em] text-[#00c2ff] mb-4"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            justifyContent: align === "center" ? "center" : "flex-start",
          }}
        >
          <span
            className="inline-block w-8 h-px bg-[#00c2ff]"
            aria-hidden="true"
          />
          {eyebrow}
        </p>
      )}
      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e4e9f4] tracking-tight leading-tight"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-[#8091b3] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
