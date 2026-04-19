export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const SubmitSchema = z.object({
  dateOfBirth: z.string().optional(),
  occupation: z.string().optional(),
  address: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  gpName: z.string().optional(),
  gpPractice: z.string().optional(),
  gpPhone: z.string().optional(),
  conditions: z.array(z.string()).optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  recentInjury: z.string().optional(),
  isPregnant: z.boolean().optional(),
  painAreas: z.array(z.string()).optional(),
  painNotes: z.string().optional(),
  previousMassage: z.boolean().optional(),
  massageFrequency: z.string().optional(),
  pressurePreference: z.string().optional(),
  areasToAvoid: z.string().optional(),
  goals: z.string().optional(),
  consentName: z.string().min(1),
});

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const intake = await db.intakeForm.findUnique({
    where: { token: params.token },
    include: { client: { select: { firstName: true, lastName: true } } },
  });
  if (!intake) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(intake);
}

export async function POST(request: Request, { params }: { params: { token: string } }) {
  const intake = await db.intakeForm.findUnique({ where: { token: params.token } });
  if (!intake) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (intake.completedAt) return NextResponse.json({ error: "Already submitted" }, { status: 409 });

  const body = await request.json();
  const data = SubmitSchema.parse(body);

  await db.intakeForm.update({
    where: { token: params.token },
    data: { ...data, completedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
