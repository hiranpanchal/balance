import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

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
