"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Analyzing screen ──────────────────────────────────────────────────────────

const ANALYSIS_STEPS = [
  { ms: 0,     label: "Sparar objektdata",              sub: "Strukturerar det du matat in" },
  { ms: 1200,  label: "Hämtar marknadsdata",           sub: "Jämförpriser och områdesstatistik" },
  { ms: 3500,  label: "Analyserar förening och pris",  sub: "Ekonomi, underhåll och marknad" },
  { ms: 6000,  label: "Beräknar score och risknivå",   sub: "Samma analys som i hela rapporten" },
];

function AnalyzingScreen({ title }: { title: string }) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYSIS_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setRevealed(prev => [...prev, i]), step.ms));
      // Mark as done ~1.4s after it appears (except last two — keep spinning until real finish)
      if (i < ANALYSIS_STEPS.length - 2) {
        timers.push(setTimeout(() => setDone(prev => [...prev, i]), step.ms + 1400));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const progress = Math.min(
    Math.round((done.length / (ANALYSIS_STEPS.length - 1)) * 100),
    95
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: "var(--surface)", zIndex: 200,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "32px 24px",
    }}>
      {/* Logo mark */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "6px" }}>
          Analys
        </p>
        <h2 style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--fg)", maxWidth: "400px" }}>
          {title}
        </h2>
      </div>

      {/* Steps list */}
      <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "0" }}>
        {ANALYSIS_STEPS.map((step, i) => {
          const visible = revealed.includes(i);
          const isDone = done.includes(i);
          const isActive = visible && !isDone;

          if (!visible) return null;

          return (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                padding: "10px 0",
                borderBottom: i < ANALYSIS_STEPS.length - 1 ? "1px solid var(--border)" : "none",
                opacity: isDone ? 0.5 : 1,
                transition: "opacity 0.4s",
                animation: "fadeSlideIn 0.3s ease forwards",
              }}
            >
              {/* Icon */}
              <div style={{ width: "20px", height: "20px", marginTop: "1px", flexShrink: 0 }}>
                {isDone ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" fill="var(--success-bg)" stroke="var(--success-border)" strokeWidth="1"/>
                    <path d="M6 10l2.5 2.5L14 7" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : isActive ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="10" cy="10" r="8" fill="none" stroke="var(--border)" strokeWidth="2"/>
                    <path d="M10 2a8 8 0 0 1 8 8" fill="none" stroke="var(--brand-secondary)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : null}
              </div>

              {/* Text */}
              <div>
                <p style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400, color: isActive ? "var(--fg)" : "var(--muted)", lineHeight: 1.3 }}>
                  {step.label}
                </p>
                {isActive && (
                  <p style={{ fontSize: "11px", color: "var(--muted-light)", marginTop: "2px" }}>
                    {step.sub}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{
        width: "100%", maxWidth: "400px", marginTop: "24px",
        height: "2px", background: "var(--border)", borderRadius: "1px", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", background: "var(--brand)", borderRadius: "1px",
          width: `${progress}%`,
          transition: "width 1.2s ease",
        }} />
      </div>
      <p style={{ fontSize: "11px", color: "var(--muted-light)", marginTop: "8px" }}>
        {progress}%
      </p>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

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
  agentInfoText: string;
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
  listingUrl: "", listingText: "", annualReportText: "", biddingText: "", agentInfoText: "",
};

const STEPS = [
  { id: 1, label: "Objektet",        short: "1" },
  { id: 2, label: "Pris",            short: "2" },
  { id: 3, label: "Föreningen",      short: "3" },
  { id: 4, label: "Risker",          short: "4" },
  { id: 5, label: "Din ekonomi",     short: "5" },
  { id: 6, label: "Övrigt",          short: "6" },
];

// ─── Nominatim address suggestion ─────────────────────────────────────────────

interface NominatimResult {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    suburb?: string;
    neighbourhood?: string;
    city_district?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    country?: string;
  };
}

