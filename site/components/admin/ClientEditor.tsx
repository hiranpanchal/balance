"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Props {
  clientId: string;
  initialNotes: string;
  initialPhone: string;
  initialGrade: "NEW" | "REGULAR";
}

export function ClientEditor({ clientId, initialNotes, initialPhone, initialGrade }: Props) {
  const [notes, setNotes] = useState(initialNotes);
  const [phone, setPhone] = useState(initialPhone);
  const [grade, setGrade] = useState<"NEW" | "REGULAR">(initialGrade);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function save(updates: { notes?: string; phone?: string }) {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/clients/${clientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  function scheduleNoteSave(value: string) {
    setNotes(value);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save({ notes: value }), 1000);
  }

  async function saveGrade(value: "NEW" | "REGULAR") {
    setGrade(value);
    await fetch(`/api/admin/clients/${clientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade: value }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Grade */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
          Customer type
        </label>
        <select
          value={grade}
          onChange={(e) => saveGrade(e.target.value as "NEW" | "REGULAR")}
          className="w-full border border-[#3E4F56]/20 rounded px-3 py-2.5 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
        >
          <option value="NEW">New customer — full payment required</option>
          <option value="REGULAR">Regular customer — 50% deposit</option>
        </select>
        <p className="mt-2 text-[11px] text-[#A09687]">
          Auto-upgrades to Regular after 5 confirmed bookings. Can be set manually here.
        </p>
      </div>

      {/* Phone */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
          Phone
        </label>
        <div className="flex gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 border border-[#3E4F56]/20 rounded px-3 py-2 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
          />
          <button
            onClick={() => save({ phone })}
            disabled={saving}
            className="px-4 py-2 bg-[#3E4F56] text-white text-[12px] tracking-[0.1em] uppercase rounded hover:opacity-90 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687]">
            Notes
          </label>
          <span className="text-[11px] text-[#A09687]">
            {saving ? "Saving…" : saved ? "Saved" : "Auto-saves"}
          </span>
        </div>
        <textarea
          value={notes}
          onChange={(e) => scheduleNoteSave(e.target.value)}
          rows={8}
          placeholder="Allergies, preferences, health notes, personal details…"
          className="w-full border border-[#3E4F56]/20 rounded px-3 py-2 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D] resize-none leading-[22px]"
        />
      </div>
    </div>
  );
}
