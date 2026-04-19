"use client";

import { useState } from "react";

interface CancelFormProps {
  token: string;
  firstName: string;
  lateCancel: boolean;
}

export function CancelForm({ token, firstName, lateCancel }: CancelFormProps) {
  const [status, setStatus] = useState<"idle" | "confirming" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCancel() {
    setStatus("loading");
    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="text-center">
        <p className="text-[14px] text-[#3E4F56] mb-2">
          Your booking has been cancelled, {firstName}. A confirmation has been sent to your email.
        </p>
        {lateCancel && (
          <p className="text-[13px] text-[#A09687] mt-3">
            As this was within 24 hours, a 50% charge may apply.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {lateCancel && (
        <div className="border-l-[3px] border-[#B28B5D] bg-[#fff8ee] px-4 py-3 mb-5">
          <p className="text-[13px] text-[#3E4F56] leading-[1.6]">
            <strong>Late cancellation notice</strong>
            <br />
            This appointment is within 24 hours. Cancelling now may incur a 50% charge.
          </p>
        </div>
      )}

      {status === "error" && (
        <p className="text-[13px] text-red-600 mb-4">{errorMsg}</p>
      )}

      {status === "confirming" ? (
        <div className="space-y-3">
          <p className="text-[13px] text-[#3E4F56]">Are you sure you want to cancel this booking?</p>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 bg-[#3E4F56] text-white text-[12px] tracking-[0.1em] uppercase rounded hover:opacity-90"
            >
              Yes, cancel it
            </button>
            <button
              onClick={() => setStatus("idle")}
              className="flex-1 px-4 py-2.5 border border-[#3E4F56]/30 text-[#3E4F56] text-[12px] tracking-[0.1em] uppercase rounded hover:border-[#3E4F56]"
            >
              Keep booking
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setStatus("confirming")}
          disabled={status === "loading"}
          className="w-full px-4 py-3 bg-[#3E4F56] text-white text-[12px] tracking-[0.1em] uppercase rounded hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Cancelling…" : "Cancel this booking"}
        </button>
      )}
    </div>
  );
}
