export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { portalUpsertPost } from "@/lib/portal";

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

  try {
    const portalId = await portalUpsertPost({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || undefined,
      body: post.body || undefined,
      category: post.tag || undefined,
      coverImage: post.image || undefined,
      publishedAt: post.publishedAt.toISOString(),
      status: post.published ? "published" : "draft",
    });
    await db.journalPost.update({
      where: { slug: post.slug },
      data: { portalPostId: portalId },
    });
  } catch (err) {
    console.error("Portal sync failed (create):", err);
  }

  return NextResponse.json(post, { status: 201 });
}
