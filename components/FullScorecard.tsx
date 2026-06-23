import Link from "next/link";
import type { PropertyAnalysis } from "@/app/generated/prisma/client";
import type { Scorecard } from "@/lib/schemas";
import { reportObjectInfoFromAnalysis, formatObjectMeta } from "@/lib/report-object-info";
import { ShareButton } from "@/components/ShareButton";
import { ExportReportButton } from "@/components/ExportReportButton";
import { DownloadPdfButton } from "@/components/DownloadPdfButton";
import { DevBypassBanner } from "@/components/DevBypassBanner";
import { FullAnalysisReport } from "@/components/FullAnalysisReport";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(d));
}

export function FullScorecard({
  analysis,
  scorecard: sc,
  devBypass = false,
}: {
  analysis: PropertyAnalysis;
  scorecard: Scorecard;
  devBypass?: boolean;
}) {
  const objectInfo = reportObjectInfoFromAnalysis(analysis);
  const meta = formatObjectMeta(objectInfo);

  return (
    <div className="full-report-page">
      <div className="full-report-page__inner">
        {devBypass && <DevBypassBanner />}

        <div className="no-print full-report-page__toolbar">
          <Link href="/new" className="full-report-page__back">
            ← Tillbaka till analyser
          </Link>
          <div className="full-report-page__actions">
            <DownloadPdfButton title={analysis.title} />
            <ExportReportButton title={analysis.title} meta={meta || null} scorecard={sc} />
            <ShareButton
              title={analysis.title}
              text={`Bostadsanalys: ${analysis.title} — ${sc.recommendation}, score ${sc.score}/100`}
            />
          </div>
        </div>

        <div className="report-print-root">
          <div className="analysis-report-shell analysis-report-shell--full">
            <FullAnalysisReport
              objectInfo={objectInfo}
              scorecard={sc}
              showBetaBadge
              showFooterCta={false}
            />
          </div>

          <p className="print-only report-print-footer">
            Exporterad från skajagbuda.se · {fmtDate(analysis.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
