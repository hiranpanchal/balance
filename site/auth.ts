import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Resend({
      from: process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>",
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        if (process.env.NODE_ENV === "development") {
          console.log("\n🔗 Magic link for", email, "→", url, "\n");
          return;
        }
        const { Resend: ResendClient } = await import("resend");
        const { MagicLinkEmail } = await import("@/emails/MagicLink");
        const resend = new ResendClient(process.env.RESEND_API_KEY);
        const { createElement } = await import("react");
        await resend.emails.send({
          from: provider.from!,
          to: email,
          subject: "Sign in to Balance & Wellness admin",
          react: createElement(MagicLinkEmail, { url }),
        });
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      return user.email === process.env.ADMIN_EMAIL;
    },
  },
  session: { strategy: "jwt" },
});
