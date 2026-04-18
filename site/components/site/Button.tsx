import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "tertiary";

const base =
  "inline-flex items-center justify-center gap-2 text-[13px] tracking-[0.08em] uppercase transition-colors duration-300 ease-out-soft disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-gold";

const variants: Record<Variant, string> = {
  primary:
    "rounded-full px-7 py-3 bg-teal text-cream hover:bg-teal-deep",
  secondary:
    "rounded-full px-7 py-3 border border-teal text-teal hover:bg-cream-light",
  tertiary:
    "px-0 py-1 text-teal border-b border-transparent hover:border-gold",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type AsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", className = "", children } = props;
  const cls = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, variant: _v, className: _c, children: _ch, ...rest } = props;
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a href={href} className={cls} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, ...rest } = props as AsButton;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
