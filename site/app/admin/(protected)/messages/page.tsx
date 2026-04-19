import type { Metadata } from "next";
import { db } from "@/lib/db";
import { MessageList } from "./MessageList";
import { MessageThread } from "./MessageThread";

export const metadata: Metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const messages = await db.message.findMany({
    orderBy: { createdAt: "desc" },
    include: { replies: { orderBy: { sentAt: "asc" } } },
  });

  const selectedId = searchParams.id ?? messages[0]?.id ?? null;
  const selected = messages.find((m) => m.id === selectedId) ?? null;

  // Mark as read server-side when opened
  if (selected && !selected.read) {
    await db.message.update({ where: { id: selected.id }, data: { read: true } });
    selected.read = true;
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="flex h-[calc(100vh-80px)] -m-6 md:-m-10 overflow-hidden rounded-lg shadow-sm">
      {/* Left — message list */}
      <div className="w-72 shrink-0 bg-white border-r border-[#EAE2D2] flex flex-col">
        <div className="px-5 py-4 border-b border-[#EAE2D2] flex items-center justify-between">
          <h1 className="font-serif text-[18px] text-[#3E4F56] font-normal">Messages</h1>
          {unreadCount > 0 && (
            <span className="text-[11px] bg-[#3E4F56] text-white px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="px-5 py-8 text-[13px] text-[#A09687]">No messages yet.</p>
          ) : (
            <MessageList messages={messages.map((m) => ({
              id: m.id,
              name: m.name,
              email: m.email,
              preview: m.body.slice(0, 80),
              read: m.read,
              replyCount: m.replies.length,
              createdAt: m.createdAt.toISOString(),
            }))} selectedId={selectedId} />
          )}
        </div>
      </div>

      {/* Right — thread */}
      <div className="flex-1 bg-[#FAFAF8] flex flex-col overflow-hidden">
        {selected ? (
          <MessageThread
            message={{
              id: selected.id,
              name: selected.name,
              email: selected.email,
              phone: selected.phone,
              body: selected.body,
              createdAt: selected.createdAt.toISOString(),
            }}
            replies={selected.replies.map((r) => ({
              id: r.id,
              body: r.body,
              sentAt: r.sentAt.toISOString(),
            }))}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#A09687] text-[14px]">
            Select a message to read it
          </div>
        )}
      </div>
    </div>
  );
}
