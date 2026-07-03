import "dotenv/config";
import { defineConfig } from "prisma/config";

/** Migrations require a direct Postgres connection — not PgBouncer transaction pooling. */
function migrationDatabaseUrl(): string {
  const direct = process.env.DIRECT_DATABASE_URL;
  if (direct) return direct;

  const pooled = process.env.DATABASE_URL;
  if (pooled) return pooled;

  throw new Error(
    "DATABASE_URL is not set. For Supabase/Vercel production, also set DIRECT_DATABASE_URL (direct connection, port 5432).",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationDatabaseUrl(),
  },
});
