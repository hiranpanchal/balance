import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AvailabilityManager } from "@/components/admin/AvailabilityManager";

export const metadata: Metadata = { title: "Availability" };
export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  const blocked = await db.blockedDate.findMany({ orderBy: { date: "asc" } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Availability</h1>
        <p className="text-[13px] text-[#A09687] mt-1">
          Block holidays, half days, and time off. The booking calendar respects these automatically.
        </p>
      </div>
      <AvailabilityManager blocked={JSON.parse(JSON.stringify(blocked))} />
    </div>
  );
}
