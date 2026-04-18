import type { Metadata } from "next";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms under which Balance and Wellness provides treatments.",
};

export default function TermsPage() {
  return (
    <article className="pt-24 md:pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[720px] mx-auto">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="font-display text-[44px] md:text-[56px] leading-[1.1] mt-5 text-teal">
          Terms of service
        </h1>
        <div className="mt-6">
          <GoldRule width="w-10" />
        </div>

        <div className="mt-12 space-y-8 text-[15px] leading-[28px] text-teal/85">
          <h2 className="font-display text-[24px] text-teal">Bookings</h2>
          <p>
            Sessions are held on confirmation. We require a booking at least
            four hours ahead of time. Payment is taken on the day of the
            session, by card or cash.
          </p>
          <h2 className="font-display text-[24px] text-teal pt-4">
            Cancellations
          </h2>
          <p>
            Free up to 24 hours before your session. Inside 24 hours we charge
            50% of the session price. No-shows are charged the full amount.
            Exceptions are made for genuine emergencies — please let us know.
          </p>
          <h2 className="font-display text-[24px] text-teal pt-4">
            Health conditions
          </h2>
          <p>
            Please tell us about any relevant medical conditions when you
            book, and before your session. Some treatments are contraindicated
            for specific conditions; we&rsquo;ll always tell you honestly.
          </p>
          <h2 className="font-display text-[24px] text-teal pt-4">
            Gift vouchers
          </h2>
          <p>
            Valid for twelve months from the date of purchase. Not refundable
            for cash. Transferable — you can gift a voucher onwards.
          </p>
          <h2 className="font-display text-[24px] text-teal pt-4">
            Conduct
          </h2>
          <p>
            Your therapist reserves the right to end a session at any time if
            she feels unsafe. In that case the full session price is charged.
          </p>
          <p className="pt-6 text-[13px] text-stone">
            Last updated: April 2026. Placeholder copy — please have a
            solicitor review before going live.
          </p>
        </div>
      </div>
    </article>
  );
}
