import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getPageDescription } from "@/lib/content";
import { getServices } from "@/lib/getServices";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Book",
    description: await getPageDescription(
      "page.book.description",
      "Book a massage or bodywork session with Mukti Panchal. Choose your treatment and a time that suits you."
    ),
  };
}

export default async function BookPage() {
  const services = await getServices();
  return <BookingWizard services={services} />;
}
