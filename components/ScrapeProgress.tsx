"use client";

import { useEffect, useState } from "react";
import type { BrokerScrapeResponse } from "@/lib/broker-scrape-types";
import {
  SCRAPE_SIM_TIMINGS,
  buildScrapeSummary,
  deriveScrapeSteps,
  formatScrapeDetailLogs,
  simulateScrapeSteps,
  type ScrapeStep,
} from "@/lib/scrape-progress";

type ScrapeProgressProps = {
  isLoading: boolean;
  result: BrokerScrapeResponse | null;
  onSkip?: () => void;
};

function StepIcon({ status }: { status: ScrapeStep["status"] }) {
  if (status === "done") {
    return <span className="scrape-step-icon scrape-step-icon--done">✓</span>;
  }
  if (status === "active") {
    return <span className="analyzing-spinner scrape-step-spinner" aria-hidden />;
  }
  if (status === "skipped") {
    return <span className="scrape-step-icon scrape-step-icon--skipped">–</span>;
  }
  return <span className="scrape-step-icon scrape-step-icon--pending" aria-hidden />;
}

export function ScrapeProgress({ isLoading, result, onSkip }: ScrapeProgressProps) {
  const [simIndex, setSimIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    setSimIndex(0);
    setShowSkip(false);
    setDetailsOpen(false);

    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const { ms, activeIndex } of SCRAPE_SIM_TIMINGS) {
      timers.push(setTimeout(() => setSimIndex(activeIndex), ms));
    }
    timers.push(setTimeout(() => setShowSkip(true), 12000));

    return () => timers.forEach(clearTimeout);
  }, [isLoading]);

  const complete = !isLoading && result != null;
  const steps = complete
    ? deriveScrapeSteps(result.logs, result.warnings, result)
    : simulateScrapeSteps(simIndex);

  const summary = complete ? buildScrapeSummary(result) : null;
  const detailLogs =
    complete && result
      ? formatScrapeDetailLogs(result.logs, result.warnings, result.documents)
      : [];

  const headline = complete && summary ? summary.headline : "Hämtar underlag";
  const intro = complete && summary
    ? summary.intro
    : "Vi försöker läsa annonsen och hitta dokument som årsredovisning. Du kan kontrollera och komplettera allt i nästa steg.";

  return (
    <div className="scrape-progress">
      <div className="scrape-progress-header">
        <h3 className="scrape-progress-title">{headline}</h3>
        <p className="scrape-progress-intro scrape-progress-intro--desktop">{intro}</p>
        <p className="scrape-progress-intro scrape-progress-intro--mobile">
          Vi läser annonsen och letar efter dokument. Du kontrollerar allt i nästa steg.
        </p>
      </div>

      <ol className="scrape-step-list" aria-label="Hämtningsförlopp">
        {steps.map((step) => (
          <li
            key={step.id}
            className={`scrape-step scrape-step--${step.status}`}
          >
            <StepIcon status={step.status} />
            <div className="scrape-step-content">
              <span className="scrape-step-label">{step.label}</span>
              {step.note && (
                <span className="scrape-step-note">{step.note}</span>
              )}
            </div>
          </li>
        ))}
      </ol>

      {complete && summary?.summaryLine && (
        <div
          className={`scrape-progress-summary${summary.partial ? " scrape-progress-summary--partial" : ""}`}
          role="status"
        >
          {summary.summaryLine}
        </div>
      )}

      {complete && detailLogs.length > 0 && (
        <div className="scrape-progress-details">
          <button
            type="button"
            className="scrape-progress-details-toggle"
            onClick={() => setDetailsOpen((o) => !o)}
            aria-expanded={detailsOpen}
          >
            {detailsOpen ? "Dölj detaljer" : "Visa detaljer"}
          </button>
          {detailsOpen && (
            <ul className="scrape-progress-details-list">
              {detailLogs.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isLoading && showSkip && onSkip && (
        <button type="button" className="scrape-progress-skip" onClick={onSkip}>
          Fortsätt och komplettera manuellt
        </button>
      )}
    </div>
  );
}
