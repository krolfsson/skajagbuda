import { execSync } from "node:child_process";
import { resolveMigrationDatabaseUrl } from "../lib/migration-database-url";

const MAX_ATTEMPTS = 4;
const RETRY_DELAYS_MS = [8_000, 16_000, 32_000];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runMigrate() {
  const url = resolveMigrationDatabaseUrl();
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url },
  });
}

async function main() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      runMigrate();
      return;
    } catch {
      if (attempt === MAX_ATTEMPTS) {
        console.error(`Migration failed after ${MAX_ATTEMPTS} attempts.`);
        process.exit(1);
      }

      const delay = RETRY_DELAYS_MS[attempt - 1] ?? 32_000;
      console.warn(
        `Migration attempt ${attempt}/${MAX_ATTEMPTS} failed — retrying in ${delay / 1000}s…`,
      );
      await sleep(delay);
    }
  }
}

void main();
