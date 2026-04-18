import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

// Base wrapper — the (protected) route group adds the sidebar for authenticated pages.
// The login page renders here without a sidebar.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