async function searchAddress(q: string): Promise<NominatimResult[]> {
  if (q.length < 4) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=6&countrycodes=se&accept-language=sv`;
  const res = await fetch(url, { headers: { "Accept-Language": "sv" } });
  if (!res.ok) return [];
  return res.json();
}

function extractCityArea(r: NominatimResult) {
  const a = r.address;
  const city = a.city ?? a.town ?? a.village ?? a.municipality ?? "";
  const area = a.suburb ?? a.neighbourhood ?? a.city_district ?? "";
  return { city, area };
}

// ─── Micro components ─────────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
  label: {
    display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em",
    textTransform: "uppercase", color: "#3a3a3a", marginBottom: "6px",
  },
  optional: {
    fontSize: "10px", fontWeight: 400, textTransform: "none",
    letterSpacing: 0, marginLeft: "4px", color: "var(--muted)",
  },
  input: {
    width: "100%", padding: "9px 12px", fontSize: "14px",
    color: "var(--fg)", background: "var(--surface)",
    border: "1px solid var(--border)", borderRadius: "6px",
    outline: "none", appearance: "none" as const,
  },
  textarea: {
    width: "100%", padding: "9px 12px", fontSize: "14px",
    color: "var(--fg)", background: "var(--surface)",
    border: "1px solid var(--border)", borderRadius: "6px",
    outline: "none", resize: "vertical" as const, lineHeight: "1.6",
  },
  select: {
    width: "100%", padding: "9px 30px 9px 12px", fontSize: "14px",
    color: "var(--fg)", background: "var(--surface)",
    border: "1px solid var(--border)", borderRadius: "6px",
    outline: "none", appearance: "none" as const, cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23505050' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  },
};

function focus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = "var(--brand-secondary)";
}
function blur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = "var(--border)";
}

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label style={S.label}>
      {children}
      {optional && <span style={S.optional}>(valfritt)</span>}
    </label>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "11.5px", color: "var(--muted)", lineHeight: 1.45, margin: "-2px 0 2px" }}>
      {children}
    </p>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} style={S.input} onFocus={focus} onBlur={blur} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 5 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows} style={S.textarea} onFocus={focus} onBlur={blur} />
  );
}

// Formats on blur with Swedish locale — "7 500 000", "4 200", "0,0234"
function NumberInput({ value, onChange, placeholder, decimals = 0 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; decimals?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);

  const displayValue = isFocused
    ? value.replace(".", ",")   // show comma while editing too
    : value !== "" && !isNaN(Number(value))
      ? new Intl.NumberFormat("sv-SE", {
          minimumFractionDigits: 0,
          maximumFractionDigits: decimals,
        }).format(Number(value))
      : value;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Strip everything except digits, dot, comma, minus — then normalise to dot
    const raw = e.target.value.replace(/[^\d.,-]/g, "").replace(",", ".");
    onChange(raw);
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onFocus={e => { setIsFocused(true); focus(e); }}
      onBlur={e => { setIsFocused(false); blur(e); }}
      placeholder={placeholder}
      style={S.input}
    />
  );
}

function Select({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={S.select} onFocus={focus} onBlur={blur}>
      {children}
    </select>
  );
}

function Checkbox({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <label
      onClick={() => onChange(!checked)}
      style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", userSelect: "none" }}
    >
      <span
        style={{
          width: "18px", height: "18px", borderRadius: "4px",
          border: checked ? "none" : "1.5px solid var(--border-strong)",
          background: checked ? "var(--brand)" : "var(--surface)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, pointerEvents: "none", transition: "all 0.15s",
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span style={{ fontSize: "14px", color: "var(--fg)" }}>{label}</span>
    </label>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{children}</div>;
}

// Responsive 2-col grid
function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "12px",
    }}>{children}</div>
  );
}

function Grid3({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "12px",
    }}>{children}</div>
  );
}

// ─── Address autocomplete ─────────────────────────────────────────────────────

function AddressAutocomplete({ value, onChange, onSelect }: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (display: string, city: string, area: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 4) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    const results = await searchAddress(q);
    setSuggestions(results);
    setOpen(results.length > 0);
    setLoading(false);
  }, []);

  function handleChange(v: string) {
    onChange(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(v), 400);
  }

  function pick(r: NominatimResult) {
    const { city, area } = extractCityArea(r);
    const road = r.address.road ?? "";
    const num = r.address.house_number ? ` ${r.address.house_number}` : "";
    const display = road ? `${road}${num}` : r.display_name.split(",")[0];
    onSelect(display, city, area);
    setSuggestions([]);
    setOpen(false);
  }

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={value}
          onChange={e => handleChange(e.target.value)}
          placeholder="t.ex. Götgatan 12, 118 46 Stockholm"
          style={{ ...S.input, paddingRight: loading ? "36px" : S.input.padding }}
          onFocus={focus}
          onBlur={blur}
          autoComplete="off"
        />
        {loading && (
          <span style={{
            position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
            width: "14px", height: "14px", border: "2px solid var(--border)",
            borderTopColor: "var(--muted)", borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }} />
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          listStyle: "none", zIndex: 100, overflow: "hidden", maxHeight: "220px", overflowY: "auto",
        }}>
          {suggestions.map((r, i) => {
            const { city, area } = extractCityArea(r);
            const line1 = r.display_name.split(",").slice(0, 2).join(",").trim();
            const line2 = [area, city].filter(Boolean).join(", ");
            return (
              <li
                key={i}
                onMouseDown={() => pick(r)}
                style={{
                  padding: "10px 14px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid var(--border)" : "none",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--fg)" }}>{line1}</div>
                {line2 && <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "1px" }}>{line2}</div>}
              </li>
            );
          })}
        </ul>
      )}
      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── File upload for PDF / text ───────────────────────────────────────────────

function AnnualReportUpload({ value, onChange }: {
  value: string; onChange: (v: string) => void;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setFileName(file.name);
    setStatus("loading");
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/parse-pdf", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error ?? "Fel vid inläsning.");
      }
      onChange(json.text ?? "");
      setStatus("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Kunde inte läsa filen.");
      setStatus("error");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--brand-secondary)"; }}
        onDragLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
        onDrop={e => {
          e.preventDefault();
          e.currentTarget.style.borderColor = "var(--border)";
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        style={{
          border: "1.5px dashed var(--border)", borderRadius: "8px", padding: "20px",
          textAlign: "center", cursor: "pointer", transition: "border-color 0.15s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          style={{ display: "none" }}
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        {status === "loading" ? (
          <p style={{ fontSize: "13px", color: "var(--muted)" }}>Läser in {fileName}...</p>
        ) : status === "done" ? (
          <p style={{ fontSize: "13px", color: "var(--accent-green)" }}>
            ✓ {fileName} — {value.length.toLocaleString("sv-SE")} tecken inlästa
          </p>
        ) : status === "error" ? (
          <p style={{ fontSize: "13px", color: "var(--danger)" }}>{errorMsg}</p>
        ) : (
          <>
            <p style={{ fontSize: "13px", color: "var(--fg)", marginBottom: "2px" }}>
              Klicka eller dra hit en PDF eller textfil
            </p>
            <p style={{ fontSize: "11px", color: "var(--muted)" }}>PDF eller .txt, max 10 MB</p>
          </>
        )}
      </div>

      {/* Manual paste fallback */}
      <details style={{ fontSize: "12px" }}>
        <summary style={{ color: "var(--muted)", cursor: "pointer", padding: "4px 0" }}>
          Klistra in text manuellt istället
        </summary>
        <div style={{ marginTop: "8px" }}>
          <Textarea value={value} onChange={onChange} placeholder="Klistra in text från årsredovisningen..." rows={8} />
        </div>
      </details>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      {/* Desktop/tablet: full stepper */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`,
      }}>
        {STEPS.map((step, i) => {
          const done = step.id < current;
          const active = step.id === current;
          const lineColor = done ? "var(--brand)" : "var(--border)";
          const rightLineColor = (done && i < STEPS.length - 1) ? "var(--brand)" : "var(--border)";
          return (
            <div key={step.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {/* Left connector */}
              {i > 0 && (
                <div style={{
                  position: "absolute", left: 0, right: "50%", top: "11px",
                  height: "1px", background: lineColor,
                }} />
              )}
              {/* Right connector */}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: "absolute", left: "50%", right: 0, top: "11px",
                  height: "1px", background: rightLineColor,
                }} />
              )}
              {/* Circle */}
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%", zIndex: 1,
                background: done || active ? "var(--brand)" : "var(--surface)",
                border: done || active ? "none" : "1.5px solid var(--border-strong)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {done ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{ fontSize: "10px", fontWeight: 600, color: active ? "#fff" : "var(--muted)" }}>
                    {step.id}
                  </span>
                )}
              </div>
              {/* Label */}
              <span style={{
                fontSize: "10px", marginTop: "5px", textAlign: "center",
                color: active ? "var(--brand)" : done ? "var(--muted)" : "#999",
                fontWeight: active ? 600 : 400,
                lineHeight: 1.3,
                paddingLeft: "2px", paddingRight: "2px",
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step contents ────────────────────────────────────────────────────────────

function Step1({ f, set }: { f: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <FieldRow>
        <Label>Adress</Label>
        <AddressAutocomplete
          value={f.address}
          onChange={v => set("address", v)}
          onSelect={(display, city, area) => {
            set("address", display);
            if (city) set("city", city);
            if (area) set("area", area);
          }}
        />
      </FieldRow>

      <Grid2>
        <FieldRow>
          <Label optional>Område / stadsdel</Label>
          <Input value={f.area} onChange={v => set("area", v)} placeholder="t.ex. Södermalm" />
        </FieldRow>
        <FieldRow>
          <Label optional>Boyta (kvm)</Label>
          <NumberInput value={f.livingAreaSqm} onChange={v => set("livingAreaSqm", v)} placeholder="t.ex. 56" />
        </FieldRow>
      </Grid2>

      <Grid2>
        <FieldRow>
          <Label optional>Antal rum</Label>
          <Select value={f.rooms} onChange={v => set("rooms", v)}>
            <option value="">Välj antal</option>
            {["1","1.5","2","2.5","3","3.5","4","4.5","5","5.5","6+"].map(r => (
              <option key={r} value={r}>{r} rok</option>
            ))}
          </Select>
        </FieldRow>
        <FieldRow>
          <Label optional>Våning</Label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Select value={f.floor} onChange={v => set("floor", v)}>
              <option value="">–</option>
              {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                <option key={n} value={String(n)}>{n}</option>
              ))}
            </Select>
            <span style={{ fontSize: "12px", color: "var(--muted)", flexShrink: 0 }}>av</span>
            <Select value={f.totalFloors} onChange={v => set("totalFloors", v)}>
              <option value="">–</option>
              {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                <option key={n} value={String(n)}>{n}</option>
              ))}
            </Select>
          </div>
        </FieldRow>
      </Grid2>

      {/* Checkboxes */}
      <FieldRow>
        <Label optional>Bekvämligheter</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
          <Checkbox checked={f.hasBalcony} onChange={v => set("hasBalcony", v)} label="Balkong / uteplats" />
          <Checkbox checked={f.hasElevator} onChange={v => set("hasElevator", v)} label="Hiss" />
          <Checkbox checked={f.hasFireplace} onChange={v => set("hasFireplace", v)} label="Eldstad" />
        </div>
      </FieldRow>

      {f.hasBalcony && (
        <FieldRow>
          <Label optional>Balkongläge</Label>
          <Select value={f.balconyDirection} onChange={v => set("balconyDirection", v)}>
            <option value="">Välj läge</option>
            {["Söder","Norr","Öster","Väster","Sydöst","Sydväst","Nordöst","Nordväst","Mot gård","Mot gata"].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>
        </FieldRow>
      )}

      <FieldRow>
        <Label optional>Klistra in annons eller annan info</Label>
        <Hint>Inkludera gärna annons, budhistorik, årsredovisning och egna anteckningar.</Hint>
        <Textarea value={f.listingText} onChange={v => set("listingText", v)} placeholder="Klistra in text här..." rows={5} />
      </FieldRow>

      <FieldRow>
        <Label optional>Egna tankar om objektet</Label>
        <Hint>Vad gillar du? Vad oroar dig? Skriv dina tankar här.</Hint>
        <Textarea value={f.objectNotes} onChange={v => set("objectNotes", v)} placeholder="Skriv här..." rows={3} />
      </FieldRow>
    </div>
  );
}

