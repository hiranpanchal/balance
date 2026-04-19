export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await db.client.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] });

  const bookingStats = await db.booking.groupBy({
    by: ["email"],
    _count: { id: true },
    _sum: { price: true },
    _max: { date: true },
  });

  const statsMap = Object.fromEntries(bookingStats.map((s) => [s.email, s]));

  const result = clients.map((c) => ({
    ...c,
    totalBookings: statsMap[c.email]?._count.id ?? 0,
    totalSpent: statsMap[c.email]?._sum.price ?? 0,
    lastBooking: statsMap[c.email]?._max.date ?? null,
  }));

  return NextResponse.json(result);
}
