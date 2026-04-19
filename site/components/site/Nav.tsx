"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "./Button";
import { AnnouncementBar } from "./AnnouncementBar";

const links = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-cream">
      <AnnouncementBar />
      <nav
        className={`flex items-center justify-between px-6 md:px-12 py-5 transition-[border-color] ${
          scrolled ? "border-b border-gold/30" : "border-b border-transparent"
        }`}
        aria-label="Primary"
      >
        <Link href="/" aria-label="Balance and Wellness, home">
          <img src="/logo-light.svg" alt="Balance and Wellness" className="h-14 w-auto" />
        </Link>

        <ul className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <li key={l.href} className="relative">
              <Link
                href={l.href}
                className="text-[13px] tracking-[0.12em] uppercase text-teal relative pb-1"
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
                {isActive(l.href) && (
                  <span
                    aria-hidden
                    className="absolute left-0 right-0 -bottom-[6px] h-[2px] bg-gold"
                  />
                )}
              </Link>
            </li>
          ))}
          <li>
            <Button href="/book" variant="primary">
              Book
            </Button>
          </li>
        </ul>

        <button
          type="button"
          className="md:hidden text-teal p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-teal/10 px-6 py-5 flex flex-col gap-4 bg-cream"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[14px] tracking-[0.12em] uppercase text-teal"
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Button href="/book" variant="primary">
            Book
          </Button>
        </div>
      )}
    </header>
  );
}
