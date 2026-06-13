import Link from "next/link";
import type { PropertyAnalysis } from "@/app/generated/prisma/client";
import type { Scorecard } from "@/lib/schemas";
import { ShareButton } from "@/components/ShareButton";
import { ExportReportButton } from "@/components/ExportReportButton";
import { DevBypassBanner } from "@/components/DevBypassBanner";
import { REC_COLORS, RISK_DOT, BRAND, scoreBarColor } from "@/lib/ui-colors";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeBid(v: number): number {
  // Guard: if AI returned value in millions (e.g. 7 instead of 7000000)
  if (v > 0 && v < 500) return v * 1_000_000;
  // If returned in thousands (e.g. 7500 instead of 7500000)
  if (v >= 500 && v < 10_000) return v * 1_000;
  return v;
}

function fmtMoney(v: number | null | undefined) {
  if (!v) return "–";
  return new Intl.NumberFormat("sv-SE", {
    maximumFractionDigits: 0,
  }).format(v) + " kr";
}

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(d));
}

const CAT_LABELS: Record<string, string> = {
  price: "Pris",
  association: "Föreningen",
  condition: "Skick",
  location: "Läge",
  liquidity: "Likviditet",
  risk: "Risk",
};

function ScoreBar({ value, inverted }: { value: number; inverted?: boolean }) {
  const color = scoreBarColor(value, inverted);
  return (
    <div style={{ flex: 1, height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: "2px" }} />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FullScorecard({
  analysis,
  scorecard: sc,
  devBypass = false,
}: {
  analysis: PropertyAnalysis;
  scorecard: Scorecard;
  devBypass?: boolean;
}) {
  const rec = REC_COLORS[sc.recommendation] ?? REC_COLORS["Buda försiktigt"];
  const riskDot = RISK_DOT[sc.riskLevel] ?? BRAND.caution;

  const meta = [
    analysis.rooms ? `${Number(analysis.rooms)} rok` : null,
    analysis.livingAreaSqm ? `${Number(analysis.livingAreaSqm)} kvm` : null,
    analysis.associationName ?? null,
    `Analys skapad ${fmtDate(analysis.createdAt)}`,
  ].filter(Boolean).join(" · ");

  return (
    <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 52px)", padding: "24px 16px 80px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {devBypass && <DevBypassBanner />}

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Link
            href="/new"
            style={{ fontSize: "13px", color: "var(--muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
          >
            ← Tillbaka till analyser
          </Link>
          <div style={{ display: "flex", gap: "8px" }}>
            <ExportReportButton title={analysis.title} meta={meta || null} scorecard={sc} />
            <ShareButton
              title={analysis.title}
              text={`Bostadsanalys: ${analysis.title} — ${sc.recommendation}, score ${sc.score}/100`}
            />
          </div>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
              marginBottom: "4px",
            }}
          >
            {analysis.title}
          </h1>
          {meta && (
            <p style={{ fontSize: "12px", color: "var(--muted)" }}>{meta}</p>
          )}
        </div>

        {/* ── Top section: score card + summary ── */}
        <div
          className="result-top-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: "16px",
            marginBottom: "16px",
            alignItems: "stretch",
          }}
        >
          {/* Left: score */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
                Total score
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "52px", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {sc.score}
                </span>
                <span style={{ fontSize: "18px", color: "var(--muted)", fontWeight: 400 }}>/ 100</span>
              </div>
            </div>

            <div>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
                Rekommendation
              </p>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: rec.text,
                  background: rec.bg,
                  border: `1px solid ${rec.border}`,
                  borderRadius: "4px",
                  padding: "3px 8px",
                }}
              >
                {sc.recommendation}
              </span>
            </div>

            <div>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
                Risknivå
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: riskDot,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "14px", fontWeight: 500, color: riskDot }}>{sc.riskLevel}</span>
              </div>
            </div>

            {sc.maxBidSuggestion && (
              <div>
                <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
                  Föreslagat maxbud
                </p>
                <span style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.02em" }}>
                  {fmtMoney(normalizeBid(sc.maxBidSuggestion))}
                </span>
                <p style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.5, marginTop: "6px" }}>
                  AI-beräknad nivå utifrån pris, förening och din budget. Beslutsstöd — inte finansiell rådgivning.
                </p>
              </div>
            )}
          </div>

          {/* Right: summary + category scores */}
          <div
            className="result-summary-grid"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "28px",
            }}
          >
            {/* Summary text */}
            <div>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "10px" }}>
                Kort sammanfattning
              </p>
              <p style={{ fontSize: "13px", lineHeight: "1.75", color: "var(--fg)" }}>
                {sc.summary}
              </p>
            </div>

            {/* Category scores */}
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
                    <span style={{ fontSize: "11px", fontWeight: 500, width: "24px", textAlign: "right", flexShrink: 0, color: "var(--fg)" }}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Styrkor / Svagheter / Röda flaggor ── */}
        <div
          className="result-3col"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          {/* Styrkor */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "20px",
            }}
          >
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--success)", marginBottom: "12px", fontWeight: 600 }}>
              Styrkor
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
              {sc.strengths.map((s, i) => (
                <li key={i} style={{ display: "flex", gap: "7px", fontSize: "12px", lineHeight: "1.5", color: "var(--fg)" }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" style={{ flexShrink: 0, marginTop: "1px" }}>
                    <circle cx="6.5" cy="6.5" r="6" fill="var(--success-bg)" />
                    <path d="M3.5 6.5l2 2 4-4" stroke="var(--success)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Svagheter */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "20px",
            }}
          >
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--caution)", marginBottom: "12px", fontWeight: 600 }}>
              Svagheter
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
              {sc.weaknesses.length > 0 ? sc.weaknesses.map((w, i) => (
                <li key={i} style={{ display: "flex", gap: "7px", fontSize: "12px", lineHeight: "1.5", color: "var(--fg)" }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" style={{ flexShrink: 0, marginTop: "1px" }}>
                    <circle cx="6.5" cy="6.5" r="6" fill="var(--caution-bg)" />
                    <path d="M4.5 4.5l4 4M8.5 4.5l-4 4" stroke="var(--caution)" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  {w}
                </li>
              )) : (
                <li style={{ fontSize: "12px", color: "var(--muted-light)" }}>Inga identifierade</li>
              )}
            </ul>
          </div>

          {/* Röda flaggor */}
          <div
            style={{
              background: sc.redFlags.length > 0 ? "var(--danger-bg)" : "var(--surface)",
              border: `1px solid ${sc.redFlags.length > 0 ? "var(--danger-border)" : "var(--border)"}`,
              borderRadius: "var(--radius)",
              padding: "20px",
            }}
          >
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--danger)", marginBottom: "12px", fontWeight: 600 }}>
              Röda flaggor
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
              {sc.redFlags.length > 0 ? sc.redFlags.map((f, i) => (
                <li key={i} style={{ display: "flex", gap: "7px", fontSize: "12px", lineHeight: "1.5", color: "var(--danger)" }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" style={{ flexShrink: 0, marginTop: "1px" }}>
                    <circle cx="6.5" cy="6.5" r="6" fill="var(--danger-bg)" />
                    <path d="M6.5 3.5v4" stroke="var(--danger)" strokeWidth="1.3" strokeLinecap="round" />
                    <circle cx="6.5" cy="9.5" r="0.7" fill="var(--danger)" />
                  </svg>
                  {f}
                </li>
              )) : (
                <li style={{ fontSize: "12px", color: "var(--muted-light)" }}>Inga identifierade</li>
              )}
            </ul>
          </div>
        </div>

        {/* ── Frågor att ställa ── */}
        {sc.questionsToAsk.length > 0 && (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "20px 24px",
              marginBottom: "12px",
            }}
          >
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "12px", fontWeight: 600 }}>
              Frågor att ställa föreningen / mäklaren
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              {sc.questionsToAsk.map((q, i) => (
                <li key={i} style={{ display: "flex", gap: "8px", fontSize: "13px", lineHeight: "1.5", color: "var(--fg)" }}>
                  <span style={{ color: "var(--muted)", flexShrink: 0, fontSize: "12px", marginTop: "1px" }}>—</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Budstrategi ── */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "20px 24px",
            marginBottom: "12px",
          }}
        >
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "16px", fontWeight: 600 }}>
            Budstrategi
          </p>
          <div
            className="result-bid-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px 32px",
            }}
          >
            {[
              { label: "Öppningsbud",          value: sc.bidStrategy.openingMove },
              { label: "Nästa steg",            value: sc.bidStrategy.nextStep },
              { label: "Walk-away",             value: sc.bidStrategy.walkAwayPoint },
              { label: "Strategi",              value: sc.bidStrategy.negotiationNotes },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "4px" }}>
                  {label}
                </p>
                <p style={{ fontSize: "13px", color: "var(--fg)", lineHeight: "1.6" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            padding: "14px 18px",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontSize: "11px",
            color: "var(--muted)",
            lineHeight: "1.6",
          }}
        >
          {sc.disclaimer}
        </div>
      </div>
    </div>
  );
}
