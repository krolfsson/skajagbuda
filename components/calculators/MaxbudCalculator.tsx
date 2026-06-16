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

const tool = getToolBySlug("maxbud")!;

export function MaxbudCalculator() {
  const [down, setDown] = useState("600000");
  const [maxMonthly, setMaxMonthly] = useState("18000");
  const [rate, setRate] = useState("4.5");
  const [fee, setFee] = useState("4500");
  const [amort, setAmort] = useState("2");
  const [other, setOther] = useState("0");
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(() => {
    const d = parseNum(down);
    const maxM = parseNum(maxMonthly);
    const r = parseNum(rate);
    const f = parseNum(fee);
    const a = parseNum(amort);
    const o = parseNum(other);
    const availableForLoan = Math.max(0, maxM - f - o);
    const annualCostRate = (r + a) / 100;
    const loan = annualCostRate > 0 ? (availableForLoan * 12) / annualCostRate : 0;
    const maxPrice = loan + d;
    const interestMonthly = (loan * (r / 100)) / 12;
    const amortMonthly = (loan * (a / 100)) / 12;
    const monthlyAtMax = f + o + interestMonthly + amortMonthly;
    const comment =
      "Maxbudet är en förenklad kalkyl. Väg alltid in föreningens ekonomi, underhåll och objektets skick.";
    return { loan, maxPrice, monthlyAtMax, interestMonthly, amortMonthly, f, o, maxM, comment };
  }, [down, maxMonthly, rate, fee, amort, other]);

  function handleCalc() {
    setCalculated(true);
    trackEvent("tool_calculated", { tool: "maxbud" });
  }

  return (
    <ToolCalculatorShell
      calculated={calculated}
      preview={tool}
      cta={tool}
      disclaimer="Förenklad kalkyl utan ränteavdrag. Jämför alltid med slutpriser och föreningens risk."
      form={
        <div className="tool-form-grid tool-form-grid--paired">
          <label className="tool-field">
            <span>Kontantinsats (kr)</span>
            <input value={down} onChange={(e) => setDown(e.target.value)} inputMode="numeric" />
          </label>
          <label className="tool-field">
            <span>Max månadskostnad (kr)</span>
            <input value={maxMonthly} onChange={(e) => setMaxMonthly(e.target.value)} inputMode="numeric" />
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
            <span>Övrigt (kr/mån)</span>
            <input value={other} onChange={(e) => setOther(e.target.value)} inputMode="numeric" />
          </label>
          <button type="button" className="tool-calc-btn tool-form-span" onClick={handleCalc}>
            Beräkna maxbud
          </button>
        </div>
      }
      result={
        calculated && result.maxPrice > 0 ? (
          <>
            <ToolResultHero label="Uppskattat maxbud" value={fmt(result.maxPrice)} suffix="kr" />
            <ToolResultStats
              items={[
                { label: "Bekväm månadskostnad", value: `${fmt(result.maxM)} kr` },
                { label: "Uppskattat lånebelopp", value: `${fmt(result.loan)} kr` },
                { label: "Månadsavgift", value: `${fmt(result.f)} kr` },
                { label: "Ränta", value: `${fmt(result.interestMonthly)} kr` },
                { label: "Amortering", value: `${fmt(result.amortMonthly)} kr` },
              ]}
            />
            <p className="tool-result-note">{result.comment}</p>
          </>
        ) : (
          <>
            <ToolResultHero label="Kunde inte räkna ut" value="–" />
            <p className="tool-result-note">
              Kontrollera att månadskostnaden räcker efter avgift och övriga kostnader.
            </p>
          </>
        )
      }
    />
  );
}
