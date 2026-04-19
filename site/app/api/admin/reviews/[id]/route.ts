export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { published } = await req.json();
  const review = await db.review.update({
    where: { id: params.id },
    data: { published },
  });
  return NextResponse.json(review);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await db.review.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
