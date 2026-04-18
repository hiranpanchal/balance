import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className = "",
  as: As = "span",
  tone = "gold",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "div" | "p";
  tone?: "gold" | "cream";
}) {
  const color = tone === "cream" ? "text-cream-light" : "text-gold";
  return (
    <As
      className={`block text-[11px] leading-[14px] tracking-[0.22em] uppercase ${color} ${className}`}
    >
      {children}
    </As>
  );
}
