"use client";

import { useState } from "react";

export function AdminLogin({
  onSubmit,
  error,
}: {
  onSubmit: (code: string) => Promise<void>;
  error: string | null;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    try {
      await onSubmit(code.trim());
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Fel kod.");
    } finally {
      setLoading(false);
    }
  }

  const message = localError ?? error;

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <p className="admin-eyebrow">skajagbuda.se</p>
        <h1 className="admin-login-title">Admin</h1>
        <p className="admin-login-lead">Ange åtkomstkod för att se statistik och betalningar.</p>
        <form onSubmit={(e) => void handleSubmit(e)} className="admin-login-form">
          <label className="admin-label" htmlFor="admin-code">
            Åtkomstkod
          </label>
          <input
            id="admin-code"
            type="password"
            autoComplete="current-password"
            className="admin-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="••••••••"
            required
          />
          {message && <p className="admin-error">{message}</p>}
          <button type="submit" className="admin-btn-primary" disabled={loading || !code.trim()}>
            {loading ? "Verifierar…" : "Logga in"}
          </button>
        </form>
      </div>
    </div>
  );
}
