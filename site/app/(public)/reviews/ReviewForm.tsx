"use client";

import { useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-2" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="text-[36px] leading-none transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <span style={{ color: n <= (hover || value) ? "#B28B5D" : "#C8BAA7" }}>★</span>
        </button>
      ))}
    </div>
  );
}

const inputCls =
  "w-full border border-teal/20 rounded-md px-4 py-3 text-[15px] text-teal bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors placeholder:text-teal/35";

export function ReviewForm({ siteKey }: { siteKey: string }) {
  const [rating, setRating] = useState(5);
  const [captchaToken, setCaptchaToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!captchaToken) { setErrorMsg("Please complete the verification below."); return; }

    const form = e.currentTarget;
    const fd = new FormData(form);

    setStatus("submitting");
    setErrorMsg("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        company: fd.get("company") || undefined,
        body: fd.get("body"),
        rating,
        captchaToken,
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setErrorMsg(json.error ?? "Something went wrong. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
      setCaptchaToken("");
      return;
    }

    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="text-center py-14">
        <GoldRule width="w-10" />
        <p className="font-display text-[28px] md:text-[34px] text-teal mt-8">
          Thank you for your kind words.
        </p>
        <p className="mt-4 text-[15px] leading-[26px] text-teal/70 max-w-[420px] mx-auto">
          Your review is with us and will appear once approved. We really appreciate you taking the time.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto">
      <div className="text-center mb-10">
        <Eyebrow>Share your experience</Eyebrow>
        <h2 className="font-display text-[32px] md:text-[40px] leading-[1.15] mt-4 text-teal">
          Leave a review.
        </h2>
        <p className="mt-4 text-[15px] leading-[26px] text-teal/70">
          Your review will appear on this page after a quick check.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-teal/60 mb-2">
              Name *
            </label>
            <input
              name="name"
              required
              placeholder="Jane Smith"
              className={inputCls}
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-teal/60 mb-2">
              Company (optional)
            </label>
            <input
              name="company"
              placeholder="Acme Ltd"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-teal/60 mb-3">
            Your rating *
          </label>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-teal/60 mb-2">
            Your review *
          </label>
          <textarea
            name="body"
            required
            minLength={10}
            rows={5}
            placeholder="Tell us about your experience…"
            className={`${inputCls} resize-none leading-[26px]`}
          />
        </div>

        {/* Turnstile — themed to sit quietly on cream background */}
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-teal/60 mb-2">
            Verification
          </label>
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            onSuccess={setCaptchaToken}
            onExpire={() => setCaptchaToken("")}
            options={{ theme: "light", size: "normal" }}
          />
        </div>

        {errorMsg && (
          <p className="text-[14px] text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full md:w-auto px-10 py-3.5 bg-teal text-cream text-[12px] tracking-[0.18em] uppercase rounded hover:bg-teal-deep transition-colors disabled:opacity-50"
        >
          {status === "submitting" ? "Submitting…" : "Submit review"}
        </button>
      </form>
    </div>
  );
}
