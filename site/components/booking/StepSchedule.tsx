"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Button } from "@/components/site/Button";
import { BookingSummary } from "./BookingSummary";
import type { BookingSelection, Service } from "@/lib/types";

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/** Four-hour-ahead cutoff — bookings must be ≥ 4h in the future. */
function meetsCutoff(dateISO: string, time: string) {
  const dt = new Date(dateISO + "T" + time + ":00");
  return dt.getTime() - Date.now() >= 4 * 60 * 60 * 1000;
}

export function StepSchedule({
  services,
  selection,
  update,
  next,
}: {
  services: Service[];
  selection: BookingSelection;
  update: (patch: Partial<BookingSelection>) => void;
  next: () => void;
}) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [viewMonth, setViewMonth] = useState(() => {
    const d = selection.date
      ? new Date(selection.date + "T00:00:00")
      : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const selectedDate = selection.date || "";
  const duration = selection.duration ?? 60;

  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!selectedDate) { setSlots([]); return; }
    setLoadingSlots(true);
    fetch(`/api/book/slots?date=${selectedDate}&duration=${duration}`)
      .then((r) => r.json())
      .then((data) => {
        const filtered = (data.slots as string[]).filter((t) => meetsCutoff(selectedDate, t));
        setSlots(filtered);
      })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, duration]);

  const canContinue = Boolean(selection.date && selection.time);

  const monthName = viewMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  // Grid: leading blanks before day 1 so columns align to Mon–Sun.
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7; // 0 = Monday
  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0,
  ).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () =>
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));

  const canPrevMonth =
    viewMonth.getTime() >
    new Date(today.getFullYear(), today.getMonth(), 1).getTime();

  return (
    <div className="bw-fade pt-12 md:pt-16">
      <div className="text-center max-w-[700px] mx-auto">
        <Eyebrow>Step two</Eyebrow>
        <h2 className="font-display text-[40px] md:text-[52px] leading-[1.1] mt-5 text-teal">
          When would suit you?
        </h2>
        <p className="mt-6 text-[15px] leading-[28px] text-teal/80">
          We&rsquo;re closed on Sundays and Mondays. Bookings need to be at
          least four hours ahead.
        </p>
      </div>

      <div className="mt-14 grid md:grid-cols-[1fr_360px] gap-10 items-start">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Calendar */}
          <div className="bg-cream-light rounded-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <button
                type="button"
                onClick={prevMonth}
                disabled={!canPrevMonth}
                className="p-2 text-teal disabled:opacity-30"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <div className="font-display text-[20px] text-teal">
                {monthName}
              </div>
              <button
                type="button"
                onClick={nextMonth}
                className="p-2 text-teal"
                aria-label="Next month"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div
              role="grid"
              aria-label="Calendar"
              className="grid grid-cols-7 gap-1"
            >
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] tracking-[0.18em] uppercase text-stone py-2"
                >
                  {d}
                </div>
              ))}
              <div className="col-span-7 bw-day-grid grid grid-cols-7 gap-1">
                {cells.map((d, i) => {
                  if (!d)
                    return <div key={i} aria-hidden />;
                  const iso = toISODate(d);
                  const isPast = d.getTime() < today.getTime();
                  const dow = d.getDay();
                  const isClosed = dow === 0 || dow === 1;
                  const isSelected = iso === selectedDate;
                  const disabled = isPast || isClosed;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={disabled}
                      onClick={() => update({ date: iso, time: undefined })}
                      aria-pressed={isSelected}
                      aria-label={d.toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                      className={`text-[13px] rounded-sm flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-teal text-cream"
                          : disabled
                            ? isClosed
                              ? "text-stone/50 line-through cursor-not-allowed"
                              : "text-stone/50 cursor-not-allowed"
                            : "text-teal hover:bg-gold/20"
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-[10px] tracking-[0.18em] uppercase text-stone">
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-teal rounded-sm" />
                Selected
              </span>
              <span className="flex items-center gap-2">
                <span className="line-through">Mon / Sun</span>
                Closed
              </span>
            </div>
          </div>

          {/* Slots */}
          <div>
            <div className="mb-4">
              <Eyebrow>Available times</Eyebrow>
              <div className="mt-2 font-display text-[20px] text-teal">
                {selectedDate
                  ? new Date(selectedDate + "T00:00:00").toLocaleDateString(
                      "en-GB",
                      { weekday: "long", day: "numeric", month: "long" },
                    )
                  : "Choose a day"}
              </div>
            </div>
            {selectedDate ? (
              loadingSlots ? (
                <p className="text-[14px] text-teal/60">Checking availability…</p>
              ) : slots.length === 0 ? (
                <p className="text-[14px] text-teal/75">
                  No slots remaining for that day. Please choose another.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((t) => {
                    const active = selection.time === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update({ time: t })}
                        aria-pressed={active}
                        className={`py-2 text-[13px] rounded-sm border transition-colors ${
                          active
                            ? "bg-teal text-cream border-teal"
                            : "border-teal/20 text-teal hover:border-teal"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              )
            ) : (
              <p className="text-[14px] text-teal/70">
                Select a date on the calendar to see available times.
              </p>
            )}
          </div>
        </div>

        <BookingSummary services={services} selection={selection} />
      </div>

      <div className="mt-14 flex justify-center">
        <Button onClick={next} disabled={!canContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
