DO $$ BEGIN
  CREATE TYPE "ClientGrade" AS ENUM ('NEW', 'REGULAR');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "grade" "ClientGrade" NOT NULL DEFAULT 'NEW';
