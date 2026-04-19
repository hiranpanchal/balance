export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { priceFor } from "@/lib/data";
import { getService } from "@/lib/getServices";
import { getSiteContent } from "@/lib/content";
import { priceForFromDb } from "@/lib/getServices";

const CheckoutSchema = z.object({
  treatment: z.string(),
  duration: z.number(),
  date: z.string(),
  time: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  firstTime: z.boolean(),
  notes: z.string().optional(),
  consent: z.boolean(),
  price: z.number(),
  voucherCode: z.string().optional(),
});

function generateRef(): string {
  return `BK-${Math.floor(1000 + Math.random() * 9000)}`;
}

function depositAmount(totalPence: number, isRegular: boolean): number {
  if (isRegular) return Math.round(totalPence * 0.5);
  return totalPence; // new customers pay full price upfront
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2026-03-25.dahlia",
  });

  try {
    const body = await request.json();
    const data = CheckoutSchema.parse(body);

    const calculatedPrice =
      (await priceForFromDb(data.treatment, data.duration)) ??
      priceFor(data.treatment, data.duration);
    if (!calculatedPrice || calculatedPrice !== data.price) {
      return NextResponse.json({ error: "Invalid price" }, { status: 422 });
    }

    const ref = `BK-${Date.now().toString(36).toUpperCase()}`;
    const [svc, existingClient] = await Promise.all([
      getService(data.treatment),
      db.client.findUnique({ where: { email: data.email }, select: { grade: true } }),
    ]);
    const isRegular = existingClient?.grade === "REGULAR";
    const serviceName = svc?.name ?? data.treatment;
    const totalPence = data.price * 100;
    const origin = request.headers.get("origin") ?? "https://balanceandwellness.com";

    // Validate voucher if provided
    let voucherDiscountPence = 0;
    let validatedVoucher: { id: string; code: string } | null = null;
    if (data.voucherCode) {
      const code = data.voucherCode.trim().toUpperCase();
      const voucher = await db.voucher.findUnique({ where: { code } });
      if (
        voucher &&
        voucher.paid &&
        !voucher.redeemedAt &&
        new Date() <= voucher.expiresAt
      ) {
        voucherDiscountPence = Math.min(voucher.amountPence, totalPence);
        validatedVoucher = { id: voucher.id, code: voucher.code };
      }
    }

    const depositPence = depositAmount(totalPence, isRegular);
    const chargeablePence = Math.max(0, depositPence - voucherDiscountPence);

    // Upsert client record
    await db.client.upsert({
      where: { email: data.email },
      update: { firstName: data.firstName, lastName: data.lastName, phone: data.phone },
      create: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone },
    });

    // Create the booking as PENDING
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
        status: "PENDING",
        depositAmount: chargeablePence / 100,
      },
    });

    // Voucher covers the full amount — confirm directly without Stripe
    if (chargeablePence === 0) {
      await db.booking.update({ where: { id: booking.id }, data: { status: "CONFIRMED", depositPaid: true } });
      if (validatedVoucher) {
        await db.voucher.update({
          where: { id: validatedVoucher.id },
          data: { redeemedAt: new Date(), redeemedBookingRef: ref },
        });
      }
      // Send confirmation email
      try {
        const [{ Resend }, { BookingConfirmation }, siteContent] = await Promise.all([
          import("resend"),
          import("@/emails/BookingConfirmation"),
          getSiteContent(),
        ]);
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>";
        const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? origin;
        const confirmedCount = await db.booking.count({
          where: { email: data.email, status: { in: ["CONFIRMED", "COMPLETED"] } },
        });
        const { createElement } = await import("react");
        await resend.emails.send({
          from,
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
            cancelUrl: `${siteOrigin}/cancel/${booking.cancelToken}`,
            confirmedBookingCount: confirmedCount,
            isRegular,
          }),
        });
      } catch (emailErr) {
        console.error("Voucher-covered booking confirmation email failed:", emailErr);
      }
      return NextResponse.json({ url: null, ref }, { status: 201 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: chargeablePence,
            product_data: {
              name: isRegular ? `${serviceName} — deposit` : `${serviceName} — full payment`,
              description: [
                `${data.duration} min session on ${data.date} at ${data.time}.`,
                voucherDiscountPence > 0 ? `Voucher (${validatedVoucher?.code}) applied: −£${voucherDiscountPence / 100}.` : "",
                isRegular ? `Remainder (£${data.price - chargeablePence / 100}) payable on the day.` : "Full payment — nothing more to pay on the day.",
              ].filter(Boolean).join(" "),
            },
          },
          quantity: 1,
        },
      ],
      customer_email: data.email,
      metadata: {
        bookingId: booking.id,
        ref,
        ...(validatedVoucher ? { voucherCode: validatedVoucher.code } : {}),
      },
      success_url: `${origin}/book/success?ref=${ref}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book?step=4`,
    });

    await db.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 422 });
    }
    console.error("/api/book/checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
