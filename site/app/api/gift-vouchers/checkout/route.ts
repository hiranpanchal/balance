export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { db } from "@/lib/db";

const MIN_AMOUNT_PENCE = 1000; // £10
const MAX_AMOUNT_PENCE = 50000; // £500

const Schema = z.object({
  amountPence: z.number().int().min(MIN_AMOUNT_PENCE).max(MAX_AMOUNT_PENCE),
  purchaserName: z.string().min(1),
  purchaserEmail: z.string().email(),
  recipientName: z.string().default(""),
  recipientEmail: z.string().email().optional().or(z.literal("")),
  message: z.string().max(500).default(""),
});

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2026-03-25.dahlia",
  });

  try {
    const body = await request.json();
    const data = Schema.parse(body);
    const origin = request.headers.get("origin") ?? "https://balanceandwellness.com";

    // Expiry: 12 months from now
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Create voucher record (unpaid, no code yet — code generated on payment)
    const voucher = await db.voucher.create({
      data: {
        code: "",
        amountPence: data.amountPence,
        purchaserName: data.purchaserName,
        purchaserEmail: data.purchaserEmail,
        recipientName: data.recipientName ?? "",
        recipientEmail: data.recipientEmail ?? "",
        message: data.message ?? "",
        paid: false,
        expiresAt,
      },
    });

    const amountGbp = (data.amountPence / 100).toFixed(2);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: data.amountPence,
            product_data: {
              name: `Balance & Wellness gift voucher — £${amountGbp}`,
              description: `Valid for 12 months from purchase date. Redeemable against any treatment.`,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: data.purchaserEmail,
      metadata: {
        type: "gift_voucher",
        voucherId: voucher.id,
        purchaserName: data.purchaserName,
        recipientName: data.recipientName ?? "",
        recipientEmail: data.recipientEmail ?? "",
        message: data.message ?? "",
      },
      success_url: `${origin}/gift-vouchers/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/gift-vouchers`,
    });

    // Store session ID
    await db.voucher.update({
      where: { id: voucher.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 422 });
    }
    console.error("/api/gift-vouchers/checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
