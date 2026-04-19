"use client";

import { useRouter } from "next/navigation";

interface MessageSummary {
  id: string;
  name: string;
  email: string;
  preview: string;
  read: boolean;
  replyCount: number;
  createdAt: string;
}

export function MessageList({
  messages,
  selectedId,
}: {
  messages: MessageSummary[];
  selectedId: string | null;
}) {
  const router = useRouter();

  return (
    <ul>
      {messages.map((m) => {
        const isSelected = m.id === selectedId;
        const date = new Date(m.createdAt);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const dateLabel = isToday
          ? date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
          : date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

        return (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => router.push(`/admin/messages?id=${m.id}`)}
              className={`w-full text-left px-5 py-4 border-b border-[#EAE2D2] transition-colors ${
                isSelected
                  ? "bg-[#F5F0E6]"
                  : "hover:bg-[#FAF8F4]"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {!m.read && (
                    <span className="shrink-0 w-2 h-2 rounded-full bg-[#B28B5D]" />
                  )}
                  <span className={`text-[13px] truncate ${!m.read ? "font-semibold text-[#3E4F56]" : "text-[#3E4F56]"}`}>
                    {m.name}
                  </span>
                </div>
                <span className="shrink-0 text-[11px] text-[#A09687]">{dateLabel}</span>
              </div>
              <p className="text-[12px] text-[#A09687] truncate pl-4">
                {m.preview}{m.preview.length >= 80 ? "…" : ""}
              </p>
              {m.replyCount > 0 && (
                <p className="text-[11px] text-[#B28B5D] mt-1 pl-4">
                  {m.replyCount} {m.replyCount === 1 ? "reply" : "replies"}
                </p>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
