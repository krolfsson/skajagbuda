"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { AdminGranularity, AdminRange, AdminStats } from "@/lib/admin-stats";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminKpiGrid } from "@/components/admin/AdminKpiGrid";
import { AdminSimpleChart } from "@/components/admin/AdminSimpleChart";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminRecentAnalyses } from "@/components/admin/AdminRecentAnalyses";
import { AdminRecentPayments } from "@/components/admin/AdminRecentPayments";

const RANGES: { value: AdminRange; label: string }[] = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
  { value: "all", label: "All" },
];

const GRANULARITIES: { value: AdminGranularity; label: string }[] = [
  { value: "day", label: "Dag" },
  { value: "week", label: "V" },
  { value: "month", label: "M" },
];

export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<AdminRange>("30d");
  const [granularity, setGranularity] = useState<AdminGranularity | "auto">("auto");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ range });
    if (granularity !== "auto") params.set("granularity", granularity);

    try {
      const res = await fetch(`/api/admin/stats?${params}`);
      if (res.status === 401) {
        setAuthenticated(false);
        setStats(null);
        return;
      }
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        throw new Error(json.error ?? "Kunde inte hämta data.");
      }
      const data = (await res.json()) as AdminStats;
      setAuthenticated(true);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel.");
    } finally {
      setLoading(false);
    }
  }, [range, granularity]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  async function handleLogin(code: string) {
    setError(null);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) throw new Error(json.error ?? "Fel kod.");
    setAuthenticated(true);
    await fetchStats();
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setStats(null);
  }

  if (authenticated === null && loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Laddar…</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="admin-page">
        <AdminLogin onSubmit={handleLogin} error={error} />
      </div>
    );
  }

  const hasSeries = stats && stats.series.length > 0;
  const hasAnalysisChart =
    hasSeries && stats.series.some((p) => p.started > 0 || p.paid > 0);

  return (
    <div className="admin-page admin-page--dashboard">
      <div className="admin-shell">
        <div className="admin-brand-row">
          <Link href="/" className="admin-logo">
            <Logo />
          </Link>
        </div>

        <header className="admin-toolbar">
          <div className="admin-toolbar__left">
            <h1 className="admin-title">Dashboard</h1>
            <div className="admin-pills" role="group" aria-label="Tidsperiod">
              {RANGES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`admin-pill${range === item.value ? " admin-pill--active" : ""}`}
                  onClick={() => setRange(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="admin-pills" role="group" aria-label="Aggregering">
              <button
                type="button"
                className={`admin-pill${granularity === "auto" ? " admin-pill--active" : ""}`}
                onClick={() => setGranularity("auto")}
              >
                Auto
              </button>
              {GRANULARITIES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`admin-pill${granularity === item.value ? " admin-pill--active" : ""}`}
                  onClick={() => setGranularity(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="admin-toolbar__actions">
            <button type="button" className="admin-btn-outline" onClick={() => void fetchStats()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 12a8 8 0 1 1-2.05-5.32M20 4v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Uppdatera
            </button>
            <button type="button" className="admin-btn-outline" onClick={() => void handleLogout()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Logga ut
            </button>
          </div>
        </header>

        {error && <p className="admin-error">{error}</p>}

        {stats && (
          <div className="admin-sections">
            <AdminKpiGrid summary={stats.summary} />

            <div className="admin-triple-grid">
              <section className="admin-card">
                <h2 className="admin-card-title">Analyser över tid</h2>
                {hasAnalysisChart ? (
                  <AdminSimpleChart series={stats.series} variant="analyses" />
                ) : (
                  <AdminEmptyState
                    compact
                    title="Ingen aktivitet ännu"
                    description="Grafen fylls när analyser startas."
                  />
                )}
              </section>

              <section className="admin-card">
                <div className="admin-card-head">
                  <h2 className="admin-card-title">Intäkter</h2>
                  <p className="admin-card-sub">
                    {stats.summary.revenueSek.toLocaleString("sv-SE")} kr totalt
                  </p>
                </div>
                {hasSeries ? (
                  <AdminSimpleChart series={stats.series} variant="revenue" />
                ) : (
                  <AdminEmptyState
                    compact
                    title="Inga intäkter ännu"
                    description="Intäkter visas här vid betalning."
                  />
                )}
              </section>

              <section className="admin-card admin-card--payments">
                <h2 className="admin-card-title">Senaste betalningar</h2>
                <AdminRecentPayments payments={stats.recentPayments} compact />
              </section>
            </div>

            <section className="admin-card admin-card--table-section">
              <div className="admin-card-head">
                <h2 className="admin-card-title">Senaste analyser</h2>
                <span className="admin-link-muted">Visa alla →</span>
              </div>
              <AdminRecentAnalyses analyses={stats.recentAnalyses} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
