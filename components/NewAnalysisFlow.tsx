"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { CTA_START_ANALYSIS } from "@/lib/brand";
import type { BrokerScrapeResponse, FieldFillStatus, ScrapeFieldKey } from "@/lib/broker-scrape-types";
import { SCRAPE_FIELD_KEYS } from "@/lib/broker-scrape-types";
import { buildScrapeSummary } from "@/lib/scrape-progress";
import { AnalyzingScreen } from "@/components/AnalyzingScreen";
import { ScrapeProgress } from "@/components/ScrapeProgress";

type FormData = {
  title: string;
  address: string;
  area: string;
  city: string;
  askingPrice: string;
  currentBid: string;
  monthlyFee: string;
  livingAreaSqm: string;
  rooms: string;
  floor: string;
  totalFloors: string;
  hasBalcony: boolean;
  balconyDirection: string;
  hasElevator: boolean;
  hasFireplace: boolean;
  objectNotes: string;
  associationName: string;
  associationDebtPerSqm: string;
  associationCash: string;
  associationAnnualFeeChangePercent: string;
  ownershipShare: string;
  plannedRenovations: string;
  upcomingPipeReplacement: boolean;
  pipeReplacementDetails: string;
  userMaxBudget: string;
  userDownPayment: string;
  userMonthlyComfortLimit: string;
  userNotes: string;
  listingUrl: string;
  listingText: string;
  annualReportText: string;
  biddingText: string;
};

const INITIAL: FormData = {
  title: "", address: "", area: "", city: "Stockholm",
  askingPrice: "", currentBid: "", monthlyFee: "",
  livingAreaSqm: "", rooms: "", floor: "", totalFloors: "",
  hasBalcony: false, balconyDirection: "", hasElevator: false, hasFireplace: false,
  objectNotes: "",
  associationName: "", associationDebtPerSqm: "", associationCash: "",
  associationAnnualFeeChangePercent: "", ownershipShare: "",
  plannedRenovations: "", upcomingPipeReplacement: false, pipeReplacementDetails: "",
  userMaxBudget: "", userDownPayment: "", userMonthlyComfortLimit: "", userNotes: "",
  listingUrl: "", listingText: "", annualReportText: "", biddingText: "",
};

const STEPS = [
  { id: 1, label: "Länk" },
  { id: 2, label: "Hämtar" },
  { id: 3, label: "Komplettera" },
  { id: 4, label: "Ekonomi" },
];

const RISK_OPTIONS = [
  { id: "stambyte", label: "Planerat stambyte" },
  { id: "tomtratt", label: "Tomträtt" },
  { id: "avgift", label: "Avgiftshöjning nämnd" },
  { id: "renovering", label: "Större renovering planerad" },
  { id: "finansiering", label: "Osäker finansiering" },
  { id: "belaning", label: "Hög belåning i föreningen" },
  { id: "ranta", label: "Rörliga lån" },
  { id: "skick", label: "Oklart skick" },
] as const;

type RiskCheckId = (typeof RISK_OPTIONS)[number]["id"];

const SCRAPE_FIELD_CONFIG: Array<{
  key: ScrapeFieldKey;
  label: string;
  section: "objekt" | "forening" | "underlag";
  kind: "input" | "textarea";
  placeholder?: string;
  minHeight?: number;
}> = [
  { key: "address", label: "Adress", section: "objekt", kind: "input" },
  { key: "area", label: "Område", section: "objekt", kind: "input" },
  { key: "city", label: "Stad", section: "objekt", kind: "input" },
  { key: "askingPrice", label: "Utgångspris (kr)", section: "objekt", kind: "input" },
  { key: "monthlyFee", label: "Månadsavgift (kr)", section: "objekt", kind: "input" },
  { key: "livingAreaSqm", label: "Boyta (kvm)", section: "objekt", kind: "input" },
  { key: "rooms", label: "Antal rum", section: "objekt", kind: "input" },
  { key: "floor", label: "Våning", section: "objekt", kind: "input", placeholder: "t.ex. 3" },
  {
    key: "totalFloors",
    label: "Totalt antal våningar",
    section: "objekt",
    kind: "input",
    placeholder: "t.ex. 5",
  },
  { key: "associationName", label: "Föreningens namn", section: "forening", kind: "input" },
  {
    key: "annualReportText",
    label: "Årsredovisning / ekonomiskt underlag",
    section: "forening",
    kind: "textarea",
    minHeight: 120,
    placeholder: "Klistra in text om årsredovisning inte hittades automatiskt…",
  },
  {
    key: "listingText",
    label: "Annonstext",
    section: "underlag",
    kind: "textarea",
    minHeight: 100,
    placeholder: "Beskrivning från mäklarens annons…",
  },
];

