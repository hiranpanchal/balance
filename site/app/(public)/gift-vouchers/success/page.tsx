import type { Metadata } from "next";
import Link from "next/link";
import { GoldRule } from "@/components/site/GoldRule";

export const metadata: Metadata = { title: "Voucher purchased" };

export default function VoucherSuccessPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-[480px] mx-auto text-center">
        <div className="text-[11px] tracking-[0.22em] uppercase text-gold mb-6">
          Purchase complete
        </div>
        <h1 className="font-display text-[40px] md:text-[52px] leading-[1.1] text-teal">
          Your voucher is on its way.
        </h1>
        <div className="mt-6 flex justify-center">
          <GoldRule width="w-10" />
        </div>
        <p className="mt-8 text-[15px] leading-[28px] text-teal/80">
          The voucher code has been sent by email. It&rsquo;s valid for twelve months and can be used against any treatment at checkout.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/gift-vouchers"
            className="px-7 py-3 border border-teal/25 text-[12px] tracking-[0.15em] uppercase text-teal rounded hover:border-gold transition-colors"
          >
            Buy another
          </Link>
          <Link
            href="/book"
            className="px-7 py-3 bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase rounded hover:opacity-90"
          >
            Book a session
          </Link>
        </div>
      </div>
    </main>
  );
}
