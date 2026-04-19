-- Messages inbox (contact form submissions + replies)
CREATE TABLE IF NOT EXISTS "Message" (
  "id"        TEXT NOT NULL,
  "name"      TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "phone"     TEXT NOT NULL DEFAULT '',
  "body"      TEXT NOT NULL,
  "read"      BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "MessageReply" (
  "id"        TEXT NOT NULL,
  "messageId" TEXT NOT NULL,
  "body"      TEXT NOT NULL,
  "sentAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MessageReply_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MessageReply_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Message_read_idx"          ON "Message"("read");
CREATE INDEX IF NOT EXISTS "MessageReply_messageId_idx" ON "MessageReply"("messageId");
