import type { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";

// Lightweight config used by middleware — no Prisma, no Node.js-only imports.
export const authConfig: NextAuthConfig = {
  providers: [
    Resend({ from: process.env.EMAIL_FROM ?? "hello@balanceandwellness.com" }),
  ],
  pages: {
    signIn: "/admin/login",
    verifyRequest: "/admin/login?check-email=1",
    error: "/admin/login",
  },
};
