export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const intake = await db.intakeForm.findUnique({ where: { clientId: params.id } });
  return NextResponse.json(intake);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await db.client.findUnique({ where: { id: params.id } });
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const token = randomUUID();

  const intake = await db.intakeForm.upsert({
    where: { clientId: params.id },
    update: { token, completedAt: null },
    create: { clientId: params.id, token },
  });

  const origin = request.headers.get("origin") ?? `https://${process.env.VERCEL_URL}`;
  const url = `${origin}/intake/${token}`;

  // Send email (non-blocking)
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>",
        to: client.email,
        subject: "Please complete your intake form — Balance & Wellness",
        text: `Hi ${client.firstName},\n\nPlease complete your massage intake form before your appointment:\n\n${url}\n\nThis helps us tailor your session to your needs.\n\nBalance & Wellness`,
      });
    } catch (err) {
      console.error("Intake email failed:", err);
    }
  }

  return NextResponse.json({ intake, url });
}