function Step2({ f, set }: { f: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Grid2>
        <FieldRow>
          <Label>Utgångspris (kr)</Label>
          <NumberInput value={f.askingPrice} onChange={v => set("askingPrice", v)} placeholder="7 500 000" />
        </FieldRow>
        <FieldRow>
          <Label optional>Aktuellt bud (kr)</Label>
          <NumberInput value={f.currentBid} onChange={v => set("currentBid", v)} placeholder="8 100 000" />
        </FieldRow>
      </Grid2>
      <FieldRow>
        <Label>Månadsavgift (kr)</Label>
        <NumberInput value={f.monthlyFee} onChange={v => set("monthlyFee", v)} placeholder="4 200" />
      </FieldRow>
    </div>
  );
}

function Step3({ f, set }: { f: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <FieldRow>
        <Label optional>Föreningens namn</Label>
        <Input value={f.associationName} onChange={v => set("associationName", v)} placeholder="BRF Sveavägen" />
      </FieldRow>
      <Grid2>
        <FieldRow>
          <Label optional>Skuld per kvm (kr)</Label>
          <NumberInput value={f.associationDebtPerSqm} onChange={v => set("associationDebtPerSqm", v)} placeholder="8 500" />
        </FieldRow>
        <FieldRow>
          <Label optional>Kassa / likvida medel (kr)</Label>
          <NumberInput value={f.associationCash} onChange={v => set("associationCash", v)} placeholder="2 500 000" />
        </FieldRow>
      </Grid2>
      <Grid2>
        <FieldRow>
          <Label optional>Avgiftsändring senaste år (%)</Label>
          <NumberInput value={f.associationAnnualFeeChangePercent} onChange={v => set("associationAnnualFeeChangePercent", v)} placeholder="8" />
          <p style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.45, marginTop: "2px" }}>
            Över 5% på ett år räknas som högt. 10% är en tydlig varningssignal.
          </p>
        </FieldRow>
        <FieldRow>
          <Label optional>Andelstal</Label>
          <NumberInput value={f.ownershipShare} onChange={v => set("ownershipShare", v)} placeholder="0,0234" decimals={6} />
        </FieldRow>
      </Grid2>

      <FieldRow>
        <Label optional>Årsredovisning (PDF eller text)</Label>
        <AnnualReportUpload value={f.annualReportText} onChange={v => set("annualReportText", v)} />
      </FieldRow>
    </div>
  );
}

