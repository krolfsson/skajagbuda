"use client";

import { useState, useEffect } from "react";

const ANALYSIS_STEPS = [
  { ms: 0, label: "Sparar objektdata", sub: "Strukturerar det du matat in" },
  { ms: 1500, label: "Läser annons och budhistorik", sub: "Tolkar text, pris och nyckeltal" },
  { ms: 3800, label: "Hämtar jämförbara försäljningar", sub: "Slutpriser i området" },
  { ms: 6200, label: "Hämtar prisindex (SCB)", sub: "Prisutveckling för kommunen" },
  { ms: 9000, label: "Läser årsredovisning", sub: "Föreningens ekonomi och skulder" },
  { ms: 12500, label: "Analyserar förening och pris", sub: "Ekonomi, underhåll och marknad" },
  { ms: 16500, label: "Identifierar risker och röda flaggor", sub: "Stambyte, tomträtt, lån m.m." },
  { ms: 20500, label: "Tar fram budstrategi", sub: "Riktbud och maxbud" },
  { ms: 24500, label: "Beräknar score och risknivå", sub: "Samma analys som i den fulla analysen" },
];

export function AnalyzingScreen({ title }: { title: string }) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYSIS_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setRevealed((prev) => [...prev, i]), step.ms));
      if (i < ANALYSIS_STEPS.length - 2) {
        timers.push(setTimeout(() => setDone((prev) => [...prev, i]), step.ms + 1400));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const progress = Math.min(Math.round((done.length / (ANALYSIS_STEPS.length - 1)) * 100), 95);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--surface)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
      }}
    >
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "6px" }}>
          Analys
        </p>
        <h2 style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--fg)", maxWidth: "400px" }}>
          {title}
        </h2>
      </div>

      <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column" }}>
        {ANALYSIS_STEPS.map((step, i) => {
          const visible = revealed.includes(i);
          const isDone = done.includes(i);
          const isActive = visible && !isDone;
          if (!visible) return null;

          return (
            <div
              key={step.label}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "10px 0",
                borderBottom: i < ANALYSIS_STEPS.length - 1 ? "1px solid var(--border)" : "none",
                opacity: isDone ? 0.5 : 1,
              }}
            >
              <div style={{ width: "20px", height: "20px", marginTop: "1px", flexShrink: 0 }}>
                {isDone ? (
                  <span style={{ color: "var(--success)", fontSize: "14px" }}>✓</span>
                ) : isActive ? (
                  <span className="analyzing-spinner" />
                ) : null}
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400, color: isActive ? "var(--fg)" : "var(--muted)", lineHeight: 1.3 }}>
                  {step.label}
                </p>
                {isActive && (
                  <p style={{ fontSize: "11px", color: "var(--muted-light)", marginTop: "2px" }}>{step.sub}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ width: "100%", maxWidth: "400px", marginTop: "24px", height: "2px", background: "var(--border)", borderRadius: "1px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "var(--brand)", width: `${progress}%`, transition: "width 1.2s ease" }} />
      </div>
      <p style={{ fontSize: "11px", color: "var(--muted-light)", marginTop: "8px" }}>{progress}%</p>
    </div>
  );
}
