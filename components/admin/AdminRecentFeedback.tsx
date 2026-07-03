import type { AdminRecentFeedback as AdminRecentFeedbackRow } from "@/lib/admin-stats";

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function AdminRecentFeedback({ feedback }: { feedback: AdminRecentFeedbackRow[] }) {
  if (feedback.length === 0) {
    return <p className="admin-empty-inline">Ingen feedback ännu.</p>;
  }

  return (
    <>
      <div className="admin-table-desktop">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tid</th>
              <th>Objekt</th>
              <th>Feedback</th>
              <th>Score</th>
              <th>Risk</th>
              <th>Kommentar</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((row) => (
              <tr key={row.id}>
                <td>{fmtDate(row.createdAt)}</td>
                <td>{row.objectAddress ?? "–"}</td>
                <td>{row.value}</td>
                <td>{row.score ?? "–"}</td>
                <td>{row.riskLevel ?? "–"}</td>
                <td className="admin-feedback-comment">{row.comment ?? "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-cards-mobile">
        {feedback.map((row) => (
          <article key={row.id} className="admin-card-row">
            <p className="admin-card-row-title">{row.objectAddress ?? "Okänt objekt"}</p>
            <p className="admin-card-row-meta">
              {fmtDate(row.createdAt)} · {row.value}
              {row.score != null ? ` · score ${row.score}` : ""}
              {row.riskLevel ? ` · ${row.riskLevel}` : ""}
            </p>
            {row.comment && <p className="admin-card-row-body">{row.comment}</p>}
          </article>
        ))}
      </div>
    </>
  );
}
