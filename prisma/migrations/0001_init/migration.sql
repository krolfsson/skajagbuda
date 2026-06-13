-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "PropertyAnalysis" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT,
    "area" TEXT,
    "city" TEXT,
    "askingPrice" INTEGER,
    "currentBid" INTEGER,
    "monthlyFee" INTEGER,
    "livingAreaSqm" DECIMAL(6,2),
    "rooms" DECIMAL(4,1),
    "floor" INTEGER,
    "hasBalcony" BOOLEAN NOT NULL DEFAULT false,
    "balconyDirection" TEXT,
    "associationName" TEXT,
    "associationDebtPerSqm" INTEGER,
    "associationCash" INTEGER,
    "associationAnnualFeeChangePercent" DECIMAL(5,2),
    "ownershipShare" DECIMAL(8,6),
    "plannedRenovations" TEXT,
    "upcomingPipeReplacement" BOOLEAN NOT NULL DEFAULT false,
    "pipeReplacementDetails" TEXT,
    "userMaxBudget" INTEGER,
    "userDownPayment" INTEGER,
    "userMonthlyComfortLimit" INTEGER,
    "userNotes" TEXT,
    "listingText" TEXT,
    "annualReportText" TEXT,
    "biddingText" TEXT,
    "agentInfoText" TEXT,
    "analysisStatus" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "aiScore" INTEGER,
    "aiRecommendation" TEXT,
    "aiRiskLevel" TEXT,
    "aiMaxBidSuggestion" INTEGER,
    "aiSummary" TEXT,
    "aiRawJson" JSONB,

    CONSTRAINT "PropertyAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PropertyAnalysis_analysisStatus_idx" ON "PropertyAnalysis"("analysisStatus");

-- CreateIndex
CREATE INDEX "PropertyAnalysis_createdAt_idx" ON "PropertyAnalysis"("createdAt");
