/**
 * Prisma migrations need a direct/session Postgres connection.
 * Supabase transaction poolers (port 6543) cannot acquire advisory locks.
 */
export function resolveMigrationDatabaseUrl(): string {
  if (process.env.DIRECT_DATABASE_URL) {
    return process.env.DIRECT_DATABASE_URL;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  return toMigrationSafeUrl(databaseUrl);
}

export function toMigrationSafeUrl(databaseUrl: string): string {
  try {
    const parsed = new URL(databaseUrl);
    const isSupabase =
      parsed.hostname.includes("supabase.co") || parsed.hostname.includes("supabase.com");

    if (!isSupabase) {
      return databaseUrl;
    }

    // Transaction pooler → session pooler (same host, port 5432).
    if (parsed.hostname.includes("pooler.supabase.com") && parsed.port === "6543") {
      parsed.port = "5432";
      parsed.searchParams.delete("pgbouncer");
      return parsed.toString();
    }

    if (parsed.searchParams.get("pgbouncer") === "true") {
      parsed.port = parsed.port || "5432";
      if (parsed.port === "6543") parsed.port = "5432";
      parsed.searchParams.delete("pgbouncer");
      return parsed.toString();
    }

    return databaseUrl;
  } catch {
    return databaseUrl;
  }
}
