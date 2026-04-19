import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Clients" };
export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await db.client.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  const bookingStats = await db.booking.groupBy({
    by: ["email"],
    _count: { id: true },
    _sum: { price: true },
    _max: { date: true },
  });

  const statsMap = Object.fromEntries(bookingStats.map((s) => [s.email, s]));

  const rows = clients.map((c) => ({
    ...c,
    totalBookings: statsMap[c.email]?._count.id ?? 0,
    totalSpent: statsMap[c.email]?._sum.price ?? 0,
    lastBooking: statsMap[c.email]?._max.date ?? null,
  }));

  const totalRevenue = rows.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Clients</h1>
          <p className="text-[13px] text-[#A09687] mt-1">{clients.length} total</p>
        </div>
        <Link
          href="/admin/clients/new"
          className="px-5 py-2.5 bg-[#3E4F56] text-white text-[12px] tracking-[0.1em] uppercase rounded hover:opacity-90"
        >
          + New client
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-[22px] font-serif text-[#3E4F56]">{clients.length}</div>
          <div className="text-[11px] tracking-[0.1em] text-[#A09687] uppercase mt-1">Total clients</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-[22px] font-serif text-[#3E4F56]">
            £{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] tracking-[0.1em] text-[#A09687] uppercase mt-1">Total revenue</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-[22px] font-serif text-[#3E4F56]">
            {clients.length > 0 ? `£${Math.round(totalRevenue / clients.length)}` : "—"}
          </div>
          <div className="text-[11px] tracking-[0.1em] text-[#A09687] uppercase mt-1">Avg per client</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#EAE2D2]">
              {["Client", "Phone", "Bookings", "Total spent", "Last visit", ""].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11px] tracking-[0.1em] uppercase text-[#A09687] px-5 py-4 font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[#A09687]">
                  No clients yet. They appear automatically when someone books.
                </td>
              </tr>
            )}
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-[#F5F0E6] hover:bg-[#FAF8F4]">
                <td className="px-5 py-4">
                  <div className="text-[#3E4F56] font-medium">
                    {c.firstName} {c.lastName}
                  </div>
                  <div className="text-[11px] text-[#A09687]">{c.email}</div>
                </td>
                <td className="px-5 py-4 text-[#3E4F56]">{c.phone || "—"}</td>
                <td className="px-5 py-4 text-[#3E4F56]">{c.totalBookings}</td>
                <td className="px-5 py-4 text-[#3E4F56]">£{c.totalSpent}</td>
                <td className="px-5 py-4 text-[#A09687]">{c.lastBooking ?? "—"}</td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="text-[#B28B5D] hover:underline text-[12px]"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
