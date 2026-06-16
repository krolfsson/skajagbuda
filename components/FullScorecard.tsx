import Link from "next/link";
import type { PropertyAnalysis } from "@/app/generated/prisma/client";
import { fmtMoney } from "@/lib/report-ui";
import type { Scorecard } from "@/lib/schemas";
import { ShareButton } from "@/components/ShareButton";
import { ExportReportButton } from "@/components/ExportReportButton";
import { DownloadPdfButton } from "@/components/DownloadPdfButton";
import { DevBypassBanner } from "@/components/DevBypassBanner";
import { ScorecardReport } from "@/components/ScorecardReport";

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
  const meta = [
    analysis.rooms ? `${Number(analysis.rooms)} rok` : null,
    analysis.livingAreaSqm ? `${Number(analysis.livingAreaSqm)} kvm` : null,
    analysis.associationName ?? null,
    analysis.askingPrice ? `Utgångspris ${fmtMoney(analysis.askingPrice)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

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

        <p className="no-print full-report-page__hint">
          Rapporten sparas på denna länk. Bokmärk sidan, dela länken eller spara som PDF.
        </p>

        <div className="report-print-root">
          <ScorecardReport title={analysis.title} meta={meta} scorecard={sc} titleAs="h1" />

          <p className="print-only report-print-footer">
            Exporterad från skajagbuda.se · {fmtDate(analysis.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
