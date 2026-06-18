import { FULL_ANALYSIS_PRICE_SEK } from "@/lib/brand";
import type { AdminStats } from "@/lib/admin-stats";

function IconCoin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v8M9 10h5a2 2 0 0 1 0 4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconFunnel() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="10" cy="19" r="1.2" fill="currentColor" />
      <circle cx="17" cy="19" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function AdminKpiGrid({ summary }: { summary: AdminStats["summary"] }) {
  const cards = [
    {
      label: "Intäkter",
      value: `${summary.revenueSek.toLocaleString("sv-SE")} kr`,
      hint: `${summary.paid} betalda × ${FULL_ANALYSIS_PRICE_SEK} kr`,
      icon: IconCoin,
      accent: true,
    },
    {
      label: "Betalda analyser",
      value: String(summary.paid),
      hint: `${summary.checkoutConversionRate}% av checkout`,
      icon: IconCard,
    },
    {
      label: "Påbörjade analyser",
      value: String(summary.totalStarted),
      hint: `${summary.freeCompleted} gratis klara`,
      icon: IconClock,
    },
    {
      label: "Konvertering",
      value: `${summary.conversionRate}%`,
      hint: `${summary.checkoutsStarted} checkout · ${summary.pendingCheckouts} väntande`,
      icon: IconFunnel,
    },
    {
      label: "Checkout-startade",
      value: String(summary.checkoutsStarted),
      hint: `${summary.pendingCheckouts} väntande`,
      icon: IconCart,
    },
  ];

  return (
    <div className="admin-kpi-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className={`admin-kpi-card${card.accent ? " admin-kpi-card--accent" : ""}`}
          >
            <div className="admin-kpi-card__top">
              <p className="admin-kpi-label">{card.label}</p>
              <span className="admin-kpi-icon">
                <Icon />
              </span>
            </div>
            <p className="admin-kpi-value">{card.value}</p>
            <p className="admin-kpi-hint">{card.hint}</p>
          </article>
        );
      })}
    </div>
  );
}
