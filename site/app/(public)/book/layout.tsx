import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Book a session",
  description:
    "Book your Balance and Wellness massage in five short steps. Treatment, therapist, date, details, confirm.",
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-stone text-[13px] tracking-[0.18em] uppercase">
          Loading…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
