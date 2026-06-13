"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { CTA_START_ANALYSIS } from "@/lib/brand";
import { GuideCtaButton } from "@/components/GuideCtaButton";

function parseNum(v: string): number {
  const n = Number(v.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number) {
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n));
}

function riskLevel(skuld: number): { level: string; comment: string } {
  if (skuld <= 0) return { level: "–", comment: "Ange värden för att beräkna." };
  if (skuld < 5000) {
    return {
      level: "Låg",
      comment: "Relativt låg skuldnivå – men bedöm även räntebindning, underhållsplan och avgift.",
    };
  }
  if (skuld < 10000) {
    return {
      level: "Medel",
      comment: "Medelhög skuld – granska räntekänslighet, planerade projekt och avgiftsutveckling.",
    };
  }
  return {
    level: "Hög",
    comment: "Hög skuldnivå – kräv tydlig plan för amortering, räntor och kommande underhåll.",
  };
}

export function BrfSkuldCalculator() {
  const [mode, setMode] = useState<"calc" | "direct">("calc");
  const [totalLoan, setTotalLoan] = useState("45000000");
  const [totalArea, setTotalArea] = useState("6000");
  const [direct, setDirect] = useState("7500");
  const [calculated, setCalculated] = useState(false);

  const skuldPerKvm = useMemo(() => {
    if (mode === "direct") return parseNum(direct);
    const loan = parseNum(totalLoan);
    const area = parseNum(totalArea);
    if (area <= 0) return 0;
    return loan / area;
  }, [mode, totalLoan, totalArea, direct]);

  const risk = riskLevel(skuldPerKvm);

  function handleCalc() {
    setCalculated(true);
    trackEvent("tool_calculated", { tool: "brf-skuld-per-kvm" });
  }

  return (
    <div className="tool-calc">
      <div className="tool-mode-tabs">
        <button type="button" className={mode === "calc" ? "active" : ""} onClick={() => setMode("calc")}>
          Räkna från lån och area
        </button>
        <button type="button" className={mode === "direct" ? "active" : ""} onClick={() => setMode("direct")}>
          Ange skuld/kvm direkt
        </button>
      </div>

      <div className="tool-calc-form">
        {mode === "calc" ? (
          <>
            <label className="tool-field">
              <span>Föreningens totala lån (kr)</span>
              <input value={totalLoan} onChange={(e) => setTotalLoan(e.target.value)} inputMode="numeric" />
            </label>
            <label className="tool-field">
              <span>Total bostadsarea (kvm)</span>
              <input value={totalArea} onChange={(e) => setTotalArea(e.target.value)} inputMode="numeric" />
            </label>
          </>
        ) : (
          <label className="tool-field">
            <span>Skuld per kvm (kr)</span>
            <input value={direct} onChange={(e) => setDirect(e.target.value)} inputMode="numeric" />
          </label>
        )}
        <button type="button" className="tool-calc-btn" onClick={handleCalc}>
          Beräkna
        </button>
      </div>

      {calculated && skuldPerKvm > 0 && (
        <div className="tool-calc-result">
          <h2>Resultat</h2>
          <dl className="tool-result-grid">
            <dt>Skuld per kvm</dt>
            <dd><strong>{fmt(skuldPerKvm)} kr/kvm</strong></dd>
            <dt>Preliminär risknivå</dt>
            <dd><strong>{risk.level}</strong></dd>
          </dl>
          <p className="tool-result-note">{risk.comment}</p>
          <p className="tool-result-note">
            Indikationen är förenklad. Ränta, avgift, underhållsbehov, nyproduktion och lokalintäkter
            påverkar den faktiska risken.
          </p>
          <div className="guide-cta guide-cta--inline">
            <h2>Vill du väga in avgift, underhåll och pris också?</h2>
            <GuideCtaButton href="/new" event="tool_cta_click" label={CTA_START_ANALYSIS} primary />
          </div>
        </div>
      )}

      <p className="guide-disclaimer">Förenklad indikation – inte helhetsbedömning av föreningen.</p>
    </div>
  );
}
