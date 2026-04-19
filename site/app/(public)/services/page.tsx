import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { Button } from "@/components/site/Button";
import { ImgPlaceholder } from "@/components/site/ImgPlaceholder";
import { getPageDescription } from "@/lib/content";
import { getServices } from "@/lib/getServices";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Treatments",
    description: await getPageDescription(
      "page.services.description",
      "Seven boutique massage and bodywork treatments — from a signature Balance session to Hot Stones. One therapist, one guest at a time."
    ),
  };
}

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <section className="pt-24 md:pt-32 pb-8 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <Eyebrow>Treatments</Eyebrow>
          <h1 className="font-display text-[44px] md:text-[64px] leading-[1.05] mt-6 text-teal">
            Seven treatments, honed over years.
          </h1>
          <p className="mt-8 text-[17px] leading-[30px] max-w-[620px] mx-auto text-teal/80">
            Choose what your body is asking for — or let me help you decide.
            Every session is one guest at a time, in one quiet room, with a
            bespoke blend of techniques tailored to the day.
          </p>
          <div className="mt-8 flex justify-center">
            <GoldRule width="w-12" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto space-y-24 md:space-y-28">
          {services.map((s, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={s.id}
                className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${
                  reverse ? "md:[&>:first-child]:order-2" : ""
                }`}
              >
                <ImgPlaceholder
                  src={s.image}
                  alt={s.name}
                  label={`${s.name} image`}
                  ratio="4 / 5"
                />
                <div>
                  <Eyebrow>Treatment</Eyebrow>
                  <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] mt-5 text-teal">
                    {s.name}
                  </h2>
                  <p className="mt-6 text-[16px] leading-[28px] text-teal/85">
                    {s.lead}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {s.durations.map((d) => (
                      <span
                        key={d.mins}
                        className="text-[12px] tracking-[0.12em] uppercase border border-teal/25 rounded-sm px-3 py-1.5 text-teal"
                      >
                        {d.mins} min · £{d.price}
                      </span>
                    ))}
                  </div>
                  <div className="mt-10 flex gap-5 flex-wrap items-center">
                    <Button href={`/book?treatment=${s.id}`} variant="primary">
                      Book this treatment
                    </Button>
                    <Link
                      href={`/services/${s.id}`}
                      className="text-[13px] tracking-[0.14em] uppercase text-teal border-b border-gold pb-1"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 bg-cream-light">
        <div className="max-w-[720px] mx-auto text-center">
          <Eyebrow>Not sure?</Eyebrow>
          <h2 className="font-display text-[32px] md:text-[40px] leading-[1.15] mt-5 text-teal">
            I&rsquo;ll help you choose.
          </h2>
          <p className="mt-6 text-[15px] leading-[28px] text-teal/80">
            If it&rsquo;s your first time, or you&rsquo;re not sure which
            treatment your body is asking for, send me a note. I&rsquo;ll reply
            within a day.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="secondary">
              Ask Mukti
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
