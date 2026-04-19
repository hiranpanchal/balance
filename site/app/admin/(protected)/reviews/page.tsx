import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ReviewsAdmin } from "./ReviewsAdmin";

export const metadata: Metadata = { title: "Reviews" };
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await db.review.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Reviews</h1>
        <p className="text-[13px] text-[#A09687] mt-1">{reviews.length} total</p>
      </div>
      <ReviewsAdmin initialReviews={JSON.parse(JSON.stringify(reviews))} />
    </div>
  );
}
