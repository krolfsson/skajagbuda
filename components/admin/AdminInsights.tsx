import type { AdminStats } from "@/lib/admin-stats";
import { AdminRecentFeedback } from "@/components/admin/AdminRecentFeedback";

const RISK_ORDER = ["Låg", "Medel", "Hög", "Mycket hög"];

export function AdminInsights({ stats }: { stats: AdminStats["summary"] }) {
  const riskEntries = RISK_ORDER.map((level) => ({
    level,
    count: stats.riskDistribution[level] ?? 0,
  })).filter((entry) => entry.count > 0);

  const riskTotal = riskEntries.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <div className="admin-insights-grid">
      <section className="admin-card">
        <h2 className="admin-card-title">Riskfördelning</h2>
        {riskTotal > 0 ? (
          <ul className="admin-risk-list">
            {riskEntries.map((entry) => (
              <li key={entry.level} className="admin-risk-item">
                <span className="admin-risk-label">{entry.level}</span>
                <span className="admin-risk-bar-wrap" aria-hidden="true">
                  <span
                    className="admin-risk-bar"
                    style={{ width: `${Math.round((entry.count / riskTotal) * 100)}%` }}
                  />
                </span>
                <span className="admin-risk-count">{entry.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-card-sub">Ingen riskdata i perioden ännu.</p>
        )}
        {stats.averageScore != null && (
          <p className="admin-insight-foot">Genomsnittlig score: {stats.averageScore}</p>
        )}
      </section>

      <section className="admin-card">
        <h2 className="admin-card-title">Feedback</h2>
        <div className="admin-feedback-summary">
          <div>
            <p className="admin-kpi-label">Ja</p>
            <p className="admin-insight-value">{stats.feedbackCounts.yes}</p>
          </div>
          <div>
            <p className="admin-kpi-label">Delvis</p>
            <p className="admin-insight-value">{stats.feedbackCounts.partial}</p>
          </div>
          <div>
            <p className="admin-kpi-label">Nej</p>
            <p className="admin-insight-value">{stats.feedbackCounts.no}</p>
          </div>
        </div>
        <p className="admin-card-sub">{stats.feedbackCounts.total} svar totalt i perioden</p>
      </section>
    </div>
  );
}

export function AdminInsightsSection({ stats }: { stats: AdminStats }) {
  return (
    <>
      <AdminInsights stats={stats.summary} />
      <section className="admin-card admin-card--table-section">
        <div className="admin-card-head">
          <h2 className="admin-card-title">Senaste feedback</h2>
        </div>
        <AdminRecentFeedback feedback={stats.recentFeedback} />
      </section>
    </>
  );
}
