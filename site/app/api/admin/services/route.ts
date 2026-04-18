export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const services = await db.service.findMany({
    include: { durations: { orderBy: { mins: "asc" } } },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json(services);
}