const SCRAPE_SECTIONS: Array<{ id: "objekt" | "forening" | "underlag"; title: string }> = [
  { id: "objekt", title: "Objekt" },
  { id: "forening", title: "Förening" },
  { id: "underlag", title: "Underlag från mäklare" },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", fontSize: "14px",
  color: "var(--fg)", background: "var(--surface)",
  border: "1px solid var(--border)", borderRadius: "6px", outline: "none",
};

function FillStatus({ status }: { status?: FieldFillStatus }) {
  if (!status) return null;
  return (
    <span className={`fill-status fill-status--${status}`}>
      {status === "found" ? "Hittad" : "Saknas"}
    </span>
  );
}

function FieldLabel({
  children,
  status,
  optional,
}: {
  children: React.ReactNode;
  status?: FieldFillStatus;
  optional?: boolean;
}) {
  return (
    <div className="analysis-field-label">
      <label className="analysis-field-label-text">
        {children}
        {optional && <span className="analysis-field-optional">Valfritt</span>}
      </label>
      <FillStatus status={status} />
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="analysis-stepper">
      <div
        className="analysis-stepper-inner"
        style={{ display: "grid", gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}
      >
        {STEPS.map((step, i) => {
          const done = step.id < current;
          const active = step.id === current;
          return (
            <div key={step.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {i > 0 && (
                <div style={{ position: "absolute", left: 0, right: "50%", top: "11px", height: "1px", background: done ? "var(--brand)" : "var(--border)" }} />
              )}
              {i < STEPS.length - 1 && (
                <div style={{ position: "absolute", left: "50%", right: 0, top: "11px", height: "1px", background: done ? "var(--brand)" : "var(--border)" }} />
              )}
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%", zIndex: 1,
                background: done || active ? "var(--brand)" : "var(--surface)",
                border: done || active ? "none" : "1.5px solid var(--border-strong)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "10px", fontWeight: 600, color: active || done ? "#fff" : "var(--muted)" }}>
                  {done ? "✓" : step.id}
                </span>
              </div>
              <span style={{ fontSize: "10px", marginTop: "5px", color: active ? "var(--brand)" : "var(--muted)", fontWeight: active ? 600 : 400 }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function applyScrape(form: FormData, result: BrokerScrapeResponse): FormData {
  const next = { ...form, listingUrl: result.url };
  for (const key of SCRAPE_FIELD_KEYS) {
    const val = result.form[key];
    if (val) next[key] = val;
  }
  return next;
}

function countFound(status: Partial<Record<ScrapeFieldKey, FieldFillStatus>>) {
  return SCRAPE_FIELD_KEYS.filter((k) => status[k] === "found").length;
}

function ScrapeField({
  config,
  value,
  status,
  onChange,
}: {
  config: (typeof SCRAPE_FIELD_CONFIG)[number];
  value: string;
  status?: FieldFillStatus;
  onChange: (value: string) => void;
}) {
  const fieldStyle =
    config.kind === "textarea"
      ? { ...inputStyle, minHeight: `${config.minHeight ?? 100}px`, resize: "vertical" as const, lineHeight: 1.6 }
      : inputStyle;

  return (
    <div className={config.kind === "textarea" ? "analysis-field-full" : undefined}>
      <FieldLabel status={status}>{config.label}</FieldLabel>
      {config.kind === "textarea" ? (
        <textarea
          style={fieldStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
        />
      ) : (
        <input
          style={fieldStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
        />
      )}
      {config.kind === "textarea" && value.trim() && (
        <p className="analysis-hint">{value.length.toLocaleString("sv-SE")} tecken</p>
      )}
    </div>
  );
}

export default function NewAnalysisFlow() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [fieldStatus, setFieldStatus] = useState<Partial<Record<ScrapeFieldKey, FieldFillStatus>>>({});
  const [scrapeResult, setScrapeResult] = useState<BrokerScrapeResponse | null>(null);
  const scrapeAbortRef = useRef<AbortController | null>(null);
  const [riskChecks, setRiskChecks] = useState<Record<RiskCheckId, boolean>>(() =>
    Object.fromEntries(RISK_OPTIONS.map((o) => [o.id, false])) as Record<RiskCheckId, boolean>
  );
  const [step, setStep] = useState(1);
  const [scraping, setScraping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeTitle, setAnalyzeTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in fieldStatus) {
      const scrapeKey = key as ScrapeFieldKey;
      setFieldStatus((prev) => ({
        ...prev,
        [scrapeKey]: typeof value === "string" && value.trim() ? "found" : "missing",
      }));
    }
  }

  function setRiskCheck(id: RiskCheckId, value: boolean) {
    setRiskChecks((prev) => ({ ...prev, [id]: value }));
  }

  async function startScrape() {
    setError(null);
    const url = form.listingUrl.trim();
    if (!url) {
      setError("Klistra in länken till objektet på mäklarens hemsida.");
      return;
    }

    setScraping(true);
    setStep(2);
    setScrapeResult(null);

    scrapeAbortRef.current?.abort();
    const abort = new AbortController();
    scrapeAbortRef.current = abort;

    try {
      const res = await fetch("/api/scrape-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: abort.signal,
      });
      const data = await res.json();
      if (abort.signal.aborted) return;
      if (!res.ok) {
        throw new Error(data.error ?? "Kunde inte hämta sidan.");
      }

      const result = data as BrokerScrapeResponse;
      setScrapeResult(result);
      setForm(applyScrape(form, result));
      setFieldStatus(result.fieldStatus);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Kunde inte hämta sidan.");
      setStep(1);
    } finally {
      if (!abort.signal.aborted) setScraping(false);
    }
  }

  function skipScrape() {
    scrapeAbortRef.current?.abort();
    scrapeAbortRef.current = null;
    setScraping(false);
    setStep(3);
  }

  function continueAfterScrape() {
    setStep(3);
  }

  function buildTitle() {
    if (form.address.trim()) {
      const parts = [form.address.trim()];
      if (form.livingAreaSqm) parts.push(`${form.livingAreaSqm} kvm`);
      if (form.rooms) parts.push(`${form.rooms} rok`);
      return parts.join(", ");
    }
    if (form.listingText.trim()) {
      const line = form.listingText.trim().split("\n").find((l) => l.trim())?.trim();
      if (line) return line.slice(0, 80);
    }
    return "Ny analys";
  }

  function buildPayload(title: string) {
    const selectedRisks = RISK_OPTIONS.filter((o) => riskChecks[o.id]).map((o) => o.label);
    const plannedRenovations = [selectedRisks.join(", "), form.plannedRenovations].filter(Boolean).join("\n");
    const numericFields = [
      "askingPrice", "currentBid", "monthlyFee", "livingAreaSqm", "rooms",
      "floor", "totalFloors", "userMaxBudget", "userDownPayment", "userMonthlyComfortLimit",
    ] as const;

    const payload: Record<string, unknown> = {
      ...form,
      title,
      plannedRenovations: plannedRenovations || undefined,
      upcomingPipeReplacement: form.upcomingPipeReplacement || riskChecks.stambyte,
      userNotes: form.userNotes || undefined,
    };

    for (const field of numericFields) {
      const val = form[field] as string;
      if (!val) { delete payload[field]; continue; }
      const n = Number(val);
      payload[field] = isNaN(n) ? undefined : n;
    }

    for (const key of Object.keys(payload)) {
      if (payload[key] === "" || payload[key] === undefined) delete payload[key];
    }
    return payload;
  }

  async function handleAnalyze() {
    if (loading) return;
    if (!form.listingUrl.trim() && !form.address.trim() && !form.listingText.trim()) {
      setError("Lägg till minst en länk, adress eller annonstext.");
      return;
    }

    setError(null);
    setLoading(true);
    trackEvent("analysis_started");
    const title = buildTitle();
    setAnalyzeTitle(title);
    setAnalyzing(true);

    try {
      const createRes = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(title)),
      });
      const createJson = await createRes.json();
      if (!createRes.ok) throw new Error(createJson.error ?? "Kunde inte spara analysen.");

      const runRes = await fetch(`/api/analyses/${createJson.id}/run`, { method: "POST" });
      const runJson = await runRes.json();
      if (!runRes.ok) throw new Error(runJson.error ?? "Analysen misslyckades.");

      trackEvent("free_risk_completed", { analysisId: createJson.id });
      router.push(`/result/${createJson.id}`);
    } catch (err) {
      setAnalyzing(false);
      setLoading(false);
      setError(err instanceof Error ? err.message : "Något gick fel.");
    }
  }

  if (analyzing) return <AnalyzingScreen title={analyzeTitle} />;

  const foundCount = countFound(fieldStatus);
  const scrapeSummary = scrapeResult ? buildScrapeSummary(scrapeResult) : null;

  return (
    <div className="analysis-page" style={{ background: "var(--bg)", padding: "32px 16px 80px" }}>
      <div style={{ maxWidth: "620px", margin: "0 auto" }}>
        <a href="/" className="analysis-back-link">← Tillbaka</a>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Ny analys
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.55, maxWidth: "520px" }}>
            Klistra in länken till objektet på mäklarens hemsida — vi hämtar annons, dokument och
            årsredovisning om de finns. Komplettera sedan det som saknas.
          </p>
        </div>

        <StepIndicator current={step} />

        <div className="analysis-card">
          {step !== 2 && (
            <h2 className="analysis-card-title">{STEPS[step - 1].label}</h2>
          )}

          {step === 1 && (
            <div className="analysis-step-body">
              <FieldLabel>Länk till mäklarens objektsida</FieldLabel>
              <input
                type="url"
                value={form.listingUrl}
                onChange={(e) => set("listingUrl", e.target.value)}
                placeholder="https://www.fastighetsbyran.com/… eller lansfast.se, erikolsson.se m.fl."
                style={inputStyle}
              />
              <p className="analysis-hint">
                Fungerar med Fastighetsbyrån, Länsförsäkringar, Bjurfors, Svensk Fast, Erik Olsson
                och de flesta andra mäklarsidor. Vi letar efter pris, avgift, förening och PDF:er
                som årsredovisning.
              </p>
            </div>
          )}

          {step === 2 && (
            <ScrapeProgress
              isLoading={scraping}
              result={scrapeResult}
              onSkip={skipScrape}
            />
          )}

          {step === 3 && (
            <div className="analysis-step-body">
              <div className="scrape-summary">
                {foundCount === SCRAPE_FIELD_KEYS.length ? (
                  <>
                    Alla <strong>{SCRAPE_FIELD_KEYS.length}</strong> nyckeluppgifter hittades automatiskt.
                    Kontrollera att allt stämmer innan du går vidare.
                  </>
                ) : (
                  <>
                    <strong>{foundCount}</strong> av {SCRAPE_FIELD_KEYS.length} nyckeluppgifter hittades automatiskt.
                    Fyll i det som saknas innan du går vidare.
                  </>
                )}
              </div>

              {SCRAPE_SECTIONS.map((section) => {
                const fields = SCRAPE_FIELD_CONFIG.filter((f) => f.section === section.id);
                const gridFields = fields.filter((f) => f.kind === "input");
                const fullFields = fields.filter((f) => f.kind === "textarea");

                return (
                  <div key={section.id}>
                    <p className="analysis-section-title">{section.title}</p>
                    {gridFields.length > 0 && (
                      <div className="analysis-field-grid">
                        {gridFields.map((config) => (
                          <ScrapeField
                            key={config.key}
                            config={config}
                            value={form[config.key]}
                            status={fieldStatus[config.key]}
                            onChange={(value) => set(config.key, value)}
                          />
                        ))}
                      </div>
                    )}
                    {fullFields.map((config) => (
                      <div key={config.key} style={{ marginTop: gridFields.length > 0 ? "12px" : 0 }}>
                        <ScrapeField
                          config={config}
                          value={form[config.key]}
                          status={fieldStatus[config.key]}
                          onChange={(value) => set(config.key, value)}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}

              <p className="analysis-section-title">Risker</p>
              <div className="analysis-risk-grid">
                {RISK_OPTIONS.map((o) => (
                  <label key={o.id} className="analysis-risk-check">
                    <input
                      type="checkbox"
                      checked={riskChecks[o.id]}
                      onChange={(e) => setRiskCheck(o.id, e.target.checked)}
                    />
                    {o.label}
                  </label>
                ))}
              </div>
              <textarea
                style={{ ...inputStyle, marginTop: "10px", minHeight: "72px", resize: "vertical" }}
                value={form.plannedRenovations}
                onChange={(e) => set("plannedRenovations", e.target.value)}
                placeholder="Planerade renoveringar och underhåll…"
              />
            </div>
          )}

          {step === 4 && (
            <div className="analysis-step-body">
              <p className="analysis-section-title">Budgivning</p>
              <div style={{ marginBottom: "14px" }}>
                <FieldLabel>Budhistorik / status</FieldLabel>
                <textarea
                  style={{ ...inputStyle, minHeight: "90px", resize: "vertical", lineHeight: 1.6 }}
                  value={form.biddingText}
                  onChange={(e) => set("biddingText", e.target.value)}
                  placeholder="Antal budgivare, budnivåer, aktuellt läge…"
                />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <FieldLabel optional>Aktuellt bud (kr)</FieldLabel>
                <input style={inputStyle} value={form.currentBid} onChange={(e) => set("currentBid", e.target.value)} />
              </div>

              <p className="analysis-section-title">Din ekonomi</p>
              <div className="analysis-field-grid">
                <div>
                  <FieldLabel optional>Max budget (kr)</FieldLabel>
                  <input style={inputStyle} value={form.userMaxBudget} onChange={(e) => set("userMaxBudget", e.target.value)} />
                </div>
                <div>
                  <FieldLabel optional>Kontantinsats (kr)</FieldLabel>
                  <input style={inputStyle} value={form.userDownPayment} onChange={(e) => set("userDownPayment", e.target.value)} />
                </div>
              </div>
              <div style={{ marginTop: "12px" }}>
                <FieldLabel optional>Bekväm maxkostnad / mån (kr)</FieldLabel>
                <input style={inputStyle} value={form.userMonthlyComfortLimit} onChange={(e) => set("userMonthlyComfortLimit", e.target.value)} />
              </div>
              <div style={{ marginTop: "12px" }}>
                <FieldLabel optional>Egna preferenser</FieldLabel>
                <textarea
                  style={{ ...inputStyle, minHeight: "72px", resize: "vertical" }}
                  value={form.userNotes}
                  onChange={(e) => set("userNotes", e.target.value)}
                  placeholder="Vad väger tungt? Vad oroar dig?"
                />
              </div>
            </div>
          )}

          {error && <div className="analysis-error">{error}</div>}

          <div className="analysis-nav">
            {step > 1 && step !== 2 ? (
              <button type="button" className="analysis-nav-back" onClick={() => setStep((s) => s - 1)}>
                ← Tillbaka
              </button>
            ) : (
              <div />
            )}
            <div className="analysis-nav-primary">
              {step === 1 && (
                <button type="button" className="analysis-nav-next" onClick={startScrape} disabled={scraping}>
                  Hämta underlag →
                </button>
              )}
              {step === 2 && !scraping && scrapeResult && scrapeSummary && (
                <button type="button" className="analysis-nav-next" onClick={continueAfterScrape}>
                  {scrapeSummary.cta} →
                </button>
              )}
              {step === 3 && (
                <button type="button" className="analysis-nav-next" onClick={() => { setError(null); setStep(4); }}>
                  Fortsätt →
                </button>
              )}
              {step === 4 && (
                <button
                  type="button"
                  className="analysis-nav-submit"
                  onClick={handleAnalyze}
                  disabled={loading}
                  style={{
                    color: loading ? "var(--muted)" : "#fff",
                    background: loading ? "var(--border)" : "var(--brand)",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Bedömer risk…" : CTA_START_ANALYSIS}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="analysis-step-counter">Steg {step} av {STEPS.length}</p>
      </div>
    </div>
  );
}
