import type { Metadata } from "next";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { getSiteContent } from "@/lib/content";
import { ContactForm } from "./ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Balance and Wellness. Studio address, opening hours, phone, email, and a contact form.",
};

export default async function ContactPage() {
  const { studio } = await getSiteContent();
  return (
    <>
      <section className="pt-24 md:pt-32 pb-12 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="font-display text-[48px] md:text-[64px] leading-[1.05] mt-6 text-teal">
            We&rsquo;d love to hear from you.
          </h1>
          <div className="mt-8 flex justify-center">
            <GoldRule width="w-12" />
          </div>
          <p className="mt-10 text-[17px] leading-[30px] max-w-[560px] mx-auto text-teal/80">
            For bookings, use the booking page — it&rsquo;s the quickest way.
            For anything else, write to us and we&rsquo;ll reply within a day.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1.1fr_1fr] gap-12 md:gap-20">
          <ContactForm />
          <aside className="space-y-10">
            <div>
              <Eyebrow>Studio</Eyebrow>
              <div className="mt-4 text-[15px] leading-[26px] text-teal">
                {studio.addressLines.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </div>
            </div>
            <div>
              <Eyebrow>Hours</Eyebrow>
              <dl className="mt-4 text-[15px] text-teal">
                {studio.hours.map(([d, h]) => (
                  <div
                    key={d}
                    className="flex justify-between gap-6 py-2 border-b border-teal/10 last:border-0"
                  >
                    <dt>{d}</dt>
                    <dd className="opacity-75">{h}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <Eyebrow>Call</Eyebrow>
              <a
                href={`tel:${studio.phone.replace(/\s/g, "")}`}
                className="mt-3 block text-[17px] text-teal border-b border-gold/40 pb-1 w-fit"
              >
                {studio.phone}
              </a>
            </div>
            <div>
              <Eyebrow>Email</Eyebrow>
              <a
                href={`mailto:${studio.email}`}
                className="mt-3 block text-[17px] text-teal border-b border-gold/40 pb-1 w-fit"
              >
                {studio.email}
              </a>
            </div>
            <div>
              <Eyebrow>Travel</Eyebrow>
              <p className="mt-3 text-[14px] leading-[24px] text-teal/80">
                Two minutes from the harbour. Nearest rail station: Bristol
                Temple Meads, fifteen minutes on foot. Street parking on Linen
                Lane is metered; the harbourside car park is a three-minute
                walk.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <div
            role="img"
            aria-label="Map showing 14 Linen Lane, Bristol"
            className="w-full h-[360px] rounded-lg overflow-hidden bg-cream-light relative flex items-center justify-center"
            style={{
              background:
                "repeating-linear-gradient(135deg, var(--cream-light) 0 22px, rgba(62,79,86,0.06) 22px 23px)",
            }}
          >
            <div className="text-center">
              <Eyebrow>Map</Eyebrow>
              <p className="mt-3 font-display text-[20px] text-teal">
                14 Linen Lane, Bristol BS1 4AA
              </p>
              <p className="mt-2 text-[12px] tracking-[0.18em] uppercase text-stone">
                {/* TODO: embed a real map provider (Mapbox / Google Maps) */}
                Map placeholder
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
