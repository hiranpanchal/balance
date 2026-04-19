import Link from "next/link";
import { Eyebrow } from "./Eyebrow";
import { NewsletterForm } from "./NewsletterForm";
import { studio as defaultStudio } from "@/lib/data";

interface StudioInfo {
  addressLines: string[];
  phone: string;
  email: string;
  instagram: string;
  hours: [string, string][];
}

export function Footer({ studio }: { studio?: StudioInfo }) {
  const s = studio ?? defaultStudio;
  return (
    <footer className="pt-20 pb-10 px-6 md:px-12 bg-teal-deep text-cream mt-24">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <Link href="/" aria-label="Balance and Wellness, home">
            <img src="/logo-dark.svg" alt="Balance and Wellness" className="h-10 w-auto" />
          </Link>
          <p className="mt-5 text-[13px] leading-[22px] opacity-70 max-w-[240px]">
            A boutique massage studio in Lostock Hall.
          </p>
        </div>

        <div>
          <Eyebrow>Studio</Eyebrow>
          <ul className="mt-4 space-y-2 text-[13px]">
            <li><Link href="/about" className="opacity-80 hover:opacity-100">About</Link></li>
            <li><Link href="/services" className="opacity-80 hover:opacity-100">Treatments</Link></li>
            <li><Link href="/pricing" className="opacity-80 hover:opacity-100">Pricing</Link></li>
            <li><Link href="/journal" className="opacity-80 hover:opacity-100">Journal</Link></li>
            <li><Link href="/gift-vouchers" className="opacity-80 hover:opacity-100">Gift vouchers</Link></li>
          </ul>
        </div>

        <div>
          <Eyebrow>Visit</Eyebrow>
          <ul className="mt-4 space-y-2 text-[13px] opacity-80">
            {s.addressLines.map((l) => <li key={l}>{l}</li>)}
            <li className="pt-2">{s.phone}</li>
            <li>
              <a href={`mailto:${s.email}`} className="hover:opacity-100">
                {s.email}
              </a>
            </li>
            {s.hours.map(([d, h]) => (
              <li key={d} className="flex justify-between gap-4 pt-1">
                <span>{d}</span>
                <span className="opacity-70">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Eyebrow>Newsletter</Eyebrow>
          <p className="mt-4 text-[13px] leading-[22px] opacity-80">
            Monthly notes on stillness, sleep, and simple rituals. No noise.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] tracking-[0.18em] uppercase opacity-50 gap-3 border-t border-cream/15">
        <span>© {new Date().getFullYear()} Balance and Wellness · {s.addressLines[s.addressLines.length - 1]}</span>
        <div className="flex gap-6">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a
            href="https://instagram.com/balance.and.wellness"
            target="_blank"
            rel="noreferrer noopener"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
