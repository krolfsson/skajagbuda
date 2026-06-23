"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { CTA_START_ANALYSIS_ARROW } from "@/lib/brand";
import type { ReportObjectInfo } from "@/lib/report-object-info";
import { formatObjectMeta } from "@/lib/report-object-info";
import {
  deriveBudgetNote,
  deriveConclusionBox,
  deriveNextSteps,
  deriveRiskExplanation,
  deriveScoreInterpretation,
  deriveWalkAwayAmount,
  fmtMoney,
  fmtPricePerSqm,
  fmtPricePerSqmRange,
  normalizeBid,
} from "@/lib/report-ui";
import type { Scorecard } from "@/lib/schemas";
import { REC_COLORS, RISK_DOT, BRAND } from "@/lib/ui-colors";
import { PreviewIcon } from "@/components/preview/PreviewIcon";

const PREVIEW_LIMIT = 3;
const LIST_LIMIT = 5;

function FarCard({
  children,
  className = "",
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "good" | "caution" | "danger" | "conclusion";
}) {
  return <div className={`far-card far-card--${tone} ${className}`.trim()}>{children}</div>;
}

function FarSectionTitle({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="far-section-title">
      {icon && <span className="far-section-title__icon">{icon}</span>}
      <h2 className="far-section-title__text">{children}</h2>
    </div>
  );
}

