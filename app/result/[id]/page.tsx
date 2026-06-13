import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isDevPaymentBypassEnabled } from "@/lib/dev-bypass";
import {
  resolveScorecardForAnalysis,
  scorecardNeedsRiskSync,
} from "@/lib/risk-level";
import { FreeResultShell } from "@/components/FreeResultView";
import { PaymentVerifier, AnalysisLoader } from "@/components/PaymentFlow";
import { FullScorecard } from "@/components/FullScorecard";
import { DevBypassBanner } from "@/components/DevBypassBanner";

export default async function ResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const sessionId = sp.session_id;

  const analysis = await prisma.propertyAnalysis.findUnique({ where: { id } });
  if (!analysis) notFound();

  const paymentVerifier = sessionId ? (
    <PaymentVerifier analysisId={id} sessionId={sessionId} />
  ) : null;

  const devBypass = isDevPaymentBypassEnabled();
  const isUnlocked =
    devBypass || (analysis.paymentStatus === "PAID" && analysis.analysisUnlocked);

  const scorecard = resolveScorecardForAnalysis(analysis);
  const isComplete =
    analysis.fullAnalysisStatus === "COMPLETED" && scorecard != null;

  if (isComplete && scorecard && scorecardNeedsRiskSync(analysis)) {
    await prisma.propertyAnalysis.update({
      where: { id },
      data: {
        aiRawJson: scorecard as object,
        aiRiskLevel: scorecard.riskLevel,
        freeRiskLevel: scorecard.riskLevel,
      },
    });
  }

  // ── Analysis in progress ────────────────────────────────────────────────────
  if (analysis.fullAnalysisStatus === "RUNNING") {
    return (
      <>
        {paymentVerifier}
        <AnalysisLoader analysisId={id} passive />
      </>
    );
  }

  // ── Analysis failed ─────────────────────────────────────────────────────────
  if (analysis.fullAnalysisStatus === "FAILED") {
    return (
      <>
        {paymentVerifier}
        <div style={{ padding: "80px 24px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "var(--danger)", marginBottom: "8px" }}>
            Analysen misslyckades
          </p>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "20px" }}>
            Kontrollera AI_API_KEY och försök igen.
          </p>
          <AnalysisLoader analysisId={id} manual />
        </div>
      </>
    );
  }

  // ── Analysis not started (legacy or interrupted) ───────────────────────────
  if (!isComplete) {
    return (
      <>
        {paymentVerifier}
        <AnalysisLoader analysisId={id} />
      </>
    );
  }

  // ── Unlocked: full report from same scorecard ───────────────────────────────
  if (isUnlocked) {
    return (
      <>
        {paymentVerifier}
        <FullScorecard analysis={analysis} scorecard={scorecard!} devBypass={devBypass} />
      </>
    );
  }

  // ── Locked: show risk from same scorecard ───────────────────────────────────
  return (
    <>
      {paymentVerifier}
      <FreeResultShell
        title={analysis.title}
        riskLevel={scorecard!.riskLevel}
        analysisId={id}
      />
    </>
  );
}
