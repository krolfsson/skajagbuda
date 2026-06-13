"use client";

import { useState } from "react";
import { RISK_DOT } from "@/lib/ui-colors";

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3.5" y="7" width="9" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

const LOCKED_ITEMS = [
  "Rekommenderat maxbud",
  "Budstrategi",
  "Röda flaggor",
  "Föreningens ekonomi",
  "Pris jämfört med marknad",
  "Frågor att ställa",
  "Walk-away-nivå",
  "Total score",
];

function getUnlockTitle(riskLevel: string): string {
  if (riskLevel === "Hög" || riskLevel === "Mycket hög") {
    return "Se varför risken är hög";
  }
  if (riskLevel === "Medel") {
    return "Se vad som påverkar risknivån";
  }
  if (riskLevel === "Låg") {
    return "Bekräfta om läget är så tryggt som det ser ut";
  }
  return "Lås upp hela beslutsunderlaget";
}

export function UnlockAnalysisCard({
  analysisId,
  riskLevel,
}: {
  analysisId: string;
  riskLevel: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnlock() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analyses/${analysisId}/checkout`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Kunde inte starta betalning.");
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("Ingen betalningslänk mottogs.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel.");
      setLoading(false);
    }
  }

  return (
    <div className="unlock-card">
      <h2 className="unlock-card-title">{getUnlockTitle(riskLevel)}</h2>
      <p className="unlock-card-text">
        Få komplett scorecard för 99 kr med rekommenderat maxbud, budstrategi, föreningsrisk,
        prisbedömning, röda flaggor och frågor att ställa innan du budar vidare.
      </p>

      <ul className="unlock-locked-list">
        {LOCKED_ITEMS.map((item) => (
          <li key={item}>
            <span className="unlock-lock-icon">
              <LockIcon />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <button type="button" className="unlock-cta" onClick={handleUnlock} disabled={loading}>
        {loading ? "Öppnar betalning..." : "Se hela analysen för 99 kr"}
      </button>
      <p className="unlock-subtext">
        Hela rapporten låses upp direkt efter betalning. Engångsbetalning. Ingen prenumeration.
      </p>

      {error && <p className="unlock-error">{error}</p>}
    </div>
  );
}

export function FreeResultShell({
  title,
  riskLevel,
  analysisId,
}: {
  title: string;
  riskLevel: string;
  analysisId: string;
}) {
  const riskColor = RISK_DOT[riskLevel] ?? "var(--muted)";

  return (
    <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 100px)", padding: "32px 16px 80px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <a
          href="/new"
          style={{
            display: "inline-block",
            fontSize: "13px",
            color: "var(--muted)",
            textDecoration: "none",
            marginBottom: "32px",
          }}
        >
          ← Tillbaka
        </a>

        <div className="free-risk-card">
          <h1 className="free-risk-card-title">{title}</h1>
          <p className="free-risk-card-label">Risknivå</p>
          <p className="free-risk-card-level" style={{ color: riskColor }}>
            {riskLevel}
          </p>
          <p className="free-risk-card-body">
            Det finns mer att granska innan du går vidare i budgivningen. I hela rapporten ser du
            var risken kommer ifrån — rekommenderat maxbud, föreningsrisk och röda flaggor som
            sällan syns tydligt i annonsen. Bättre att veta innan du binder dig, inte efter.
          </p>
        </div>

        <UnlockAnalysisCard analysisId={analysisId} riskLevel={riskLevel} />
      </div>
    </div>
  );
}
