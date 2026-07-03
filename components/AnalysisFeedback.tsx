"use client";

import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type FeedbackValue = "yes" | "partial" | "no";

const VALUE_LABELS: Record<FeedbackValue, string> = {
  yes: "Ja",
  partial: "Delvis",
  no: "Nej",
};

export function AnalysisFeedback({ analysisId }: { analysisId: string }) {
  const [value, setValue] = useState<FeedbackValue | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!value || submitting || submitted) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/analyses/${analysisId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value,
          comment: comment.trim() || undefined,
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Kunde inte skicka feedback.");

      trackEvent("feedback_submitted", { analysisId, value, hasComment: !!comment.trim() });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="far-feedback far-feedback--thanks no-print" aria-live="polite">
        <p className="far-feedback-thanks">Tack! Din feedback hjälper oss göra analysen bättre.</p>
      </section>
    );
  }

  return (
    <section className="far-feedback no-print" aria-labelledby="feedback-heading">
      <h2 id="feedback-heading" className="far-feedback-title">
        Var analysen användbar?
      </h2>
      <p className="far-feedback-lead">
        Hjälp oss förbättra analysen under beta. Svara gärna kort på om resultatet kändes rimligt.
      </p>

      <div className="far-feedback-actions" role="group" aria-label="Feedback">
        {(["yes", "partial", "no"] as const).map((option) => (
          <button
            key={option}
            type="button"
            className={`far-feedback-btn${value === option ? " far-feedback-btn--active" : ""}`}
            onClick={() => setValue(option)}
            aria-pressed={value === option}
          >
            {VALUE_LABELS[option]}
          </button>
        ))}
      </div>

      {value && (
        <form className="far-feedback-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={`feedback-comment-${analysisId}`}>
            Frivillig kommentar
          </label>
          <textarea
            id={`feedback-comment-${analysisId}`}
            className="far-feedback-textarea"
            rows={3}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Vad saknades, kändes fel eller var mest användbart?"
          />
          {error && <p className="far-feedback-error">{error}</p>}
          <button type="submit" className="home-btn-primary far-feedback-submit" disabled={submitting}>
            {submitting ? "Skickar…" : "Skicka feedback"}
          </button>
        </form>
      )}
    </section>
  );
}
