export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyTurnstile } from "@/lib/turnstile";

const Schema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  body: z.string().min(10),
  rating: z.number().int().min(1).max(5),
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

    await db.review.create({
      data: {
        name: data.name,
        company: data.company ?? "",
        body: data.body,
        rating: data.rating,
        published: false,
      },
    });

    // Notify admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>";
        await resend.emails.send({
          from,
          to: adminEmail,
          subject: `New review from ${data.name}`,
          text: `A new review has been submitted and is waiting for approval.\n\nName: ${data.name}${data.company ? `\nCompany: ${data.company}` : ""}\nRating: ${"★".repeat(data.rating)}${"☆".repeat(5 - data.rating)}\n\nReview:\n${data.body}\n\nApprove it in the admin panel:\nhttps://balanceandwellness.com/admin/reviews`,
        });
      }
    } catch {
      // Non-blocking — review is saved even if email fails
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 422 });
    }
    console.error("/api/reviews error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
