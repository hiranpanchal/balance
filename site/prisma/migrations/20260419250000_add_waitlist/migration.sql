-- Waiting list for fully-booked dates
CREATE TABLE IF NOT EXISTS "WaitlistEntry" (
  "id"         TEXT NOT NULL,
  "firstName"  TEXT NOT NULL,
  "lastName"   TEXT NOT NULL,
  "email"      TEXT NOT NULL,
  "phone"      TEXT NOT NULL DEFAULT '',
  "service"    TEXT NOT NULL DEFAULT '',
  "date"       TEXT NOT NULL,
  "notifiedAt" TIMESTAMP(3),
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "WaitlistEntry_date_idx" ON "WaitlistEntry"("date");
