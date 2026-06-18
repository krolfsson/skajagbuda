"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminGranularity, AdminRange, AdminStats } from "@/lib/admin-stats";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminKpiGrid } from "@/components/admin/AdminKpiGrid";
import { AdminBarChart } from "@/components/admin/AdminBarChart";
import { AdminRecentPayments } from "@/components/admin/AdminRecentPayments";

const RANGES: { value: AdminRange; label: string }[] = [
  { value: "7d", label: "7 dagar" },
  { value: "30d", label: "30 dagar" },
  { value: "90d", label: "90 dagar" },
  { value: "all", label: "All tid" },
];

const GRANULARITIES: { value: AdminGranularity; label: string }[] = [
  { value: "day", label: "Dag" },
  { value: "week", label: "Vecka" },
  { value: "month", label: "Månad" },
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
    if (!res.ok) {
      throw new Error(json.error ?? "Fel kod.");
    }
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

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Internt</p>
          <h1 className="admin-title">Dashboard</h1>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn-ghost" onClick={() => void fetchStats()}>
            Uppdatera
          </button>
          <button type="button" className="admin-btn-ghost" onClick={() => void handleLogout()}>
            Logga ut
          </button>
        </div>
      </header>

      <div className="admin-controls">
        <div className="admin-segmented" role="group" aria-label="Tidsperiod">
          {RANGES.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`admin-segmented-btn${range === item.value ? " admin-segmented-btn--active" : ""}`}
              onClick={() => setRange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="admin-segmented" role="group" aria-label="Aggregering">
          <button
            type="button"
            className={`admin-segmented-btn${granularity === "auto" ? " admin-segmented-btn--active" : ""}`}
            onClick={() => setGranularity("auto")}
          >
            Auto
          </button>
          {GRANULARITIES.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`admin-segmented-btn${granularity === item.value ? " admin-segmented-btn--active" : ""}`}
              onClick={() => setGranularity(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {stats && (
        <>
          <AdminKpiGrid summary={stats.summary} />
          <section className="admin-panel">
            <div className="admin-panel-head">
              <h2 className="admin-panel-title">Påbörjade vs betalda</h2>
              <p className="admin-panel-desc">
                Aggregerat per {stats.granularity === "day" ? "dag" : stats.granularity === "week" ? "vecka" : "månad"}
              </p>
            </div>
            <AdminBarChart series={stats.series} />
          </section>
          <section className="admin-panel">
            <div className="admin-panel-head">
              <h2 className="admin-panel-title">Intäkter per period</h2>
              <p className="admin-panel-desc">{stats.summary.revenueSek.toLocaleString("sv-SE")} kr totalt i vald period</p>
            </div>
            <AdminBarChart series={stats.series} mode="revenue" />
          </section>
          <AdminRecentPayments payments={stats.recentPayments} />
        </>
      )}

      {loading && stats && <p className="admin-loading-inline">Uppdaterar…</p>}
    </div>
  );
}
