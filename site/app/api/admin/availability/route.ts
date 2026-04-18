import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const BlockSchema = z.object({
  date: z.string(),
  reason: z.string().optional(),
  isFullDay: z.boolean().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await db.blockedDate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(blocked);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const data = BlockSchema.parse(body);

  const record = await db.blockedDate.upsert({
    where: { date: data.date },
    update: data,
    create: data,
  });

  return NextResponse.json(record, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  await db.blockedDate.delete({ where: { date } });
  return new NextResponse(null, { status: 204 });
}
