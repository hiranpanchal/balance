"use client";

import { useState } from "react";
import { ClipboardCopy, Check, Send } from "lucide-react";

interface Props {
  clientId: string;
  clientFirstName: string;
}

export function SendPortalLinkButton({ clientId, clientFirstName }: Props) {
  const [sending, setSending] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSend() {
    setSending(true);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/portal`, { method: "POST" });
      const data = await res.json();
      setUrl(data.url);
    } finally {
      setSending(false);
    }
  }

  function copyLink() {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-4">Client portal</h2>

      {url ? (
        <div className="space-y-3">
          <p className="text-[13px] text-[#A09687]">
            Link sent to {clientFirstName}. Copy it below to share manually.
          </p>
          <div className="flex items-center gap-2 bg-[#F5F0E6] rounded-md px-3 py-2.5">
            <span className="text-[11px] text-[#3E4F56] truncate flex-1 font-mono">{url}</span>
            <button onClick={copyLink} className="shrink-0 text-[#A09687] hover:text-[#3E4F56]">
              {copied
                ? <Check size={14} strokeWidth={1.5} className="text-green-600" />
                : <ClipboardCopy size={14} strokeWidth={1.5} />}
            </button>
          </div>
          <button
            onClick={handleSend}
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
            Send {clientFirstName} a link to view their upcoming bookings and cancel if needed.
          </p>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3E4F56] text-white text-[12px] tracking-[0.1em] uppercase rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Send size={13} strokeWidth={1.5} />
            {sending ? "Sending…" : "Send portal link"}
          </button>
        </div>
      )}
    </div>
  );
}
