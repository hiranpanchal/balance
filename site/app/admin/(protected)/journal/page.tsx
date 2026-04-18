import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Journal" };
export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const posts = await db.journalPost.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Journal</h1>
        <Link
          href="/admin/journal/new"
          className="bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase px-6 py-3 rounded hover:opacity-90"
        >
          New post
        </Link>
      </div>

      <div className="space-y-3">
        {posts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-[#A09687] text-[14px]">
            No posts yet. Write your first journal entry.
          </div>
        )}
        {posts.map((p) => (
          <div
            key={p.slug}
            className="bg-white rounded-lg shadow-sm p-5 flex items-center justify-between gap-6"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-serif text-[17px] text-[#3E4F56]">{p.title}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded border ${
                    p.published
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="text-[12px] text-[#A09687] mt-1">
                {p.tag && <span className="mr-3">{p.tag}</span>}
                <span>{new Date(p.publishedAt).toLocaleDateString("en-GB")}</span>
              </div>
            </div>
            <Link
              href={`/admin/journal/${p.slug}`}
              className="shrink-0 text-[13px] text-[#B28B5D] hover:underline"
            >
              Edit →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
