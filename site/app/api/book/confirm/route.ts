export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getService } from "@/lib/getServices";
import { getSiteContent } from "@/lib/content";

const BookingSchema = z.object({
  treatment: z.string(),
  duration: z.number(),
  date: z.string(),
  time: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  firstTime: z.boolean(),
  notes: z.string().optional(),
  consent: z.boolean(),
  price: z.number(),
});

function generateRef(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BK-${num}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = BookingSchema.parse(body);

    const ref = generateRef();

    const booking = await db.booking.create({
      data: {
        ref,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        service: data.treatment,
        duration: data.duration,
        date: data.date,
        time: data.time,
        price: data.price,
        firstTime: data.firstTime,
        notes: data.notes ?? "",
        status: "CONFIRMED",
      },
    });

    // Upsert client record
    await db.client.upsert({
      where: { email: data.email },
      update: { firstName: data.firstName, lastName: data.lastName, phone: data.phone },
      create: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone },
    });

    // Send confirmation email (non-blocking — don't fail booking if email fails)
    try {
      const [{ Resend }, { createElement }, { BookingConfirmation }, siteContent, svc] = await Promise.all([
        import("resend"),
        import("react"),
        import("@/emails/BookingConfirmation"),
        getSiteContent(),
        getService(data.treatment),
      ]);
      const serviceName = svc?.name ?? data.treatment;

      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>",
        to: data.email,
        subject: `Your session is confirmed — ${ref}`,
        react: createElement(BookingConfirmation, {
          ref,
          firstName: data.firstName,
          serviceName,
          duration: data.duration,
          date: data.date,
          time: data.time,
          price: data.price,
          isFirstTime: data.firstTime,
          studioAddress: siteContent.studio.addressLines.join("\n"),
          studioPhone: siteContent.studio.phone,
        }),
      });

      // Notify admin
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>",
          to: adminEmail,
          subject: `New booking: ${data.firstName} ${data.lastName} — ${ref}`,
          text: `New booking received:\n\nRef: ${ref}\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone}\nTreatment: ${serviceName}\nDuration: ${data.duration} min\nDate: ${data.date}\nTime: ${data.time}\nPrice: £${data.price}\nFirst time: ${data.firstTime ? "Yes" : "No"}\nNotes: ${data.notes ?? "—"}`,
        });
      }
    } catch (emailErr) {
      console.error("Email send failed (booking still saved):", emailErr);
    }

    return NextResponse.json({ id: booking.id, ref: booking.ref }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 422 });
    }
    console.error("/api/book/confirm error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
