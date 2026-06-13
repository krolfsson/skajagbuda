"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function PaymentVerifier({
  analysisId,
  sessionId,
}: {
  analysisId: string;
  sessionId: string;
}) {
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    (async () => {
      try {
        await fetch(`/api/analyses/${analysisId}/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch {
        // Webhook may have already processed payment
      } finally {
        setDone(true);
        router.refresh();
      }
    })();
  }, [analysisId, sessionId, done, router]);

  return null;
}

/** Kör eller väntar på produktens enda analys. */
export function AnalysisLoader({
  analysisId,
  manual = false,
  passive = false,
}: {
  analysisId: string;
  manual?: boolean;
  /** Visa bara väntskärm — anropet triggas redan från annat håll. */
  passive?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(!manual && !passive);

  useEffect(() => {
    if (!active || passive) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/analyses/${analysisId}/run`, { method: "POST" });
        const data = await res.json().catch(() => null);
        if (res.status === 409) {
          if (!cancelled) setTimeout(() => router.refresh(), 3000);
          return;
        }
        if (!res.ok) {
          if (!cancelled) setError(data?.error ?? "Analysen misslyckades.");
          return;
        }
        if (!cancelled) router.refresh();
      } catch {
        if (!cancelled) setError("Kunde inte köra analysen.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [analysisId, router, active, passive]);

  if (manual && !active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        style={{
          fontSize: "13px",
          fontWeight: 600,
          padding: "9px 20px",
          background: "var(--brand)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
        }}
      >
        Försök igen
      </button>
    );
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 116px)", padding: "80px 24px", textAlign: "center" }}>
      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "12px" }}>
        Analys
      </p>
      <h1 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
        {error ? "Något gick fel" : "Analyserar bostaden..."}
      </h1>
      <p style={{ fontSize: "13px", color: "var(--muted)", maxWidth: "360px", margin: "0 auto" }}>
        {error ?? "Det tar cirka 30–60 sekunder. Sidan uppdateras automatiskt."}
      </p>
      {error && manual && (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setActive(true);
          }}
          style={{
            marginTop: "20px",
            fontSize: "13px",
            fontWeight: 600,
            padding: "9px 20px",
            background: "var(--brand)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
          }}
        >
          Försök igen
        </button>
      )}
    </div>
  );
}

/** @deprecated Använd AnalysisLoader */
export const PaidAnalysisLoader = AnalysisLoader;
