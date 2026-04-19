export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const CreateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

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

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const data = CreateSchema.parse(body);

  const client = await db.client.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? "",
      notes: data.notes ?? "",
    },
  });

  return NextResponse.json(client, { status: 201 });
}
