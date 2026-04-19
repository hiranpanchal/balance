export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await db.client.findUnique({ where: { id: params.id } });
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const origin = request.headers.get("origin") ?? `https://${process.env.VERCEL_URL}`;
  const url = `${origin}/my-booking/${client.portalToken}`;

  // Send email
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>",
        to: client.email,
        subject: "Your Balance & Wellness bookings",
        text: `Hi ${client.firstName},\n\nYou can view your upcoming bookings and manage them online:\n\n${url}\n\nBalance & Wellness`,
      });
    } catch (err) {
      console.error("Portal link email failed:", err);
    }
  }

  return NextResponse.json({ url });
}
