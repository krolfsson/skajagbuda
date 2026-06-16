"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { ToolMeta } from "@/lib/content/types";
import { ToolAnalysisCta } from "@/components/tools/ToolAnalysisCta";

export function ToolCalculatorShell({
  form,
  calculated,
  preview,
  result,
  cta,
  disclaimer,
}: {
  form: ReactNode;
  calculated: boolean;
  preview: Pick<ToolMeta, "previewTitle" | "previewText" | "previewBullets">;
  result: ReactNode;
  cta: Pick<ToolMeta, "ctaTitle" | "ctaText" | "resultCtaLabel">;
  disclaimer: string;
}) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!calculated || !panelRef.current) return;
    if (window.matchMedia("(max-width: 900px)").matches) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [calculated]);

  return (
    <div className="tool-shell">
      <div className="tool-shell-layout">
        <div className="tool-shell-form-card">
          <h2 className="tool-form-card-title">Fyll i dina värden</h2>
          {form}
          <p className="tool-form-card-note">
            Förenklad kalkyl. Använd som riktmärke, inte rådgivning.
          </p>
        </div>

        <aside ref={panelRef} className="tool-shell-panel" aria-live="polite">
          {!calculated ? (
            <div className="tool-panel tool-panel--preview">
              <h2 className="tool-panel-title">{preview.previewTitle}</h2>
              <p className="tool-panel-lead">{preview.previewText}</p>
              <ul className="tool-panel-bullets">
                {preview.previewBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <ToolAnalysisCta
                compact
                title="Nästa steg"
                text="När du hittat ett objekt kan du analysera pris, förening och risk gratis."
              />
            </div>
          ) : (
            <div className="tool-panel tool-panel--result">
              <p className="tool-result-eyebrow">Resultat</p>
              {result}
              <ToolAnalysisCta
                result
                title={cta.ctaTitle}
                text={cta.ctaText}
                primaryLabel={cta.resultCtaLabel}
              />
            </div>
          )}
        </aside>
      </div>

      <p className="guide-disclaimer tool-shell-disclaimer">{disclaimer}</p>
    </div>
  );
}
