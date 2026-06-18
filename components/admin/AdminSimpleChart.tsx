import type { AdminTimeSeriesPoint } from "@/lib/admin-stats";

type Variant = "analyses" | "revenue";

function niceMax(value: number) {
  if (value <= 0) return 4;
  if (value <= 5) return Math.max(value, 4);
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

function pickLabels(series: AdminTimeSeriesPoint[]) {
  const maxLabels = 6;
  const step = Math.max(1, Math.ceil(series.length / maxLabels));
  return series.map((point, index) =>
    index % step === 0 || index === series.length - 1 ? point.label : "",
  );
}

export function AdminSimpleChart({
  series,
  variant,
}: {
  series: AdminTimeSeriesPoint[];
  variant: Variant;
}) {
  if (series.length === 0) return null;

  const primary = variant === "revenue" ? series.map((p) => p.revenueSek) : series.map((p) => p.started);
  const secondary = variant === "analyses" ? series.map((p) => p.paid) : null;
  const max = niceMax(Math.max(...primary, ...(secondary ?? []), 0));
  const ticks = [max, Math.round(max / 2), 0];
  const labels = pickLabels(series);

  const w = 100;
  const h = 100;
  const pad = { t: 8, r: 4, b: 4, l: 4 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  const toPoint = (values: number[], i: number) => ({
    x: pad.l + (series.length <= 1 ? innerW / 2 : (i / (series.length - 1)) * innerW),
    y: pad.t + innerH - (values[i] / max) * innerH,
  });

  const pathFor = (values: number[]) =>
    values
      .map((_, i) => {
        const p = toPoint(values, i);
        return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(" ");

  return (
    <div className="admin-chart-block">
      <div className="admin-chart-block__y">
        {ticks.map((tick) => (
          <span key={tick}>{variant === "revenue" ? tick : tick}</span>
        ))}
      </div>
      <div className="admin-chart-block__body">
        {variant === "analyses" && (
          <div className="admin-chart-legend">
            <span className="admin-legend-item">
              <span className="admin-legend-line admin-legend-line--muted" />
              Påbörjade
            </span>
            <span className="admin-legend-item">
              <span className="admin-legend-line admin-legend-line--brand" />
              Betalda
            </span>
          </div>
        )}
        <svg viewBox={`0 0 ${w} ${h}`} className="admin-line-svg" preserveAspectRatio="none">
          {[0.25, 0.5, 0.75, 1].map((t) => {
            const y = pad.t + innerH * (1 - t);
            return (
              <line key={t} x1={pad.l} x2={w - pad.r} y1={y} y2={y} className="admin-line-grid" />
            );
          })}
          {secondary && (
            <path d={pathFor(primary)} className="admin-line admin-line--muted" fill="none" />
          )}
          <path
            d={pathFor(secondary ?? primary)}
            className="admin-line admin-line--brand"
            fill="none"
          />
        </svg>
        <div className="admin-chart-block__x">
          {labels.map((label, i) => (
            <span key={`${series[i].period}-x`}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
