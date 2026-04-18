export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const DurationSchema = z.object({
  mins: z.number(),
  price: z.number(),
});

const ServiceSchema = z.object({
  name: z.string().optional(),
  tagline: z.string().optional(),
  lead: z.string().optional(),
  image: z.string().optional(),
  whatToExpect: z.array(z.object({ eyebrow: z.string(), body: z.string() })).optional(),
  goodFor: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),
  durations: z.array(DurationSchema).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = await db.service.findUnique({
    where: { id: params.id },
    include: { durations: { orderBy: { mins: "asc" } } },
  });
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(service);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { durations, ...data } = ServiceSchema.parse(body);

  const service = await db.service.update({
    where: { id: params.id },
    data,
  });

  if (durations) {
    await db.serviceDuration.deleteMany({ where: { serviceId: params.id } });
    await db.serviceDuration.createMany({
      data: durations.map((d) => ({ serviceId: params.id, ...d })),
    });
  }

  return NextResponse.json(
    await db.service.findUnique({
      where: { id: params.id },
      include: { durations: { orderBy: { mins: "asc" } } },
    })
  );
}
