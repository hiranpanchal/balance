"use client";

import { Eyebrow } from "@/components/site/Eyebrow";
import { Button } from "@/components/site/Button";
import { ImgPlaceholder } from "@/components/site/ImgPlaceholder";
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
    // Preserve the existing duration if the new treatment also offers it, otherwise default to the first.
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

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => {
          const isSelected = selection.treatment === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => pickTreatment(s.id)}
              aria-pressed={isSelected}
              className={`text-left block rounded-lg overflow-hidden transition-all ${
                isSelected
                  ? "ring-2 ring-gold"
                  : "ring-1 ring-teal/10 hover:ring-teal/30"
              }`}
            >
              <ImgPlaceholder
                src={s.image}
                alt={s.name}
                label={s.name}
                ratio="4 / 5"
                className="rounded-none"
              />
              <div className="p-5 bg-cream">
                <Eyebrow>Treatment</Eyebrow>
                <h3 className="font-display text-[22px] mt-2 text-teal">
                  {s.name}
                </h3>
                <p className="mt-3 text-[13px] leading-[22px] text-teal/80">
                  {s.tagline}
                </p>
                <div className="mt-3 text-[12px] text-teal/65">
                  from £{s.durations[0].price} · {s.durations[0].mins} min
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-10 max-w-[720px] mx-auto bw-fade">
          <Eyebrow>Duration</Eyebrow>
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.durations.map((d) => {
              const active = selection.duration === d.mins;
              return (
                <button
                  key={d.mins}
                  type="button"
                  onClick={() => update({ duration: d.mins as DurationMins })}
                  aria-pressed={active}
                  className={`px-4 py-2 text-[12px] tracking-[0.12em] uppercase rounded-sm border transition-colors ${
                    active
                      ? "border-gold bg-gold-light/30 text-teal"
                      : "border-teal/25 text-teal hover:border-teal"
                  }`}
                >
                  {d.mins} min · £{d.price}
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
