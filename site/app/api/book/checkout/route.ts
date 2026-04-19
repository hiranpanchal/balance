export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { priceFor } from "@/lib/data";
import { getService } from "@/lib/getServices";
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

    const ref = generateRef();
    const [svc, existingClient] = await Promise.all([
      getService(data.treatment),
      db.client.findUnique({ where: { email: data.email }, select: { grade: true } }),
    ]);
    const isRegular = existingClient?.grade === "REGULAR";
    const serviceName = svc?.name ?? data.treatment;
    const depositPence = depositAmount(data.price * 100, isRegular);
    const origin = request.headers.get("origin") ?? "https://balanceandwellness.com";

    // Create the booking as PENDING — webhook will confirm it after payment
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
        depositAmount: depositPence / 100,
      },
    });

    // Upsert client record
    await db.client.upsert({
      where: { email: data.email },
      update: { firstName: data.firstName, lastName: data.lastName, phone: data.phone },
      create: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: depositPence,
            product_data: {
              name: isRegular ? `${serviceName} — deposit` : `${serviceName} — full payment`,
              description: isRegular
                ? `${data.duration} min session on ${data.date} at ${data.time}. Remainder (£${data.price - depositPence / 100}) payable on the day.`
                : `${data.duration} min session on ${data.date} at ${data.time}. Full payment — nothing more to pay on the day.`,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: data.email,
      metadata: { bookingId: booking.id, ref },
      success_url: `${origin}/book/success?ref=${ref}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book?step=4`,
    });

    // Store session ID on the booking
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
