export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createElement } from "react";
import { db } from "@/lib/db";
import { services } from "@/lib/data";
import { getSiteContent } from "@/lib/content";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2025-03-31.basil",
  });

  const body = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch {
    return new Response("Webhook signature invalid", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { bookingId, ref } = session.metadata ?? {};

    if (!bookingId) return new Response("No bookingId in metadata", { status: 400 });

    // Mark deposit as paid and confirm the booking
    const booking = await db.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED", depositPaid: true },
    });

    // Send confirmation email (non-blocking)
    try {
      const [{ Resend }, { BookingConfirmation }, siteContent] = await Promise.all([
        import("resend"),
        import("@/emails/BookingConfirmation"),
        getSiteContent(),
      ]);

      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>";
      const serviceName = services.find((s) => s.id === booking.service)?.name ?? booking.service;

      await resend.emails.send({
        from,
        to: booking.email,
        subject: `Your session is confirmed — ${ref ?? booking.ref}`,
        react: createElement(BookingConfirmation, {
          ref: ref ?? booking.ref,
          firstName: booking.firstName,
          serviceName,
          duration: booking.duration,
          date: booking.date,
          time: booking.time,
          price: booking.price,
          isFirstTime: booking.firstTime,
          studioAddress: siteContent.studio.addressLines.join("\n"),
          studioPhone: siteContent.studio.phone,
        }),
      });

      // Notify admin
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await resend.emails.send({
          from,
          to: adminEmail,
          subject: `New booking (deposit paid): ${booking.firstName} ${booking.lastName} — ${ref ?? booking.ref}`,
          text: `Deposit paid. Booking confirmed.\n\nRef: ${ref ?? booking.ref}\nName: ${booking.firstName} ${booking.lastName}\nEmail: ${booking.email}\nPhone: ${booking.phone}\nTreatment: ${serviceName}\nDuration: ${booking.duration} min\nDate: ${booking.date}\nTime: ${booking.time}\nTotal: £${booking.price}\nDeposit paid: £${booking.depositAmount}`,
        });
      }
    } catch (emailErr) {
      console.error("Post-payment email failed:", emailErr);
    }
  }

  return NextResponse.json({ received: true });
}
