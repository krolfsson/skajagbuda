"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { GuideCtaButton } from "@/components/GuideCtaButton";

function parseNum(v: string): number {
  const n = Number(v.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number) {
  return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n));
}

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
    const loan =
      annualCostRate > 0 ? (availableForLoan * 12) / annualCostRate : 0;
    const maxPrice = loan + d;
    const monthlyAtMax =
      f + o + (loan * (r / 100)) / 12 + (loan * (a / 100)) / 12;
    const sensitive = r >= 4 || f > 5000;
    return { loan, maxPrice, monthlyAtMax, sensitive, availableForLoan };
  }, [down, maxMonthly, rate, fee, amort, other]);

  function handleCalc() {
    setCalculated(true);
    trackEvent("tool_calculated", { tool: "maxbud" });
  }

  return (
    <div className="tool-calc">
      <div className="tool-calc-form">
        <label className="tool-field">
          <span>Kontantinsats (kr)</span>
          <input value={down} onChange={(e) => setDown(e.target.value)} inputMode="numeric" />
        </label>
        <label className="tool-field">
          <span>Max månadskostnad du är bekväm med (kr)</span>
          <input value={maxMonthly} onChange={(e) => setMaxMonthly(e.target.value)} inputMode="numeric" />
        </label>
        <label className="tool-field">
          <span>Ränta (%)</span>
          <input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" />
        </label>
        <label className="tool-field">
          <span>Månadsavgift (kr)</span>
          <input value={fee} onChange={(e) => setFee(e.target.value)} inputMode="numeric" />
        </label>
        <label className="tool-field">
          <span>Amortering (%/år av lån)</span>
          <input value={amort} onChange={(e) => setAmort(e.target.value)} inputMode="decimal" />
        </label>
        <label className="tool-field">
          <span>Övriga kostnader (kr/mån, valfritt)</span>
          <input value={other} onChange={(e) => setOther(e.target.value)} inputMode="numeric" />
        </label>
        <button type="button" className="tool-calc-btn" onClick={handleCalc}>
          Beräkna maxbud
        </button>
      </div>

      {calculated && result.maxPrice > 0 && (
        <div className="tool-calc-result">
          <h2>Resultat</h2>
          <dl className="tool-result-grid">
            <dt>Ungefärligt maxpris</dt>
            <dd><strong>{fmt(result.maxPrice)} kr</strong></dd>
            <dt>Ungefärligt lånebelopp</dt>
            <dd>{fmt(result.loan)} kr</dd>
            <dt>Månadskostnad vid maxpris</dt>
            <dd>{fmt(result.monthlyAtMax)} kr</dd>
          </dl>
          {result.sensitive && (
            <p className="tool-result-warn">
              Kalkylen är känslig för ränta och avgift – en höjning på 1 procentenhet eller ökad
              avgift kan sänka ditt faktiska maxbud.
            </p>
          )}
          <div className="guide-cta guide-cta--inline">
            <h2>Vill du jämföra maxbudet mot objektets risk?</h2>
            <GuideCtaButton href="/new" event="tool_cta_click" label="Analysera objekt" primary />
          </div>
        </div>
      )}

      <p className="guide-disclaimer">
        Förenklad kalkyl utan ränteavdrag. Jämför alltid med slutpriser och föreningens risk.
      </p>
    </div>
  );
}
