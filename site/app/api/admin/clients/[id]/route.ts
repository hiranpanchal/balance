export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const UpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await db.client.findUnique({ where: { id: params.id } });
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const today = new Date().toISOString().split("T")[0];

  const [upcoming, past] = await Promise.all([
    db.booking.findMany({
      where: { email: client.email, date: { gte: today } },
      orderBy: { date: "asc" },
    }),
    db.booking.findMany({
      where: { email: client.email, date: { lt: today } },
      orderBy: { date: "desc" },
    }),
  ]);

  const totalSpent = [...upcoming, ...past].reduce((sum, b) => sum + b.price, 0);

  return NextResponse.json({ client, upcoming, past, totalSpent });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const data = UpdateSchema.parse(body);

  const client = await db.client.update({ where: { id: params.id }, data });
  return NextResponse.json(client);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.client.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
