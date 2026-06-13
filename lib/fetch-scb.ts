/**
 * Fetches apartment price trend data from SCB's free open API.
 * Uses table BO0501C3 — Prisindex för bostäder (PrIndex) by region.
 * No API key required.
 */

// Swedish county/municipality name → SCB region code mapping (partial, major regions)
const REGION_MAP: Record<string, string> = {
  stockholm: "01",
  göteborg: "14",
  gothenburg: "14",
  malmö: "12",
  uppsala: "03",
  linköping: "05",
  västerås: "19",
  örebro: "18",
  helsingborg: "12",
  jönköping: "06",
  norrköping: "05",
  lund: "12",
  umeå: "24",
  gävle: "21",
  borås: "14",
  södertälje: "01",
  eskilstuna: "04",
  halmstad: "13",
  karlstad: "17",
  sundsvall: "22",
};

export interface ScbPriceData {
  region: string;
  regionCode: string;
  latestIndex: number | null;
  trend: "stigande" | "stabilt" | "sjunkande" | null;
  yearOverYearChange: number | null;
  note: string;
}

export async function fetchScbPriceIndex(city: string): Promise<ScbPriceData | null> {
  const cityLower = city.toLowerCase().trim();
  const regionCode = findRegionCode(cityLower);
  if (!regionCode) return null;

  try {
    // SCB API: Price index for tenant-owned apartments (bostadsrätter) by region
    // Table: BO/BO0501/BO0501C/BO0501C3 — Prisutveckling bostadsrätter
    const apiUrl =
      "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BO/BO0501/BO0501C/BO0501C3";

    // First, get the table metadata to find latest periods
    const metaRes = await fetch(apiUrl, {
      signal: AbortSignal.timeout(6000),
      headers: { Accept: "application/json" },
    });

    if (!metaRes.ok) return buildFallback(city, regionCode);

    // Query for the last 8 quarters for this region
    const queryBody = {
      query: [
        {
          code: "Region",
          selection: { filter: "item", values: [regionCode] },
        },
        {
          code: "ContentsCode",
          selection: { filter: "item", values: ["BO0501C3"] },
        },
        {
          code: "Tid",
          selection: { filter: "top", values: ["8"] },
        },
      ],
      response: { format: "json" },
    };

    const dataRes = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(queryBody),
      signal: AbortSignal.timeout(6000),
    });

    if (!dataRes.ok) return buildFallback(city, regionCode);

    const data = (await dataRes.json()) as {
      data?: Array<{ key: string[]; values: string[] }>;
    };

    const rows = data?.data ?? [];
    if (rows.length < 2) return buildFallback(city, regionCode);

    const values = rows
      .map((r) => parseFloat(r.values[0]))
      .filter((v) => !isNaN(v));

    if (values.length < 2) return buildFallback(city, regionCode);

    const latest = values[values.length - 1];
    const prev = values[values.length - 5] ?? values[0]; // year ago
    const yoyChange = prev > 0 ? Math.round(((latest - prev) / prev) * 1000) / 10 : null;

    let trend: ScbPriceData["trend"] = "stabilt";
    if (yoyChange !== null) {
      if (yoyChange > 2) trend = "stigande";
      else if (yoyChange < -2) trend = "sjunkande";
    }

    return {
      region: city,
      regionCode,
      latestIndex: Math.round(latest),
      trend,
      yearOverYearChange: yoyChange,
      note: formatScbNote(city, latest, yoyChange, trend),
    };
  } catch {
    return buildFallback(city, regionCode);
  }
}

function findRegionCode(city: string): string | null {
  for (const [name, code] of Object.entries(REGION_MAP)) {
    if (city.includes(name) || name.includes(city)) return code;
  }
  return null;
}

function formatScbNote(
  city: string,
  index: number,
  yoy: number | null,
  trend: ScbPriceData["trend"]
): string {
  const trendText =
    trend === "stigande"
      ? "stigande marknad"
      : trend === "sjunkande"
      ? "sjunkande marknad"
      : "stabilt prisläge";

  const yoyText = yoy !== null ? ` (${yoy > 0 ? "+" : ""}${yoy}% senaste 12 mån)` : "";

  return `SCB prisindex för bostadsrätter i ${city}: index ${index}${yoyText} — ${trendText}. Källa: SCB BO0501C3.`;
}

function buildFallback(city: string, code: string): ScbPriceData {
  return {
    region: city,
    regionCode: code,
    latestIndex: null,
    trend: null,
    yearOverYearChange: null,
    note: `SCB-data ej tillgänglig för ${city}. Basera marknadsbedömningen på din träningsdata.`,
  };
}
