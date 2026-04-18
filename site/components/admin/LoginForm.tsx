"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

interface Props {
  callbackUrl?: string;
  error?: string;
}

export function LoginForm({ callbackUrl, error }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      email,
      password,
      callbackUrl: callbackUrl ?? "/admin/bookings",
    });
    setLoading(false);
  }

  return (
    <div className="bg-white rounded p-8 shadow-sm">
      <h2 className="text-[#3E4F56] text-[16px] font-serif font-normal mb-6">
        Sign in
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-[13px] text-red-700">
          {error === "CredentialsSignin"
            ? "Incorrect email or password."
            : "Something went wrong. Please try again."}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-[11px] tracking-[0.15em] uppercase text-[#A09687] mb-2"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mukti@balanceandwellness.com"
            className="w-full border border-[#3E4F56]/20 rounded px-4 py-3 text-[14px] text-[#3E4F56] bg-[#F5F0E6] placeholder:text-[#A09687] focus:outline-none focus:border-[#B28B5D]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[11px] tracking-[0.15em] uppercase text-[#A09687] mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#3E4F56]/20 rounded px-4 py-3 text-[14px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.18em] uppercase py-3 rounded transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
