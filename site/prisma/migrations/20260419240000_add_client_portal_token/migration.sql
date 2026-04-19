-- Add portalToken to Client for tokenised self-serve portal links
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "portalToken" TEXT;
UPDATE "Client" SET "portalToken" = gen_random_uuid()::text WHERE "portalToken" IS NULL;
ALTER TABLE "Client" ALTER COLUMN "portalToken" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Client_portalToken_key" ON "Client"("portalToken");
