"use client";

import { Eyebrow } from "@/components/site/Eyebrow";
import { Button } from "@/components/site/Button";
import { GoldRule } from "@/components/site/GoldRule";
import { services, therapist, priceFor } from "@/lib/data";
import type { BookingSelection } from "@/lib/types";

export function StepConfirm({
  selection,
  onConfirm,
  edit,
  confirming,
  confirmError,
}: {
  selection: BookingSelection;
  onConfirm: () => void;
  edit: (step: number) => void;
  confirming?: boolean;
  confirmError?: string;
}) {
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
      year: "numeric",
    });

  return (
    <div className="bw-fade pt-12 md:pt-16">
      <div className="text-center max-w-[700px] mx-auto">
        <Eyebrow>Step four</Eyebrow>
        <h2 className="font-display text-[40px] md:text-[52px] leading-[1.1] mt-5 text-teal">
          Almost there. Please confirm.
        </h2>
        <p className="mt-6 text-[15px] leading-[28px] text-teal/80">
          Review your details below. Nothing is charged until the day of your
          session.
        </p>
      </div>

      <div className="mt-14 max-w-[820px] mx-auto bg-cream-light rounded-lg p-8 md:p-10">
        <Row
          label="Treatment"
          value={svc ? `${svc.name} · ${selection.duration} minutes` : ""}
          onEdit={() => edit(1)}
        />
        <Row label="With" value={therapist.name} />
        <Row
          label="Date & time"
          value={dateLabel ? `${dateLabel} at ${selection.time}` : ""}
          onEdit={() => edit(2)}
        />
        <Row
          label="Guest"
          value={`${selection.firstName} ${selection.lastName}`}
          onEdit={() => edit(3)}
        />
        <Row
          label="Contact"
          value={`${selection.email} · ${selection.phone}`}
          onEdit={() => edit(3)}
        />
        {selection.notes && (
          <Row label="Notes" value={selection.notes} onEdit={() => edit(3)} />
        )}

        <div className="flex items-center justify-between py-4 mt-2 border-t border-teal/20">
          <span className="font-display text-[20px] text-teal">Total</span>
          <span className="font-display text-[24px] text-teal">
            {price !== null ? `£${price}` : "—"}
          </span>
        </div>
      </div>

      <div className="mt-10 max-w-[720px] mx-auto">
        <div className="flex justify-center mb-6">
          <GoldRule width="w-10" />
        </div>
        <h3 className="font-display text-[20px] text-teal text-center">
          Cancellation policy
        </h3>
        <p className="mt-4 text-[14px] leading-[24px] text-teal/80 text-center">
          Free up to 24 hours before your session. Inside 24 hours we charge
          50% of the session price. Genuine emergencies are always an
          exception.
        </p>
      </div>

      {confirmError && (
        <div className="mt-6 max-w-[560px] mx-auto p-4 bg-red-50 border border-red-200 rounded text-[14px] text-red-700 text-center">
          {confirmError}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button onClick={onConfirm} disabled={confirming}>
          {confirming ? "Confirming…" : "Confirm booking"}
        </Button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-4 border-b border-teal/10">
      <div>
        <div className="text-[11px] tracking-[0.22em] uppercase text-gold">
          {label}
        </div>
        <div className="mt-1 text-[15px] text-teal">{value || "—"}</div>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-[11px] tracking-[0.22em] uppercase text-teal border-b border-transparent hover:border-gold"
        >
          Edit
        </button>
      )}
    </div>
  );
}
