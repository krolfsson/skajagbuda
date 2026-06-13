-- AlterTable: add new columns
ALTER TABLE "PropertyAnalysis"
  ADD COLUMN IF NOT EXISTS "totalFloors"      INTEGER,
  ADD COLUMN IF NOT EXISTS "hasElevator"      BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "hasFireplace"     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "listingUrl"       TEXT;
