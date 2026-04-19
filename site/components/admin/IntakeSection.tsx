"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCopy, Check, Send } from "lucide-react";

interface Props {
  clientId: string;
  isCompleted: boolean;
  isSent: boolean;
}

export function IntakeSection({ clientId, isCompleted, isSent }: Props) {
  const router = useRouter();
  const [link, setLink] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  async function sendIntake() {
    setSending(true);
    const res = await fetch(`/api/admin/clients/${clientId}/intake`, { method: "POST" });
    const data = await res.json();
    setLink(data.url);
    setSending(false);
    router.refresh();
  }

  function copyLink() {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687]">Intake form</h2>
        {isCompleted && (
          <span className="text-[11px] tracking-[0.08em] uppercase bg-[#3E4F56]/8 text-[#3E4F56] px-2 py-1 rounded">
            Completed
          </span>
        )}
        {isSent && !isCompleted && (
          <span className="text-[11px] tracking-[0.08em] uppercase bg-[#B28B5D]/10 text-[#B28B5D] px-2 py-1 rounded">
            Sent
          </span>
        )}
      </div>

      {isCompleted ? (
        <div className="space-y-3">
          <p className="text-[13px] text-[#A09687]">Form completed — details shown on the left.</p>
          <button
            onClick={sendIntake}
            disabled={sending}
            className="text-[12px] text-[#A09687] hover:text-[#3E4F56] transition-colors"
          >
            {sending ? "Sending…" : "Resend link"}
          </button>
        </div>
      ) : isSent && !link ? (
        <div className="space-y-3">
          <p className="text-[13px] text-[#A09687] leading-[22px]">
            Link sent — waiting for the client to complete the form.
          </p>
          <button
            onClick={sendIntake}
            disabled={sending}
            className="flex items-center gap-2 text-[12px] text-[#A09687] hover:text-[#3E4F56] transition-colors"
          >
            <Send size={12} strokeWidth={1.5} />
            {sending ? "Sending…" : "Resend link"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[13px] text-[#A09687] leading-[22px]">
            Send the client a link to complete their health intake form before their first appointment.
          </p>
          <button
            onClick={sendIntake}
            disabled={sending}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3E4F56] text-white text-[12px] tracking-[0.1em] uppercase rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Send size={13} strokeWidth={1.5} />
            {sending ? "Sending…" : "Send intake form"}
          </button>
        </div>
      )}

      {link && (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] text-[#A09687]">Copy link to send manually:</p>
          <div className="flex items-center gap-2 bg-[#F5F0E6] rounded-md px-3 py-2.5">
            <span className="text-[11px] text-[#3E4F56] truncate flex-1 font-mono">{link}</span>
            <button onClick={copyLink} className="shrink-0 text-[#A09687] hover:text-[#3E4F56]">
              {copied
                ? <Check size={14} strokeWidth={1.5} className="text-green-600" />
                : <ClipboardCopy size={14} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
