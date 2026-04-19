import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { IntakeFormClient } from "@/components/intake/IntakeFormClient";

export const dynamic = "force-dynamic";

export default async function IntakePage({ params }: { params: { token: string } }) {
  const intake = await db.intakeForm.findUnique({
    where: { token: params.token },
    include: { client: { select: { firstName: true, lastName: true } } },
  });

  if (!intake) notFound();

  if (intake.completedAt) {
    return (
      <div className="min-h-screen bg-[#EAE2D2] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm p-10 max-w-[480px] w-full text-center">
          <img src="/logo-light.svg" alt="Balance and Wellness" className="h-8 w-auto mx-auto mb-8" />
          <h1 className="font-serif text-[24px] text-[#3E4F56] font-normal mb-3">
            Already submitted
          </h1>
          <p className="text-[14px] text-[#A09687] leading-[24px]">
            Your intake form has already been completed. If you need to make changes,
            please contact the studio directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <IntakeFormClient
      token={params.token}
      clientName={intake.client.firstName}
    />
  );
}