function Step4({ f, set }: { f: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <FieldRow>
        <Label optional>Planerade renoveringar och underhåll</Label>
        <Textarea value={f.plannedRenovations} onChange={v => set("plannedRenovations", v)}
          placeholder="t.ex. fasadrenovering 2026, stambyte planerat 2027, ny hiss" rows={4} />
      </FieldRow>
    </div>
  );
}

function Step5({ f, set }: { f: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Grid2>
        <FieldRow>
          <Label optional>Max budget (kr)</Label>
          <NumberInput value={f.userMaxBudget} onChange={v => set("userMaxBudget", v)} placeholder="9 000 000" />
        </FieldRow>
        <FieldRow>
          <Label optional>Kontantinsats (kr)</Label>
          <NumberInput value={f.userDownPayment} onChange={v => set("userDownPayment", v)} placeholder="1 800 000" />
        </FieldRow>
      </Grid2>
      <FieldRow>
        <Label optional>Max månadsutlägg du är bekväm med (kr)</Label>
        <NumberInput value={f.userMonthlyComfortLimit} onChange={v => set("userMonthlyComfortLimit", v)} placeholder="18 000" />
      </FieldRow>
      <FieldRow>
        <Label optional>Dina tankar och preferenser</Label>
        <Textarea value={f.userNotes} onChange={v => set("userNotes", v)}
          placeholder="Vad väger tungt? Vad oroar dig? Hur länge planerar du bo kvar?" rows={4} />
      </FieldRow>
    </div>
  );
}

