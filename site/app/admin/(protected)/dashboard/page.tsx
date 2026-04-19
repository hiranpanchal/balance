import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getServices } from "@/lib/getServices";
import { BarChart } from "@/components/admin/charts/BarChart";
import { HorizontalBar } from "@/components/admin/charts/HorizontalBar";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
  const thisYearStart = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
  const todayStr = now.toISOString().split("T")[0];

  // 12-month window for chart
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const twelveMonthsAgoStr = twelveMonthsAgo.toISOString().split("T")[0];

  const [allBookings, services, upcomingCount, pendingCount, clientCount, unreadMessages] = await Promise.all([
    db.booking.findMany({
      where: { status: { in: ["CONFIRMED", "COMPLETED"] }, date: { gte: twelveMonthsAgoStr } },
      select: { date: true, price: true, service: true },
      orderBy: { date: "asc" },
    }),
    getServices(),
    db.booking.count({ where: { status: "CONFIRMED", date: { gte: todayStr } } }),
    db.booking.count({ where: { status: "PENDING" } }),
    db.client.count(),
    db.message.findMany({
      where: { read: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, body: true, createdAt: true },
    }),
  ]);

  // ── Monthly revenue for chart (last 12 months) ────────────────────────────
  const monthlyMap = new Map<string, number>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, 0);
  }
  for (const b of allBookings) {
    const key = b.date.slice(0, 7);
    if (monthlyMap.has(key)) monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + b.price);
  }
  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const chartData = Array.from(monthlyMap.entries()).map(([key, value]) => ({
    label: monthLabels[parseInt(key.slice(5, 7)) - 1],
    value,
  }));

  // ── This month / last month ───────────────────────────────────────────────
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastMonthKey = (() => {
    const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  })();
  const revenueThisMonth = monthlyMap.get(thisMonthKey) ?? 0;
  const revenueLastMonth = monthlyMap.get(lastMonthKey) ?? 0;
  const revenueThisYear = allBookings
    .filter((b) => b.date >= thisYearStart)
    .reduce((s, b) => s + b.price, 0);
  const bookingsThisMonth = allBookings.filter((b) => b.date >= thisMonthStart).length;
  const bookingsLastMonth = allBookings.filter(
    (b) => b.date >= lastMonthStart && b.date < thisMonthStart
  ).length;
  const avgBookingValue = allBookings.length > 0
    ? Math.round(allBookings.reduce((s, b) => s + b.price, 0) / allBookings.length)
    : 0;

  // ── Treatment breakdown ───────────────────────────────────────────────────
  const treatmentMap = new Map<string, { value: number; count: number }>();
  for (const b of allBookings) {
    const name = services.find((s) => s.id === b.service)?.name ?? b.service;
    const cur = treatmentMap.get(name) ?? { value: 0, count: 0 };
    treatmentMap.set(name, { value: cur.value + b.price, count: cur.count + 1 });
  }
  const treatmentData = Array.from(treatmentMap.entries())
    .map(([label, { value, count }]) => ({ label, value, count }))
    .sort((a, b) => b.value - a.value);

  // ── Busiest days ──────────────────────────────────────────────────────────
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayCount = [0, 0, 0, 0, 0, 0, 0];
  for (const b of allBookings) {
    dayCount[new Date(b.date + "T12:00:00").getDay()]++;
  }
  const dayData = dayNames.map((label, i) => ({ label, value: dayCount[i] }));

  // ── Month-on-month delta ──────────────────────────────────────────────────
  const revDelta = revenueLastMonth > 0
    ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
    : null;
  const bkDelta = bookingsLastMonth > 0
    ? Math.round(((bookingsThisMonth - bookingsLastMonth) / bookingsLastMonth) * 100)
    : null;

  function Delta({ pct }: { pct: number | null }) {
    if (pct === null) return null;
    const up = pct >= 0;
    return (
      <span className={`text-[11px] ml-1 ${up ? "text-green-600" : "text-red-500"}`}>
        {up ? "▲" : "▼"} {Math.abs(pct)}% vs last month
      </span>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Dashboard</h1>
        <p className="text-[13px] text-[#A09687] mt-1">
          {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Revenue this month"
          value={`£${revenueThisMonth.toLocaleString()}`}
          sub={<Delta pct={revDelta} />}
        />
        <StatCard
          label="Bookings this month"
          value={String(bookingsThisMonth)}
          sub={<Delta pct={bkDelta} />}
        />
        <StatCard
          label="Revenue this year"
          value={`£${revenueThisYear.toLocaleString()}`}
        />
        <StatCard
          label="Avg booking value"
          value={`£${avgBookingValue}`}
        />
      </div>

      {/* Secondary cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Upcoming sessions" value={String(upcomingCount)} small />
        <StatCard label="Pending payment" value={String(pendingCount)} small />
        <StatCard label="Total clients" value={String(clientCount)} small />
      </div>

      {/* Unread messages */}
      {unreadMessages.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687]">
              Unread messages
              <span className="ml-2 bg-[#3E4F56] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {unreadMessages.length}
              </span>
            </h2>
            <a href="/admin/messages" className="text-[11px] tracking-[0.1em] uppercase text-[#B28B5D] hover:underline">
              View all →
            </a>
          </div>
          <div className="divide-y divide-[#EAE2D2]">
            {unreadMessages.map((m) => (
              <a
                key={m.id}
                href={`/admin/messages?id=${m.id}`}
                className="flex items-start gap-4 py-3 hover:bg-[#FAFAF8] -mx-6 px-6 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#EAE2D2] flex items-center justify-center shrink-0 text-[11px] text-[#3E4F56] font-medium mt-0.5">
                  {m.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-[#3E4F56] truncate">{m.name}</span>
                    <span className="text-[11px] text-[#A09687] shrink-0">
                      {new Date(m.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#A09687] truncate mt-0.5">{m.body.slice(0, 100)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Monthly revenue chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-6">
          Monthly revenue — last 12 months
        </h2>
        <BarChart data={chartData} prefix="£" />
      </div>

      {/* Treatment breakdown + busiest days */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-6">
            Revenue by treatment
          </h2>
          {treatmentData.length === 0 ? (
            <p className="text-[13px] text-[#A09687]">No data yet.</p>
          ) : (
            <HorizontalBar data={treatmentData} prefix="£" />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-6">
            Bookings by day of week
          </h2>
          <BarChart data={dayData} prefix="" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  small,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  small?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className={`font-serif text-[#3E4F56] ${small ? "text-[22px]" : "text-[28px]"}`}>
        {value}
      </div>
      <div className="text-[11px] tracking-[0.08em] uppercase text-[#A09687] mt-1">{label}</div>
      {sub && <div className="mt-1">{sub}</div>}
    </div>
  );
}
