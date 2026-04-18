import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { services } from "@/lib/data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { BookingActions } from "@/components/admin/BookingActions";

export const metadata: Metadata = { title: "Booking detail" };
export const dynamic = "force-dynamic";

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const booking = await db.booking.findUnique({ where: { id: params.id } });
  if (!booking) notFound();

  const svcName = services.find((s) => s.id === booking.service)?.name ?? booking.service;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/bookings" className="text-[13px] text-[#A09687] hover:text-[#3E4F56]">
          ← Bookings
        </Link>
        <span className="text-[#A09687]">/</span>
        <span className="text-[13px] text-[#3E4F56] font-mono">{booking.ref}</span>
      </div>

      <div className="grid md:grid-cols-[1fr_340px] gap-8">
        {/* Main details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="font-serif text-[24px] text-[#3E4F56] font-normal">
                  {booking.firstName} {booking.lastName}
                </h1>
                <p className="text-[#A09687] text-[13px] mt-1">{booking.email}</p>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 text-[13px]">
              <div>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  Treatment
                </dt>
                <dd className="text-[#3E4F56]">{svcName}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  Duration
                </dt>
                <dd className="text-[#3E4F56]">{booking.duration} minutes</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  Date
                </dt>
                <dd className="text-[#3E4F56]">{booking.date}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  Time
                </dt>
                <dd className="text-[#3E4F56]">{booking.time}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  Price
                </dt>
                <dd className="text-[#3E4F56]">£{booking.price}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  Phone
                </dt>
                <dd className="text-[#3E4F56]">{booking.phone}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  First time
                </dt>
                <dd className="text-[#3E4F56]">{booking.firstTime ? "Yes" : "No"}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                  Ref
                </dt>
                <dd className="font-mono text-[#3E4F56]">{booking.ref}</dd>
              </div>
            </dl>

            {booking.notes && (
              <div className="mt-6 pt-6 border-t border-[#F5F0E6]">
                <dt className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
                  Notes
                </dt>
                <dd className="text-[#3E4F56] text-[13px] leading-[22px] whitespace-pre-wrap">
                  {booking.notes}
                </dd>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-4">
              Timeline
            </h2>
            <div className="text-[13px] text-[#3E4F56]/70">
              Created{" "}
              {new Date(booking.createdAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Actions sidebar */}
        <BookingActions booking={JSON.parse(JSON.stringify(booking))} />
      </div>
    </div>
  );
}
