import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

interface Props {
  searchParams: { "check-email"?: string; callbackUrl?: string; error?: string };
}

export default function LoginPage({ searchParams }: Props) {
  const checkEmail = searchParams["check-email"] === "1";
  const error = searchParams.error;

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

        {checkEmail ? (
          <div className="bg-white rounded p-8 text-center shadow-sm">
            <div className="text-[#3E4F56] font-serif text-[20px] mb-3">Check your email</div>
            <p className="text-[14px] leading-[24px] text-[#3E4F56]/70">
              A sign-in link has been sent. It expires in 24 hours.
            </p>
            <p className="text-[12px] text-[#A09687] mt-4">
              In development the link is printed to the terminal.
            </p>
          </div>
        ) : (
          <LoginForm callbackUrl={searchParams.callbackUrl} error={error} />
        )}
      </div>
    </div>
  );
}
