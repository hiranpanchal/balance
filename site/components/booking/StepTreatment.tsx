"use client";

import { Eyebrow } from "@/components/site/Eyebrow";
import { Button } from "@/components/site/Button";
import { services } from "@/lib/data";
import type { BookingSelection, DurationMins, ServiceId } from "@/lib/types";

export function StepTreatment({
  selection,
  update,
  next,
}: {
  selection: BookingSelection;
  update: (patch: Partial<BookingSelection>) => void;
  next: () => void;
}) {
  const canContinue = Boolean(selection.treatment && selection.duration);
  const selected = services.find((s) => s.id === selection.treatment);

  const pickTreatment = (id: ServiceId) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    const keep =
      selection.duration &&
      svc.durations.some((d) => d.mins === selection.duration)
        ? selection.duration
        : svc.durations[0].mins;
    update({ treatment: id, duration: keep });
  };

  return (
    <div className="bw-fade">
      <div className="pt-12 md:pt-16 text-center max-w-[720px] mx-auto">
        <Eyebrow>Step one</Eyebrow>
        <h1 className="font-display text-[40px] md:text-[56px] leading-[1.1] mt-5 text-teal">
          What is your body asking for?
        </h1>
        <p className="mt-6 text-[15px] leading-[28px] text-teal/80">
          Pick a treatment, then choose a length.
        </p>
      </div>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => {
          const isSelected = selection.treatment === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => pickTreatment(s.id)}
              aria-pressed={isSelected}
              className={`text-left p-6 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-gold bg-gold/5"
                  : "border-teal/15 hover:border-gold/50 bg-white"
              }`}
            >
              <Eyebrow>Treatment</Eyebrow>
              <h3 className="font-display text-[22px] mt-3 text-teal leading-[1.2]">
                {s.name}
              </h3>
              <p className="mt-3 text-[13px] leading-[22px] text-teal/75">
                {s.tagline}
              </p>
              <div className="mt-4 pt-4 border-t border-teal/10 text-[12px] tracking-[0.06em] text-teal/55">
                from £{s.durations[0].price} · {s.durations[0].mins} min
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-10 bw-fade bg-white rounded-lg border border-teal/10 p-6 max-w-[720px] mx-auto">
          <p className="text-[11px] tracking-[0.18em] uppercase text-gold font-medium mb-4">
            Duration — {selected.name}
          </p>
          <div className="flex flex-wrap gap-3">
            {selected.durations.map((d) => {
              const active = selection.duration === d.mins;
              return (
                <button
                  key={d.mins}
                  type="button"
                  onClick={() => update({ duration: d.mins as DurationMins })}
                  aria-pressed={active}
                  className={`flex-1 min-w-[120px] px-5 py-4 text-center rounded-md border-2 transition-all ${
                    active
                      ? "border-gold bg-gold/8 text-teal"
                      : "border-teal/15 text-teal/70 hover:border-gold/50 hover:text-teal"
                  }`}
                >
                  <div className="text-[15px] font-display">{d.mins} min</div>
                  <div className="text-[13px] mt-1 text-teal/70">£{d.price}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-14 flex justify-center">
        <Button onClick={next} disabled={!canContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
