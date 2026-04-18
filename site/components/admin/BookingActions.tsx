"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

interface Booking {
  id: string;
  status: string;
  date: string;
  time: string;
  notes: string;
}

const STATUSES: { value: Status; label: string }[] = [
  { value: "CONFIRMED", label: "Confirm" },
  { value: "COMPLETED", label: "Mark completed" },
  { value: "NO_SHOW", label: "Mark no-show" },
  { value: "CANCELLED", label: "Cancel (sends email)" },
];

export function BookingActions({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState(booking.notes);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function updateStatus(status: Status) {
    setLoading(status);
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(null);
    router.refresh();
  }

  async function saveNotes() {
    setSaveStatus("saving");
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-4">
          Actions
        </h2>
        <div className="space-y-2">
          {STATUSES.filter((s) => s.value !== booking.status).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateStatus(value)}
              disabled={!!loading}
              className={`w-full text-left px-4 py-3 rounded text-[13px] border transition-colors disabled:opacity-50 ${
                value === "CANCELLED"
                  ? "border-red-200 text-red-700 hover:bg-red-50"
                  : "border-[#3E4F56]/15 text-[#3E4F56] hover:border-[#B28B5D]"
              }`}
            >
              {loading === value ? "…" : label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-3">
          Admin notes
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full border border-[#3E4F56]/15 rounded px-3 py-2 text-[13px] text-[#3E4F56] bg-[#F5F0E6] resize-none focus:outline-none focus:border-[#B28B5D]"
        />
        <button
          onClick={saveNotes}
          disabled={saveStatus === "saving"}
          className="mt-2 text-[12px] text-[#B28B5D] hover:underline disabled:opacity-50"
        >
          {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved ✓" : "Save notes"}
        </button>
      </div>
    </div>
  );
}
