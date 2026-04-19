import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CalendarView } from "@/components/admin/CalendarView";

export const metadata: Metadata = { title: "Calendar" };
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [bookings, clients] = await Promise.all([
    db.booking.findMany({
      where: { status: { not: "CANCELLED" } },
      orderBy: { date: "asc" },
    }),
    db.client.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Calendar</h1>
        <p className="text-[13px] text-[#A09687] mt-1">
          Click a slot to book · Drag to move · Drag edge to resize
        </p>
      </div>

      <CalendarView
        initialBookings={JSON.parse(JSON.stringify(bookings))}
        clients={JSON.parse(JSON.stringify(clients))}
      />
    </div>
  );
}
