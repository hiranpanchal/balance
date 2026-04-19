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

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>";
      await resend.emails.send({
        from,
        to: adminEmail,
        replyTo: data.email,
        subject: `Contact message from ${data.name}`,
        text: `Name: ${data.name}\nEmail: ${data.email}${data.phone ? `\nPhone: ${data.phone}` : ""}\n\n${data.message}`,
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
