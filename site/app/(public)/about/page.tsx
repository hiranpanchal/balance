import type { Metadata } from "next";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { Button } from "@/components/site/Button";
import { ImgPlaceholder } from "@/components/site/ImgPlaceholder";
import { therapist, values } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Mukti Panchal — fully qualified clinical aromatherapist and massage therapist. Boutique Bristol studio, one guest at a time.",
};

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=1200&q=80",
    label: "The reception room",
  },
  {
    src: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80",
    label: "The treatment room",
  },
  {
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    label: "Bespoke oils",
  },
  {
    src: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80",
    label: "Linen and light",
  },
  {
    src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    label: "Warmth and stone",
  },
  {
    src: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    label: "A quiet hour",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-24 md:pt-32 pb-16 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <Eyebrow>About</Eyebrow>
          <h1 className="font-display text-[48px] md:text-[72px] leading-[1.05] mt-6 text-teal">
            An unhurried studio, by design.
          </h1>
          <div className="mt-8 flex justify-center">
            <GoldRule width="w-12" />
          </div>
          <p className="mt-10 text-[17px] leading-[30px] max-w-[640px] mx-auto text-teal/85">
            Balance and Wellness is a one-therapist studio, run by Mukti
            Panchal. One guest at a time. One room. A kettle that is always on.
            The aim is simple — to offer a genuinely unhurried hour, by a
            therapist who has practised the craft for years.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-[1fr_1.1fr] gap-12 md:gap-20 items-center">
          <ImgPlaceholder
            src={therapist.image}
            alt={therapist.name}
            label={therapist.name}
            ratio="4 / 5"
          />
          <div>
            <Eyebrow>Your therapist</Eyebrow>
            <h2 className="font-display text-[40px] md:text-[52px] leading-[1.1] mt-5 text-teal">
              {therapist.name}
            </h2>
            <div className="mt-4 text-[12px] tracking-[0.18em] uppercase text-stone">
              {therapist.role}
            </div>
            <div className="mt-8 space-y-5 text-[16px] leading-[28px] text-teal/85">
              {therapist.bio.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-10 flex gap-4 flex-wrap">
              <Button href="/book" variant="primary">
                Book a session
              </Button>
              <Button href="/contact" variant="secondary">
                Get in touch
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 bg-cream-light">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center">
            <Eyebrow>What we come back to</Eyebrow>
            <h2 className="font-display text-[32px] md:text-[40px] leading-[1.15] mt-4 text-teal">
              Five words that shape the studio.
            </h2>
          </div>
          <div className="grid md:grid-cols-5 gap-6 mt-14">
            {values.map((v) => (
              <div
                key={v.name}
                className="text-center p-6 border border-teal/10 rounded-lg bg-cream"
              >
                <div className="font-display text-[20px] text-teal">
                  {v.name}
                </div>
                <div className="mt-3 flex justify-center">
                  <GoldRule width="w-5" />
                </div>
                <p className="mt-4 text-[13px] leading-[22px] text-teal/80">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center">
            <Eyebrow>The space</Eyebrow>
            <h2 className="font-display text-[32px] md:text-[40px] leading-[1.15] mt-4 text-teal">
              Inside the studio.
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {GALLERY.map((img) => (
              <figure key={img.label}>
                <ImgPlaceholder
                  src={img.src}
                  alt={img.label}
                  label={img.label}
                  ratio="4 / 5"
                />
                <figcaption className="mt-3 text-[11px] tracking-[0.22em] uppercase text-stone">
                  {img.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
