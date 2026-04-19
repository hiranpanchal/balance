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
import { RebookingNudge } from "@/emails/RebookingNudge";

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

  // 8 weeks ago — for rebooking nudges
  const eightWeeksAgo = new Date(now);
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);
  const eightWeeksAgoStr = eightWeeksAgo.toISOString().split("T")[0];

  // 9 weeks ago — nudge clients whose last booking was exactly 8 weeks ago (±1 day window)
  const nineWeeksAgo = new Date(now);
  nineWeeksAgo.setDate(nineWeeksAgo.getDate() - 63);
  const nineWeeksAgoStr = nineWeeksAgo.toISOString().split("T")[0];

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

  // Find clients whose most recent booking ended 8 weeks ago (no booking since)
  const lapsedBookings = await db.booking.findMany({
    where: {
      date: { gte: nineWeeksAgoStr, lte: eightWeeksAgoStr },
      status: { in: ["CONFIRMED", "COMPLETED"] },
    },
    orderBy: { date: "desc" },
  });

  // Deduplicate by email and confirm no newer booking exists
  const lapsedByEmail = new Map<string, typeof lapsedBookings[0]>();
  for (const b of lapsedBookings) {
    if (!lapsedByEmail.has(b.email)) lapsedByEmail.set(b.email, b);
  }
  const nudgeCandidates: typeof lapsedBookings = [];
  for (const [, booking] of lapsedByEmail) {
    const newer = await db.booking.findFirst({
      where: { email: booking.email, date: { gt: eightWeeksAgoStr }, status: { in: ["CONFIRMED", "COMPLETED", "PENDING"] } },
    });
    if (!newer) nudgeCandidates.push(booking);
  }

  const studioAddress = siteContent.studio.addressLines.join("\n");
  const studioPhone = siteContent.studio.phone;
  const reviewUrl = reviewUrlRow?.value || undefined;

  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://balanceandwellness.vercel.app";

  let remindersSent = 0;
  let reviewsSent = 0;
  let nudgesSent = 0;
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

  // Send rebooking nudges
  for (const booking of nudgeCandidates) {
    try {
      const serviceName = services.find((s) => s.id === booking.service)?.name ?? booking.service;
      await resend.emails.send({
        from,
        to: booking.email,
        subject: `It's been a while, ${booking.firstName} — time for another session?`,
        react: createElement(RebookingNudge, {
          firstName: booking.firstName,
          lastServiceName: serviceName,
          bookUrl: `${siteOrigin}/book`,
        }),
      });
      nudgesSent++;
    } catch (err) {
      errors.push(`Nudge for ${booking.email}: ${err}`);
    }
  }

  return NextResponse.json({ remindersSent, reviewsSent, nudgesSent, errors });
}
