export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const CreateSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  service: z.string(),
  duration: z.number(),
  date: z.string(),
  time: z.string(),
  price: z.number(),
  notes: z.string().optional(),
  firstTime: z.boolean().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (date) where.date = date;

  const [bookings, total] = await Promise.all([
    db.booking.findMany({
      where,
      orderBy: [{ date: "desc" }, { time: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.booking.count({ where }),
  ]);

  return NextResponse.json({ bookings, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const data = CreateSchema.parse(body);

  const num = Math.floor(1000 + Math.random() * 9000);
  const ref = `BK-${num}`;

  const booking = await db.booking.create({
    data: {
      ref,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      service: data.service,
      duration: data.duration,
      date: data.date,
      time: data.time,
      price: data.price,
      notes: data.notes ?? "",
      firstTime: data.firstTime ?? false,
      status: data.status ?? "CONFIRMED",
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
