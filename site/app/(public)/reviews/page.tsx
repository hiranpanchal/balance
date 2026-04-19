import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { Button } from "@/components/site/Button";
import { getPageDescription } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Reviews",
    description: await getPageDescription(
      "page.reviews.description",
      "Read what guests say about Balance and Wellness. Honest reviews from real sessions."
    ),
  };
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          aria-hidden
          className="text-[22px] leading-none"
          style={{ color: n <= rating ? "#B28B5D" : "#D1C4B0" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const reviews = await db.review.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <>
      <section className="pt-24 md:pt-32 pb-12 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <Eyebrow>Reviews</Eyebrow>
          <h1 className="font-display text-[48px] md:text-[64px] leading-[1.05] mt-6 text-teal">
            What guests say.
          </h1>
          <div className="mt-8 flex justify-center">
            <GoldRule width="w-12" />
          </div>
          {avgRating && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className="text-[32px] leading-none" style={{ color: "#B28B5D" }}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-[15px] text-teal/70">
                {avgRating} average · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 md:px-12 pb-28">
        <div className="max-w-[1200px] mx-auto">
          {reviews.length === 0 ? (
            <div className="text-center py-20 text-teal/50 text-[15px]">
              No reviews yet — check back soon.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="bg-cream-light rounded-lg p-8 flex flex-col gap-4"
                >
                  <Stars rating={r.rating} />
                  <p className="font-display italic text-[19px] md:text-[22px] leading-[1.4] text-teal flex-1">
                    &ldquo;{r.body}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-teal/10">
                    <div className="text-[13px] font-medium text-teal">{r.name}</div>
                    {r.company && (
                      <div className="text-[12px] text-teal/55 mt-0.5">{r.company}</div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 bg-teal-deep text-cream">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="font-display text-[32px] md:text-[40px] leading-[1.15] text-cream">
            Ready to experience it yourself?
          </h2>
          <div className="mt-10">
            <Button href="/book" variant="primary" className="!bg-cream !text-teal hover:!bg-cream-light">
              Book a session
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
