export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const GRACE_MINS = 15;

const ALL_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

function toMins(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const duration = parseInt(searchParams.get("duration") ?? "60");

  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  const d = new Date(date + "T00:00:00");
  const day = d.getDay();

  // Closed Sunday (0) and Monday (1)
  if (day === 0 || day === 1) return NextResponse.json({ slots: [] });

  // Saturday last slot must end + grace by 18:00 (so last start = 18:00 - duration - grace)
  const closingMins = day === 6 ? 17 * 60 : 19 * 60;
  const pool = ALL_SLOTS.filter((t) => toMins(t) + duration + GRACE_MINS <= closingMins);

  // Existing confirmed/pending bookings for this date
  const bookings = await db.booking.findMany({
    where: { date, status: { in: ["CONFIRMED", "PENDING"] } },
    select: { time: true, duration: true },
  });

  // Each booking blocks [start, start + duration + grace]
  const blocked = bookings.map((b) => ({
    start: toMins(b.time),
    end: toMins(b.time) + b.duration + GRACE_MINS,
  }));

  // A slot is free if the new booking [slotStart, slotStart + duration] doesn't overlap any blocked range
  const available = pool.filter((slot) => {
    const slotStart = toMins(slot);
    const slotEnd = slotStart + duration;
    return !blocked.some((b) => slotStart < b.end && slotEnd > b.start);
  });

  return NextResponse.json({ slots: available });
}
