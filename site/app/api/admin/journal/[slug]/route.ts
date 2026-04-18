import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const UpdateSchema = z.object({
  title: z.string().optional(),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  tag: z.string().optional(),
  readingTime: z.number().optional(),
  image: z.string().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await db.journalPost.findUnique({ where: { slug: params.slug } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { publishedAt, ...rest } = UpdateSchema.parse(body);

  const post = await db.journalPost.update({
    where: { slug: params.slug },
    data: {
      ...rest,
      ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.journalPost.delete({ where: { slug: params.slug } });
  return new NextResponse(null, { status: 204 });
}
