import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/site/Hero";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { Button } from "@/components/site/Button";
import { ServiceCard } from "@/components/site/ServiceCard";
import { JournalCard } from "@/components/site/JournalCard";
import { ImgPlaceholder } from "@/components/site/ImgPlaceholder";
import { journalPosts, featuredServiceIds } from "@/lib/data";
import { getSiteContent } from "@/lib/content";
import { getServices } from "@/lib/getServices";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { getPageDescription } = await import("@/lib/content");
  return {
    title: "Balance and Wellness — boutique massage & bodywork",
    description: await getPageDescription(
      "page.home.description",
      "Boutique massage and bodywork by clinical aromatherapist Mukti Panchal. Seven treatments, one guest at a time, in Lostock Hall."
    ),
  };
}

const approach = [
  {
    title: "Stillness",
    body: "We protect quiet — in the room, the rituals, and the pace of the work.",
  },
  {
    title: "Craft",
    body: "A fully qualified clinical aromatherapist and massage therapist.",
  },
  {
    title: "Presence",
    body: "One guest at a time. No double-booking, no overlap, no rushing.",
  },
];

export default async function HomePage() {
  const [content, allServices, latestReviews] = await Promise.all([
    getSiteContent(),
    getServices(),
    db.review.findMany({ where: { published: true }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }], take: 4 }),
  ]);
  const { studio } = content;
  const featuredServices = featuredServiceIds
    .map((id) => allServices.find((s) => s.id === id))
    .filter(Boolean) as (typeof allServices)[number][];
  const latestPosts = journalPosts.slice(0, 2);

  return (
    <>
      <Hero headline={content.hero.headline} subheadline={content.hero.subheadline} />

      {/* Approach */}
      <section className="py-28 md:py-32 px-6 md:px-12">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center">
            <Eyebrow>— Our approach —</Eyebrow>
            <h2 className="font-display text-[36px] md:text-[44px] leading-[1.15] mt-6 max-w-[620px] mx-auto text-teal">
              A studio built around three quiet principles.
            </h2>
            <p className="mt-6 text-[15px] leading-[28px] max-w-[540px] mx-auto text-teal/75">
              From the moment you arrive to the final cup of tea on the way out,
              every part of the session is shaped by the same few ideas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 md:gap-16 mt-20">
            {approach.map((it) => (
              <div key={it.title} className="text-center">
                <div className="font-display text-[22px] text-teal">
                  {it.title}
                </div>
                <div className="mt-3 flex justify-center">
                  <GoldRule width="w-6" />
                </div>
                <p className="mt-5 text-[14px] leading-[24px] max-w-[280px] mx-auto text-teal/80">
                  {it.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section className="py-28 md:py-32 px-6 md:px-12 bg-cream-light">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center">
            <Eyebrow>Treatments</Eyebrow>
            <h2 className="font-display text-[40px] md:text-[52px] leading-[1.1] mt-6 max-w-[720px] mx-auto text-teal">
              Seven treatments, each honed over years.
            </h2>
            <p className="mt-6 text-[15px] leading-[28px] max-w-[520px] mx-auto text-teal/75">
              Choose what your body is asking for — or let me help you decide.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10 mt-20">
            {featuredServices.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link
              href="/services"
              className="text-[12px] tracking-[0.22em] uppercase text-teal border-b border-gold pb-1"
            >
              See all seven treatments →
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {latestReviews.length > 0 && (
        <section className="py-24 md:py-28 px-6 md:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <Eyebrow>Reviews</Eyebrow>
              <h2 className="font-display text-[32px] md:text-[40px] leading-[1.15] mt-4 text-teal">
                What guests say.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {latestReviews.map((r) => (
                <article key={r.id} className="bg-cream-light rounded-lg p-8 flex flex-col gap-4">
                  <div className="flex gap-1" aria-label={`${r.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} aria-hidden className="text-[20px] leading-none" style={{ color: n <= r.rating ? "#B28B5D" : "#D1C4B0" }}>★</span>
                    ))}
                  </div>
                  <p className="font-display italic text-[18px] md:text-[20px] leading-[1.4] text-teal flex-1">
                    &ldquo;{r.body}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-teal/10">
                    <div className="text-[13px] font-medium text-teal">{r.name}</div>
                    {r.company && <div className="text-[12px] text-teal/55 mt-0.5">{r.company}</div>}
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/reviews" className="text-[12px] tracking-[0.22em] uppercase text-teal border-b border-gold pb-1">
                Read all reviews →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Journal preview */}
      <section className="py-24 px-6 md:px-12 bg-cream-light">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <Eyebrow>Journal</Eyebrow>
              <h2 className="font-display text-[32px] md:text-[40px] leading-[1.15] mt-4 text-teal">
                Notes from the studio.
              </h2>
            </div>
            <Link
              href="/journal"
              className="text-[12px] tracking-[0.18em] uppercase text-teal border-b border-gold pb-1"
            >
              Read all entries →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 mt-12">
            {latestPosts.map((p) => (
              <JournalCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <ImgPlaceholder
              src="https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=1600&q=80"
              alt="The studio interior"
              label="Studio interior"
              ratio="4 / 3"
            />
          </div>
          <div>
            <Eyebrow>Visit</Eyebrow>
            <h2 className="font-display text-[38px] md:text-[48px] leading-[1.1] mt-6 text-teal">
              {studio.addressLines[0]}
            </h2>
            <p className="mt-6 text-[15px] leading-[28px] max-w-[440px] text-teal/80">
              A quiet side street two minutes from the harbour. Tea is always on.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-4 text-[13px] text-teal">
              <div>
                <Eyebrow>Address</Eyebrow>
                {studio.addressLines.map((a) => (
                  <div key={a} className="mt-1">
                    {a}
                  </div>
                ))}
                <div className="mt-3 opacity-75">{studio.phone}</div>
              </div>
              <div>
                <Eyebrow>Hours</Eyebrow>
                {studio.hours.map(([d, h]) => (
                  <div key={d} className="mt-1 flex justify-between gap-4">
                    <span>{d}</span>
                    <span className="opacity-70">{h}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <Button href="/contact" variant="secondary">
                Get directions
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
