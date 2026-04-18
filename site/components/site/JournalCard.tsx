import Link from "next/link";
import { Eyebrow } from "./Eyebrow";
import { ImgPlaceholder } from "./ImgPlaceholder";
import type { JournalPost } from "@/lib/types";

export function JournalCard({ post }: { post: JournalPost }) {
  const date = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group block focus-visible:outline-gold"
    >
      <ImgPlaceholder
        src={post.cover}
        alt={post.title}
        label={post.title}
        ratio="16 / 9"
        className="mb-5 transition-transform duration-500 ease-out-soft group-hover:scale-[1.01]"
        sizes="(min-width: 1024px) 45vw, 90vw"
      />
      <Eyebrow>{post.category}</Eyebrow>
      <h3 className="font-display text-[24px] leading-[32px] mt-3 text-teal">
        {post.title}
      </h3>
      <p className="mt-3 text-[14px] leading-[24px] text-teal/80">
        {post.teaser}
      </p>
      <div className="mt-5 text-[11px] tracking-[0.22em] uppercase text-stone">
        {post.author} · {date} · {post.readMins} min read
      </div>
    </Link>
  );
}