function Step6({ f, set }: { f: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Annons-länk */}
      <FieldRow>
        <Label optional>Länk till annons</Label>
        <Input value={f.listingUrl} onChange={v => set("listingUrl", v)}
          placeholder="hemnet.se, booli.se eller mäklarens hemsida" type="url" />
      </FieldRow>

      {/* Budgivningsstatus */}
      <FieldRow>
        <Label optional>Budgivningsstatus</Label>
        <Textarea value={f.biddingText} onChange={v => set("biddingText", v)}
          placeholder="Antal budgivare, budhöjningar, aktuellt läge i budgivningen..." rows={4} />
      </FieldRow>

      {/* Övrig info */}
      <FieldRow>
        <Label optional>Övrig info från mäklare / visning</Label>
        <Textarea value={f.agentInfoText} onChange={v => set("agentInfoText", v)}
          placeholder="Mail, anteckningar, info om grannar, föreningen m.m." rows={4} />
      </FieldRow>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function NewAnalysisPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeTitle, setAnalyzeTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function next() {
    if (step === 1 && !form.address.trim()) {
      setError("Ange en adress för att fortsätta.");
      return;
    }
    setError(null);
    if (step < 6) setStep(s => s + 1);
  }

  function back() {
    setError(null);
    if (step > 1) setStep(s => s - 1);
  }

  async function safeJson(res: Response): Promise<Record<string, string> | null> {
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  }

  function buildTitle(): string {
    const parts: string[] = [];
    if (form.address.trim()) parts.push(form.address.trim());
    if (form.livingAreaSqm) parts.push(`${form.livingAreaSqm} kvm`);
    if (form.rooms) parts.push(`${form.rooms} rok`);
    return parts.join(", ") || "Ny analys";
  }

  async function handleAnalyze() {
    setError(null);
    setLoading(true);

    const title = buildTitle();
    setAnalyzeTitle(title);
    setAnalyzing(true);

    const numericFields = [
      "askingPrice","currentBid","monthlyFee","livingAreaSqm","rooms",
      "floor","totalFloors","associationDebtPerSqm","associationCash",
      "associationAnnualFeeChangePercent","ownershipShare",
      "userMaxBudget","userDownPayment","userMonthlyComfortLimit",
    ] as const;

    const payload: Record<string, unknown> = {
      ...form,
      title,
      userNotes: [form.userNotes, form.objectNotes].filter(Boolean).join("\n\n") || undefined,
    };

    for (const field of numericFields) {
      const val = form[field] as string;
      if (!val) { delete payload[field]; continue; }
      const n = Number(val);
      payload[field] = isNaN(n) ? undefined : n;
    }

    // Clean empty strings
    for (const key of Object.keys(payload)) {
      if (payload[key] === "" || payload[key] === undefined) delete payload[key];
    }

    try {
      const createRes = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const createJson = await safeJson(createRes);
      if (!createRes.ok) {
        throw new Error(createJson?.error ?? `Kunde inte spara analysen (fel ${createRes.status}).`);
      }

      const { id } = createJson as { id: string };

      const runRes = await fetch(`/api/analyses/${id}/run`, { method: "POST" });
      const runJson = await safeJson(runRes);

      if (!runRes.ok) {
        throw new Error(runJson?.error ?? `Analysen misslyckades (fel ${runRes.status}).`);
      }

      router.push(`/result/${id}`);
    } catch (err) {
      setAnalyzing(false);
      setError(err instanceof Error ? err.message : "Något gick fel.");
      setLoading(false);
    }
  }

  if (analyzing) {
    return <AnalyzingScreen title={analyzeTitle} />;
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "calc(100vh - 52px)", padding: "32px 16px 80px" }}>
      <div style={{ maxWidth: "580px", margin: "0 auto" }}>
        {/* Back */}
        <a href="/" style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          fontSize: "13px", color: "var(--muted)", textDecoration: "none", marginBottom: "24px",
        }}>
          ← Tillbaka
        </a>

        {/* Heading */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Ny analys
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.55, maxWidth: "460px" }}>
            Fyll i det du vet om bostaden. Det räcker med några uppgifter för att få en preliminär
            risknivå. Ju mer du lägger till, desto bättre blir fullrapporten.
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Card */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "12px", padding: "24px",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "20px" }}>
            {STEPS[step - 1].label}
          </h2>

          {step === 1 && <Step1 f={form} set={set} />}
          {step === 2 && <Step2 f={form} set={set} />}
          {step === 3 && <Step3 f={form} set={set} />}
          {step === 4 && <Step4 f={form} set={set} />}
          {step === 5 && <Step5 f={form} set={set} />}
          {step === 6 && <Step6 f={form} set={set} />}

          {error && (
            <div style={{
              marginTop: "16px", padding: "10px 12px",
              background: "var(--danger-bg)", border: "1px solid var(--danger-border)",
              borderRadius: "6px", fontSize: "13px", color: "var(--danger)",
            }}>
              {error}
            </div>
          )}

          {/* Nav buttons */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)",
            gap: "12px",
          }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={back}
                style={{
                  fontSize: "13px", color: "var(--muted)",
                  background: "none", border: "1px solid var(--border)",
                  borderRadius: "6px", padding: "9px 16px", cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                ← Tillbaka
              </button>
            ) : <div />}

            {step < 6 ? (
              <button
                type="button"
                onClick={next}
                style={{
                  fontSize: "13px", fontWeight: 600, color: "#fff",
                  background: "var(--brand)", border: "none", borderRadius: "6px",
                  padding: "9px 24px", cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                Nästa →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                  fontSize: "13px", fontWeight: 600,
                  color: loading ? "var(--muted)" : "#fff",
                  background: loading ? "var(--border)" : "var(--brand)",
                  border: "none", borderRadius: "6px",
                  padding: "9px 24px", cursor: loading ? "not-allowed" : "pointer",
                  minWidth: "140px", whiteSpace: "nowrap",
                }}
              >
                {loading ? "Bedömer risk..." : "Få preliminär risknivå →"}
              </button>
            )}
          </div>
        </div>

        {/* Step counter on mobile */}
        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "11px", color: "var(--muted-light)" }}>
          Steg {step} av {STEPS.length}
        </p>
      </div>
    </div>
  );
}
