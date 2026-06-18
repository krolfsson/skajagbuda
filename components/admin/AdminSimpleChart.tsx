"use client";

import { useCallback, useId, useState } from "react";
import type { AdminTimeSeriesPoint } from "@/lib/admin-stats";

type Variant = "analyses" | "revenue";
type PlotPoint = { x: number; y: number };

const VB = { w: 100, h: 100, pad: { t: 8, r: 4, b: 4, l: 4 } };

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

function smoothLinePath(points: PlotPoint[], minY: number, maxY: number) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  const clampY = (y: number) => Math.max(minY, Math.min(maxY, y));

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = clampY(p1.y + (p2.y - p0.y) / 6);
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = clampY(p2.y - (p3.y - p1.y) / 6);

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

function smoothAreaPath(points: PlotPoint[], baseY: number, minY: number, maxY: number) {
  if (points.length === 0) return "";
  const line = smoothLinePath(points, minY, maxY);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L ${last.x.toFixed(2)} ${baseY.toFixed(2)} L ${first.x.toFixed(2)} ${baseY.toFixed(2)} Z`;
}

function nearestIndex(clientX: number, rect: DOMRect, count: number) {
  const { pad, w } = VB;
  const innerW = w - pad.l - pad.r;
  const ratio = (clientX - rect.left) / rect.width;
  const x = pad.l + ratio * innerW;
  const raw = count <= 1 ? 0 : ((x - pad.l) / innerW) * (count - 1);
  return Math.max(0, Math.min(count - 1, Math.round(raw)));
}

export function AdminSimpleChart({
  series,
  variant,
}: {
  series: AdminTimeSeriesPoint[];
  variant: Variant;
}) {
  const clipId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handlePlotMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      setHoverIndex(nearestIndex(event.clientX, rect, series.length));
    },
    [series.length],
  );

  if (series.length === 0) return null;

  const primary = variant === "revenue" ? series.map((p) => p.revenueSek) : series.map((p) => p.started);
  const secondary = variant === "analyses" ? series.map((p) => p.paid) : null;
  const max = niceMax(Math.max(...primary, ...(secondary ?? []), 0));
  const ticks = [max, Math.round(max / 2), 0];
  const labels = pickLabels(series);

  const { w, h, pad } = VB;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const baseY = pad.t + innerH;
  const minY = pad.t;
  const maxY = baseY;

  const toPoint = (values: number[], i: number): PlotPoint => ({
    x: pad.l + (series.length <= 1 ? innerW / 2 : (i / (series.length - 1)) * innerW),
    y: pad.t + innerH - (values[i] / max) * innerH,
  });

  const primaryPoints = primary.map((_, i) => toPoint(primary, i));
  const secondaryPoints = secondary ? secondary.map((_, i) => toPoint(secondary, i)) : null;
  const mainPoints = secondaryPoints ?? primaryPoints;
  const mutedPoints = secondary ? primaryPoints : null;

  const activeIndex = hoverIndex;
  const activePoint = activeIndex != null ? series[activeIndex] : null;

  const pctX = (x: number) => `${((x - pad.l) / innerW) * 100}%`;
  const pctY = (y: number) => `${((y - pad.t) / innerH) * 100}%`;

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

        <div
          className="admin-chart-plot"
          onMouseMove={handlePlotMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <svg viewBox={`0 0 ${w} ${h}`} className="admin-line-svg" preserveAspectRatio="none">
            <defs>
              <clipPath id={clipId}>
                <rect x={pad.l} y={pad.t} width={innerW} height={innerH} />
              </clipPath>
            </defs>

            {[0.25, 0.5, 0.75, 1].map((t) => {
              const y = pad.t + innerH * (1 - t);
              return (
                <line key={t} x1={pad.l} x2={w - pad.r} y1={y} y2={y} className="admin-line-grid" />
              );
            })}

            <g clipPath={`url(#${clipId})`}>
              {mutedPoints && (
                <>
                  <path
                    d={smoothAreaPath(mutedPoints, baseY, minY, maxY)}
                    className="admin-area admin-area--muted"
                  />
                  <path
                    d={smoothLinePath(mutedPoints, minY, maxY)}
                    className="admin-line admin-line--muted"
                    fill="none"
                  />
                </>
              )}

              <path
                d={smoothAreaPath(mainPoints, baseY, minY, maxY)}
                className="admin-area admin-area--brand"
              />
              <path
                d={smoothLinePath(mainPoints, minY, maxY)}
                className="admin-line admin-line--brand"
                fill="none"
              />
            </g>
          </svg>

          <div className="admin-chart-overlay" aria-hidden="true">
            {activeIndex != null && activePoint && (
              <>
                <span
                  className="admin-chart-cursor-line"
                  style={{
                    left: pctX(mainPoints[activeIndex].x),
                    top: 0,
                    height: "100%",
                  }}
                />
                {mutedPoints && (
                  <span
                    className="admin-chart-dot admin-chart-dot--muted"
                    style={{
                      left: pctX(mutedPoints[activeIndex].x),
                      top: pctY(mutedPoints[activeIndex].y),
                    }}
                  />
                )}
                <span
                  className="admin-chart-dot admin-chart-dot--brand"
                  style={{
                    left: pctX(mainPoints[activeIndex].x),
                    top: pctY(mainPoints[activeIndex].y),
                  }}
                />
                <div
                  className="admin-chart-tooltip"
                  style={{
                    left: pctX(mainPoints[activeIndex].x),
                    top: pctY(mainPoints[activeIndex].y),
                  }}
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
