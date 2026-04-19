import Image from "next/image";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import { GoldRule } from "./GoldRule";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2400&q=80";

interface HeroProps {
  headline?: string;
  subheadline?: string;
}

export function Hero({ headline, subheadline }: HeroProps = {}) {
  return (
    <section className="relative w-full h-[88vh] min-h-[620px] flex items-center justify-center overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="A linen-draped massage table in morning light"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "rgba(40, 54, 60, 0.35)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "rgba(178,139,93,0.04)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--cream))",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-[820px]">
        <Eyebrow tone="cream">MASSAGE · BODYWORK · SPA</Eyebrow>
        <div className="flex justify-center mt-4">
          <GoldRule width="w-10" />
        </div>
        <h1 className="font-display mt-6 leading-[1.05] text-[54px] md:text-[78px] text-cream">
          {headline ?? "A quiet hour, well kept."}
        </h1>
        <p className="mt-8 text-[17px] md:text-[19px] leading-[30px] max-w-[560px] mx-auto text-cream/90">
          {subheadline ?? "Boutique massage and bodywork, delivered with unhurried attention. Open Tuesday through Saturday."}
        </p>
        <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
          <Button href="/book" variant="primary">
            Book a session
          </Button>
          <a
            href="/services"
            className="text-[13px] tracking-[0.12em] uppercase text-cream border-b border-gold pb-1"
          >
            See our treatments
          </a>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-cream/70"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <span className="mt-2 w-px h-10 bg-cream" />
      </div>
    </section>
  );
}
