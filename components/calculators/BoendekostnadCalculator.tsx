"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { getToolBySlug } from "@/lib/content/tools";
import { ToolCalculatorShell } from "@/components/tools/ToolCalculatorShell";
import { ToolResultHero, ToolResultStats } from "@/components/tools/ToolResultParts";

function parseNum(v: string): number {
  const n = Number(v.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number) {
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n));
}

const tool = getToolBySlug("boendekostnad")!;

export function BoendekostnadCalculator() {
  const [price, setPrice] = useState("4000000");
  const [down, setDown] = useState("600000");
  const [rate, setRate] = useState("4.5");
  const [fee, setFee] = useState("4500");
  const [amort, setAmort] = useState("2");
  const [drift, setDrift] = useState("0");
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(() => {
    const p = parseNum(price);
    const d = parseNum(down);
    const r = parseNum(rate);
    const f = parseNum(fee);
    const a = parseNum(amort);
    const dr = parseNum(drift);
    const loan = Math.max(0, p - d);
    const monthlyRate = r / 100 / 12;
    const interestBefore = loan * monthlyRate;
    const taxDeduction = interestBefore * 0.3;
    const interestAfter = interestBefore - taxDeduction;
    const amortMonthly = (loan * (a / 100)) / 12;
    const total = interestAfter + amortMonthly + f + dr;
    const comment =
      "Detta visar bara boendekostnaden. För att väga in pris, förening, risk och budstrategi kan du analysera objektet.";
    return { loan, interestAfter, amortMonthly, f, dr, total, comment };
  }, [price, down, rate, fee, amort, drift]);

  function handleCalc() {
    setCalculated(true);
    trackEvent("tool_calculated", { tool: "boendekostnad" });
  }

  return (
    <ToolCalculatorShell
      calculated={calculated}
      preview={tool}
      cta={tool}
      disclaimer="Förenklad kalkyl med schablonränteavdrag (30 %). Inte finansiell rådgivning – kontrollera med bank."
      form={
        <div className="tool-form-grid tool-form-grid--paired">
          <label className="tool-field">
            <span>Bostadspris (kr)</span>
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" />
          </label>
          <label className="tool-field">
            <span>Kontantinsats (kr)</span>
            <input value={down} onChange={(e) => setDown(e.target.value)} inputMode="numeric" />
          </label>
          <label className="tool-field">
            <span>Ränta (%)</span>
            <input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" />
          </label>
          <label className="tool-field">
            <span>Amortering (%/år)</span>
            <input value={amort} onChange={(e) => setAmort(e.target.value)} inputMode="decimal" />
          </label>
          <label className="tool-field">
            <span>Månadsavgift (kr)</span>
            <input value={fee} onChange={(e) => setFee(e.target.value)} inputMode="numeric" />
          </label>
          <label className="tool-field">
            <span>Drift (kr/mån)</span>
            <input value={drift} onChange={(e) => setDrift(e.target.value)} inputMode="numeric" />
          </label>
          <button type="button" className="tool-calc-btn tool-form-span" onClick={handleCalc}>
            Beräkna
          </button>
        </div>
      }
      result={
        <>
          <ToolResultHero label="Ungefärlig månadskostnad" value={fmt(result.total)} suffix="kr/mån" />
          <ToolResultStats
            items={[
              { label: "Räntekostnad efter avdrag", value: `${fmt(result.interestAfter)} kr` },
              { label: "Amortering", value: `${fmt(result.amortMonthly)} kr` },
              { label: "Månadsavgift", value: `${fmt(result.f)} kr` },
              { label: "Drift", value: `${fmt(result.dr)} kr` },
            ]}
          />
          <p className="tool-result-note">{result.comment}</p>
        </>
      }
    />
  );
}
