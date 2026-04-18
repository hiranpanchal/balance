import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ServiceEditor } from "@/components/admin/ServiceEditor";

export const metadata: Metadata = { title: "Edit service" };
export const dynamic = "force-dynamic";

export default async function ServiceEditPage({ params }: { params: { id: string } }) {
  const service = await db.service.findUnique({
    where: { id: params.id },
    include: { durations: { orderBy: { mins: "asc" } } },
  });
  if (!service) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/services" className="text-[13px] text-[#A09687] hover:text-[#3E4F56]">
          ← Services
        </Link>
        <span className="text-[#A09687]">/</span>
        <span className="text-[13px] text-[#3E4F56]">{service.name}</span>
      </div>
      <ServiceEditor service={JSON.parse(JSON.stringify(service))} />
    </div>
  );
}
