-- Gift vouchers table
CREATE TABLE IF NOT EXISTS "Voucher" (
  "id"                 TEXT NOT NULL,
  "code"               TEXT NOT NULL,
  "amountPence"        INTEGER NOT NULL,
  "purchaserName"      TEXT NOT NULL,
  "purchaserEmail"     TEXT NOT NULL,
  "recipientName"      TEXT NOT NULL DEFAULT '',
  "recipientEmail"     TEXT NOT NULL DEFAULT '',
  "message"            TEXT NOT NULL DEFAULT '',
  "stripeSessionId"    TEXT,
  "paid"               BOOLEAN NOT NULL DEFAULT false,
  "redeemedAt"         TIMESTAMP(3),
  "redeemedBookingRef" TEXT,
  "expiresAt"          TIMESTAMP(3) NOT NULL,
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Voucher_code_key"            ON "Voucher"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "Voucher_stripeSessionId_key" ON "Voucher"("stripeSessionId");
