"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getToolBySlug } from "@/lib/content/tools";
import { ToolCalculatorShell } from "@/components/tools/ToolCalculatorShell";
import { ToolResultHero, ToolRiskBadge } from "@/components/tools/ToolResultParts";

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
      comment:
        "Belåning behöver vägas mot avgift, kassa, ränta och planerat underhåll.",
    };
  }
  if (skuld < 10000) {
    return {
      level: "Medel",
      comment:
        "Belåning behöver vägas mot avgift, kassa, ränta och planerat underhåll.",
    };
  }
  return {
    level: "Hög",
    comment:
      "Belåning behöver vägas mot avgift, kassa, ränta och planerat underhåll.",
  };
}

const tool = getToolBySlug("brf-skuld-per-kvm")!;

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
    <ToolCalculatorShell
      calculated={calculated}
      preview={tool}
      cta={tool}
      disclaimer="Preliminär riskindikation – inte helhetsbedömning av föreningen."
      form={
        <>
          <div className="tool-mode-tabs">
            <button type="button" className={mode === "calc" ? "active" : ""} onClick={() => setMode("calc")}>
              Räkna från lån och area
            </button>
            <button type="button" className={mode === "direct" ? "active" : ""} onClick={() => setMode("direct")}>
              Ange skuld/kvm direkt
            </button>
          </div>
          <div className="tool-form-grid tool-form-grid--paired">
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
              <label className="tool-field tool-form-span">
                <span>Skuld per kvm (kr)</span>
                <input value={direct} onChange={(e) => setDirect(e.target.value)} inputMode="numeric" />
              </label>
            )}
            <button type="button" className="tool-calc-btn tool-form-span" onClick={handleCalc}>
              Beräkna
            </button>
          </div>
        </>
      }
      result={
        skuldPerKvm > 0 ? (
          <>
            <ToolResultHero label="Skuld per kvm" value={fmt(skuldPerKvm)} suffix="kr/kvm" />
            <div className="tool-result-risk-row">
              <span className="tool-result-risk-label">Riskindikator</span>
              <ToolRiskBadge level={risk.level} />
            </div>
            <p className="tool-result-note">{risk.comment}</p>
          </>
        ) : (
          <>
            <ToolResultHero label="Skuld per kvm" value="–" />
            <p className="tool-result-note">Ange lån och area, eller skuld per kvm direkt.</p>
          </>
        )
      }
    />
  );
}
