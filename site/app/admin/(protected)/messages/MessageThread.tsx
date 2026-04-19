"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

interface Props {
  message: {
    id: string;
    name: string;
    email: string;
    phone: string;
    body: string;
    createdAt: string;
  };
  replies: { id: string; body: string; sentAt: string }[];
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageThread({ message, replies }: Props) {
  const router = useRouter();
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyBody.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/messages/${message.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody.trim() }),
      });
      if (!res.ok) {
        setError("Failed to send reply. Please try again.");
        return;
      }
      setReplyBody("");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="px-8 py-5 border-b border-[#EAE2D2] bg-white">
        <h2 className="text-[18px] font-serif text-[#3E4F56] font-normal">
          {message.name}
        </h2>
        <div className="flex items-center gap-4 mt-1 flex-wrap">
          <a href={`mailto:${message.email}`} className="text-[13px] text-[#B28B5D] hover:underline">
            {message.email}
          </a>
          {message.phone && (
            <span className="text-[13px] text-[#A09687]">{message.phone}</span>
          )}
          <span className="text-[12px] text-[#A09687]">{formatDateTime(message.createdAt)}</span>
        </div>
      </div>

      {/* Thread scroll area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {/* Original message */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-[#EAE2D2] flex items-center justify-center shrink-0 text-[12px] text-[#3E4F56] font-medium">
            {message.name[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-[11px] text-[#A09687] mb-2">{formatDateTime(message.createdAt)}</div>
            <div className="bg-white rounded-lg p-5 shadow-sm text-[14px] text-[#3E4F56] leading-[24px] whitespace-pre-wrap">
              {message.body}
            </div>
          </div>
        </div>

        {/* Replies */}
        {replies.map((r) => (
          <div key={r.id} className="flex gap-4 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-[#3E4F56] flex items-center justify-center shrink-0 text-[12px] text-white font-medium">
              B
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-[#A09687] mb-2 text-right">
                {formatDateTime(r.sentAt)} · You
              </div>
              <div className="bg-[#3E4F56] rounded-lg p-5 text-[14px] text-white leading-[24px] whitespace-pre-wrap ml-8">
                {r.body}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply bar */}
      <div className="border-t border-[#EAE2D2] bg-white px-8 py-4">
        <form onSubmit={handleReply}>
          <div className="border border-[#3E4F56]/15 rounded-lg overflow-hidden focus-within:border-[#B28B5D] transition-colors">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder={`Reply to ${message.name.split(" ")[0]}…`}
              rows={3}
              className="w-full px-4 pt-3 pb-2 text-[14px] text-[#3E4F56] placeholder:text-[#A09687] focus:outline-none resize-none bg-transparent"
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <span className="text-[11px] text-[#A09687]">
                Will be sent to {message.email}
              </span>
              <button
                type="submit"
                disabled={!replyBody.trim() || sending}
                className="flex items-center gap-2 px-4 py-2 bg-[#3E4F56] text-white text-[12px] tracking-[0.1em] uppercase rounded hover:opacity-90 disabled:opacity-40"
              >
                <Send size={12} strokeWidth={1.5} />
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
          {error && <p className="mt-2 text-[12px] text-red-600">{error}</p>}
        </form>
      </div>
    </>
  );
}
