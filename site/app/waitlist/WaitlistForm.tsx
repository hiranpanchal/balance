"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface Service { id: string; name: string; }

export function WaitlistForm({ services }: { services: Service[] }) {
  const params = useSearchParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(params.get("service") ?? "");
  const [date, setDate] = useState(params.get("date") ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, service, date }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <main className="min-h-screen bg-[#EAE2D2] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-lg p-10 shadow-sm text-center">
          <h1 className="font-serif text-[24px] text-[#3E4F56] font-normal mb-4">
            You&rsquo;re on the list.
          </h1>
          <p className="text-[14px] text-[#A09687] leading-[22px]">
            We&rsquo;ll email you at <strong>{email}</strong> as soon as a slot opens
            {formattedDate ? ` on ${formattedDate}` : ""}. No action needed until then.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EAE2D2] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-lg p-10 shadow-sm">
        <h1 className="font-serif text-[24px] text-[#3E4F56] font-normal mb-2">
          Balance &amp; Wellness
        </h1>
        <p className="text-[12px] tracking-[0.12em] uppercase text-[#A09687] mb-2">
          Join waiting list
        </p>
        {formattedDate && (
          <p className="text-[14px] text-[#3E4F56] mb-6">
            For <strong>{formattedDate}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={input}
                placeholder="Jane"
              />
            </Field>
            <Field label="Last name">
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={input}
                placeholder="Smith"
              />
            </Field>
          </div>

          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
              placeholder="jane@example.com"
            />
          </Field>

          <Field label="Phone (optional)">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={input}
              placeholder="+44 7700 000000"
            />
          </Field>

          {!date && (
            <Field label="Date you wanted">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={input}
              />
            </Field>
          )}

          <Field label="Preferred treatment (optional)">
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className={input}
            >
              <option value="">Any treatment</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Field>

          {(status === "error") && (
            <p className="text-[13px] text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full mt-2 px-4 py-3 bg-[#3E4F56] text-white text-[12px] tracking-[0.1em] uppercase rounded hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Joining…" : "Join waiting list"}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-[#A09687] text-center leading-[18px]">
          We&rsquo;ll only contact you when a slot opens. No marketing emails.
        </p>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.12em] uppercase text-[#A09687] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const input = "w-full border border-[#3E4F56]/15 rounded px-4 py-2.5 text-[13px] text-[#3E4F56] focus:outline-none focus:border-[#B28B5D] bg-transparent";
