import { Eyebrow } from "@/components/site/Eyebrow";
import { services, priceFor, therapist } from "@/lib/data";
import type { BookingSelection } from "@/lib/types";

export function BookingSummary({ selection }: { selection: BookingSelection }) {
  const svc = services.find((s) => s.id === selection.treatment);
  const price =
    selection.treatment && selection.duration
      ? priceFor(selection.treatment, selection.duration)
      : null;

  const dateLabel =
    selection.date &&
    new Date(selection.date + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  return (
    <aside className="bg-cream-light rounded-lg p-7">
      <Eyebrow>Booking summary</Eyebrow>
      <dl className="mt-5 divide-y divide-teal/10">
        <Row label="Treatment" value={svc?.name} />
        <Row
          label="Duration"
          value={selection.duration ? `${selection.duration} minutes` : undefined}
        />
        <Row label="With" value={therapist.name} />
        <Row label="Date" value={dateLabel || undefined} />
        <Row label="Time" value={selection.time} />
        <div className="flex items-center justify-between py-4">
          <dt className="font-display text-[16px] text-teal">Total</dt>
          <dd className="font-display text-[22px] text-teal">
            {price !== null ? `£${price}` : "—"}
          </dd>
        </div>
      </dl>
      <p className="text-[12px] leading-[20px] text-stone mt-2">
        Payment taken on the day. Free cancellation up to 24 hours before.
      </p>
    </aside>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-[14px]">
      <dt className="text-[11px] tracking-[0.22em] uppercase text-stone">
        {label}
      </dt>
      <dd className="text-teal text-right">
        {value || <span className="text-stone/60">—</span>}
      </dd>
    </div>
  );
}
