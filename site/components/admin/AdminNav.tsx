"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  CalendarDays,
  Layers,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  LogOut,
  Settings,
  Star,
  Users,
  FileText,
  Gift,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/availability", label: "Availability", icon: Calendar },
  { href: "/admin/vouchers", label: "Vouchers", icon: Gift },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/content", label: "Content", icon: Settings },
  { href: "/admin/about", label: "About", icon: FileText },
  { href: "/admin/journal", label: "Journal", icon: BookOpen },
  { href: "/admin/images", label: "Images", icon: ImageIcon },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-56 bg-[#3E4F56] flex flex-col shrink-0 min-h-screen">
      <div className="px-6 py-6 border-b border-white/10">
        <img src="/logo-dark.svg" alt="Balance and Wellness" className="w-full h-auto" />
        <div className="text-white/45 text-[11px] tracking-[0.15em] uppercase mt-3">
          Admin
        </div>
      </div>

      <div className="flex-1 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-6 py-3 text-[13px] transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="px-6 py-5 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 text-[13px] text-white/45 hover:text-white transition-colors"
        >
          <LogOut size={14} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </nav>
  );
}
