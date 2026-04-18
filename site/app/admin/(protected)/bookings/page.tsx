import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { services } from "@/lib/data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { BookingFilters } from "@/components/admin/BookingFilters";

export const metadata: Metadata = { title: "Bookings" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: { status?: string; date?: string; page?: string };
}

export default async function BookingsPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page ?? "1");
  const limit = 25;

  const where: Record<string, unknown> = {};
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.date) where.date = searchParams.date;

  const [bookings, total] = await Promise.all([
    db.booking.findMany({
      where,
      orderBy: [{ date: "desc" }, { time: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.booking.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  const counts = await db.booking.groupBy({
    by: ["status"],
    _count: true,
  });
  const statusCounts = Object.fromEntries(counts.map((c) => [c.status, c._count]));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Bookings</h1>
          <p className="text-[13px] text-[#A09687] mt-1">{total} total</p>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {(["CONFIRMED", "PENDING", "COMPLETED", "CANCELLED", "NO_SHOW"] as const).map((s) => (
          <Link
            key={s}
            href={`/admin/bookings?status=${s}`}
            className={`bg-white rounded-lg p-4 border transition-colors hover:border-[#B28B5D] ${
              searchParams.status === s ? "border-[#B28B5D]" : "border-transparent shadow-sm"
            }`}
          >
            <div className="text-[22px] font-serif text-[#3E4F56]">
              {statusCounts[s] ?? 0}
            </div>
            <div className="text-[11px] tracking-[0.1em] text-[#A09687] uppercase mt-1">
              {s.toLowerCase().replace("_", " ")}
            </div>
          </Link>
        ))}
      </div>

      <BookingFilters currentStatus={searchParams.status} currentDate={searchParams.date} />

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#EAE2D2]">
              {["Ref", "Guest", "Treatment", "Date & time", "Duration", "Price", "Status", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-[11px] tracking-[0.1em] uppercase text-[#A09687] px-5 py-4 font-normal"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-[#A09687]">
                  No bookings found.
                </td>
              </tr>
            )}
            {bookings.map((b) => {
              const svcName = services.find((s) => s.id === b.service)?.name ?? b.service;
              return (
                <tr key={b.id} className="border-b border-[#F5F0E6] hover:bg-[#FAF8F4]">
                  <td className="px-5 py-4 font-mono text-[11px] text-[#A09687]">{b.ref}</td>
                  <td className="px-5 py-4 text-[#3E4F56]">
                    {b.firstName} {b.lastName}
                    <div className="text-[11px] text-[#A09687]">{b.email}</div>
                  </td>
                  <td className="px-5 py-4 text-[#3E4F56]">{svcName}</td>
                  <td className="px-5 py-4 text-[#3E4F56]">
                    {b.date}
                    <div className="text-[#A09687]">{b.time}</div>
                  </td>
                  <td className="px-5 py-4 text-[#3E4F56]">{b.duration} min</td>
                  <td className="px-5 py-4 text-[#3E4F56]">£{b.price}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="text-[#B28B5D] hover:underline text-[12px]"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/bookings?page=${p}${searchParams.status ? `&status=${searchParams.status}` : ""}`}
              className={`w-9 h-9 flex items-center justify-center rounded text-[13px] ${
                p === page
                  ? "bg-[#3E4F56] text-white"
                  : "text-[#3E4F56] hover:bg-white"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
