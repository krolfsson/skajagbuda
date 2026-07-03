-- CreateEnum
CREATE TYPE "FeedbackValue" AS ENUM ('YES', 'PARTIAL', 'NO');

-- CreateTable
CREATE TABLE "AnalysisFeedback" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analysisId" TEXT NOT NULL,
    "value" "FeedbackValue" NOT NULL,
    "comment" TEXT,
    "objectAddress" TEXT,
    "score" INTEGER,
    "riskLevel" TEXT,
    "uncertaintyLevel" TEXT,

    CONSTRAINT "AnalysisFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalysisFeedback_analysisId_idx" ON "AnalysisFeedback"("analysisId");

-- CreateIndex
CREATE INDEX "AnalysisFeedback_createdAt_idx" ON "AnalysisFeedback"("createdAt");

-- AddForeignKey
ALTER TABLE "AnalysisFeedback" ADD CONSTRAINT "AnalysisFeedback_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "PropertyAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
