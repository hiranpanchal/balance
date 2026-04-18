import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const UpdateSchema = z.record(z.string());

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.content.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const data = UpdateSchema.parse(body);

  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      db.content.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
