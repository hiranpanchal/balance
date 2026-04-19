import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { Button } from "@/components/site/Button";
import { ImgPlaceholder } from "@/components/site/ImgPlaceholder";
import { therapist } from "@/lib/data";
import { getServices, getService } from "@/lib/getServices";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = await getService(params.slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.lead,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [service, allServices] = await Promise.all([
    getService(params.slug),
    getServices(),
  ]);
  if (!service) notFound();

  const related = allServices.filter((s) => s.id !== service.id).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.lead,
    provider: { "@type": "LocalBusiness", name: "Balance and Wellness" },
    offers: service.durations.map((d) => ({
      "@type": "Offer",
      priceCurrency: "GBP",
      price: d.price,
      name: `${d.mins} min`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="pt-20 md:pt-28 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <Eyebrow>Treatment</Eyebrow>
            <h1 className="font-display text-[44px] md:text-[64px] leading-[1.05] mt-5 text-teal">
              {service.name}
            </h1>
            <div className="mt-6">
              <GoldRule width="w-12" />
            </div>
            <p className="mt-8 text-[17px] leading-[30px] max-w-[520px] text-teal/85">
              {service.lead}
            </p>
            <div className="mt-10 flex gap-5 items-center flex-wrap">
              <Button href={`/book?treatment=${service.id}`} variant="primary">
                Book this treatment
              </Button>
              <span className="text-[13px] text-teal/70">
                from £{service.durations[0].price} /{" "}
                {service.durations[0].mins} min
              </span>
            </div>
          </div>
          <ImgPlaceholder
            src={service.image}
            alt={`${service.name} treatment`}
            label={service.name}
            ratio="4 / 5"
          />
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center">
            <Eyebrow>What to expect</Eyebrow>
            <h2 className="font-display text-[32px] md:text-[40px] leading-[1.15] mt-4 text-teal">
              The shape of a session.
            </h2>
          </div>
          <ol className="mt-16 grid md:grid-cols-2 gap-10 md:gap-14">
            {service.whatToExpect.map((step) => (
              <li key={step.eyebrow} className="flex gap-6">
                <div className="font-display text-[32px] leading-none text-gold">
                  {step.eyebrow}
                </div>
                <p className="text-[15px] leading-[26px] text-teal/85">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-12 bg-cream-light">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-14 md:gap-20">
          <div>
            <Eyebrow>Good for</Eyebrow>
            <h2 className="font-display text-[30px] md:text-[36px] leading-[1.2] mt-4 text-teal">
              What this treatment is best suited to.
            </h2>
            <ul className="mt-8 space-y-3">
              {service.goodFor.map((g) => (
                <li
                  key={g}
                  className="flex items-start gap-3 text-[15px] leading-[26px] text-teal"
                >
                  <span
                    aria-hidden
                    className="mt-2.5 inline-block h-px w-4 bg-gold shrink-0"
                  />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="font-display text-[30px] md:text-[36px] leading-[1.2] mt-4 text-teal">
              Quiet, steady pricing.
            </h2>
            <table className="mt-8 w-full text-[15px] text-teal">
              <thead>
                <tr className="text-left border-b border-teal/15">
                  <th className="py-3 text-[11px] tracking-[0.22em] uppercase text-gold font-normal">
                    Duration
                  </th>
                  <th className="py-3 text-[11px] tracking-[0.22em] uppercase text-gold font-normal text-right">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {service.durations.map((d) => (
                  <tr key={d.mins} className="border-b border-teal/10">
                    <td className="py-4">{d.mins} minutes</td>
                    <td className="py-4 text-right">£{d.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto grid md:grid-cols-[280px_1fr] gap-10 md:gap-14 items-center">
          <ImgPlaceholder
            src={therapist.image}
            alt={therapist.name}
            label={therapist.name}
            ratio="4 / 5"
          />
          <div>
            <Eyebrow>Your therapist</Eyebrow>
            <h2 className="font-display text-[28px] md:text-[34px] leading-[1.2] mt-3 text-teal">
              {therapist.name}
            </h2>
            <div className="mt-2 text-[12px] tracking-[0.18em] uppercase text-stone">
              {therapist.role}
            </div>
            <p className="mt-5 text-[15px] leading-[26px] text-teal/80">
              {therapist.bio.split("\n\n")[0]}
            </p>
            <div className="mt-6">
              <Link
                href="/about"
                className="text-[12px] tracking-[0.18em] uppercase text-teal border-b border-gold pb-1"
              >
                Read the full bio →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-12 bg-teal-deep text-cream">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="font-display text-[32px] md:text-[44px] leading-[1.15] text-cream">
            Book your {service.name.toLowerCase()} session.
          </h2>
          <p className="mt-6 text-[15px] leading-[28px] text-cream/80">
            Four quiet steps. One guest at a time.
          </p>
          <div className="mt-10">
            <Button
              href={`/book?treatment=${service.id}`}
              variant="primary"
              className="!bg-cream !text-teal hover:!bg-cream-light"
            >
              Book a session
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <Eyebrow>Related</Eyebrow>
              <h2 className="font-display text-[28px] md:text-[34px] leading-[1.2] mt-3 text-teal">
                You may also consider.
              </h2>
            </div>
            <Link
              href="/services"
              className="text-[12px] tracking-[0.18em] uppercase text-teal border-b border-gold pb-1"
            >
              All treatments →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/services/${r.id}`}
                className="group grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr] gap-6 items-center focus-visible:outline-gold"
              >
                <ImgPlaceholder
                  src={r.image}
                  alt={r.name}
                  label={r.name}
                  ratio="4 / 5"
                />
                <div>
                  <Eyebrow>Treatment</Eyebrow>
                  <h3 className="font-display text-[22px] mt-2 text-teal">
                    {r.name}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[22px] text-teal/75">
                    {r.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
