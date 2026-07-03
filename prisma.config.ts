import "dotenv/config";
import { defineConfig } from "prisma/config";
import { resolveMigrationDatabaseUrl } from "./lib/migration-database-url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: resolveMigrationDatabaseUrl(),
  },
});
