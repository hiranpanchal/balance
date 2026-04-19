import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getPageDescription } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Book",
    description: await getPageDescription(
      "page.book.description",
      "Book a massage or bodywork session with Mukti Panchal. Choose your treatment and a time that suits you."
    ),
  };
}

export default function BookPage() {
  return <BookingWizard />;
}
