export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { portalUpsertPost, portalDeletePost } from "@/lib/portal";

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
    if (!post.portalPostId) {
      await db.journalPost.update({
        where: { slug: post.slug },
        data: { portalPostId: portalId },
      });
    }
  } catch (err) {
    console.error("Portal sync failed (update):", err);
  }

  return NextResponse.json(post);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await db.journalPost.findUnique({ where: { slug: params.slug } });

  await db.journalPost.delete({ where: { slug: params.slug } });

  if (post?.portalPostId) {
    try {
      await portalDeletePost(post.portalPostId);
    } catch (err) {
      console.error("Portal sync failed (delete):", err);
    }
  }

  return new NextResponse(null, { status: 204 });
}
