-- CreateEnum
CREATE TYPE "FreeAnalysisStatus" AS ENUM ('NOT_STARTED', 'RUNNING', 'COMPLETED', 'FAILED');
CREATE TYPE "FullAnalysisStatus" AS ENUM ('LOCKED', 'RUNNING', 'COMPLETED', 'FAILED');
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "PropertyAnalysis" ADD COLUMN "freeAnalysisStatus" "FreeAnalysisStatus" NOT NULL DEFAULT 'NOT_STARTED';
ALTER TABLE "PropertyAnalysis" ADD COLUMN "freeRiskLevel" TEXT;
ALTER TABLE "PropertyAnalysis" ADD COLUMN "freeRawJson" JSONB;
ALTER TABLE "PropertyAnalysis" ADD COLUMN "fullAnalysisStatus" "FullAnalysisStatus" NOT NULL DEFAULT 'LOCKED';
ALTER TABLE "PropertyAnalysis" ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
ALTER TABLE "PropertyAnalysis" ADD COLUMN "analysisUnlocked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PropertyAnalysis" ADD COLUMN "stripeCheckoutSessionId" TEXT;
ALTER TABLE "PropertyAnalysis" ADD COLUMN "stripePaymentIntentId" TEXT;

-- CreateIndex
CREATE INDEX "PropertyAnalysis_paymentStatus_idx" ON "PropertyAnalysis"("paymentStatus");
