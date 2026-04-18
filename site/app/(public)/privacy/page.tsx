import type { Metadata } from "next";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Balance and Wellness handles your personal data.",
};

export default function PrivacyPage() {
  return (
    <article className="pt-24 md:pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[720px] mx-auto">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="font-display text-[44px] md:text-[56px] leading-[1.1] mt-5 text-teal">
          Privacy
        </h1>
        <div className="mt-6">
          <GoldRule width="w-10" />
        </div>

        <div className="mt-12 space-y-8 text-[15px] leading-[28px] text-teal/85">
          <p>
            This page explains what personal information Balance and Wellness
            collects, why we collect it, and what happens to it. It reflects
            how we operate today and is written in plain English.
          </p>
          <h2 className="font-display text-[24px] text-teal pt-4">
            What we collect
          </h2>
          <p>
            Names, email addresses, phone numbers, and any notes you add when
            booking a session. If you message us via the contact form, the
            message itself.
          </p>
          <h2 className="font-display text-[24px] text-teal pt-4">
            Why we collect it
          </h2>
          <p>
            So we can hold your session, contact you if anything changes, and
            tailor the experience to what you&rsquo;ve told us. We don&rsquo;t
            sell or share personal data with anyone outside the studio.
          </p>
          <h2 className="font-display text-[24px] text-teal pt-4">
            How long we keep it
          </h2>
          <p>
            Booking records for six years, as required for our insurance.
            Marketing subscribers for as long as you remain subscribed.
          </p>
          <h2 className="font-display text-[24px] text-teal pt-4">
            Your rights
          </h2>
          <p>
            You can ask us for a copy of your data, or to delete it, by
            writing to{" "}
            <a
              href="mailto:hello@balanceandwellness.com"
              className="border-b border-gold/50"
            >
              hello@balanceandwellness.com
            </a>
            . We&rsquo;ll respond within a week.
          </p>
          <p className="pt-6 text-[13px] text-stone">
            Last updated: April 2026. This is placeholder copy — please have a
            solicitor review before going live.
          </p>
        </div>
      </div>
    </article>
  );
}
