import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata: Metadata = { title: "Edit post" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { slug: string } }) {
  const post = await db.journalPost.findUnique({ where: { slug: params.slug } });
  if (!post) notFound();

  const serialized = {
    ...JSON.parse(JSON.stringify(post)),
    publishedAt: post.publishedAt.toISOString().split("T")[0],
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/journal" className="text-[13px] text-[#A09687] hover:text-[#3E4F56]">
          ← Journal
        </Link>
        <span className="text-[#A09687]">/</span>
        <span className="text-[13px] text-[#3E4F56]">{post.title}</span>
      </div>
      <PostEditor post={serialized} mode="edit" />
    </div>
  );
}
