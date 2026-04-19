"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SelectField } from "@/components/admin/SelectField";
import type { Service } from "@/lib/types";

interface Props {
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  services: Service[];
}

const times = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
];

const inputClass =
  "w-full border border-[#3E4F56]/15 rounded-md px-3 py-2.5 text-[13px] text-[#3E4F56] bg-white focus:outline-none focus:border-[#B28B5D] focus:ring-1 focus:ring-[#B28B5D]/30 transition-colors hover:border-[#3E4F56]/30";
const labelClass =
  "block text-[11px] tracking-[0.12em] uppercase text-[#A09687] mb-1.5";

export function ManualBookingForm({ client, services }: Props) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState<string>(services[0].id);
  const [duration, setDuration] = useState<number>(services[0].durations[0].mins);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [price, setPrice] = useState(services[0].durations[0].price);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("CONFIRMED");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedService = services.find((s) => s.id === serviceId)!;

  function handleServiceChange(id: string) {
    const svc = services.find((s) => s.id === id)!;
    setServiceId(id);
    setDuration(svc.durations[0].mins);
    setPrice(svc.durations[0].price);
  }

  function handleDurationChange(val: string) {
    const mins = Number(val);
    setDuration(mins);
    const d = selectedService.durations.find((d) => d.mins === mins);
    if (d) setPrice(d.price);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) { setError("Please select a date."); return; }
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          service: serviceId,
          duration,
          date,
          time,
          price,
          notes,
          status,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Failed to create booking. Please try again.");
        return;
      }

      setDate("");
      setNotes("");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-[11px] tracking-[0.12em] uppercase text-[#A09687] mb-5">
        Add booking
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-[12px] text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectField
          label="Treatment"
          value={serviceId}
          onChange={handleServiceChange}
          options={services.map((s) => ({ value: s.id, label: s.name }))}
        />

        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Duration"
            value={duration}
            onChange={handleDurationChange}
            options={selectedService.durations.map((d) => ({ value: d.mins, label: `${d.mins} min` }))}
          />
          <div>
            <label className={labelClass}>Price (£)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <SelectField
            label="Time"
            value={time}
            onChange={setTime}
            options={times.map((t) => ({ value: t, label: t }))}
          />
        </div>

        <SelectField
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "CONFIRMED", label: "Confirmed" },
            { value: "PENDING", label: "Pending" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
          ]}
        />

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputClass} resize-none leading-[22px]`}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-[#3E4F56] text-white text-[12px] tracking-[0.12em] uppercase rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? "Saving…" : "Add booking"}
        </button>
      </form>
    </div>
  );
}
