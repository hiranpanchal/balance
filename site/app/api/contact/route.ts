export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyTurnstile } from "@/lib/turnstile";

const Schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(5),
  captchaToken: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = Schema.parse(body);

    const valid = await verifyTurnstile(data.captchaToken);
    if (!valid) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 422 });
    }

    const { db } = await import("@/lib/db");
    await db.message.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? "",
        body: data.message,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>";
      const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://balanceandwellness.vercel.app";
      await resend.emails.send({
        from,
        to: adminEmail,
        replyTo: data.email,
        subject: `New message from ${data.name}`,
        text: `${data.name} sent a message via the contact form.\n\n${data.message}\n\nReply in the admin: ${siteOrigin}/admin/messages`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 422 });
    }
    console.error("/api/contact error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
