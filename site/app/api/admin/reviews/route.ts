export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const CreateSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  body: z.string().min(1),
  rating: z.number().int().min(1).max(5),
});

export async function GET() {
  const reviews = await db.review.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = CreateSchema.parse(body);
    const review = await db.review.create({
      data: {
        name: data.name,
        company: data.company ?? "",
        body: data.body,
        rating: data.rating,
        published: true,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
