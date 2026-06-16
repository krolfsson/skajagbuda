import type { ReactNode } from "react";
import { summaryToBullets } from "@/lib/format-summary";
import { REC_COLORS, RISK_DOT, BRAND, scoreBarColor } from "@/lib/ui-colors";
import { EXAMPLE_PROPERTY, EXAMPLE_SCORECARD, EXAMPLE_CONCLUSION } from "@/lib/example-scorecard";

const CAT_LABELS: Record<string, string> = {
  price: "Pris",
  association: "Föreningen",
  condition: "Skick",
  location: "Läge",
  liquidity: "Likviditet",
  risk: "Risk",
};

function fmtMoney(v: number | null | undefined) {
  if (!v) return "–";
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(v) + " kr";
}

function ScoreBar({ value, inverted }: { value: number; inverted?: boolean }) {
  const color = scoreBarColor(value, inverted);
  return (
    <div className="ex-bar-track">
      <div className="ex-bar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function PanelLabel({ children }: { children: ReactNode }) {
  return <p className="ex-panel-label">{children}</p>;
}

/**
 * Full example scorecard — shared by landing page and /exempel.
 * Desktop: multi-column layout. Mobile: single column with priority ordering via CSS.
 */
export function ExampleReport({ showHeading = true }: { showHeading?: boolean }) {
  const sc = EXAMPLE_SCORECARD;
  const rec = REC_COLORS[sc.recommendation] ?? REC_COLORS["Buda försiktigt"];
  const riskDot = RISK_DOT[sc.riskLevel] ?? BRAND.caution;

  return (
    <div className="example-report">
      {showHeading && (
        <div className="example-report__heading">
          <h3>{EXAMPLE_PROPERTY.title}</h3>
          <p>{EXAMPLE_PROPERTY.metaShort}</p>
        </div>
      )}

      <div className="example-report__score ex-panel">
        <PanelLabel>Total score</PanelLabel>
        <div className="ex-score-row">
          <span className="ex-score-value">{sc.score}</span>
          <span className="ex-score-max">/ 100</span>
        </div>
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
          </div>
          <div>
            <PanelLabel>Rekommenderat maxbud</PanelLabel>
            <span className="ex-maxbid">{fmtMoney(sc.maxBidSuggestion)}</span>
          </div>
        </div>
      </div>

      <div className="example-report__summary-short ex-panel">
        <PanelLabel>Kort sammanfattning</PanelLabel>
        <p className="ex-body-text">{sc.oneSentenceSummary}</p>
      </div>

      <div className="example-report__categories ex-panel">
        <PanelLabel>Kategoripoäng</PanelLabel>
        <div className="ex-cat-list">
          {Object.entries(sc.categoryScores)
            .filter(([key]) => key in CAT_LABELS)
            .map(([key, val]) => (
              <div key={key} className="ex-cat-row">
                <span className="ex-cat-label">{CAT_LABELS[key] ?? key}</span>
                <ScoreBar value={val} inverted={key === "risk"} />
                <span className="ex-cat-num">{val}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="example-report__redflags ex-panel ex-panel--danger">
        <PanelLabel>Röda flaggor</PanelLabel>
        <ul className="ex-list ex-list--danger">
          {sc.redFlags.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <div className="example-report__strengths ex-panel">
        <PanelLabel>Styrkor</PanelLabel>
        <ul className="ex-list ex-list--good">
          {sc.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="example-report__weaknesses ex-panel">
        <PanelLabel>Svagheter</PanelLabel>
        <ul className="ex-list ex-list--caution">
          {sc.weaknesses.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>

      <div className="example-report__questions ex-panel">
        <PanelLabel>Frågor att ställa föreningen / mäklaren</PanelLabel>
        <ul className="ex-questions">
          {sc.questionsToAsk.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>

      <div className="example-report__bid ex-panel">
        <PanelLabel>Budstrategi</PanelLabel>
        <div className="ex-bid-grid">
          {[
            { label: "Öppningsbud", value: sc.bidStrategy.openingMove },
            { label: "Nästa steg", value: sc.bidStrategy.nextStep },
            { label: "Walk-away", value: sc.bidStrategy.walkAwayPoint },
            { label: "Strategi", value: sc.bidStrategy.negotiationNotes },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="ex-bid-label">{label}</p>
              <p className="ex-body-text">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="example-report__summary-long ex-panel">
        <PanelLabel>Sammanfattning</PanelLabel>
        <p className="ex-conclusion">
          <strong>Kort slutsats:</strong> {EXAMPLE_CONCLUSION}
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
