import type { AdminTimeSeriesPoint } from "@/lib/admin-stats";

type ChartMode = "funnel" | "revenue";

export function AdminBarChart({
  series,
  mode = "funnel",
}: {
  series: AdminTimeSeriesPoint[];
  mode?: ChartMode;
}) {
  if (series.length === 0) {
    return <p className="admin-empty">Ingen data i vald period.</p>;
  }

  const maxValue = Math.max(
    ...series.map((point) =>
      mode === "revenue" ? point.revenueSek : Math.max(point.started, point.paid),
    ),
    1,
  );

  const chartHeight = 220;
  const barGap = series.length > 20 ? 4 : 8;
  const barWidth = Math.min(36, Math.max(12, (640 - barGap * series.length) / series.length));

  return (
    <div className="admin-chart-wrap">
      <svg
        className="admin-chart"
        viewBox={`0 0 ${series.length * (barWidth + barGap) + 40} ${chartHeight + 48}`}
        role="img"
        aria-label={mode === "revenue" ? "Intäkter per period" : "Påbörjade och betalda analyser"}
      >
        {series.map((point, index) => {
          const x = 20 + index * (barWidth + barGap);
          const startedHeight =
            mode === "funnel" ? (point.started / maxValue) * chartHeight : 0;
          const paidHeight =
            mode === "funnel"
              ? (point.paid / maxValue) * chartHeight
              : (point.revenueSek / maxValue) * chartHeight;
          const groupWidth = mode === "funnel" ? barWidth / 2 - 1 : barWidth;

          return (
            <g key={point.period}>
              {mode === "funnel" ? (
                <>
                  <rect
                    x={x}
                    y={chartHeight - startedHeight + 8}
                    width={groupWidth}
                    height={startedHeight}
                    rx={3}
                    className="admin-chart-bar admin-chart-bar--started"
                  />
                  <rect
                    x={x + groupWidth + 2}
                    y={chartHeight - paidHeight + 8}
                    width={groupWidth}
                    height={paidHeight}
                    rx={3}
                    className="admin-chart-bar admin-chart-bar--paid"
                  />
                </>
              ) : (
                <rect
                  x={x}
                  y={chartHeight - paidHeight + 8}
                  width={barWidth}
                  height={paidHeight}
                  rx={3}
                  className="admin-chart-bar admin-chart-bar--revenue"
                />
              )}
              {(series.length <= 14 || index % Math.ceil(series.length / 10) === 0) && (
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 28}
                  textAnchor="middle"
                  className="admin-chart-label"
                >
                  {point.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {mode === "funnel" && (
        <div className="admin-chart-legend">
          <span className="admin-legend-item">
            <span className="admin-legend-swatch admin-legend-swatch--started" />
            Påbörjade
          </span>
          <span className="admin-legend-item">
            <span className="admin-legend-swatch admin-legend-swatch--paid" />
            Betalda
          </span>
        </div>
      )}
    </div>
  );
}
