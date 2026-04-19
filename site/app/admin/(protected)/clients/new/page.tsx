import type { Metadata } from "next";
import Link from "next/link";
import { NewClientForm } from "@/components/admin/NewClientForm";

export const metadata: Metadata = { title: "New client" };

export default function NewClientPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/clients" className="text-[13px] text-[#A09687] hover:text-[#3E4F56]">
          ← Clients
        </Link>
      </div>

      <div className="max-w-[520px]">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal mb-8">New client</h1>
        <NewClientForm />
      </div>
    </div>
  );
}
