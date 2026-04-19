import type { Metadata } from "next";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { JournalCard } from "@/components/site/JournalCard";
import { journalPosts } from "@/lib/data";
import { getPageDescription } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Journal",
    description: await getPageDescription(
      "page.journal.description",
      "Notes from the studio — short essays on stillness, sleep, ritual, and the craft of bodywork."
    ),
  };
}

export default function JournalPage() {
  return (
    <>
      <section className="pt-24 md:pt-32 pb-12 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <Eyebrow>Journal</Eyebrow>
          <h1 className="font-display text-[48px] md:text-[64px] leading-[1.05] mt-6 text-teal">
            Notes from the studio.
          </h1>
          <div className="mt-8 flex justify-center">
            <GoldRule width="w-12" />
          </div>
          <p className="mt-10 text-[17px] leading-[30px] max-w-[560px] mx-auto text-teal/80">
            Short essays on stillness, sleep, ritual, and the small decisions
            that shape how a session feels.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-14 md:gap-16">
          {journalPosts.map((p) => (
            <JournalCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </>
  );
}
