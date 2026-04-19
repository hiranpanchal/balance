ALTER TABLE "Booking" ADD COLUMN "stripeSessionId" TEXT;
ALTER TABLE "Booking" ADD COLUMN "depositAmount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Booking" ADD COLUMN "depositPaid" BOOLEAN NOT NULL DEFAULT false;
CREATE UNIQUE INDEX "Booking_stripeSessionId_key" ON "Booking"("stripeSessionId");
