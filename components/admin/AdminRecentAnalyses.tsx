import type { AdminRecentAnalysis } from "@/lib/admin-stats";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

function statusClass(status: AdminRecentAnalysis["status"]) {
  switch (status) {
    case "Betald":
      return "admin-status admin-status--paid";
    case "Checkout":
      return "admin-status admin-status--checkout";
    case "Gratis klar":
      return "admin-status admin-status--free";
    default:
      return "admin-status admin-status--started";
  }
}

function StatusIcon({ status }: { status: AdminRecentAnalysis["status"] }) {
  if (status === "Gratis klar") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === "Checkout") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6h12l-1 7H7L6 6Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (status === "Betald") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="7" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  return null;
}

function riskDotClass(risk: string | null) {
  if (!risk) return "admin-risk-dot admin-risk-dot--none";
  const lower = risk.toLowerCase();
  if (lower.includes("låg") || lower.includes("low")) return "admin-risk-dot admin-risk-dot--low";
  if (lower.includes("hög") || lower.includes("high")) return "admin-risk-dot admin-risk-dot--high";
  return "admin-risk-dot admin-risk-dot--medium";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("sv-SE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminRecentAnalyses({ analyses }: { analyses: AdminRecentAnalysis[] }) {
  if (analyses.length === 0) {
    return (
      <AdminEmptyState
        title="Inga analyser i vald period"
        description="Nya analyser visas här när någon startar ett objekt."
      />
    );
  }

  return (
    <>
      <div className="admin-table-desktop">
        <table className="admin-table admin-table--analyses">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Objekt</th>
              <th>Status</th>
              <th>Score</th>
              <th>Risk</th>
              <th aria-label="Åtgärder" />
            </tr>
          </thead>
          <tbody>
            {analyses.map((row) => (
              <tr key={row.id}>
                <td className="admin-table-muted">{formatDate(row.createdAt)}</td>
                <td className="admin-table-title">{row.title}</td>
                <td>
                  <span className={statusClass(row.status)}>
                    <StatusIcon status={row.status} />
                    {row.status}
                  </span>
                </td>
                <td className="admin-table-score">
                  {row.score != null ? `${row.score} / 100` : "—"}
                </td>
                <td>
                  {row.riskLevel ? (
                    <span className="admin-risk">
                      <span className={riskDotClass(row.riskLevel)} />
                      {row.riskLevel}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="admin-table-menu">
                  <button type="button" className="admin-row-menu" aria-label="Visa alternativ">
                    ···
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-cards-mobile">
        {analyses.map((row) => (
          <article key={row.id} className="admin-card-row">
            <div className="admin-card-row__head">
              <span className={statusClass(row.status)}>
                <StatusIcon status={row.status} />
                {row.status}
              </span>
              <time className="admin-table-muted">{formatDate(row.createdAt)}</time>
            </div>
            <p className="admin-card-row__title">{row.title}</p>
            <dl className="admin-card-row__meta">
              <div>
                <dt>Score</dt>
                <dd>{row.score != null ? `${row.score} / 100` : "—"}</dd>
              </div>
              <div>
                <dt>Risk</dt>
                <dd>{row.riskLevel ?? "—"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