function FarList({
  items,
  variant = "neutral",
}: {
  items: string[];
  variant?: "neutral" | "good" | "caution" | "danger";
}) {
  const icon =
    variant === "good" ? "check" : variant === "caution" ? "minus" : variant === "danger" ? "flag" : "steps";
  return (
    <ul className={`far-list far-list--${variant}`}>
      {items.map((item) => (
        <li key={item}>
          <PreviewIcon name={icon} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ExpandLink({ expanded, onClick, label }: { expanded: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" className="far-expand-link no-print" onClick={onClick}>
      {expanded ? "Visa färre" : label}
    </button>
  );
}

function ComparableCard({ comp, askingPrice }: { comp: Scorecard["comparisonObjects"][number]; askingPrice: number | null }) {
  const sold = comp.soldPrice ? normalizeBid(comp.soldPrice) : null;
  const ppm = comp.pricePerSqm ?? (sold && comp.sqm ? Math.round(sold / comp.sqm) : null);
  let deltaNote = comp.comment;
  if (!deltaNote && sold && askingPrice && askingPrice > 0) {
    const pct = Math.round(((sold - askingPrice) / askingPrice) * 100);
    deltaNote = pct === 0 ? "I linje med utgångspris" : `${pct > 0 ? "+" : ""}${pct} % mot utgångspris`;
  }

  return (
    <article className={`far-comp-card${comp.isSameAddress ? " far-comp-card--same-address" : ""}`}>
      {comp.soldDate && <p className="far-comp-card__status">Såld {comp.soldDate}</p>}
      {comp.isSameAddress && <p className="far-comp-card__badge">Samma adress</p>}
      <p className="far-comp-card__address">{comp.address}</p>
      <p className="far-comp-card__meta">
        {[comp.sqm ? `${comp.sqm} kvm` : null, sold ? fmtMoney(sold) : null].filter(Boolean).join(" · ")}
      </p>
      {ppm && <p className="far-comp-card__ppm">{new Intl.NumberFormat("sv-SE").format(ppm)} kr/kvm</p>}
      {deltaNote && <p className="far-comp-card__note">{deltaNote}</p>}
    </article>
  );
}

function BidScale({
  askingPrice,
  fairLow,
  fairHigh,
  ceiling,
  budget,
  walkAway,
}: {
  askingPrice: number | null;
  fairLow: number | null;
  fairHigh: number | null;
  ceiling: number | null;
  budget: number | null;
  walkAway: number | null;
}) {
  const values = [askingPrice, fairLow, fairHigh, ceiling, budget, walkAway]
    .filter((v): v is number => v != null && v > 0)
    .map(normalizeBid);
  if (values.length < 2) return null;

  const min = Math.min(...values) * 0.95;
  const max = Math.max(...values) * 1.05;
  const span = max - min || 1;
  const pos = (v: number | null) => (v ? `${Math.min(100, Math.max(0, ((normalizeBid(v) - min) / span) * 100))}%` : null);

  const fairStart = fairLow ? pos(fairLow) : null;
  const fairEnd = fairHigh ? pos(fairHigh) : fairStart;

  return (
    <div className="far-bid-scale">
      <div className="far-bid-scale__track">
        <div className="far-bid-scale__zone far-bid-scale__zone--low" style={{ width: fairStart ?? "33%" }} />
        <div
          className="far-bid-scale__zone far-bid-scale__zone--fair"
          style={{
            left: fairStart ?? "20%",
            width: fairStart && fairEnd ? `calc(${fairEnd} - ${fairStart})` : "40%",
          }}
        />
        <div className="far-bid-scale__zone far-bid-scale__zone--high" style={{ left: fairEnd ?? "60%", right: 0 }} />
        {ceiling && (
          <span className="far-bid-scale__marker far-bid-scale__marker--ceiling" style={{ left: pos(ceiling)! }} title="Rekommenderat budtak" />
        )}
        {budget && (
          <span className="far-bid-scale__marker far-bid-scale__marker--budget" style={{ left: pos(budget)! }} title="Din maxbudget" />
        )}
      </div>
      <div className="far-bid-scale__labels">
        <span>Lägre bud</span>
        <span>Rimligt intervall</span>
        <span>Överpris</span>
      </div>
    </div>
  );
}

export type FullAnalysisReportProps = {
  objectInfo: ReportObjectInfo;
  scorecard: Scorecard;
  conclusionLine?: string;
  showBetaBadge?: boolean;
  showFooterCta?: boolean;
};

export function FullAnalysisReport({
  objectInfo,
  scorecard: sc,
  conclusionLine,
  showBetaBadge = true,
  showFooterCta = true,
}: FullAnalysisReportProps) {
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [showAllComps, setShowAllComps] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const rec = REC_COLORS[sc.recommendation] ?? REC_COLORS["Buda försiktigt"];
  const riskDot = RISK_DOT[sc.riskLevel] ?? BRAND.caution;
  const sqm = objectInfo.sqm;
  const budget = objectInfo.userMaxBudget ?? sc.budgetContext.userMaxBudget ?? null;
  const intervals = sc.bidIntervals;
  const fairLow = intervals.fairValueLow ?? sc.priceAnalysis.estimatedFairRangeLow;
  const fairHigh = intervals.fairValueHigh ?? sc.priceAnalysis.estimatedFairRangeHigh;
  const ceiling = intervals.recommendedCeiling ?? sc.maxBidSuggestion;
  const stretch = intervals.stretchLevel;
  const walkAway = intervals.walkAwayLevel;
  const ceilingLow = fairLow ?? (ceiling ? ceiling - 250_000 : null);
  const ceilingHigh = ceiling ?? stretch ?? fairHigh;

  const conclusion = conclusionLine ?? deriveConclusionBox(sc);
  const nextSteps = deriveNextSteps(sc);
  const visibleSteps = showAllSteps ? nextSteps : nextSteps.slice(0, PREVIEW_LIMIT);
  const hasRedFlags = sc.redFlags.length > 0;
  const comps = sc.comparisonObjects;
  const visibleComps = showAllComps ? comps : comps.slice(0, PREVIEW_LIMIT);
  const visibleQuestions = showAllQuestions ? sc.questionsToAsk : sc.questionsToAsk.slice(0, PREVIEW_LIMIT);
  const budgetNote = deriveBudgetNote(sc, budget);
  const walkAwayAmount = deriveWalkAwayAmount(sc);

  const strengths = sc.strengths.slice(0, 6);
  const weaknesses = sc.weaknesses.slice(0, 6);
  const redFlags = sc.redFlags.slice(0, 6);
  const holdBack = sc.bidArguments.holdBack.slice(0, 6);
  const premium = sc.bidArguments.premiumJustification.slice(0, 6);

  const associationMetrics = [
    {
      label: "Låneskuld/kvm",
      value: objectInfo.associationDebtPerSqm
        ? `${new Intl.NumberFormat("sv-SE").format(objectInfo.associationDebtPerSqm)} kr`
        : "–",
    },
    {
      label: "Avg.förändring",
      value: objectInfo.associationAnnualFeeChangePercent != null
        ? `${objectInfo.associationAnnualFeeChangePercent} %`
        : "–",
    },
    {
      label: "Kassa",
      value: objectInfo.associationCash ? fmtMoney(objectInfo.associationCash) : "–",
    },
    {
      label: "Avgift/mån",
      value: objectInfo.monthlyFee ? fmtMoney(objectInfo.monthlyFee) : "–",
    },
    {
      label: "Avgift/kvm",
      value: objectInfo.monthlyFee && sqm ? `${Math.round(objectInfo.monthlyFee / sqm)} kr` : "–",
    },
  ];

  const meta = formatObjectMeta(objectInfo);

  return (
    <div className="far">
      {/* Header */}
      <header className="far-header far-section far-section--header">
        <div className="far-header__main">
          {showBetaBadge && <span className="far-beta-badge">Gratis beta</span>}
          <h1 className="far-header__title">{objectInfo.address ?? objectInfo.title}</h1>
          <p className="far-header__meta">{meta}</p>
        </div>
      </header>

      <div className="far-layout">
        <div className="far-main">
          {/* 1. Slutsats */}
          <section className="far-section far-section--conclusion">
            <FarCard tone="conclusion">
              <FarSectionTitle icon={<PreviewIcon name="conclusion" />}>Slutsats</FarSectionTitle>
              <p className="far-conclusion-text">{conclusion}</p>
            </FarCard>
          </section>

          {/* 2. Budintervall + 4. Nästa steg (side by side on desktop) */}
          <section className="far-section far-section--bid-row">
            <div className="far-bid-row">
              <FarCard className="far-bid-row__interval">
                <FarSectionTitle icon={<PreviewIcon name="price" />}>Rekommenderat budintervall</FarSectionTitle>

                <div className="far-bid-cards">
                  <div className="far-bid-card">
                    <p className="far-bid-card__label">Rimligt värde</p>
                    <p className="far-bid-card__value">
                      {fairLow && fairHigh
                        ? `${fmtMoney(normalizeBid(fairLow))} – ${fmtMoney(normalizeBid(fairHigh))}`
                        : fairLow
                          ? fmtMoney(normalizeBid(fairLow))
                          : "–"}
                    </p>
                    <p className="far-bid-card__sub">{fmtPricePerSqmRange(fairLow, fairHigh, sqm)}</p>
                  </div>

                  <div className="far-bid-card far-bid-card--primary">
                    <p className="far-bid-card__label">Rekommenderat budtak</p>
                    <p className="far-bid-card__value">
                      {ceilingLow && ceilingHigh
                        ? `${fmtMoney(normalizeBid(ceilingLow))} – ${fmtMoney(normalizeBid(ceilingHigh))}`
                        : ceiling
                          ? fmtMoney(normalizeBid(ceiling))
                          : "–"}
                    </p>
                    <p className="far-bid-card__sub">{fmtPricePerSqmRange(ceilingLow, ceilingHigh, sqm)}</p>
                  </div>

                  <div className="far-bid-card">
                    <p className="far-bid-card__label">
                      Din maxbudget
                      <span className="far-bid-card__edit" title="Angiven i formuläret">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M11 2l3 3L5 14H2v-3L11 2z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </p>
                    <p className="far-bid-card__value">{budget ? fmtMoney(normalizeBid(budget)) : "Ej angiven"}</p>
                    <p className="far-bid-card__sub">{budget ? fmtPricePerSqm(budget, sqm) : "–"}</p>
                  </div>
                </div>

                <BidScale
                  askingPrice={objectInfo.askingPrice}
                  fairLow={fairLow}
                  fairHigh={fairHigh}
                  ceiling={ceiling}
                  budget={budget}
                  walkAway={walkAway}
                />

                <p className="far-bid-footnote">
                  Intervallet baseras på jämförelser, föreningens ekonomi och marknadsläget just nu.
                </p>
                {budget && <p className="far-budget-note">{budgetNote}</p>}
                {intervals.uncertaintyNote && (
                  <p className="far-bid-uncertainty">{intervals.uncertaintyNote}</p>
                )}
              </FarCard>

              <FarCard className="far-bid-row__steps">
                <FarSectionTitle icon={<PreviewIcon name="steps" />}>Nästa steg innan bud</FarSectionTitle>
                <FarList items={visibleSteps} />
                {nextSteps.length > PREVIEW_LIMIT && (
                  <ExpandLink
                    expanded={showAllSteps}
                    onClick={() => setShowAllSteps((v) => !v)}
                    label="Visa alla steg →"
                  />
                )}
              </FarCard>
            </div>
          </section>

          {/* 5. Prisbild */}
          <section className="far-section far-section--price">
            <FarCard>
              <FarSectionTitle icon={<PreviewIcon name="chart" />}>Prisbild och jämförelse</FarSectionTitle>
              <p className="far-price-verdict">
                Bedömning: <strong>{sc.priceAnalysis.verdict}</strong> — {sc.priceAnalysis.conclusion}
              </p>

              {comps.length > 0 ? (
                <>
                  <div className="far-comp-grid">
                    {visibleComps.map((comp) => (
                      <ComparableCard key={comp.address + (comp.soldDate ?? "")} comp={comp} askingPrice={objectInfo.askingPrice} />
                    ))}
                  </div>
                  {comps.length > PREVIEW_LIMIT && (
                    <ExpandLink
                      expanded={showAllComps}
                      onClick={() => setShowAllComps((v) => !v)}
                      label="Visa alla jämförelser →"
                    />
                  )}
                </>
              ) : (
                <div className="far-empty">
                  <p>
                    Vi hittade inga säkra jämförelseobjekt i underlaget. Prisbedömningen baseras därför på
                    objektets data, pris/kvm och föreningsrisk.
                  </p>
                  {sc.priceAnalysis.missingComparablesNote && (
                    <p className="far-empty__sub">{sc.priceAnalysis.missingComparablesNote}</p>
                  )}
                </div>
              )}

              <div className="far-price-details">
                <p><strong>Utgångspris:</strong> {sc.priceAnalysis.askingPriceNote}</p>
                <p><strong>Pris/kvm:</strong> {sc.priceAnalysis.pricePerSqmNote}</p>
                <p><strong>Område:</strong> {sc.priceAnalysis.areaComparison}</p>
              </div>
            </FarCard>
          </section>

          {/* 6. Tri cards */}
          <div className="far-tri-row">
          <section className="far-section far-section--redflags">
            <FarCard tone={hasRedFlags ? "danger" : "good"}>
              <FarSectionTitle icon={<PreviewIcon name="flag" />}>
                {hasRedFlags ? "Röda flaggor" : "Inga tydliga röda flaggor hittades"}
              </FarSectionTitle>
              {hasRedFlags ? (
                <FarList items={redFlags} variant="danger" />
              ) : (
                <p className="far-empty-inline">
                  Kontrollera ändå budhistorik, underhållsplan och eventuella kommande avgiftshöjningar.
                </p>
              )}
            </FarCard>
          </section>

          <section className="far-section far-section--strengths">
            <FarCard tone="good">
              <FarSectionTitle icon={<PreviewIcon name="check" />}>Styrkor</FarSectionTitle>
              <FarList items={strengths} variant="good" />
            </FarCard>
          </section>

          <section className="far-section far-section--weaknesses">
            <FarCard tone="caution">
              <FarSectionTitle icon={<PreviewIcon name="minus" />}>Svagheter</FarSectionTitle>
              {weaknesses.length > 0 ? (
                <FarList items={weaknesses} variant="caution" />
              ) : (
                <p className="far-empty-inline">Inga tydliga svagheter identifierade utifrån underlaget.</p>
              )}
            </FarCard>
          </section>
          </div>

          {/* 7. Argument */}
          <section className="far-section far-section--arguments">
            <FarCard>
              <FarSectionTitle icon={<PreviewIcon name="shield" />}>Argument i budgivningen</FarSectionTitle>
              <div className="far-arguments-grid">
                <div>
                  <p className="far-arguments-head">Faktorer som talar för att hålla tillbaka budet</p>
                  <FarList items={holdBack} variant="caution" />
                </div>
                <div>
                  <p className="far-arguments-head">Faktorer som kan motivera ett högre bud</p>
                  {premium.length > 0 ? (
                    <FarList items={premium} variant="good" />
                  ) : (
                    <p className="far-empty-inline">Inga tydliga premiumargument utifrån underlaget.</p>
                  )}
                </div>
              </div>
            </FarCard>
          </section>

          {/* 8. Frågor */}
          <section className="far-section far-section--questions">
            <FarCard>
              <FarSectionTitle icon={<PreviewIcon name="steps" />}>
                Frågor att ställa mäklaren / föreningen
              </FarSectionTitle>
              <FarList items={visibleQuestions} />
              {sc.questionsToAsk.length > PREVIEW_LIMIT && (
                <ExpandLink
                  expanded={showAllQuestions}
                  onClick={() => setShowAllQuestions((v) => !v)}
                  label="Visa fler frågor →"
                />
              )}
            </FarCard>
          </section>

          {/* Budstrategi — compact */}
          <section className="far-section far-section--strategy">
            <FarCard>
              <FarSectionTitle icon={<PreviewIcon name="chart" />}>Budstrategi</FarSectionTitle>
              <div className="far-strategy-grid">
                <div>
                  <p className="far-strategy-label">Öppningsbud</p>
                  <p>{sc.bidStrategy.openingMove}</p>
                </div>
                <div>
                  <p className="far-strategy-label">Nästa steg</p>
                  <p>{sc.bidStrategy.nextStep}</p>
                </div>
                <div className="far-strategy-walkaway">
                  <p className="far-strategy-label">Walk-away</p>
                  {walkAwayAmount && <p className="far-walkaway-amount">{walkAwayAmount}</p>}
                  <p>{sc.bidStrategy.walkAwayPoint}</p>
                </div>
              </div>
            </FarCard>
          </section>

          {/* CTA */}
          {showFooterCta && (
            <section className="far-section far-section--cta no-print">
              <div className="far-cta">
                <Link href="/new" className="guide-cta-primary">
                  {CTA_START_ANALYSIS_ARROW}
                </Link>
                <p className="far-disclaimer">{sc.disclaimer}</p>
              </div>
            </section>
          )}
        </div>

        <aside className="far-sidebar">
          <div className="far-section far-section--score">
            <FarCard>
              <p className="far-sidebar-label">Total score</p>
              <div className="far-score-row">
                <span className="far-score-value">{sc.score}</span>
                <span className="far-score-max">/ 100</span>
              </div>
              <p className="far-score-sub">{deriveScoreInterpretation(sc)}</p>

              <div className="far-sidebar-metrics">
                <div>
                  <p className="far-metric-label">Rekommendation</p>
                  <span
                    className="far-rec-badge"
                    style={{ color: rec.text, background: rec.bg, borderColor: rec.border }}
                  >
                    {sc.recommendation}
                  </span>
                </div>
                <div>
                  <p className="far-metric-label">Risknivå</p>
                  <div className="far-risk">
                    <span className="far-risk-dot" style={{ background: riskDot }} />
                    <span style={{ color: riskDot }}>{sc.riskLevel}</span>
                  </div>
                  <p className="far-metric-hint">{deriveRiskExplanation(sc)}</p>
                </div>
                {ceiling && (
                  <div>
                    <p className="far-metric-label">Rekommenderat budtak</p>
                    <p className="far-metric-value">{fmtMoney(normalizeBid(ceiling))}</p>
                    <p className="far-metric-hint">{fmtPricePerSqm(ceiling, sqm)}</p>
                  </div>
                )}
              </div>

              <Link href="/guider/vad-ar-rimligt-maxbud" className="far-method-link">
                Läs om vår metod →
              </Link>
            </FarCard>
          </div>

          <div className="far-section far-section--association">
            <FarCard>
              <p className="far-sidebar-label">Nyckeltal – föreningen</p>
              <dl className="far-kpi-list">
                {associationMetrics.map((m) => (
                  <div key={m.label} className="far-kpi-row">
                    <dt>{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="far-kpi-source">
                Källa:{" "}
                {objectInfo.hasAnnualReport
                  ? "Inskickad årsredovisning + formulär"
                  : "Formulär och inskickat underlag"}
              </p>
            </FarCard>
          </div>
        </aside>
      </div>
    </div>
  );
}
