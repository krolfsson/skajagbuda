"use client";

import { useState } from "react";
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

function smoothLinePath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

function smoothAreaPath(points: { x: number; y: number }[], baseY: number) {
  if (points.length === 0) return "";
  const line = smoothLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L ${last.x.toFixed(2)} ${baseY.toFixed(2)} L ${first.x.toFixed(2)} ${baseY.toFixed(2)} Z`;
}

export function AdminSimpleChart({
  series,
  variant,
}: {
  series: AdminTimeSeriesPoint[];
  variant: Variant;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

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
  const baseY = pad.t + innerH;

  const toPoint = (values: number[], i: number) => ({
    x: pad.l + (series.length <= 1 ? innerW / 2 : (i / (series.length - 1)) * innerW),
    y: pad.t + innerH - (values[i] / max) * innerH,
  });

  const primaryPoints = primary.map((_, i) => toPoint(primary, i));
  const secondaryPoints = secondary ? secondary.map((_, i) => toPoint(secondary, i)) : null;
  const mainPoints = secondaryPoints ?? primaryPoints;
  const mutedPoints = secondary ? primaryPoints : null;

  const activeIndex = hoverIndex ?? null;
  const activePoint = activeIndex != null ? series[activeIndex] : null;

  const pctX = (x: number) => (x / w) * 100;
  const pctY = (y: number) => (y / h) * 100;

  return (
    <div className="admin-chart-block">
      <div className="admin-chart-block__y">
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
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

        <div className="admin-chart-plot" onMouseLeave={() => setHoverIndex(null)}>
          {activePoint && activeIndex != null && (
            <div
              className="admin-chart-tooltip"
              style={{ left: `${(mainPoints[activeIndex].x / w) * 100}%` }}
            >
              <p className="admin-chart-tooltip__label">{activePoint.label}</p>
              {variant === "revenue" ? (
                <p className="admin-chart-tooltip__value">{activePoint.revenueSek} kr</p>
              ) : (
                <>
                  <p className="admin-chart-tooltip__value">Påbörjade: {activePoint.started}</p>
                  <p className="admin-chart-tooltip__value admin-chart-tooltip__value--muted">
                    Betalda: {activePoint.paid}
                  </p>
                </>
              )}
            </div>
          )}

          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="admin-line-svg"
            preserveAspectRatio="none"
          >
            {[0.25, 0.5, 0.75, 1].map((t) => {
              const y = pad.t + innerH * (1 - t);
              return (
                <line key={t} x1={pad.l} x2={w - pad.r} y1={y} y2={y} className="admin-line-grid" />
              );
            })}

            {mutedPoints && (
              <>
                <path d={smoothAreaPath(mutedPoints, baseY)} className="admin-area admin-area--muted" />
                <path d={smoothLinePath(mutedPoints)} className="admin-line admin-line--muted" fill="none" />
              </>
            )}

            <path d={smoothAreaPath(mainPoints, baseY)} className="admin-area admin-area--brand" />
            <path d={smoothLinePath(mainPoints)} className="admin-line admin-line--brand" fill="none" />
          </svg>

          <div className="admin-chart-overlay" aria-hidden="true">
            {series.map((_, i) => {
              const hitW = series.length <= 1 ? innerW : innerW / (series.length - 1);
              const cx = mainPoints[i].x;
              return (
                <button
                  key={series[i].period}
                  type="button"
                  className="admin-chart-hit"
                  style={{
                    left: `${pctX(cx - hitW / 2)}%`,
                    top: `${pctY(pad.t)}%`,
                    width: `${pctX(hitW)}%`,
                    height: `${pctY(innerH)}%`,
                  }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onFocus={() => setHoverIndex(i)}
                  onBlur={() => setHoverIndex(null)}
                  tabIndex={-1}
                />
              );
            })}

            {activeIndex != null && (
              <>
                <span
                  className="admin-chart-cursor-line"
                  style={{
                    left: `${pctX(mainPoints[activeIndex].x)}%`,
                    top: `${pctY(pad.t)}%`,
                    height: `${pctY(innerH)}%`,
                  }}
                />
                {mutedPoints && (
                  <span
                    className="admin-chart-dot admin-chart-dot--muted"
                    style={{
                      left: `${pctX(mutedPoints[activeIndex].x)}%`,
                      top: `${pctY(mutedPoints[activeIndex].y)}%`,
                    }}
                  />
                )}
                <span
                  className="admin-chart-dot admin-chart-dot--brand"
                  style={{
                    left: `${pctX(mainPoints[activeIndex].x)}%`,
                    top: `${pctY(mainPoints[activeIndex].y)}%`,
                  }}
                />
              </>
            )}
          </div>
        </div>

        <div className="admin-chart-block__x">
          {labels.map((label, i) => (
            <span key={`${series[i].period}-x`}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
