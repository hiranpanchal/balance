import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Services" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await db.service.findMany({
    include: { durations: { orderBy: { mins: "asc" } } },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Services &amp; pricing</h1>
      </div>

      <div className="space-y-3">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="bg-white rounded-lg shadow-sm p-6 flex items-start justify-between gap-6"
          >
            <div className="flex-1 min-w-0">
              <div className="font-serif text-[18px] text-[#3E4F56]">{svc.name}</div>
              <p className="text-[13px] text-[#A09687] mt-1">{svc.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {svc.durations.map((d) => (
                  <span
                    key={d.mins}
                    className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#EAE2D2] rounded text-[12px] text-[#3E4F56]"
                  >
                    {d.mins} min — <span className="text-[#B28B5D]">£{d.price}</span>
                  </span>
                ))}
              </div>
            </div>
            <Link
              href={`/admin/services/${svc.id}`}
              className="shrink-0 text-[13px] text-[#B28B5D] hover:underline"
            >
              Edit →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
