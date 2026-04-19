import type { Metadata } from "next";
import { getServices } from "@/lib/getServices";
import { WaitlistForm } from "./WaitlistForm";

export const metadata: Metadata = { title: "Join waiting list" };
export const dynamic = "force-dynamic";

export default async function WaitlistPage() {
  const services = await getServices();
  return <WaitlistForm services={services.map((s) => ({ id: s.id, name: s.name }))} />;
}
