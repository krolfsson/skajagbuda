import type { AdminRecentPayment } from "@/lib/admin-stats";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

export function AdminRecentPayments({
  payments,
  compact = false,
}: {
  payments: AdminRecentPayment[];
  compact?: boolean;
}) {
  if (payments.length === 0) {
    return (
      <AdminEmptyState
        compact={compact}
        icon="wallet"
        title="Inga betalningar ännu"
        description="Betalningar visas här när de kommer in."
      />
    );
  }

  const rows = compact ? payments.slice(0, 6) : payments;

  return (
    <>
      <div className="admin-table-desktop">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tid</th>
              <th>Objekt</th>
              <th>Belopp</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((payment) => (
              <tr key={payment.id}>
                <td className="admin-table-muted">
                  {new Date(payment.paidAt).toLocaleString("sv-SE", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="admin-table-title">{payment.title}</td>
                <td>{payment.amountSek} kr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-cards-mobile">
        {rows.map((payment) => (
          <article key={payment.id} className="admin-card-row">
            <div className="admin-card-row__head">
              <span className="admin-status admin-status--paid">{payment.amountSek} kr</span>
              <time className="admin-table-muted">
                {new Date(payment.paidAt).toLocaleString("sv-SE", {
                  day: "numeric",
                  month: "short",
                })}
              </time>
            </div>
            <p className="admin-card-row__title">{payment.title}</p>
          </article>
        ))}
      </div>
    </>
  );
}
