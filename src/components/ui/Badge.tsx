import { ReactNode, HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "violet" | "gold" | "emerald" | "rose" | "outline";
  className?: string;
}

export default function Badge({
  children,
  variant = "violet",
  className = "",
  ...props
}: BadgeProps) {
  const variants = {
    violet: "badge-violet",
    gold: "badge-gold",
    emerald: "badge-emerald",
    rose: "badge-rose",
    outline: "border border-subtle text-muted text-[10px] uppercase tracking-widest",
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
