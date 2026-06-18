import type { AdminStats } from "@/lib/admin-stats";

export function AdminKpiGrid({ summary }: { summary: AdminStats["summary"] }) {
  const cards = [
    {
      label: "Intäkter",
      value: `${summary.revenueSek.toLocaleString("sv-SE")} kr`,
      hint: `${summary.paid} betalda × 29 kr`,
      accent: true,
    },
    {
      label: "Betalda analyser",
      value: summary.paid.toLocaleString("sv-SE"),
      hint: `${summary.checkoutConversionRate}% av checkout`,
    },
    {
      label: "Påbörjade analyser",
      value: summary.totalStarted.toLocaleString("sv-SE"),
      hint: `${summary.freeCompleted} gratis klara`,
    },
    {
      label: "Konvertering",
      value: `${summary.conversionRate}%`,
      hint: `${summary.checkoutsStarted} checkout · ${summary.pendingCheckouts} väntande`,
    },
  ];

  return (
    <div className="admin-kpi-grid">
      {cards.map((card) => (
        <article
          key={card.label}
          className={`admin-kpi-card${card.accent ? " admin-kpi-card--accent" : ""}`}
        >
          <p className="admin-kpi-label">{card.label}</p>
          <p className="admin-kpi-value">{card.value}</p>
          <p className="admin-kpi-hint">{card.hint}</p>
        </article>
      ))}
    </div>
  );
}
