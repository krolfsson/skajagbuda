"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export function HomeHeroForm({ id, variant = "full" }: { id?: string; variant?: "full" | "compact" }) {
  const [url, setUrl] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    trackEvent("hero_analysis_started");
    trackEvent("click_start_analysis", { source: id ?? "hero" });
    router.push(`/new?url=${encodeURIComponent(trimmed)}&autostart=1`);
  }

  function handleExampleClick() {
    trackEvent("click_example_analysis");
    trackEvent("example_analysis_clicked");
  }

  return (
    <form id={id} className="home-hero-form" onSubmit={handleSubmit}>
      <div className="home-hero-form-row">
        <input
          type="url"
          name="listingUrl"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onFocus={() => trackEvent("hero_input_focus")}
          placeholder="Klistra in länk till mäklarens objekt"
          className="home-hero-input"
          autoComplete="url"
          enterKeyHint="go"
          required
        />
        <button type="submit" className="home-btn-primary home-hero-submit">
          Analysera objekt gratis →
        </button>
      </div>

      <p className="home-hero-beta-line">
        Gratis under beta · Ingen inloggning · Tar cirka 1 minut
      </p>

      {variant === "full" && (
        <a
          href="#exempelanalys"
          className="home-btn-secondary home-hero-example-link"
          onClick={handleExampleClick}
        >
          Se exempelanalys
        </a>
      )}

      {variant === "full" && (
        <p className="home-hero-disclaimer">
          <InfoIcon />
          Analysen är ett beslutsstöd, inte finansiell rådgivning. Kontrollera alltid uppgifter med
          mäklare, förening och bank innan du budar.
        </p>
      )}
    </form>
  );
}

function InfoIcon() {
  return (
    <svg
      className="home-disclaimer-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}
