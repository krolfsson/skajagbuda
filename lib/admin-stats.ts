import { prisma } from "@/lib/prisma";
import { FULL_ANALYSIS_PRICE_SEK } from "@/lib/brand";

export type AdminRange = "7d" | "30d" | "90d" | "all";
export type AdminGranularity = "day" | "week" | "month";

export type AdminTimeSeriesPoint = {
  period: string;
  label: string;
  started: number;
  freeCompleted: number;
  paid: number;
  revenueSek: number;
};

export type AdminRecentPayment = {
  id: string;
  title: string;
  city: string | null;
  paidAt: string;
  amountSek: number;
};

export type AdminStats = {
  summary: {
    totalStarted: number;
    freeCompleted: number;
    checkoutsStarted: number;
    pendingCheckouts: number;
    paid: number;
    revenueSek: number;
    conversionRate: number;
    checkoutConversionRate: number;
  };
  series: AdminTimeSeriesPoint[];
  recentPayments: AdminRecentPayment[];
  range: AdminRange;
  granularity: AdminGranularity;
};

function rangeToSince(range: AdminRange): Date | null {
  if (range === "all") return null;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));
  return since;
}

function defaultGranularity(range: AdminRange): AdminGranularity {
  if (range === "7d" || range === "30d") return "day";
  if (range === "90d") return "week";
  return "month";
}

function formatLabel(date: Date, granularity: AdminGranularity): string {
  if (granularity === "month") {
    return date.toLocaleDateString("sv-SE", { month: "short", year: "2-digit" });
  }
  if (granularity === "week") {
    return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
  }
  return date.toLocaleDateString("sv-SE", { weekday: "short", day: "numeric", month: "short" });
}

type BucketRow = {
  period: Date;
  started: number;
  free_completed: number;
  paid: number;
};

async function fetchBuckets(
  since: Date | null,
  granularity: AdminGranularity,
): Promise<BucketRow[]> {
  const sinceClause = since ? `AND "createdAt" >= $1` : "";
  const params = since ? [since] : [];

  const trunc =
    granularity === "day" ? "day" : granularity === "week" ? "week" : "month";

  const sql = `
    SELECT
      DATE_TRUNC('${trunc}', "createdAt") AS period,
      COUNT(*)::int AS started,
      COUNT(*) FILTER (WHERE "freeAnalysisStatus" = 'COMPLETED')::int AS free_completed,
      COUNT(*) FILTER (WHERE "paymentStatus" = 'PAID')::int AS paid
    FROM "PropertyAnalysis"
    WHERE 1=1 ${sinceClause}
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  return prisma.$queryRawUnsafe<BucketRow[]>(sql, ...params);
}

function pct(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

export async function getAdminStats(
  range: AdminRange,
  granularity?: AdminGranularity,
): Promise<AdminStats> {
  const since = rangeToSince(range);
  const bucketGranularity = granularity ?? defaultGranularity(range);
  const dateFilter = since ? { createdAt: { gte: since } } : undefined;

  const [summaryCounts, buckets, recentPaid] = await Promise.all([
    Promise.all([
      prisma.propertyAnalysis.count({ where: dateFilter }),
      prisma.propertyAnalysis.count({
        where: { ...dateFilter, freeAnalysisStatus: "COMPLETED" },
      }),
      prisma.propertyAnalysis.count({
        where: { ...dateFilter, stripeCheckoutSessionId: { not: null } },
      }),
      prisma.propertyAnalysis.count({
        where: { ...dateFilter, paymentStatus: "PENDING" },
      }),
      prisma.propertyAnalysis.count({
        where: { ...dateFilter, paymentStatus: "PAID" },
      }),
    ]),
    fetchBuckets(since, bucketGranularity),
    prisma.propertyAnalysis.findMany({
      where: { paymentStatus: "PAID" },
      orderBy: { updatedAt: "desc" },
      take: 15,
      select: {
        id: true,
        title: true,
        city: true,
        updatedAt: true,
      },
    }),
  ]);

  const [totalStarted, freeCompleted, checkoutsStarted, pendingCheckouts, paid] =
    summaryCounts;
  const revenueSek = paid * FULL_ANALYSIS_PRICE_SEK;

  const series: AdminTimeSeriesPoint[] = buckets.map((row) => ({
    period: row.period.toISOString(),
    label: formatLabel(row.period, bucketGranularity),
    started: row.started,
    freeCompleted: row.free_completed,
    paid: row.paid,
    revenueSek: row.paid * FULL_ANALYSIS_PRICE_SEK,
  }));

  return {
    summary: {
      totalStarted,
      freeCompleted,
      checkoutsStarted,
      pendingCheckouts,
      paid,
      revenueSek,
      conversionRate: pct(paid, totalStarted),
      checkoutConversionRate: pct(paid, checkoutsStarted),
    },
    series,
    recentPayments: recentPaid.map((row) => ({
      id: row.id,
      title: row.title,
      city: row.city,
      paidAt: row.updatedAt.toISOString(),
      amountSek: FULL_ANALYSIS_PRICE_SEK,
    })),
    range,
    granularity: bucketGranularity,
  };
}

export function parseAdminRange(value: string | null): AdminRange {
  if (value === "7d" || value === "30d" || value === "90d" || value === "all") {
    return value;
  }
  return "30d";
}

export function parseAdminGranularity(value: string | null): AdminGranularity | undefined {
  if (value === "day" || value === "week" || value === "month") return value;
  return undefined;
}
