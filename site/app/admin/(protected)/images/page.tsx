import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ImageManager } from "@/components/admin/ImageManager";

export const metadata: Metadata = { title: "Images" };
export const dynamic = "force-dynamic";

export default async function ImagesPage() {
  const images = await db.image.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Images</h1>
        <p className="text-[13px] text-[#A09687] mt-1">
          Upload images to Vercel Blob. Copy the URL into service or journal image fields.
        </p>
      </div>
      <ImageManager images={JSON.parse(JSON.stringify(images))} />
    </div>
  );
}
