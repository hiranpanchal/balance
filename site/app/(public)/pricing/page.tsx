import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { Button } from "@/components/site/Button";
import { services, faq } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Quiet, steady pricing across all seven treatments. No add-ons, no upsells. From £35.",
};

export default function PricingPage() {
  return (
    <>
      <section className="pt-24 md:pt-32 pb-10 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="font-display text-[48px] md:text-[64px] leading-[1.05] mt-6 text-teal">
            Steady, honest pricing.
          </h1>
          <div className="mt-8 flex justify-center">
            <GoldRule width="w-12" />
          </div>
          <p className="mt-10 text-[17px] leading-[30px] max-w-[620px] mx-auto text-teal/85">
            No add-ons. No premium hours. Gratuity is always included. Booking
            a longer session means more time, not a different treatment.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <ul className="divide-y divide-teal/15">
            {services.map((s) => (
              <li
                key={s.id}
                className="py-7 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-start md:items-center"
              >
                <div>
                  <Link
                    href={`/services/${s.id}`}
                    className="font-display text-[22px] md:text-[26px] text-teal hover:text-teal-deep transition-colors"
                  >
                    {s.name}
                  </Link>
                  <p className="mt-2 text-[13px] leading-[22px] text-teal/70 max-w-[540px]">
                    {s.tagline}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {s.durations.map((d) => (
                    <span
                      key={d.mins}
                      className="text-[12px] tracking-[0.12em] uppercase border border-teal/20 rounded-sm px-3 py-1.5 text-teal whitespace-nowrap"
                    >
                      {d.mins} min · £{d.price}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 md:px-12 bg-cream-light">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-14">
          <div>
            <Eyebrow>Packs</Eyebrow>
            <h2 className="font-display text-[30px] md:text-[36px] leading-[1.2] mt-4 text-teal">
              Book a sequence, save a little.
            </h2>
            <p className="mt-6 text-[15px] leading-[28px] text-teal/80">
              For guests who come back. Packs are flexible — mix durations and
              treatments as you like. They don&rsquo;t expire.
            </p>
            <ul className="mt-8 space-y-4 text-[15px] leading-[26px] text-teal">
              <li className="flex items-baseline justify-between gap-6 border-b border-teal/10 pb-3">
                <span>Three-session pack</span>
                <span className="text-gold text-[12px] tracking-[0.18em] uppercase">
                  10% off
                </span>
              </li>
              <li className="flex items-baseline justify-between gap-6 border-b border-teal/10 pb-3">
                <span>Six-session pack</span>
                <span className="text-gold text-[12px] tracking-[0.18em] uppercase">
                  15% off
                </span>
              </li>
            </ul>
          </div>
          <div>
            <Eyebrow>Notes</Eyebrow>
            <h2 className="font-display text-[30px] md:text-[36px] leading-[1.2] mt-4 text-teal">
              A few things worth knowing.
            </h2>
            <dl className="mt-8 space-y-6">
              {faq.map((f) => (
                <div key={f.q}>
                  <dt className="font-display text-[17px] text-teal">{f.q}</dt>
                  <dd className="mt-2 text-[14px] leading-[24px] text-teal/80">
                    {f.a}
                  </dd>
                </div>
              ))}
              <div>
                <dt className="font-display text-[17px] text-teal">
                  Gratuity
                </dt>
                <dd className="mt-2 text-[14px] leading-[24px] text-teal/80">
                  Included. Please never feel you need to tip.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="font-display text-[32px] md:text-[40px] leading-[1.15] text-teal">
            Ready when you are.
          </h2>
          <div className="mt-10 flex gap-5 justify-center flex-wrap">
            <Button href="/book" variant="primary">
              Book a session
            </Button>
            <Button href="/gift-vouchers" variant="secondary">
              Buy a gift voucher
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
