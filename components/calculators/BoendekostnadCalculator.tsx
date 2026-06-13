"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
    const monthlyRate = (r / 100) / 12;
    const interestBefore = loan * monthlyRate;
    const taxDeduction = interestBefore * 0.3;
    const interestAfter = interestBefore - taxDeduction;
    const amortMonthly = (loan * (a / 100)) / 12;
    const total = interestAfter + amortMonthly + f + dr;
    let comment = "Månadskostnaden ser hanterbar ut – kontrollera ändå förening och räntekänslighet.";
    if (total > 25000) comment = "Hög månadskostnad – säkerställ buffert vid räntehöjning och avgiftsökning.";
    else if (total > 18000) comment = "Medelhög kostnad – räkna med att räntan kan vara högre vid omförhandling.";
    return { loan, interestBefore, taxDeduction, interestAfter, amortMonthly, total, comment };
  }, [price, down, rate, fee, amort, drift]);

  function handleCalc() {
    setCalculated(true);
    trackEvent("tool_calculated", { tool: "boendekostnad" });
  }

  return (
    <div className="tool-calc">
      <div className="tool-calc-form">
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
          <span>Månadsavgift (kr)</span>
          <input value={fee} onChange={(e) => setFee(e.target.value)} inputMode="numeric" />
        </label>
        <label className="tool-field">
          <span>Amortering (%/år av lån)</span>
          <input value={amort} onChange={(e) => setAmort(e.target.value)} inputMode="decimal" />
        </label>
        <label className="tool-field">
          <span>Driftskostnad (kr/mån, valfritt)</span>
          <input value={drift} onChange={(e) => setDrift(e.target.value)} inputMode="numeric" />
        </label>
        <button type="button" className="tool-calc-btn" onClick={handleCalc}>
          Beräkna
        </button>
      </div>

      {calculated && (
        <div className="tool-calc-result">
          <h2>Resultat</h2>
          <dl className="tool-result-grid">
            <dt>Lånebelopp</dt><dd>{fmt(result.loan)} kr</dd>
            <dt>Räntekostnad/mån (före avdrag)</dt><dd>{fmt(result.interestBefore)} kr</dd>
            <dt>Ungefärligt ränteavdrag (30 %)</dt><dd>{fmt(result.taxDeduction)} kr</dd>
            <dt>Räntekostnad efter avdrag</dt><dd>{fmt(result.interestAfter)} kr</dd>
            <dt>Amortering/mån</dt><dd>{fmt(result.amortMonthly)} kr</dd>
            <dt>Total månadskostnad</dt><dd><strong>{fmt(result.total)} kr</strong></dd>
          </dl>
          <p className="tool-result-note">{result.comment}</p>
          <div className="guide-cta guide-cta--inline">
            <h2>Vill du analysera hela objektet?</h2>
            <p>Jämför kostnaden mot förening, pris och risk i en full analys.</p>
            <GuideCtaButton href="/new" event="tool_cta_click" label={CTA_START_ANALYSIS} primary />
          </div>
        </div>
      )}

      <p className="guide-disclaimer">
        Förenklad kalkyl med schablonränteavdrag (30 %). Inte finansiell rådgivning – kontrollera med bank.
      </p>
    </div>
  );
}
