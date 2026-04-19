"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StepTreatment } from "./StepTreatment";
import { StepSchedule } from "./StepSchedule";
import { StepDetails } from "./StepDetails";
import { StepConfirm } from "./StepConfirm";
import type { BookingSelection, DurationMins, Service, ServiceId } from "@/lib/types";

const SS_KEY = "bw_booking_draft_v2";
const TOTAL_STEPS = 4;
const STEP_LABELS = ["Treatment", "Date & time", "Your details", "Confirm"];
const VALID_DURATIONS: DurationMins[] = [30, 45, 60, 75, 90];
const VALID_TREATMENTS: ServiceId[] = [
  "balance",
  "upper-body",
  "hand-and-arm",
  "walking-on-air",
  "holistic",
  "fibromyalgia",
  "hot-stones",
];

function priceFor(services: Service[], serviceId: ServiceId, mins: DurationMins): number | null {
  return services.find((s) => s.id === serviceId)?.durations.find((d) => d.mins === mins)?.price ?? null;
}

export function BookingWizard({ services }: { services: Service[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const [selection, setSelection] = useState<BookingSelection>({});
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  // On mount: read URL params + sessionStorage into selection.
  useEffect(() => {
    let stored: BookingSelection = {};
    try {
      const raw = sessionStorage.getItem(SS_KEY);
      if (raw) stored = JSON.parse(raw);
    } catch {}

    const fromUrl: Partial<BookingSelection> = {};
    const t = params.get("treatment");
    const dur = params.get("duration");
    const date = params.get("date");
    const time = params.get("time");
    if (t && VALID_TREATMENTS.includes(t as ServiceId)) fromUrl.treatment = t as ServiceId;
    if (dur) {
      const n = Number(dur) as DurationMins;
      if (VALID_DURATIONS.includes(n)) fromUrl.duration = n;
    }
    if (date) fromUrl.date = date;
    if (time) fromUrl.time = time;

    setSelection({ ...stored, ...fromUrl });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist selection changes.
  useEffect(() => {
    try {
      sessionStorage.setItem(SS_KEY, JSON.stringify(selection));
    } catch {}
  }, [selection]);

  const stepParam = params.get("step");
  const step = Math.min(Math.max(parseInt(stepParam || "1", 10) || 1, 1), TOTAL_STEPS);

  const setStep = useCallback(
    (n: number, patch?: Partial<BookingSelection>) => {
      if (patch) setSelection((s) => ({ ...s, ...patch }));
      const next = new URLSearchParams(params.toString());
      next.set("step", String(n));
      if (patch?.treatment) next.set("treatment", patch.treatment);
      if (patch?.duration) next.set("duration", String(patch.duration));
      if (patch?.date) next.set("date", patch.date);
      if (patch?.time) next.set("time", patch.time);
      router.push(`/book?${next.toString()}`, { scroll: true });
    },
    [params, router],
  );

  const update = useCallback((patch: Partial<BookingSelection>) => {
    setSelection((s) => ({ ...s, ...patch }));
  }, []);

  const goBack = useCallback(() => {
    if (step === 1) {
      router.push("/");
      return;
    }
    setStep(step - 1);
  }, [step, setStep, router]);

  const handleConfirm = useCallback(async () => {
    if (
      !selection.treatment ||
      !selection.duration ||
      !selection.date ||
      !selection.time
    )
      return;

    const price = priceFor(services, selection.treatment, selection.duration) ?? 0;
    setConfirming(true);
    setConfirmError("");

    try {
      const res = await fetch("/api/book/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatment: selection.treatment,
          duration: selection.duration,
          date: selection.date,
          time: selection.time,
          firstName: selection.firstName ?? "",
          lastName: selection.lastName ?? "",
          email: selection.email ?? "",
          phone: selection.phone ?? "",
          firstTime: selection.firstTime ?? false,
          notes: selection.notes ?? "",
          consent: selection.consent ?? false,
          price,
          ...(selection.voucherCode ? { voucherCode: selection.voucherCode } : {}),
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Something went wrong. Please try again.");
      }

      const { url, ref: confirmedRef } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        // Voucher covered full amount — confirmed without Stripe
        router.push(`/book/success?ref=${confirmedRef}`);
      }
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : "Something went wrong.");
      setConfirming(false);
    }
  }, [selection]);

  const maxReachable = useMemo(() => {
    if (!selection.treatment || !selection.duration) return 1;
    if (!selection.date || !selection.time) return 2;
    if (
      !selection.firstName ||
      !selection.lastName ||
      !selection.email ||
      !selection.phone ||
      !selection.consent
    )
      return 3;
    return 4;
  }, [selection]);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-8 md:pt-10 pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-teal"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            {step === 1 ? "Back to home" : "Back"}
          </button>
          <div className="text-[11px] tracking-[0.22em] uppercase text-stone">
            Step {step} of {TOTAL_STEPS} · {STEP_LABELS[step - 1]}
          </div>
        </div>

        <ProgressBar step={step} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pb-24">
        {step === 1 && (
          <StepTreatment
            services={services}
            selection={selection}
            update={update}
            next={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepSchedule
            services={services}
            selection={selection}
            update={update}
            next={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepDetails
            services={services}
            selection={selection}
            update={update}
            next={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <StepConfirm
            services={services}
            selection={selection}
            update={update}
            onConfirm={handleConfirm}
            edit={(targetStep) => setStep(targetStep)}
            confirming={confirming}
            confirmError={confirmError}
          />
        )}
      </div>

      {step > maxReachable && (
        <div className="sr-only">Please complete earlier steps first.</div>
      )}
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mt-6 flex gap-3" aria-label="Booking progress">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const active = i + 1 === step;
        const done = i + 1 < step;
        return (
          <div
            key={i}
            className={`h-px flex-1 transition-colors ${
              done || active ? "bg-gold" : "bg-teal/20"
            } ${active ? "h-[2px]" : ""}`}
            aria-current={active ? "step" : undefined}
          />
        );
      })}
    </div>
  );
}
