import type { Metadata } from "next";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { Button } from "@/components/site/Button";
import { ImgPlaceholder } from "@/components/site/ImgPlaceholder";
import { voucherAmounts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gift vouchers",
  description:
    "A quiet hour, given. Balance and Wellness gift vouchers from £75, delivered by email or post.",
};

export default function VouchersPage() {
  return (
    <>
      <section className="pt-24 md:pt-32 pb-12 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <Eyebrow>Gift vouchers</Eyebrow>
          <h1 className="font-display text-[48px] md:text-[64px] leading-[1.05] mt-6 text-teal">
            A quiet hour, given.
          </h1>
          <div className="mt-8 flex justify-center">
            <GoldRule width="w-12" />
          </div>
          <p className="mt-10 text-[17px] leading-[30px] max-w-[560px] mx-auto text-teal/85">
            The best gift we know is unhurried time. Vouchers are valid for
            twelve months from purchase, and can be redeemed against any
            treatment or duration.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-[1fr_1.1fr] gap-14 md:gap-20 items-center">
          <ImgPlaceholder
            src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=80"
            alt="A Balance and Wellness gift voucher"
            label="Voucher"
            ratio="4 / 5"
          />
          <div>
            <Eyebrow>Amounts</Eyebrow>
            <h2 className="font-display text-[32px] md:text-[40px] leading-[1.15] mt-4 text-teal">
              Choose a denomination.
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {voucherAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className="group text-left p-6 border border-teal/15 rounded-lg hover:border-gold transition-colors"
                >
                  <Eyebrow>{amt === 50 ? "Starter" : amt === 75 ? "Standard" : "Long session"}</Eyebrow>
                  <div className="font-display text-[34px] mt-3 text-teal">
                    £{amt}
                  </div>
                </button>
              ))}
              <button
                type="button"
                className="col-span-2 text-left p-6 border border-teal/15 rounded-lg hover:border-gold transition-colors"
              >
                <Eyebrow>Custom amount</Eyebrow>
                <div className="font-display text-[24px] mt-3 text-teal">
                  Enter your own
                </div>
              </button>
            </div>
            <div className="mt-10 space-y-4">
              <Eyebrow>Delivery</Eyebrow>
              <p className="text-[14px] leading-[24px] text-teal/80">
                Vouchers are delivered by email the same day, or sent by post
                on recycled card with a handwritten note — add the address at
                checkout.
              </p>
            </div>
            <div className="mt-10">
              <Button variant="primary" href="mailto:hello@balanceandwellness.com?subject=Gift voucher">
                Purchase a voucher
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
