export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createElement } from "react";
import { db } from "@/lib/db";
import { getService } from "@/lib/getServices";
import { getSiteContent } from "@/lib/content";

function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "GV-";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2026-03-25.dahlia",
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

    // ── Gift voucher purchase ──────────────────────────────────────────────
    if (session.metadata?.type === "gift_voucher") {
      const { voucherId, purchaserName, recipientName, recipientEmail, message } = session.metadata;
      if (voucherId) {
        try {
          const code = generateVoucherCode();
          const voucher = await db.voucher.update({
            where: { id: voucherId },
            data: { paid: true, code },
          });

          const [{ Resend }, { VoucherEmail }] = await Promise.all([
            import("resend"),
            import("@/emails/VoucherEmail"),
          ]);
          const resend = new Resend(process.env.RESEND_API_KEY);
          const from = process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>";
          const amountGbp = voucher.amountPence / 100;
          const expiresAt = voucher.expiresAt.toISOString();

          // Email purchaser
          await resend.emails.send({
            from,
            to: voucher.purchaserEmail,
            subject: `Your Balance & Wellness gift voucher — £${amountGbp}`,
            react: createElement(VoucherEmail, {
              purchaserName,
              recipientName: recipientName || undefined,
              code,
              amountGbp,
              expiresAt,
              message: message || undefined,
              isGift: false,
            }),
          });

          // Email recipient if different address provided
          if (recipientEmail && recipientEmail !== voucher.purchaserEmail) {
            await resend.emails.send({
              from,
              to: recipientEmail,
              subject: `You have a Balance & Wellness gift voucher — £${amountGbp}`,
              react: createElement(VoucherEmail, {
                purchaserName,
                recipientName: recipientName || undefined,
                code,
                amountGbp,
                expiresAt,
                message: message || undefined,
                isGift: true,
              }),
            });
          }
        } catch (err) {
          console.error("Gift voucher post-payment error:", err);
        }
      }
      return NextResponse.json({ received: true });
    }

    const { bookingId, ref } = session.metadata ?? {};

    if (!bookingId) return new Response("No bookingId in metadata", { status: 400 });

    // Mark deposit as paid and confirm the booking
    const booking = await db.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED", depositPaid: true },
    });

    // Mark voucher as redeemed if one was applied
    if (session.metadata?.voucherCode) {
      await db.voucher.updateMany({
        where: { code: session.metadata.voucherCode, paid: true, redeemedAt: null },
        data: { redeemedAt: new Date(), redeemedBookingRef: booking.ref },
      }).catch(() => {});
    }

    // Count confirmed bookings and load client (shared by auto-upgrade + email)
    const [confirmedCount, client] = await Promise.all([
      db.booking.count({
        where: { email: booking.email, status: { in: ["CONFIRMED", "COMPLETED"] } },
      }),
      db.client.findUnique({ where: { email: booking.email } }),
    ]);

    // Auto-upgrade to REGULAR after 5 confirmed/completed bookings
    let isRegular = client?.grade === "REGULAR";
    if (client && client.grade === "NEW" && confirmedCount >= 5) {
      await db.client.update({ where: { id: client.id }, data: { grade: "REGULAR" } });
      isRegular = true;
    }

    // Send confirmation email (non-blocking)
    try {
      const [{ Resend }, { BookingConfirmation }, siteContent, svc] = await Promise.all([
        import("resend"),
        import("@/emails/BookingConfirmation"),
        getSiteContent(),
        getService(booking.service),
      ]);

      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>";
      const serviceName = svc?.name ?? booking.service;
      const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://balanceandwellness.vercel.app";

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
          cancelUrl: `${siteOrigin}/cancel/${booking.cancelToken}`,
          confirmedBookingCount: confirmedCount,
          isRegular,
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
