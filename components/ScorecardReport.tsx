import type { ReactNode } from "react";
import Link from "next/link";
import { summaryToBullets } from "@/lib/format-summary";
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

function ScoreBar({ value }: { value: number }) {
  const color = scoreBarColor(value);
  return (
    <div className="ex-bar-track">
      <div className="ex-bar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function PanelLabel({ children }: { children: ReactNode }) {
  return <p className="ex-panel-label">{children}</p>;
}

export function ScorecardReport({
  title,
  meta,
  scorecard: sc,
  conclusionLine,
  showHeading = true,
  titleAs: TitleTag = "h3",
  mobileCompactPreview = false,
}: {
  title: string;
  meta: string;
  scorecard: Scorecard;
  conclusionLine?: string;
  showHeading?: boolean;
  titleAs?: "h1" | "h2" | "h3";
  mobileCompactPreview?: boolean;
}) {
  const rec = REC_COLORS[sc.recommendation] ?? REC_COLORS["Buda försiktigt"];
  const riskDot = RISK_DOT[sc.riskLevel] ?? BRAND.caution;
  const conclusion = conclusionLine ?? deriveConclusion(sc);
  const conclusionBox = deriveConclusionBox(sc);
  const decisionSummary = deriveDecisionSummary(sc);
  const nextSteps = deriveNextSteps(sc);
  const walkAwayAmount = deriveWalkAwayAmount(sc);
  const hasRedFlags = sc.redFlags.length > 0;

  return (
    <div className={`example-report${mobileCompactPreview ? " example-report--mobile-compact" : ""}`}>
      {showHeading && (
        <div className="example-report__heading">
          <TitleTag>{title}</TitleTag>
          {meta && <p>{meta}</p>}
        </div>
      )}

      <div className="example-report__conclusion ex-panel ex-panel--conclusion">
        <PanelLabel>Slutsats</PanelLabel>
        <p className="ex-conclusion-box">{conclusionBox}</p>
      </div>

      <div className="example-report__score ex-panel">
        <PanelLabel>Total score</PanelLabel>
        <div className="ex-score-row">
          <span className="ex-score-value">{sc.score}</span>
          <span className="ex-score-max">/ 100</span>
        </div>
        <p className="ex-score-interpretation">{deriveScoreInterpretation(sc)}</p>
        <p className="ex-score-subtext">{deriveScoreSubtext(sc)}</p>
        <div className="ex-score-metrics">
          <div>
            <PanelLabel>Rekommendation</PanelLabel>
            <span className="ex-rec-badge" style={{ color: rec.text, background: rec.bg, borderColor: rec.border }}>
              {sc.recommendation}
            </span>
          </div>
          <div>
            <PanelLabel>Risknivå</PanelLabel>
            <div className="ex-risk-row">
              <span className="ex-risk-dot" style={{ background: riskDot }} />
              <span className="ex-risk-text" style={{ color: riskDot }}>{sc.riskLevel}</span>
            </div>
            <p className="ex-metric-hint">{deriveRiskExplanation(sc)}</p>
          </div>
          {sc.maxBidSuggestion && (
            <div>
              <PanelLabel>Rekommenderat maxbud</PanelLabel>
              <span className="ex-maxbid">{fmtMoney(normalizeBid(sc.maxBidSuggestion))}</span>
            </div>
          )}
        </div>
      </div>

      <div className="example-report__next-steps ex-panel">
        <PanelLabel>Nästa steg innan bud</PanelLabel>
        <ul className="ex-next-steps">
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>

      <div
        className={`example-report__redflags ex-panel ${hasRedFlags ? "ex-panel--danger" : "ex-panel--good"}`}
      >
        {hasRedFlags ? (
          <>
            <PanelLabel>Röda flaggor</PanelLabel>
            <ul className="ex-list ex-list--danger">
              {sc.redFlags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <PanelLabel>Inga tydliga röda flaggor hittades</PanelLabel>
            <p className="ex-body-text">
              Kontrollera ändå budhistorik, underhållsplan och eventuella kommande avgiftshöjningar innan du går
              vidare.
            </p>
          </>
        )}
      </div>

      <div className="example-report__summary-short ex-panel">
        <PanelLabel>Kort sammanfattning</PanelLabel>
        <p className="ex-body-text ex-body-text--long">{decisionSummary}</p>
      </div>

      <div className="example-report__categories ex-panel">
        <PanelLabel>Kategoripoäng</PanelLabel>
        <p className="ex-cat-hint">Högre poäng är bättre inom varje område.</p>
        <div className="ex-cat-list">
          {Object.entries(sc.categoryScores)
            .filter(([key]) => key in CATEGORY_LABELS)
            .map(([key, val]) => (
              <div key={key} className="ex-cat-row">
                <div className="ex-cat-label-wrap">
                  <span className="ex-cat-label">{CATEGORY_LABELS[key] ?? key}</span>
                  <span className="ex-cat-helper">{CATEGORY_HINTS[key]}</span>
                </div>
                <ScoreBar value={val} />
                <span className="ex-cat-num">{val}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="example-report__strengths ex-panel ex-panel--good">
        <PanelLabel>Styrkor</PanelLabel>
        <ul className="ex-list ex-list--good">
          {sc.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="example-report__weaknesses ex-panel ex-panel--caution">
        <PanelLabel>Svagheter</PanelLabel>
        {sc.weaknesses.length > 0 ? (
          <ul className="ex-list ex-list--caution">
            {sc.weaknesses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        ) : (
          <p className="ex-body-text ex-muted">Inga tydliga svagheter identifierade utifrån underlaget.</p>
        )}
      </div>

      {sc.questionsToAsk.length > 0 && (
        <div className="example-report__questions ex-panel">
          <PanelLabel>Frågor att ställa föreningen / mäklaren</PanelLabel>
          <ul className="ex-questions">
            {sc.questionsToAsk.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="example-report__bid ex-panel">
        <PanelLabel>Budstrategi</PanelLabel>
        <div className="ex-bid-grid">
          <div>
            <p className="ex-bid-label">Öppningsbud</p>
            <p className="ex-body-text">{sc.bidStrategy.openingMove}</p>
          </div>
          <div>
            <p className="ex-bid-label">Nästa steg</p>
            <p className="ex-body-text">{sc.bidStrategy.nextStep}</p>
          </div>
          <div className="ex-bid-walkaway">
            <p className="ex-bid-label">Gå inte över</p>
            {walkAwayAmount && <p className="ex-walkaway-amount">{walkAwayAmount}</p>}
            <p className="ex-body-text">{sc.bidStrategy.walkAwayPoint}</p>
          </div>
          <div>
            <p className="ex-bid-label">Strategi</p>
            <p className="ex-body-text">{sc.bidStrategy.negotiationNotes}</p>
          </div>
        </div>
      </div>

      {mobileCompactPreview && (
        <div className="example-report__compact-cta">
          <Link href="/exempel" className="example-report__compact-link">
            Se hela exempelanalysen →
          </Link>
        </div>
      )}

      <div className="example-report__summary-long ex-panel">
        <PanelLabel>Sammanfattning</PanelLabel>
        <p className="ex-conclusion">
          <strong>Kort slutsats:</strong> {conclusion}
        </p>
        <ul className="ex-summary-bullets">
          {summaryToBullets(sc.summary).map((point, i) => (
            <li key={i} className="ex-body-text">
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="example-report__disclaimer ex-disclaimer">{sc.disclaimer}</div>
    </div>
  );
}
