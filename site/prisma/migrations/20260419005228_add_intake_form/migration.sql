-- CreateTable
CREATE TABLE "IntakeForm" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "dateOfBirth" TEXT NOT NULL DEFAULT '',
    "occupation" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "emergencyName" TEXT NOT NULL DEFAULT '',
    "emergencyPhone" TEXT NOT NULL DEFAULT '',
    "conditions" JSONB NOT NULL DEFAULT '[]',
    "medications" TEXT NOT NULL DEFAULT '',
    "allergies" TEXT NOT NULL DEFAULT '',
    "recentInjury" TEXT NOT NULL DEFAULT '',
    "isPregnant" BOOLEAN NOT NULL DEFAULT false,
    "painAreas" JSONB NOT NULL DEFAULT '[]',
    "painNotes" TEXT NOT NULL DEFAULT '',
    "previousMassage" BOOLEAN NOT NULL DEFAULT false,
    "massageFrequency" TEXT NOT NULL DEFAULT '',
    "pressurePreference" TEXT NOT NULL DEFAULT 'medium',
    "areasToAvoid" TEXT NOT NULL DEFAULT '',
    "goals" TEXT NOT NULL DEFAULT '',
    "consentName" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntakeForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntakeForm_clientId_key" ON "IntakeForm"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "IntakeForm_token_key" ON "IntakeForm"("token");

-- AddForeignKey
ALTER TABLE "IntakeForm" ADD CONSTRAINT "IntakeForm_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
