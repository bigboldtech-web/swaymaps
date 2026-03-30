import Link from "next/link";
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "lg" | "md" | "sm";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#00c2ff] text-[#070b14] font-semibold hover:bg-[#00d4ff] active:bg-[#00b0e6] shadow-[0_0_20px_rgba(0,194,255,0.2)] hover:shadow-[0_0_30px_rgba(0,194,255,0.3)]",
  outline:
    "bg-transparent text-[#e4e9f4] border border-[#253060] hover:border-[#3a5ccc] hover:text-[#00c2ff]",
  ghost:
    "bg-transparent text-[#8091b3] hover:text-[#e4e9f4] hover:bg-[#0f1629]",
};

const sizeStyles: Record<Size, string> = {
  lg: "h-12 px-7 text-base rounded-lg gap-2.5",
  md: "h-10 px-5 text-sm rounded-lg gap-2",
  sm: "h-8 px-3.5 text-xs rounded-md gap-1.5",
};

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...rest
  } = props;

  const classes = [
    "inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 ease-out font-medium select-none",
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (props.href !== undefined) {
    const { href, ...linkRest } = rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };
    return (
      <Link href={href} className={classes} {...(linkRest as Record<string, unknown>)}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
