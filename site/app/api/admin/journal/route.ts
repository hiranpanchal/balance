import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const CreateSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string(),
  body: z.string(),
  tag: z.string().optional(),
  readingTime: z.number().optional(),
  image: z.string().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await db.journalPost.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const data = CreateSchema.parse(body);

  const post = await db.journalPost.create({
    data: {
      ...data,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    },
  });

  return NextResponse.json(post, { status: 201 });
}
