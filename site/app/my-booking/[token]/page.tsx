import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getServices } from "@/lib/getServices";

export const metadata: Metadata = { title: "My bookings" };
export const dynamic = "force-dynamic";

export default async function ClientPortalPage({ params }: { params: { token: string } }) {
  const client = await db.client.findUnique({
    where: { portalToken: params.token },
  });

  if (!client) notFound();

  const today = new Date().toISOString().split("T")[0];

  const [upcoming, past, services] = await Promise.all([
    db.booking.findMany({
      where: { email: client.email, date: { gte: today }, status: { in: ["CONFIRMED", "PENDING"] } },
      orderBy: { date: "asc" },
    }),
    db.booking.findMany({
      where: { email: client.email, date: { lt: today }, status: { in: ["CONFIRMED", "COMPLETED"] } },
      orderBy: { date: "desc" },
      take: 5,
    }),
    getServices(),
  ]);

  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? id;

  const formatDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <main className="min-h-screen bg-[#EAE2D2]">
      <div className="max-w-[640px] mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <img src="/logo-light.svg" alt="Balance and Wellness" className="h-12 w-auto mb-8" />
          <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">
            Hi {client.firstName}
          </h1>
          <p className="text-[14px] text-[#A09687] mt-1">Your bookings at Balance &amp; Wellness</p>
        </div>

        {/* Upcoming */}
        <section className="mb-10">
          <h2 className="text-[11px] tracking-[0.18em] uppercase text-[#A09687] mb-4">
            Upcoming
          </h2>

          {upcoming.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-[14px] text-[#A09687]">
              No upcoming bookings.{" "}
              <Link href="/book" className="text-[#B28B5D] hover:underline">
                Book a session →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b) => {
                const bookingDate = new Date(`${b.date}T${b.time}`);
                const hoursUntil = (bookingDate.getTime() - Date.now()) / (1000 * 60 * 60);
                const canCancel = hoursUntil > 0;

                return (
                  <div key={b.id} className="bg-white rounded-lg p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[15px] font-medium text-[#3E4F56]">
                          {serviceName(b.service)}
                        </div>
                        <div className="text-[13px] text-[#A09687] mt-1">
                          {formatDate(b.date)} at {b.time}
                        </div>
                        <div className="text-[13px] text-[#A09687]">
                          {b.duration} min · £{b.price}
                        </div>
                        <div className="text-[11px] text-[#A09687] mt-2 tracking-[0.08em] uppercase">
                          Ref: {b.ref}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className={`inline-block text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full mb-3 ${
                          b.status === "CONFIRMED"
                            ? "bg-[#3E4F56]/10 text-[#3E4F56]"
                            : "bg-[#A09687]/15 text-[#A09687]"
                        }`}>
                          {b.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                        </span>
                        {canCancel && (
                          <div>
                            <Link
                              href={`/cancel/${b.cancelToken}`}
                              className="text-[12px] text-[#A09687] hover:text-[#3E4F56] underline underline-offset-2"
                            >
                              Cancel
                            </Link>
                            {hoursUntil < 24 && (
                              <div className="text-[11px] text-[#B28B5D] mt-1">
                                Within 24h — fee may apply
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[11px] tracking-[0.18em] uppercase text-[#A09687] mb-4">
              Recent visits
            </h2>
            <div className="space-y-2">
              {past.map((b) => (
                <div key={b.id} className="bg-white/60 rounded-lg px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-[14px] text-[#3E4F56]">{serviceName(b.service)}</div>
                    <div className="text-[12px] text-[#A09687]">{formatDate(b.date)}</div>
                  </div>
                  <div className="text-[13px] text-[#A09687]">£{b.price}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Book again */}
        <Link
          href="/book"
          className="inline-block px-7 py-3 bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase rounded hover:opacity-90"
        >
          Book a session
        </Link>
      </div>
    </main>
  );
}
