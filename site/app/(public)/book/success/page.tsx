"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GoldRule } from "@/components/site/GoldRule";
import { Button } from "@/components/site/Button";

const SS_KEY = "bw_booking_draft_v2";

export default function BookingSuccessPage() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const cleared = useRef(false);

  useEffect(() => {
    if (!cleared.current) {
      try { sessionStorage.removeItem(SS_KEY); } catch {}
      cleared.current = true;
    }
  }, []);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-24">
      <div className="max-w-[560px] w-full text-center">
        <div className="flex justify-center mb-8">
          <GoldRule width="w-12" />
        </div>

        <h1 className="font-display text-[44px] md:text-[56px] leading-[1.05] text-teal">
          You&rsquo;re booked in.
        </h1>

        <p className="mt-6 text-[15px] leading-[28px] text-teal/80">
          Your deposit has been taken and your session is confirmed. A confirmation email is on its way to you.
        </p>

        {ref && (
          <div className="mt-8 inline-block bg-cream-light rounded-lg px-8 py-5">
            <p className="text-[11px] tracking-[0.22em] uppercase text-gold mb-1">Booking reference</p>
            <p className="font-display text-[28px] text-teal">{ref}</p>
          </div>
        )}

        <p className="mt-8 text-[13px] text-teal/60 leading-[22px]">
          The remaining balance is payable on the day of your session.
          <br />
          Need to change anything? Call or message us at least 24 hours in advance.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/" variant="primary">Back to home</Button>
          <Link
            href="/services"
            className="text-[12px] tracking-[0.18em] uppercase text-teal border-b border-gold pb-1"
          >
            Browse treatments
          </Link>
        </div>
      </div>
    </div>
  );
}
