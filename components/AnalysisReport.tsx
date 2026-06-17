import type { ReactNode } from "react";
import Link from "next/link";
import { summaryToBullets } from "@/lib/format-summary";
import { CTA_START_ANALYSIS_ARROW } from "@/lib/brand";
import {
  CATEGORY_HINTS,
  CATEGORY_LABELS,
  deriveConclusion,
  deriveConclusionBox,
  deriveDecisionSummary,
  deriveNextSteps,
  deriveRiskExplanation,
  deriveScoreInterpretation,
  deriveScoreSubtext,
  deriveWalkAwayAmount,
  fmtMoney,
  normalizeBid,
} from "@/lib/report-ui";
import type { Scorecard } from "@/lib/schemas";
import { REC_COLORS, RISK_DOT, BRAND, scoreBarColor } from "@/lib/ui-colors";
import { CATEGORY_ICONS, PreviewIcon } from "@/components/preview/PreviewIcon";

function truncateLine(text: string, max = 100): string {
  const cleaned = text.replace(/^[-•*]\s+/, "").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trim()}…`;
}

function limitItems(items: string[], max: number, maxLen = 100): string[] {
  return items.slice(0, max).map((item) => truncateLine(item, maxLen));
}

function ReportPanel({
  label,
  icon,
  tone,
  children,
  className = "",
}: {
  label: string;
  icon?: ReactNode;
  tone?: "neutral" | "good" | "caution" | "danger";
  children: ReactNode;
  className?: string;
}) {
  const toneClass = tone ? ` analysis-preview__card--${tone}` : "";
  return (
    <div className={`analysis-preview__card${toneClass} ${className}`.trim()}>
      <div className="analysis-preview__card-head">
        {icon && <span className="analysis-preview__card-icon">{icon}</span>}
        <p className="analysis-preview__label">{label}</p>
      </div>
      {children}
    </div>
  );
}

function ReportList({
  items,
  variant,
}: {
  items: string[];
  variant: "good" | "caution" | "danger";
}) {
  const iconName = variant === "good" ? "check" : variant === "caution" ? "minus" : "flag";
  return (
    <ul className={`analysis-preview__list analysis-preview__list--${variant}`}>
      {items.map((item) => (
        <li key={item}>
          <PreviewIcon name={iconName} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export type AnalysisReportProps = {
  title: string;
  meta: string;
  scorecard: Scorecard;
  eyebrow?: string;
  titleAs?: "h1" | "h2" | "h3";
  conclusionLine?: string;
  footer?: "landing" | "none";
  /** Tighter layout and capped list lengths — for homepage preview. */
  compact?: boolean;
};

export function AnalysisReport({
  title,
  meta,
  scorecard: sc,
  eyebrow,
  titleAs: TitleTag = "h2",
  conclusionLine,
  footer = "none",
  compact = false,
}: AnalysisReportProps) {
  const rec = REC_COLORS[sc.recommendation] ?? REC_COLORS["Buda försiktigt"];
  const riskDot = RISK_DOT[sc.riskLevel] ?? BRAND.caution;
  const conclusion = conclusionLine ?? deriveConclusion(sc);
  const conclusionBox = deriveConclusionBox(sc);
  const decisionSummary = deriveDecisionSummary(sc);
  const nextSteps = deriveNextSteps(sc);
  const walkAwayAmount = deriveWalkAwayAmount(sc);
  const hasRedFlags = sc.redFlags.length > 0;
  const listCap = compact ? 4 : 999;
  const lineCap = compact ? 88 : 999;
  const strengths = compact ? limitItems(sc.strengths, listCap, lineCap) : sc.strengths;
  const weaknesses = compact ? limitItems(sc.weaknesses, listCap, lineCap) : sc.weaknesses;
  const redFlags = compact ? limitItems(sc.redFlags, listCap, lineCap) : sc.redFlags;
  const steps = compact ? nextSteps.slice(0, 4) : nextSteps;
  const questions = compact ? sc.questionsToAsk.slice(0, 4) : sc.questionsToAsk;
  const summaryBullets = compact
    ? summaryToBullets(sc.summary).slice(0, 4).map((p) => truncateLine(p, 120))
    : summaryToBullets(sc.summary);
  const displayConclusion = compact
    ? truncateLine(conclusionBox, 280)
    : conclusionBox;
  const displayDecisionSummary = compact
    ? truncateLine(decisionSummary, 220)
    : decisionSummary;
  const bidText = (text: string) => (compact ? truncateLine(text, 140) : text);

  return (
    <div className={`analysis-preview${compact ? " analysis-preview--compact" : ""}`}>
      <div className="analysis-preview__object">
        {eyebrow && <p className="analysis-preview__eyebrow">{eyebrow}</p>}
        <TitleTag className="analysis-preview__title">{title}</TitleTag>
        {meta && <p className="analysis-preview__meta">{meta}</p>}
      </div>

      <div className="analysis-preview__layout">
        <ReportPanel
          label="Slutsats"
          icon={<PreviewIcon name="conclusion" />}
          tone="neutral"
          className="analysis-preview__span-12"
        >
          <p className="analysis-preview__conclusion">{displayConclusion}</p>
        </ReportPanel>

        <ReportPanel
          label="Total score"
          tone="neutral"
          className="analysis-preview__span-4 analysis-preview__score-card analysis-preview__pair-card"
        >
          <div className="analysis-preview__score-row">
            <span className="analysis-preview__score-value">{sc.score}</span>
            <span className="analysis-preview__score-max">/ 100</span>
          </div>
          <p className="analysis-preview__score-label">{deriveScoreInterpretation(sc)}</p>
          <p className="analysis-preview__score-sub">
            {compact ? truncateLine(deriveScoreSubtext(sc), 90) : deriveScoreSubtext(sc)}
          </p>
          <div className="analysis-preview__metrics">
            <div>
              <p className="analysis-preview__metric-label">Rekommendation</p>
              <span
                className="analysis-preview__rec-badge"
                style={{ color: rec.text, background: rec.bg, borderColor: rec.border }}
              >
                {sc.recommendation}
              </span>
            </div>
            <div>
              <p className="analysis-preview__metric-label">Risknivå</p>
              <div className="analysis-preview__risk">
                <span className="analysis-preview__risk-dot" style={{ background: riskDot }} />
                <span style={{ color: riskDot }}>{sc.riskLevel}</span>
              </div>
              <p className="analysis-preview__metric-hint">
                {compact ? truncateLine(deriveRiskExplanation(sc), 95) : deriveRiskExplanation(sc)}
              </p>
            </div>
            {sc.maxBidSuggestion && (
              <div>
                <p className="analysis-preview__metric-label">Rekommenderat maxbud</p>
                <p className="analysis-preview__maxbid">{fmtMoney(normalizeBid(sc.maxBidSuggestion))}</p>
              </div>
            )}
          </div>
        </ReportPanel>

        <ReportPanel
          label="Nästa steg innan bud"
          icon={<PreviewIcon name="steps" />}
          tone="neutral"
          className="analysis-preview__span-8 analysis-preview__pair-card"
        >
          <ul className="analysis-preview__steps">
            {steps.map((step) => (
              <li key={step}>{compact ? truncateLine(step, 100) : step}</li>
            ))}
          </ul>
        </ReportPanel>

        <ReportPanel
          label="Styrkor"
          icon={<PreviewIcon name="check" />}
          tone="good"
          className="analysis-preview__span-4 analysis-preview__tri-card"
        >
          <ReportList items={strengths} variant="good" />
        </ReportPanel>

        <ReportPanel
          label="Svagheter"
          icon={<PreviewIcon name="minus" />}
          tone="caution"
          className="analysis-preview__span-4 analysis-preview__tri-card"
        >
          {weaknesses.length > 0 ? (
            <ReportList items={weaknesses} variant="caution" />
          ) : (
            <p className="analysis-preview__empty">Inga tydliga svagheter identifierade utifrån underlaget.</p>
          )}
        </ReportPanel>

        <ReportPanel
          label={hasRedFlags ? "Röda flaggor" : "Inga tydliga röda flaggor hittades"}
          icon={<PreviewIcon name="flag" />}
          tone={hasRedFlags ? "danger" : "good"}
          className="analysis-preview__span-4 analysis-preview__redflags-card analysis-preview__tri-card"
        >
          {hasRedFlags ? (
            <ReportList items={redFlags} variant="danger" />
          ) : (
            <p className="analysis-preview__empty">
              Kontrollera ändå budhistorik, underhållsplan och eventuella kommande avgiftshöjningar innan du går
              vidare.
            </p>
          )}
        </ReportPanel>

        <ReportPanel label="Kort sammanfattning" tone="neutral" className="analysis-preview__span-12">
          <p className="analysis-preview__body">{displayDecisionSummary}</p>
        </ReportPanel>

        <ReportPanel
          label="Kategoripoäng"
          icon={<PreviewIcon name="chart" />}
          tone="neutral"
          className="analysis-preview__span-12"
        >
          <p className="analysis-preview__cat-hint">Högre poäng är bättre inom varje område.</p>
          <div className="analysis-preview__cats">
            {Object.entries(sc.categoryScores)
              .filter(([key]) => key in CATEGORY_LABELS)
              .map(([key, val]) => (
                <div key={key} className="analysis-preview__cat-row">
                  <span className="analysis-preview__cat-icon">
                    <PreviewIcon name={CATEGORY_ICONS[key] ?? "chart"} />
                  </span>
                  <div className="analysis-preview__cat-copy">
                    <span className="analysis-preview__cat-name">{CATEGORY_LABELS[key]}</span>
                    <span className="analysis-preview__cat-helper">{CATEGORY_HINTS[key]}</span>
                  </div>
                  <div className="analysis-preview__cat-bar">
                    <div
                      className="analysis-preview__cat-fill"
                      style={{ width: `${val}%`, background: scoreBarColor(val) }}
                    />
                  </div>
                  <span className="analysis-preview__cat-num">{val}</span>
                </div>
              ))}
          </div>
        </ReportPanel>

        {questions.length > 0 && (
          <ReportPanel
            label="Frågor att ställa föreningen / mäklaren"
            icon={<PreviewIcon name="steps" />}
            tone="neutral"
            className="analysis-preview__span-12 analysis-preview__questions-card"
          >
            <ul className="analysis-preview__questions">
              {questions.map((q) => (
                <li key={q}>{compact ? truncateLine(q, 110) : q}</li>
              ))}
            </ul>
          </ReportPanel>
        )}

        <ReportPanel label="Budstrategi" tone="neutral" className="analysis-preview__span-12">
          <div className="analysis-preview__bid-grid">
            <div>
              <p className="analysis-preview__bid-label">Öppningsbud</p>
              <p className="analysis-preview__body">{bidText(sc.bidStrategy.openingMove)}</p>
            </div>
            <div>
              <p className="analysis-preview__bid-label">Nästa steg</p>
              <p className="analysis-preview__body">{bidText(sc.bidStrategy.nextStep)}</p>
            </div>
            <div className="analysis-preview__bid-walkaway">
              <p className="analysis-preview__bid-label">Gå inte över</p>
              {walkAwayAmount && <p className="analysis-preview__walkaway-amount">{walkAwayAmount}</p>}
              <p className="analysis-preview__body">{bidText(sc.bidStrategy.walkAwayPoint)}</p>
            </div>
            <div>
              <p className="analysis-preview__bid-label">Strategi</p>
              <p className="analysis-preview__body">{bidText(sc.bidStrategy.negotiationNotes)}</p>
            </div>
          </div>
        </ReportPanel>

        <ReportPanel label="Sammanfattning" tone="neutral" className="analysis-preview__span-12">
          <p className="analysis-preview__body analysis-preview__body--lead">
            <strong>Kort slutsats:</strong>{" "}
            {compact ? truncateLine(conclusionLine ?? conclusion, 120) : conclusion}
          </p>
          <ul className="analysis-preview__summary-bullets">
            {summaryBullets.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </ReportPanel>

        <div className="analysis-preview__disclaimer analysis-preview__span-12">{sc.disclaimer}</div>

        {footer === "landing" && (
          <div className="analysis-preview__cta analysis-preview__span-12">
            <Link href="/new" className="analysis-preview__cta-primary">
              {CTA_START_ANALYSIS_ARROW}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
