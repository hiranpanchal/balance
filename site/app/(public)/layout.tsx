import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SkipLink } from "@/components/site/SkipLink";
import { CookieBanner } from "@/components/site/CookieBanner";
import { getSiteContent } from "@/lib/content";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { studio } = await getSiteContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: studio.name,
    description: "Boutique massage and bodywork by clinical aromatherapist Mukti Panchal. One guest at a time.",
    url: "https://balanceandwellness.com",
    telephone: studio.phone,
    email: studio.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: studio.addressLines[0],
      addressLocality: studio.addressLines[1] ?? "",
      postalCode: studio.addressLines[studio.addressLines.length - 1] ?? "",
      addressCountry: "GB",
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "17:00" },
    ],
    priceRange: "££",
    currenciesAccepted: "GBP",
    paymentAccepted: "Cash, Card",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SkipLink />
      <Nav />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <Footer studio={studio} />
      <CookieBanner />
    </>
  );
}
