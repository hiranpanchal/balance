"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/site/Eyebrow";

const FIXED_AMOUNTS = [
  { pence: 5000, label: "Starter", desc: "Covers shorter sessions" },
  { pence: 7500, label: "Standard", desc: "Most 60-minute treatments" },
  { pence: 10000, label: "Long session", desc: "Premium 90-minute sessions" },
];

type Step = "amount" | "details" | "submitting";

export function VoucherPurchaseForm() {
  const [step, setStep] = useState<Step>("amount");
  const [amountPence, setAmountPence] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [forSomeoneElse, setForSomeoneElse] = useState(false);

  const [purchaserName, setPurchaserName] = useState("");
  const [purchaserEmail, setPurchaserEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resolvedPence = useCustom
    ? Math.round(parseFloat(customAmount || "0") * 100)
    : amountPence;

  const amountLabel = resolvedPence ? `£${resolvedPence / 100}` : null;

  function selectFixed(pence: number) {
    setAmountPence(pence);
    setUseCustom(false);
  }

  function handleCustomFocus() {
    setUseCustom(true);
    setAmountPence(null);
  }

  const canProceedToDetails =
    resolvedPence !== null && resolvedPence >= 1000 && resolvedPence <= 50000;

  const canSubmit =
    purchaserName.trim().length > 0 &&
    /\S+@\S+\.\S+/.test(purchaserEmail) &&
    (!forSomeoneElse || !recipientEmail || /\S+@\S+\.\S+/.test(recipientEmail));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !resolvedPence) return;
    setStep("submitting");
    setError("");
    try {
      const res = await fetch("/api/gift-vouchers/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountPence: resolvedPence,
          purchaserName: purchaserName.trim(),
          purchaserEmail: purchaserEmail.trim(),
          recipientName: forSomeoneElse ? recipientName.trim() : "",
          recipientEmail: forSomeoneElse ? recipientEmail.trim() : "",
          message: forSomeoneElse ? message.trim() : "",
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Something went wrong. Please try again.");
        setStep("details");
        return;
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setError("Something went wrong. Please try again.");
      setStep("details");
    }
  }

  if (step === "details" || step === "submitting") {
    return (
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => setStep("amount")}
            className="text-[11px] tracking-[0.18em] uppercase text-teal/50 hover:text-teal"
          >
            ← Back
          </button>
          <span className="text-[11px] tracking-[0.1em] uppercase text-gold">
            {amountLabel} voucher
          </span>
        </div>

        <Eyebrow>Your details</Eyebrow>
        <div className="mt-6 space-y-4">
          <Field label="Your name" required>
            <input
              type="text"
              value={purchaserName}
              onChange={(e) => setPurchaserName(e.target.value)}
              placeholder="Jane Smith"
              className={inputClass}
              required
            />
          </Field>
          <Field label="Your email" required>
            <input
              type="email"
              value={purchaserEmail}
              onChange={(e) => setPurchaserEmail(e.target.value)}
              placeholder="jane@example.com"
              className={inputClass}
              required
            />
          </Field>
        </div>

        <div className="mt-8">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={forSomeoneElse}
              onChange={(e) => setForSomeoneElse(e.target.checked)}
              className="w-4 h-4 accent-[#B28B5D]"
            />
            <span className="text-[13px] text-teal">This is a gift for someone else</span>
          </label>
        </div>

        {forSomeoneElse && (
          <div className="mt-6 space-y-4 pl-7 border-l-2 border-gold/30">
            <Field label="Recipient's name">
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Alex Jones"
                className={inputClass}
              />
            </Field>
            <Field label="Recipient's email" hint="Voucher code sent directly to them">
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="alex@example.com"
                className={inputClass}
              />
            </Field>
            <Field label="Personal message" hint="Optional">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Thinking of you…"
                rows={3}
                maxLength={500}
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>
        )}

        {error && (
          <p className="mt-4 text-[13px] text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || step === "submitting"}
          className="mt-8 w-full px-6 py-4 bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase rounded hover:opacity-90 disabled:opacity-40"
        >
          {step === "submitting" ? "Redirecting…" : `Purchase ${amountLabel} voucher`}
        </button>
        <p className="mt-3 text-[11px] text-teal/50 text-center">Secured by Stripe. Delivered by email instantly.</p>
      </form>
    );
  }

  return (
    <div>
      <Eyebrow>Choose an amount</Eyebrow>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {FIXED_AMOUNTS.map((opt) => {
          const selected = !useCustom && amountPence === opt.pence;
          return (
            <button
              key={opt.pence}
              type="button"
              onClick={() => selectFixed(opt.pence)}
              className={`text-left p-6 border rounded-lg transition-colors ${
                selected
                  ? "border-gold bg-cream-light"
                  : "border-teal/15 hover:border-gold"
              }`}
            >
              <Eyebrow>{opt.label}</Eyebrow>
              <div className="font-display text-[34px] mt-3 text-teal">
                £{opt.pence / 100}
              </div>
              <div className="text-[12px] text-teal/60 mt-1">{opt.desc}</div>
            </button>
          );
        })}

        <div
          className={`col-span-2 p-6 border rounded-lg transition-colors ${
            useCustom ? "border-gold bg-cream-light" : "border-teal/15"
          }`}
        >
          <Eyebrow>Custom amount</Eyebrow>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-display text-[24px] text-teal">£</span>
            <input
              type="number"
              min={10}
              max={500}
              step={5}
              value={customAmount}
              onFocus={handleCustomFocus}
              onChange={(e) => { setCustomAmount(e.target.value); setUseCustom(true); }}
              placeholder="e.g. 60"
              className="font-display text-[24px] text-teal bg-transparent border-b border-teal/30 focus:border-gold outline-none w-28"
            />
          </div>
          {useCustom && resolvedPence !== null && (resolvedPence < 1000 || resolvedPence > 50000) && (
            <p className="mt-2 text-[12px] text-red-500">Amount must be between £10 and £500</p>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Eyebrow>Delivery</Eyebrow>
        <p className="text-[14px] leading-[24px] text-teal/80">
          Delivered by email instantly after payment. If you&rsquo;re gifting to someone else, we&rsquo;ll send the code directly to them too.
        </p>
      </div>

      <button
        type="button"
        disabled={!canProceedToDetails}
        onClick={() => setStep("details")}
        className="mt-8 w-full px-6 py-4 bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase rounded hover:opacity-90 disabled:opacity-40"
      >
        Continue{amountLabel ? ` — ${amountLabel}` : ""}
      </button>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.15em] uppercase text-teal/60 mb-1.5">
        {label}{required && <span className="text-gold ml-1">*</span>}
        {hint && <span className="normal-case tracking-normal ml-2 text-teal/40">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-teal/20 rounded px-4 py-2.5 text-[14px] text-teal placeholder:text-teal/35 focus:outline-none focus:border-gold bg-transparent";
