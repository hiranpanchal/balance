"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Button } from "@/components/site/Button";
import { GoldRule } from "@/components/site/GoldRule";
import { therapist } from "@/lib/data";
import type { BookingSelection, Service } from "@/lib/types";

export function StepConfirm({
  services,
  selection,
  update,
  onConfirm,
  edit,
  confirming,
  confirmError,
}: {
  services: Service[];
  selection: BookingSelection;
  update: (patch: Partial<BookingSelection>) => void;
  onConfirm: () => void;
  edit: (step: number) => void;
  confirming?: boolean;
  confirmError?: string;
}) {
  const [voucherInput, setVoucherInput] = useState(selection.voucherCode ?? "");
  const [voucherStatus, setVoucherStatus] = useState<"idle" | "checking" | "valid" | "invalid">(
    selection.voucherCode ? "valid" : "idle"
  );
  const [voucherError, setVoucherError] = useState("");

  const svc = services.find((s) => s.id === selection.treatment);
  const price =
    selection.treatment && selection.duration
      ? (svc?.durations.find((d) => d.mins === selection.duration)?.price ?? null)
      : null;

  const discount = (selection.voucherDiscountPence ?? 0) / 100;
  const chargeable = price !== null ? Math.max(0, price - discount) : null;

  async function applyVoucher() {
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;
    setVoucherStatus("checking");
    setVoucherError("");
    try {
      const res = await fetch(`/api/voucher/validate?code=${encodeURIComponent(code)}`);
      const json = await res.json();
      if (json.valid) {
        const discountPence = price !== null ? Math.min(json.amountPence, price * 100) : json.amountPence;
        update({ voucherCode: code, voucherDiscountPence: discountPence });
        setVoucherStatus("valid");
      } else {
        setVoucherError(json.error ?? "Invalid voucher code");
        setVoucherStatus("invalid");
        update({ voucherCode: undefined, voucherDiscountPence: undefined });
      }
    } catch {
      setVoucherError("Could not check voucher. Please try again.");
      setVoucherStatus("invalid");
    }
  }

  function removeVoucher() {
    setVoucherInput("");
    setVoucherStatus("idle");
    setVoucherError("");
    update({ voucherCode: undefined, voucherDiscountPence: undefined });
  }

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
          Review your details below. A 25% deposit is taken now to secure your
          session — the remainder is payable on the day.
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

        {discount > 0 && (
          <div className="flex items-center justify-between py-3 border-b border-teal/10 text-[13px]">
            <span className="text-gold">Voucher ({selection.voucherCode})</span>
            <span className="text-gold">−£{discount}</span>
          </div>
        )}
        <div className="flex items-center justify-between py-4 mt-2 border-t border-teal/20">
          <span className="font-display text-[20px] text-teal">
            {chargeable === 0 ? "Fully covered" : "To pay now"}
          </span>
          <span className="font-display text-[24px] text-teal">
            {chargeable !== null ? `£${chargeable}` : "—"}
          </span>
        </div>
      </div>

      {/* Voucher code */}
      <div className="mt-6 max-w-[820px] mx-auto">
        {voucherStatus === "valid" ? (
          <div className="flex items-center justify-between bg-[#f0faf0] border border-green-200 rounded px-4 py-3">
            <span className="text-[13px] text-green-800">
              Voucher <strong>{selection.voucherCode}</strong> applied — £{discount} off
            </span>
            <button
              type="button"
              onClick={removeVoucher}
              className="text-[11px] tracking-[0.12em] uppercase text-green-700 hover:text-green-900"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Gift voucher code"
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
              className="flex-1 border border-teal/20 rounded px-4 py-2.5 text-[13px] text-teal placeholder:text-teal/40 focus:outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={applyVoucher}
              disabled={!voucherInput.trim() || voucherStatus === "checking"}
              className="px-5 py-2.5 border border-teal/30 text-teal text-[11px] tracking-[0.12em] uppercase rounded hover:border-gold disabled:opacity-40"
            >
              {voucherStatus === "checking" ? "Checking…" : "Apply"}
            </button>
          </div>
        )}
        {voucherError && (
          <p className="mt-2 text-[12px] text-red-600">{voucherError}</p>
        )}
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

      <div className="mt-8 flex flex-col items-center gap-3">
        <Button onClick={onConfirm} disabled={confirming}>
          {confirming
            ? "Confirming…"
            : chargeable === 0
            ? "Confirm booking"
            : "Pay & confirm"}
        </Button>
        {chargeable !== 0 && (
          <p className="text-[12px] text-teal/50">Secured by Stripe.</p>
        )}
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
