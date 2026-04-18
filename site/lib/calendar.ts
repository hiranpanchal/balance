import type { ConfirmedBooking } from "./types";

/** Format a Date as YYYYMMDDTHHMMSS (local time, no TZ suffix — per RFC 5545 floating time). */
function formatIcsDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    "00"
  );
}

export function makeIcs(
  booking: ConfirmedBooking,
  treatmentName: string,
  therapistName: string,
): string {
  const startDate = new Date(booking.date + "T" + booking.time + ":00");
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + booking.duration);

  const uid = `${booking.id}@balanceandwellness.com`;
  const summary = `${treatmentName} with ${therapistName} — Balance and Wellness`;
  const description = `Your ${booking.duration}-minute ${treatmentName} treatment. 14 Linen Lane, Bristol BS1 4AA.`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Balance and Wellness//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "LOCATION:14 Linen Lane, Bristol BS1 4AA",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(filename: string, icsContent: string): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
