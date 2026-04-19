export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createElement } from "react";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { db } from "@/lib/db";
import { getServices } from "@/lib/getServices";
import { getSiteContent } from "@/lib/content";
import { BookingReminder } from "@/emails/BookingReminder";
import { ReviewRequest } from "@/emails/ReviewRequest";

// Vercel automatically provides CRON_SECRET and sends it in the Authorization header.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>";

  const now = new Date();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const [siteContent, tomorrowBookings, yesterdayBookings, reviewUrlRow, services] = await Promise.all([
    getSiteContent(),
    db.booking.findMany({
      where: { date: tomorrowStr, status: { in: ["CONFIRMED"] } },
    }),
    db.booking.findMany({
      where: { date: yesterdayStr, status: { in: ["CONFIRMED", "COMPLETED"] } },
    }),
    db.content.findUnique({ where: { key: "seo.googleReviewsUrl" } }),
    getServices(),
  ]);

  const studioAddress = siteContent.studio.addressLines.join("\n");
  const studioPhone = siteContent.studio.phone;
  const reviewUrl = reviewUrlRow?.value || undefined;

  let remindersSent = 0;
  let reviewsSent = 0;
  const errors: string[] = [];

  // Send 24-hour reminders
  for (const booking of tomorrowBookings) {
    try {
      const serviceName = services.find((s) => s.id === booking.service)?.name ?? booking.service;
      await resend.emails.send({
        from,
        to: booking.email,
        subject: `Reminder: your ${serviceName} session tomorrow at ${booking.time}`,
        react: createElement(BookingReminder, {
          firstName: booking.firstName,
          serviceName,
          duration: booking.duration,
          date: booking.date,
          time: booking.time,
          studioAddress,
          studioPhone,
        }),
      });
      remindersSent++;
    } catch (err) {
      errors.push(`Reminder for ${booking.ref}: ${err}`);
    }
  }

  // Send review requests for yesterday's sessions
  for (const booking of yesterdayBookings) {
    try {
      const serviceName = services.find((s) => s.id === booking.service)?.name ?? booking.service;
      await resend.emails.send({
        from,
        to: booking.email,
        subject: `How was your session with us, ${booking.firstName}?`,
        react: createElement(ReviewRequest, {
          firstName: booking.firstName,
          serviceName,
          reviewUrl,
        }),
      });
      reviewsSent++;
    } catch (err) {
      errors.push(`Review request for ${booking.ref}: ${err}`);
    }
  }

  return NextResponse.json({ remindersSent, reviewsSent, errors });
}
