import type { Metadata } from "next";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { ImgPlaceholder } from "@/components/site/ImgPlaceholder";
import { getPageDescription } from "@/lib/content";
import { VoucherPurchaseForm } from "@/components/gift-vouchers/VoucherPurchaseForm";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Gift vouchers",
    description: await getPageDescription(
      "page.giftvouchers.description",
      "A quiet hour, given. Balance and Wellness gift vouchers from £50, delivered by email the same day."
    ),
  };
}

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
            The best gift we know is unhurried time. Vouchers are valid for twelve months from purchase, and can be redeemed against any treatment or duration.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-[1fr_1.1fr] gap-14 md:gap-20 items-start">
          <ImgPlaceholder
            src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=80"
            alt="A Balance and Wellness gift voucher"
            label="Voucher"
            ratio="4 / 5"
          />
          <VoucherPurchaseForm />
        </div>
      </section>
    </>
  );
}
