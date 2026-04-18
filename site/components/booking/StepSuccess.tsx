"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Eyebrow } from "@/components/site/Eyebrow";
import { GoldRule } from "@/components/site/GoldRule";
import { Button } from "@/components/site/Button";
import { services, therapist } from "@/lib/data";
import { makeIcs, downloadIcs } from "@/lib/calendar";
import type { BookingSelection, ConfirmedBooking } from "@/lib/types";

export function StepSuccess({
  bookingId,
  selection,
  price,
}: {
  bookingId: string;
  selection: BookingSelection;
  price: number;
}) {
  const svc = services.find((s) => s.id === selection.treatment);

  const dateLabel =
    selection.date &&
    new Date(selection.date + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleDownloadIcs = () => {
    if (!svc) return;
    const booking: ConfirmedBooking = {
      id: bookingId,
      treatment: selection.treatment!,
      duration: selection.duration!,
      date: selection.date!,
      time: selection.time!,
      firstName: selection.firstName!,
      lastName: selection.lastName!,
      email: selection.email!,
      phone: selection.phone!,
      firstTime: selection.firstTime ?? false,
      notes: selection.notes ?? "",
      consent: true,
      price,
      createdAt: new Date().toISOString(),
    };
    const ics = makeIcs(booking, svc.name, therapist.name);
    downloadIcs(`${bookingId}-balance-and-wellness.ics`, ics);
  };

  return (
    <div className="min-h-[75vh] bg-cream px-6 md:px-12 py-16 md:py-24 bw-fade">
      <div className="max-w-[720px] mx-auto text-center">
        <Eyebrow>Confirmed · {bookingId}</Eyebrow>
        <h1 className="font-display text-[52px] md:text-[80px] leading-[1.02] mt-6 text-teal">
          Your hour is held.
        </h1>
        <div className="mt-8 flex justify-center">
          <GoldRule width="w-12" />
        </div>
        <p className="mt-10 text-[17px] leading-[30px] text-teal/85 max-w-[520px] mx-auto">
          A quiet confirmation is on its way to{" "}
          <span className="text-teal border-b border-gold/40 pb-0.5">
            {selection.email}
          </span>
          . See you on {dateLabel}.
        </p>
      </div>

      <div className="mt-14 max-w-[720px] mx-auto bg-cream-light rounded-lg p-8 md:p-10 text-left">
        <Row label="Treatment" value={`${svc?.name} · ${selection.duration} minutes`} />
        <Row label="With" value={therapist.name} />
        <Row label="When" value={`${dateLabel} · ${selection.time}`} />
        <Row label="Where" value="14 Linen Lane, Bristol BS1 4AA" />
        <Row label="Total" value={`£${price} · payable on the day`} />
      </div>

      <div className="mt-10 flex gap-4 justify-center flex-wrap">
        <Button onClick={handleDownloadIcs} variant="secondary">
          <CalendarDays size={16} strokeWidth={1.5} />
          Add to calendar
        </Button>
        <Link
          href="/journal"
          className="inline-flex items-center text-[13px] tracking-[0.14em] uppercase text-teal border-b border-gold pb-1"
        >
          Read the journal →
        </Link>
      </div>

      <p className="mt-14 text-center text-[12px] tracking-[0.18em] uppercase text-stone">
        Need to change something?{" "}
        <Link href="/contact" className="underline-offset-4 hover:text-teal">
          Get in touch
        </Link>
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-4 border-b border-teal/10 last:border-0">
      <div className="text-[11px] tracking-[0.22em] uppercase text-gold">
        {label}
      </div>
      <div className="text-[15px] text-teal text-right">{value}</div>
    </div>
  );
}
