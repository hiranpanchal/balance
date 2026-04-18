import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const metadata: Metadata = { title: "Content" };
export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const rows = await db.content.findMany({ orderBy: { key: "asc" } });
  const content = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Site content</h1>
        <p className="text-[13px] text-[#A09687] mt-1">
          Edit the hero copy, studio address, and hours — changes reflect live immediately.
        </p>
      </div>
      <ContentEditor content={content} />
    </div>
  );
}
