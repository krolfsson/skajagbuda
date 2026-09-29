"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { TestimonialStrip } from "@/components/TestimonialStrip";
import { BetaPriceTag } from "@/components/BetaPriceTag";

/** Hemnet/Booli block automatic reading — the broker's own page is what works. */
function portalName(value: string): "Hemnet" | "Booli" | null {
  if (/(^|\/\/|\.)hemnet\.se/i.test(value)) return "Hemnet";
  if (/(^|\/\/|\.)booli\.se/i.test(value)) return "Booli";
  return null;
}

export function HomeHeroForm({ id, variant = "full" }: { id?: string; variant?: "full" | "compact" }) {
  const [url, setUrl] = useState("");
  const [portalWarned, setPortalWarned] = useState(false);
  const router = useRouter();
  const portal = portalName(url.trim());

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    // First submit of a Hemnet/Booli link: explain instead of navigating. Second submit continues.
    if (portal && !portalWarned) {
      setPortalWarned(true);
      return;
    }

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
        <div className="home-hero-input-wrap">
          <LinkIcon />
          <input
            type="url"
            name="listingUrl"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setPortalWarned(false);
            }}
            onFocus={() => trackEvent("hero_input_focus")}
            placeholder="Länk från mäklarens hemsida"
            aria-describedby={id ? `${id}-hint` : undefined}
            className="home-hero-input"
            autoComplete="url"
            enterKeyHint="go"
            required
          />
        </div>
        <button type="submit" className="home-btn-primary home-hero-submit">
          {portal && portalWarned ? `Fortsätt ändå med ${portal}-länken →` : "Analysera objekt gratis →"}
        </button>
      </div>

      {portal && portalWarned ? (
        <p className="home-hero-portal-warning" role="alert">
          <strong>Det här är en {portal}-länk.</strong> {portal} tillåter inte att vi läser annonsen,
          så pris och avgift kommer inte med automatiskt. Öppna annonsen, klicka dig vidare till
          mäklarens hemsida och klistra in den länken i stället — eller fortsätt och klistra in
          annonstexten i nästa steg.
        </p>
      ) : (
        <p id={id ? `${id}-hint` : undefined} className="home-hero-link-hint">
          Använd länken från mäklarens egen sida (t.ex. Fastighetsbyrån, Svensk Fast, Länsförsäkringar)
          — inte Hemnet eller Booli.
        </p>
      )}

      {variant === "full" && <BetaPriceTag className="beta-price-tag--hero" />}

      {variant === "full" && (
        <ul className="home-hero-trust" aria-label="Trygghetsinformation">
          <li>
            <CheckCircleIcon />
            Inget kort krävs
          </li>
          <li>
            <LockIcon />
            Ingen inloggning
          </li>
          <li>
            <ClockIcon />
            Tar cirka 1 minut
          </li>
        </ul>
      )}

      {variant === "full" && <TestimonialStrip className="testimonial-strip--hero" />}

      {variant === "full" && (
        <a
          href="#exempelanalys"
          className="home-btn-secondary home-hero-example-link"
          onClick={handleExampleClick}
        >
          <DocumentIcon />
          Se exempelanalys
        </a>
      )}

      {variant === "compact" && (
        <>
          <BetaPriceTag className="beta-price-tag--compact" />
          <p className="home-hero-beta-line">Ingen inloggning · Inget kort krävs · Tar cirka 1 minut</p>
        </>
      )}

      {variant === "full" && (
        <p className="home-hero-disclaimer">
          <ShieldIcon />
          Analysen är ett beslutsstöd, inte finansiell rådgivning. Kontrollera alltid uppgifter med
          mäklare, förening och bank innan du budar.
        </p>
      )}
    </form>
  );
}

function LinkIcon() {
  return (
    <svg
      className="home-hero-input-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
      <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="m8 12 2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 4h8l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M16 4v4h4M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="home-disclaimer-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 5 6v5c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
