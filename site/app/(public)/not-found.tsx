import Link from "next/link";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { Button } from "@/components/site/Button";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-[560px] text-center">
        <Eyebrow>404</Eyebrow>
        <h1 className="font-display text-[56px] md:text-[72px] leading-[1.05] mt-5 text-teal">
          This page is quiet.
        </h1>
        <div className="mt-8 flex justify-center">
          <GoldRule width="w-10" />
        </div>
        <p className="mt-10 text-[15px] leading-[28px] text-teal/80">
          We couldn&rsquo;t find what you were looking for. Try the home page,
          or book a session directly.
        </p>
        <div className="mt-10 flex gap-4 justify-center flex-wrap">
          <Button href="/" variant="primary">
            Home
          </Button>
          <Link
            href="/book"
            className="text-[13px] tracking-[0.14em] uppercase text-teal border-b border-gold pb-1"
          >
            Book a session →
          </Link>
        </div>
      </div>
    </section>
  );
}
