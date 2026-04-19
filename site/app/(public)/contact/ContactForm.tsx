"use client";

import { useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { TextField, TextAreaField } from "@/components/site/FormField";
import { Button } from "@/components/site/Button";
import { Eyebrow } from "@/components/site/Eyebrow";

export function ContactForm() {
  const [captchaToken, setCaptchaToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!captchaToken) { setErrorMsg("Please complete the verification below."); return; }

    const fd = new FormData(e.currentTarget);
    setStatus("submitting");
    setErrorMsg("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone") || undefined,
        message: fd.get("message"),
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
      <div className="bg-cream-light rounded-lg p-10 text-center">
        <Eyebrow>Thank you</Eyebrow>
        <p className="font-display text-[26px] text-teal mt-4">Your note is with us.</p>
        <p className="mt-4 text-[14px] leading-[24px] text-teal/80">
          We&rsquo;ll reply within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextField label="Name" name="name" required error={undefined} autoComplete="name" />
      <TextField label="Email" name="email" type="email" required error={undefined} autoComplete="email" />
      <TextField label="Phone (optional)" name="phone" type="tel" error={undefined} autoComplete="tel" />
      <TextAreaField label="Message" name="message" required error={undefined} />

      <div>
        <p className="text-[11px] tracking-[0.15em] uppercase text-teal/60 mb-2">Verification</p>
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

      <div className="pt-2">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
