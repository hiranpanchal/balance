import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CancelForm } from "./CancelForm";

export const metadata: Metadata = { title: "Cancel booking" };
export const dynamic = "force-dynamic";

export default async function CancelPage({ params }: { params: { token: string } }) {
  const booking = await db.booking.findUnique({
    where: { cancelToken: params.token },
    select: {
      ref: true,
      firstName: true,
      service: true,
      date: true,
      time: true,
      duration: true,
      status: true,
      cancelToken: true,
    },
  });

  if (!booking) notFound();

  const formattedDate = new Date(booking.date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
  const hoursUntil = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
  const lateCancel = hoursUntil < 24;
  const isPast = hoursUntil < 0;

  return (
    <main className="min-h-screen bg-[#EAE2D2] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-lg p-10 shadow-sm">
        <h1 className="font-serif text-[24px] text-[#3E4F56] font-normal mb-2">
          Balance &amp; Wellness
        </h1>
        <p className="text-[12px] tracking-[0.12em] uppercase text-[#A09687] mb-8">
          Cancel booking
        </p>

        <div className="bg-[#F5F0E6] rounded p-5 mb-6 space-y-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#A09687] uppercase tracking-[0.08em] text-[11px]">Ref</span>
            <span className="text-[#3E4F56]">{booking.ref}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#A09687] uppercase tracking-[0.08em] text-[11px]">Date</span>
            <span className="text-[#3E4F56]">{formattedDate}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#A09687] uppercase tracking-[0.08em] text-[11px]">Time</span>
            <span className="text-[#3E4F56]">{booking.time}</span>
          </div>
        </div>

        {booking.status === "CANCELLED" ? (
          <p className="text-[14px] text-[#3E4F56] text-center">
            This booking has already been cancelled.
          </p>
        ) : booking.status === "COMPLETED" || booking.status === "NO_SHOW" || isPast ? (
          <p className="text-[14px] text-[#3E4F56] text-center">
            This booking has already taken place and cannot be cancelled online.
          </p>
        ) : (
          <CancelForm
            token={booking.cancelToken}
            firstName={booking.firstName}
            lateCancel={lateCancel}
          />
        )}
      </div>
    </main>
  );
}
