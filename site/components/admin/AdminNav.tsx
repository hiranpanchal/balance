"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  CalendarCheck2,
  Layers,
  CalendarRange,
  BookOpen,
  LogOut,
  Settings,
  Star,
  Users,
  Gift,
  LayoutDashboard,
  Clock,
  Mail,
  PenLine,
} from "lucide-react";

const groups = [
  {
    label: "Operations",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/clients", label: "Clients", icon: Users },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck2 },
      { href: "/admin/calendar", label: "Calendar", icon: CalendarRange },
      { href: "/admin/messages", label: "Messages", icon: Mail },
    ],
  },
  {
    label: "Studio",
    items: [
      { href: "/admin/services", label: "Services", icon: Layers },
      { href: "/admin/availability", label: "Availability", icon: Clock },
      { href: "/admin/vouchers", label: "Vouchers", icon: Gift },
      { href: "/admin/waitlist", label: "Waitlist", icon: Users },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/content", label: "Content", icon: Settings },
      { href: "/admin/journal", label: "Journal", icon: BookOpen },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-56 bg-[#2E3C42] flex flex-col shrink-0 min-h-screen">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <img src="/logo-dark.svg" alt="Balance and Wellness" className="h-11 w-auto max-w-full" />
      </div>

      {/* Nav groups */}
      <div className="flex-1 py-3 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.label} className="mb-1">
            <p className="px-5 pt-4 pb-1.5 text-[9px] tracking-[0.2em] uppercase text-white/30 font-medium">
              {group.label}
            </p>
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-5 py-2.5 text-[13px] transition-colors ${
                    active
                      ? "text-white bg-white/10 border-l-2 border-[#B28B5D]"
                      : "text-white/50 hover:text-white/85 hover:bg-white/5 border-l-2 border-transparent"
                  }`}
                >
                  <Icon size={14} strokeWidth={1.75} />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sign out */}
      <div className="px-5 py-5 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 text-[12px] text-white/35 hover:text-white/70 transition-colors"
        >
          <LogOut size={13} strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </nav>
  );
}
