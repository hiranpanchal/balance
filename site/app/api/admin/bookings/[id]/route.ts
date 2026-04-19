export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const UpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  duration: z.number().optional(),
  notes: z.string().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const booking = await db.booking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(booking);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const data = UpdateSchema.parse(body);

  const booking = await db.booking.update({
    where: { id: params.id },
    data,
  });

  // Send cancellation email if status changed to CANCELLED
  if (data.status === "CANCELLED") {
    try {
      const { Resend } = await import("resend");
      const { createElement } = await import("react");
      const { BookingCancellation } = await import("@/emails/BookingCancellation");
      const [{ services }, { getSiteContent }] = await Promise.all([
        import("@/lib/data"),
        import("@/lib/content"),
      ]);

      const resend = new Resend(process.env.RESEND_API_KEY);
      const serviceName = services.find((s) => s.id === booking.service)?.name ?? booking.service;
      const siteContent = await getSiteContent();

      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Balance & Wellness <hello@balanceandwellness.com>",
        to: booking.email,
        subject: `Your session has been cancelled — ${booking.ref}`,
        react: createElement(BookingCancellation, {
          ref: booking.ref,
          firstName: booking.firstName,
          serviceName,
          date: booking.date,
          time: booking.time,
          studioPhone: siteContent.studio.phone,
        }),
      });
    } catch (emailErr) {
      console.error("Cancellation email failed:", emailErr);
    }
  }

  return NextResponse.json(booking);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.booking.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
