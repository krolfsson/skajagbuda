import { REC_COLORS, RISK_DOT, BRAND, scoreBarColor } from "@/lib/ui-colors";
import { EXAMPLE_PROPERTY, EXAMPLE_SCORECARD } from "@/lib/example-scorecard";

const CAT_LABELS: Record<string, string> = {
  price:       "Pris",
  association: "Föreningen",
  condition:   "Skick",
  location:    "Läge",
  liquidity:   "Likviditet",
  risk:        "Risk",
};

function fmtMoney(v: number | null | undefined) {
  if (!v) return "–";
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(v) + " kr";
}

function ScoreBar({ value, inverted }: { value: number; inverted?: boolean }) {
  const color = scoreBarColor(value, inverted);
  return (
    <div style={{ flex: 1, height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: "2px" }} />
    </div>
  );
}

/**
 * Full example scorecard rendering, shared by the landing page and the /exempel route.
 * Uses the `result-*` classNames so the existing mobile media queries collapse the
 * multi-column grids to a single column on small screens.
 */
export function ExampleReport({ showHeading = true }: { showHeading?: boolean }) {
  const sc = EXAMPLE_SCORECARD;
  const rec = REC_COLORS[sc.recommendation] ?? REC_COLORS["Buda försiktigt"];
  const riskDot = RISK_DOT[sc.riskLevel] ?? BRAND.caution;

  return (
    <>
      {showHeading && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "4px" }}>
            {EXAMPLE_PROPERTY.title}
          </h3>
          <p style={{ fontSize: "12px", color: "var(--muted)" }}>
            {EXAMPLE_PROPERTY.metaShort}
          </p>
        </div>
      )}

      {/* Top grid: score + summary */}
      <div
        className="result-top-grid"
        style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "16px", marginBottom: "16px" }}
      >
        {/* Left: score card */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "14px", padding: "24px",
          display: "flex", flexDirection: "column", gap: "20px",
        }}>
          <div>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
              Total score
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "52px", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {sc.score}
              </span>
              <span style={{ fontSize: "18px", color: "var(--muted)" }}>/ 100</span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
              Rekommendation
            </p>
            <span style={{
              display: "inline-block", fontSize: "14px", fontWeight: 600,
              color: rec.text, background: rec.bg,
              border: `1px solid ${rec.border}`, borderRadius: "4px", padding: "3px 8px",
            }}>
              {sc.recommendation}
            </span>
          </div>

          <div>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
              Risknivå
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: riskDot, flexShrink: 0 }} />
              <span style={{ fontSize: "14px", fontWeight: 500, color: riskDot }}>{sc.riskLevel}</span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
              Föreslagat maxbud
            </p>
            <span style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.02em" }}>
              {fmtMoney(sc.maxBidSuggestion)}
            </span>
          </div>
        </div>

        {/* Right: summary + categories */}
        <div
          className="result-summary-grid"
          style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "14px", padding: "24px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px",
          }}
        >
          <div>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "10px" }}>
              Kort sammanfattning
            </p>
            <p style={{ fontSize: "13px", lineHeight: "1.75", color: "var(--fg)" }}>
              {sc.oneSentenceSummary}
            </p>
          </div>
          <div>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "10px" }}>
              Kategoripoäng
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Object.entries(sc.categoryScores)
                .filter(([key]) => key in CAT_LABELS)
                .map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", width: "100px", flexShrink: 0, color: "var(--muted)" }}>
                    {CAT_LABELS[key] ?? key}
                  </span>
                  <ScoreBar value={val} inverted={key === "risk"} />
                  <span style={{ fontSize: "11px", fontWeight: 500, width: "24px", textAlign: "right", flexShrink: 0 }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Styrkor / Svagheter / Röda flaggor */}
      <div
        className="result-3col"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}
      >
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--success)", marginBottom: "12px", fontWeight: 600 }}>
            Styrkor
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
            {sc.strengths.map((s, i) => (
              <li key={i} style={{ display: "flex", gap: "7px", fontSize: "12px", lineHeight: "1.5" }}>
                <svg width="13" height="13" viewBox="0 0 13 13" style={{ flexShrink: 0, marginTop: "1px" }}>
                  <circle cx="6.5" cy="6.5" r="6" fill="var(--success-bg)" />
                  <path d="M3.5 6.5l2 2 4-4" stroke="var(--success)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--caution)", marginBottom: "12px", fontWeight: 600 }}>
            Svagheter
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
            {sc.weaknesses.map((w, i) => (
              <li key={i} style={{ display: "flex", gap: "7px", fontSize: "12px", lineHeight: "1.5" }}>
                <svg width="13" height="13" viewBox="0 0 13 13" style={{ flexShrink: 0, marginTop: "1px" }}>
                  <circle cx="6.5" cy="6.5" r="6" fill="var(--caution-bg)" />
                  <path d="M4.5 4.5l4 4M8.5 4.5l-4 4" stroke="var(--caution)" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-border)", borderRadius: "10px", padding: "20px" }}>
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--danger)", marginBottom: "12px", fontWeight: 600 }}>
            Röda flaggor
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
            {sc.redFlags.map((f, i) => (
              <li key={i} style={{ display: "flex", gap: "7px", fontSize: "12px", lineHeight: "1.5", color: "var(--danger)" }}>
                <svg width="13" height="13" viewBox="0 0 13 13" style={{ flexShrink: 0, marginTop: "1px" }}>
                  <circle cx="6.5" cy="6.5" r="6" fill="var(--danger-bg)" />
                  <path d="M6.5 3.5v4" stroke="var(--danger)" strokeWidth="1.3" strokeLinecap="round" />
                  <circle cx="6.5" cy="9.5" r="0.7" fill="var(--danger)" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Frågor att ställa */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px 24px", marginBottom: "12px" }}>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "12px", fontWeight: 600 }}>
          Frågor att ställa föreningen / mäklaren
        </p>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
          {sc.questionsToAsk.map((q, i) => (
            <li key={i} style={{ display: "flex", gap: "8px", fontSize: "13px", lineHeight: "1.5" }}>
              <span style={{ color: "var(--muted)", flexShrink: 0 }}>—</span>
              {q}
            </li>
          ))}
        </ul>
      </div>

      {/* Budstrategi */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px 24px", marginBottom: "12px" }}>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "16px", fontWeight: 600 }}>
          Budstrategi
        </p>
        <div
          className="result-bid-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px" }}
        >
          {[
            { label: "Öppningsbud", value: sc.bidStrategy.openingMove },
            { label: "Nästa steg",  value: sc.bidStrategy.nextStep },
            { label: "Walk-away",   value: sc.bidStrategy.walkAwayPoint },
            { label: "Strategi",    value: sc.bidStrategy.negotiationNotes },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "4px" }}>
                {label}
              </p>
              <p style={{ fontSize: "13px", lineHeight: "1.6" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px 24px", marginBottom: "12px" }}>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "10px", fontWeight: 600 }}>
          Sammanfattning
        </p>
        <p style={{ fontSize: "13px", lineHeight: "1.8", whiteSpace: "pre-line" }}>{sc.summary}</p>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: "14px 18px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px", color: "var(--muted)", lineHeight: "1.6" }}>
        {sc.disclaimer}
      </div>
    </>
  );
}
