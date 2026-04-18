"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Filters({
  currentStatus,
  currentDate,
}: {
  currentStatus?: string;
  currentDate?: string;
}) {
  const router = useRouter();

  function apply(updates: Record<string, string>) {
    const params = new URLSearchParams();
    if (currentStatus) params.set("status", currentStatus);
    if (currentDate) params.set("date", currentDate);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.delete("page");
    router.push(`/admin/bookings?${params}`);
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <input
        type="date"
        defaultValue={currentDate ?? ""}
        onChange={(e) => apply({ date: e.target.value })}
        className="border border-[#3E4F56]/15 rounded px-3 py-2 text-[13px] text-[#3E4F56] bg-white focus:outline-none focus:border-[#B28B5D]"
      />
      <select
        defaultValue={currentStatus ?? ""}
        onChange={(e) => apply({ status: e.target.value })}
        className="border border-[#3E4F56]/15 rounded px-3 py-2 text-[13px] text-[#3E4F56] bg-white focus:outline-none focus:border-[#B28B5D]"
      >
        <option value="">All statuses</option>
        {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"].map((s) => (
          <option key={s} value={s}>
            {s.charAt(0) + s.slice(1).toLowerCase().replace("_", " ")}
          </option>
        ))}
      </select>
      {(currentStatus || currentDate) && (
        <button
          onClick={() => router.push("/admin/bookings")}
          className="text-[13px] text-[#A09687] hover:text-[#3E4F56] underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export function BookingFilters(props: { currentStatus?: string; currentDate?: string }) {
  return (
    <Suspense>
      <Filters {...props} />
    </Suspense>
  );
}
