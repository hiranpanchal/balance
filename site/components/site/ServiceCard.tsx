import Link from "next/link";
import { Eyebrow } from "./Eyebrow";
import { ImgPlaceholder } from "./ImgPlaceholder";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  const from = service.durations[0];
  return (
    <Link
      href={`/services/${service.id}`}
      className="group block focus-visible:outline-gold"
    >
      <ImgPlaceholder
        src={service.image}
        alt={`${service.name} massage treatment`}
        label={`${service.name} image`}
        ratio="4 / 5"
        className="mb-7 transition-transform duration-500 ease-out-soft group-hover:scale-[1.01]"
        sizes="(min-width: 1024px) 30vw, 90vw"
      />
      <Eyebrow>Treatment</Eyebrow>
      <h3 className="font-display text-[26px] leading-[32px] mt-3 text-teal">
        {service.name}
      </h3>
      <p className="mt-3 text-[14px] leading-[24px] text-teal/80">
        {service.tagline}
      </p>
      <div className="mt-5 flex items-center justify-between text-[13px] text-teal">
        <span className="opacity-70">
          from £{from.price} / {from.mins} min
        </span>
        <span className="tracking-[0.14em] uppercase border-b border-gold pb-0.5 group-hover:text-teal-deep transition-colors">
          Read more →
        </span>
      </div>
    </Link>
  );
}
