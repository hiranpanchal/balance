export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSiteContent } from "@/lib/content";
import { getService } from "@/lib/getServices";
import { createElement } from "react";
import { Resend } from "resend";

const Schema = z.object({ token: z.string().min(1) });

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const booking = await db.booking.findUnique({
    where: { cancelToken: parsed.data.token },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status === "CANCELLED") {
    return NextResponse.json({ error: "Already cancelled" }, { status: 409 });
  }

  if (booking.status === "COMPLETED" || booking.status === "NO_SHOW") {
    return NextResponse.json({ error: "This booking has already taken place" }, { status: 409 });
  }

  // Check if cancellation is within 24 hours
  const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
  const hoursUntil = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
  const lateCancel = hoursUntil < 24;

  await db.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED" },
  });

  // Send cancellation confirmation email
  try {
    const [{ BookingCancellation }, siteContent, svc] = await Promise.all([
      import("@/emails/BookingCancellation"),
      getSiteContent(),
      getService(booking.service),
    ]);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>";
    const serviceName = svc?.name ?? booking.service;

    await resend.emails.send({
      from,
      to: booking.email,
      subject: `Booking cancelled — ${booking.ref}`,
      react: createElement(BookingCancellation, {
        ref: booking.ref,
        firstName: booking.firstName,
        serviceName,
        date: booking.date,
        time: booking.time,
        lateCancel,
        studioPhone: siteContent.studio.phone,
      }),
    });

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await resend.emails.send({
        from,
        to: adminEmail,
        subject: `Cancellation: ${booking.firstName} ${booking.lastName} — ${booking.ref}${lateCancel ? " (LATE)" : ""}`,
        text: `Booking cancelled by client.\n\nRef: ${booking.ref}\nName: ${booking.firstName} ${booking.lastName}\nEmail: ${booking.email}\nDate: ${booking.date} at ${booking.time}\nLate cancellation (within 24h): ${lateCancel ? "YES — 50% charge applies" : "No"}`,
      });
    }
  } catch (err) {
    console.error("Cancellation email failed:", err);
  }

  return NextResponse.json({ ok: true, lateCancel });
}
