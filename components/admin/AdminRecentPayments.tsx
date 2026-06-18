import type { AdminRecentPayment } from "@/lib/admin-stats";

export function AdminRecentPayments({ payments }: { payments: AdminRecentPayment[] }) {
  if (payments.length === 0) {
    return (
      <section className="admin-panel">
        <h2 className="admin-panel-title">Senaste betalningar</h2>
        <p className="admin-empty">Inga betalningar ännu.</p>
      </section>
    );
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <h2 className="admin-panel-title">Senaste betalningar</h2>
        <p className="admin-panel-desc">15 senaste betalda analyser (alla tider)</p>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Objekt</th>
              <th>Stad</th>
              <th>Betalat</th>
              <th>Belopp</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="admin-table-title">{payment.title}</td>
                <td>{payment.city ?? "—"}</td>
                <td>
                  {new Date(payment.paidAt).toLocaleString("sv-SE", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td>{payment.amountSek} kr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
