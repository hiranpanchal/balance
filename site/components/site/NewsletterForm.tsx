"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // TODO: wire a real provider (Buttondown, ConvertKit, etc).
    // eslint-disable-next-line no-console
    console.log("[mock newsletter signup]", new FormData(form).get("email"));
    form.reset();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  if (sent) {
    return (
      <p className="mt-4 text-[13px] leading-[22px] text-gold">
        Thank you — we&rsquo;ll be in touch.
      </p>
    );
  }

  return (
    <form
      className="mt-4 flex items-center border-b border-cream/25 pb-2"
      onSubmit={onSubmit}
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="your@email.com"
        className="bg-transparent flex-1 text-[13px] placeholder:text-cream/50 text-cream focus:outline-none"
      />
      <button
        type="submit"
        className="text-[11px] tracking-[0.22em] uppercase text-gold"
      >
        Subscribe →
      </button>
    </form>
  );
}
