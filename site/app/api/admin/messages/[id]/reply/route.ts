export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Resend } from "resend";

const Schema = z.object({ body: z.string().min(1) });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Body required" }, { status: 400 });

  const message = await db.message.findUnique({ where: { id: params.id } });
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const reply = await db.messageReply.create({
    data: { messageId: params.id, body: parsed.data.body },
  });

  // Mark as read
  await db.message.update({ where: { id: params.id }, data: { read: true } });

  // Send reply email
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>";
    await resend.emails.send({
      from,
      to: message.email,
      replyTo: from,
      subject: `Re: your message to Balance & Wellness`,
      text: `Hi ${message.name.split(" ")[0]},\n\n${parsed.data.body}\n\n—\nBalance & Wellness`,
    });
  } catch (err) {
    console.error("Reply email failed:", err);
  }

  return NextResponse.json(reply, { status: 201 });
}
