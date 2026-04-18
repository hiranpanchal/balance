"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
  isFullDay: boolean;
  startTime: string | null;
  endTime: string | null;
}

export function AvailabilityManager({ blocked }: { blocked: BlockedDate[] }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [isFullDay, setIsFullDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");
  const [adding, setAdding] = useState(false);

  async function addBlock() {
    if (!date) return;
    setAdding(true);
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, reason, isFullDay, startTime, endTime }),
    });
    setAdding(false);
    setDate("");
    setReason("");
    router.refresh();
  }

  async function removeBlock(d: string) {
    await fetch(`/api/admin/availability?date=${d}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid md:grid-cols-[1fr_360px] gap-8">
      {/* Blocked dates list */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-[#F5F0E6]">
          <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687]">
            Blocked dates ({blocked.length})
          </h2>
        </div>
        {blocked.length === 0 && (
          <p className="px-6 py-10 text-[13px] text-[#A09687] text-center">
            No dates blocked. The studio is open on all working days.
          </p>
        )}
        <div className="divide-y divide-[#F5F0E6]">
          {blocked.map((b) => (
            <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-[14px] text-[#3E4F56] font-mono">{b.date}</div>
                <div className="text-[12px] text-[#A09687] mt-0.5">
                  {b.isFullDay
                    ? "Full day"
                    : `${b.startTime} – ${b.endTime}`}
                  {b.reason && ` — ${b.reason}`}
                </div>
              </div>
              <button
                onClick={() => removeBlock(b.date)}
                className="text-[12px] text-red-600 hover:underline shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-5 h-fit">
        <h2 className="font-serif text-[18px] text-[#3E4F56] font-normal">Block a date</h2>

        <div>
          <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
            Reason (optional)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Holiday, training, etc."
            className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D] placeholder:text-[#A09687]"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="fullday"
            type="checkbox"
            checked={isFullDay}
            onChange={(e) => setIsFullDay(e.target.checked)}
            className="accent-[#3E4F56]"
          />
          <label htmlFor="fullday" className="text-[13px] text-[#3E4F56]">
            Full day
          </label>
        </div>

        {!isFullDay && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "From", val: startTime, set: setStartTime },
              { label: "Until", val: endTime, set: setEndTime },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  {label}
                </label>
                <input
                  type="time"
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  className="w-full border border-[#3E4F56]/15 rounded px-3 py-2 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
                />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={addBlock}
          disabled={!date || adding}
          className="w-full bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase py-3 rounded hover:opacity-90 disabled:opacity-40"
        >
          {adding ? "Blocking…" : "Block date"}
        </button>
      </div>
    </div>
  );
}
