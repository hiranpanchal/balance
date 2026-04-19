import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getServices } from "@/lib/getServices";

export const metadata: Metadata = { title: "Waiting list" };
export const dynamic = "force-dynamic";

export default async function WaitlistPage() {
  const today = new Date().toISOString().split("T")[0];

  const [entries, services] = await Promise.all([
    db.waitlistEntry.findMany({
      where: { date: { gte: today } },
      orderBy: [{ date: "asc" }, { createdAt: "asc" }],
    }),
    getServices(),
  ]);

  const notified = entries.filter((e) => e.notifiedAt).length;
  const waiting = entries.filter((e) => !e.notifiedAt).length;

  const serviceName = (id: string) =>
    id ? (services.find((s) => s.id === id)?.name ?? id) : "Any";

  // Group by date
  const byDate = new Map<string, typeof entries>();
  for (const e of entries) {
    if (!byDate.has(e.date)) byDate.set(e.date, []);
    byDate.get(e.date)!.push(e);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Waiting list</h1>
        <p className="text-[13px] text-[#A09687] mt-1">Upcoming dates only</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-[22px] font-serif text-[#3E4F56]">{waiting}</div>
          <div className="text-[11px] tracking-[0.1em] text-[#A09687] uppercase mt-1">Waiting</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-[22px] font-serif text-[#3E4F56]">{notified}</div>
          <div className="text-[11px] tracking-[0.1em] text-[#A09687] uppercase mt-1">Notified</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-[22px] font-serif text-[#3E4F56]">{byDate.size}</div>
          <div className="text-[11px] tracking-[0.1em] text-[#A09687] uppercase mt-1">Dates</div>
        </div>
      </div>

      {byDate.size === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-[#A09687] text-[14px]">
          No one on the waiting list right now.
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(byDate.entries()).map(([date, dateEntries]) => {
            const formatted = new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            });
            return (
              <div key={date} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-[#EAE2D2] flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#3E4F56]">{formatted}</span>
                  <span className="text-[11px] tracking-[0.08em] uppercase text-[#A09687]">
                    {dateEntries.filter((e) => !e.notifiedAt).length} waiting
                  </span>
                </div>
                <table className="w-full text-[13px]">
                  <tbody>
                    {dateEntries.map((e) => (
                      <tr key={e.id} className="border-b border-[#F5F0E6] last:border-0">
                        <td className="px-5 py-3">
                          <div className="text-[#3E4F56]">{e.firstName} {e.lastName}</div>
                          <div className="text-[11px] text-[#A09687]">{e.email}</div>
                        </td>
                        <td className="px-5 py-3 text-[#A09687]">{e.phone || "—"}</td>
                        <td className="px-5 py-3 text-[#A09687]">{serviceName(e.service)}</td>
                        <td className="px-5 py-3">
                          {e.notifiedAt ? (
                            <span className="text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-[#B28B5D]/15 text-[#B28B5D]">
                              Notified
                            </span>
                          ) : (
                            <span className="text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-[#3E4F56]/10 text-[#3E4F56]">
                              Waiting
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
