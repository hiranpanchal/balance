import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getServices } from "@/lib/getServices";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ClientEditor } from "@/components/admin/ClientEditor";
import { ManualBookingForm } from "@/components/admin/ManualBookingForm";
import { IntakeSection } from "@/components/admin/IntakeSection";
import { IntakeDetails } from "@/components/admin/IntakeDetails";

export const metadata: Metadata = { title: "Client" };
export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await db.client.findUnique({
    where: { id: params.id },
    include: { intakeForm: true },
  });
  if (!client) notFound();

  const today = new Date().toISOString().split("T")[0];

  const [upcoming, past, services] = await Promise.all([
    db.booking.findMany({
      where: { email: client.email, date: { gte: today } },
      orderBy: { date: "asc" },
    }),
    db.booking.findMany({
      where: { email: client.email, date: { lt: today } },
      orderBy: { date: "desc" },
    }),
    getServices(),
  ]);

  const totalSpent = [...upcoming, ...past].reduce((sum, b) => sum + b.price, 0);
  const totalBookings = upcoming.length + past.length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/clients" className="text-[13px] text-[#A09687] hover:text-[#3E4F56]">
          ← Clients
        </Link>
      </div>

      <div className="grid md:grid-cols-[1fr_340px] gap-8">
        {/* Left column */}
        <div className="space-y-6">
          {/* Header card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="font-serif text-[24px] text-[#3E4F56] font-normal">
              {client.firstName} {client.lastName}
            </h1>
            <p className="text-[#A09687] text-[13px] mt-1">{client.email}</p>

            <dl className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-[#F5F0E6]">
              <div>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  Total bookings
                </dt>
                <dd className="text-[#3E4F56] font-serif text-[20px]">{totalBookings}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  Total spent
                </dt>
                <dd className="text-[#3E4F56] font-serif text-[20px]">£{totalSpent}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  Client since
                </dt>
                <dd className="text-[#3E4F56] text-[13px]">
                  {new Date(client.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </div>

          {/* Upcoming bookings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-4">
              Upcoming bookings ({upcoming.length})
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-[13px] text-[#A09687]">No upcoming bookings.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((b) => {
                  const svcName = services.find((s) => s.id === b.service)?.name ?? b.service;
                  return (
                    <div
                      key={b.id}
                      className="flex items-center justify-between py-3 border-b border-[#F5F0E6] last:border-0"
                    >
                      <div>
                        <div className="text-[13px] text-[#3E4F56]">{svcName} · {b.duration} min</div>
                        <div className="text-[12px] text-[#A09687] mt-0.5">
                          {b.date} at {b.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[13px] text-[#3E4F56]">£{b.price}</span>
                        <StatusBadge status={b.status} />
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="text-[#B28B5D] hover:underline text-[12px]"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Intake form details */}
          {client.intakeForm?.completedAt && (
            <IntakeDetails intake={JSON.parse(JSON.stringify(client.intakeForm))} />
          )}

          {/* Past bookings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-4">
              Past bookings ({past.length})
            </h2>
            {past.length === 0 ? (
              <p className="text-[13px] text-[#A09687]">No past bookings.</p>
            ) : (
              <div className="space-y-3">
                {past.map((b) => {
                  const svcName = services.find((s) => s.id === b.service)?.name ?? b.service;
                  return (
                    <div
                      key={b.id}
                      className="flex items-center justify-between py-3 border-b border-[#F5F0E6] last:border-0"
                    >
                      <div>
                        <div className="text-[13px] text-[#3E4F56]">{svcName} · {b.duration} min</div>
                        <div className="text-[12px] text-[#A09687] mt-0.5">
                          {b.date} at {b.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[13px] text-[#3E4F56]">£{b.price}</span>
                        <StatusBadge status={b.status} />
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="text-[#B28B5D] hover:underline text-[12px]"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column — phone, notes, manual booking */}
        <div className="space-y-6">
          <ClientEditor
            clientId={client.id}
            initialNotes={client.notes}
            initialPhone={client.phone}
          />
          <IntakeSection
            clientId={client.id}
            isCompleted={!!client.intakeForm?.completedAt}
            isSent={!!client.intakeForm}
          />
          <ManualBookingForm
            client={{
              firstName: client.firstName,
              lastName: client.lastName,
              email: client.email,
              phone: client.phone,
            }}
            services={services}
          />
        </div>
      </div>
    </div>
  );
}
