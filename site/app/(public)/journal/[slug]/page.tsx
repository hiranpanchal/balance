import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { JournalCard } from "@/components/site/JournalCard";
import { ImgPlaceholder } from "@/components/site/ImgPlaceholder";
import { journalPosts } from "@/lib/data";

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = journalPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.teaser,
    openGraph: { images: [post.cover] },
  };
}

export default function JournalArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = journalPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = journalPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const date = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <article className="pt-20 md:pt-28 px-6 md:px-12">
        <div className="max-w-[780px] mx-auto">
          <div className="text-center">
            <Eyebrow>{post.category}</Eyebrow>
            <h1 className="font-display text-[40px] md:text-[60px] leading-[1.1] mt-5 text-teal">
              {post.title}
            </h1>
            <div className="mt-7 flex justify-center">
              <GoldRule width="w-10" />
            </div>
            <div className="mt-5 text-[11px] tracking-[0.22em] uppercase text-stone">
              {post.author} · {date} · {post.readMins} min read
            </div>
          </div>
          <div className="mt-14">
            <ImgPlaceholder
              src={post.cover}
              alt={post.title}
              label={post.title}
              ratio="16 / 9"
              priority
              sizes="(min-width: 1024px) 780px, 95vw"
            />
          </div>
          <div className="mt-14 space-y-7 text-[17px] leading-[32px] text-teal/90">
            {post.body.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "first-letter:font-display first-letter:text-[54px] first-letter:leading-[0.9] first-letter:float-left first-letter:pr-3 first-letter:pt-2 first-letter:text-gold"
                    : ""
                }
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </article>

      <section className="mt-24 py-20 px-6 md:px-12 bg-cream-light">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <Eyebrow>Continue reading</Eyebrow>
              <h2 className="font-display text-[28px] md:text-[34px] leading-[1.2] mt-3 text-teal">
                More from the journal.
              </h2>
            </div>
            <Link
              href="/journal"
              className="text-[12px] tracking-[0.18em] uppercase text-teal border-b border-gold pb-1"
            >
              All entries →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {related.map((p) => (
              <JournalCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
