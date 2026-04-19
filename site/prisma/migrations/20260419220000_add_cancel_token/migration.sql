-- Add cancelToken to Booking for self-serve cancellation links
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "cancelToken" TEXT;
UPDATE "Booking" SET "cancelToken" = gen_random_uuid()::text WHERE "cancelToken" IS NULL;
ALTER TABLE "Booking" ALTER COLUMN "cancelToken" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Booking_cancelToken_key" ON "Booking"("cancelToken");
