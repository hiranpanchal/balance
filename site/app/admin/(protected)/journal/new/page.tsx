import type { Metadata } from "next";
import Link from "next/link";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata: Metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/journal" className="text-[13px] text-[#A09687] hover:text-[#3E4F56]">
          ← Journal
        </Link>
        <span className="text-[#A09687]">/</span>
        <span className="text-[13px] text-[#3E4F56]">New post</span>
      </div>
      <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal mb-8">New post</h1>
      <PostEditor mode="new" />
    </div>
  );
}
