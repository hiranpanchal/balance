import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

interface Props {
  searchParams: { callbackUrl?: string; error?: string };
}

export default function LoginPage({ searchParams }: Props) {
  return (
    <div className="min-h-screen bg-[#EAE2D2] flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-10">
          <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">
            Balance &amp; Wellness
          </h1>
          <p className="text-[12px] tracking-[0.18em] uppercase text-[#A09687] mt-2">
            Admin panel
          </p>
        </div>
        <LoginForm callbackUrl={searchParams.callbackUrl} error={searchParams.error} />
      </div>
    </div>
  );
}
