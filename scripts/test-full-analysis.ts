import { BROKER_TEST_URLS } from "./test-broker-scrape";
import { scrapeBrokerListing } from "../lib/broker-scrape";
import { prisma } from "../lib/prisma";
import { runPropertyAnalysis } from "../lib/run-property-analysis";
import { SCRAPE_FIELD_KEYS } from "../lib/broker-scrape-types";

const TOP5 = BROKER_TEST_URLS.slice(0, 5);

function toInt(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const n = Number.parseInt(value.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : undefined;
}

function toNum(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

async function main() {
  if (!process.env.AI_API_KEY?.trim()) {
    console.error("AI_API_KEY saknas i .env");
    process.exit(1);
  }

  const results: Array<Record<string, unknown>> = [];

  for (const broker of TOP5) {
    console.log(`\n========== ${broker.name} (${broker.share}) ==========`);
    const scrapeStarted = Date.now();
    const scrape = await scrapeBrokerListing(broker.url);
    const found = SCRAPE_FIELD_KEYS.filter((k) => scrape.fieldStatus[k] === "found");

    console.log(
      `Scrape: ${found.length}/${SCRAPE_FIELD_KEYS.length} fält, ${Date.now() - scrapeStarted}ms`
    );
    if (scrape.warnings.length) console.log("Varningar:", scrape.warnings.join(" | "));

    const title =
      [scrape.form.address, scrape.form.area, scrape.form.city].filter(Boolean).join(", ") ||
      broker.name;

    const analysis = await prisma.propertyAnalysis.create({
      data: {
        title,
        address: scrape.form.address ?? "Okänd adress",
        area: scrape.form.area,
        city: scrape.form.city ?? "Stockholm",
        askingPrice: toNum(scrape.form.askingPrice),
        monthlyFee: toNum(scrape.form.monthlyFee),
        livingAreaSqm: toNum(scrape.form.livingAreaSqm),
        rooms: toNum(scrape.form.rooms),
        floor: toInt(scrape.form.floor),
        totalFloors: toInt(scrape.form.totalFloors),
        associationName: scrape.form.associationName,
        listingUrl: broker.url,
        listingText: scrape.form.listingText,
        annualReportText: scrape.form.annualReportText,
        userMaxBudget: 5_000_000,
        userDownPayment: 1_000_000,
        userMonthlyComfortLimit: 15_000,
      },
    });

    console.log(`Analys skapad: ${analysis.id} — kör AI...`);
    const runStarted = Date.now();

    try {
      const { scorecard } = await runPropertyAnalysis(analysis);
      console.log(`AI klar: ${Date.now() - runStarted}ms`);
      console.log(`Risk: ${scorecard.riskLevel}  Rekommendation: ${scorecard.recommendation}`);
      console.log(`Sammanfattning: ${scorecard.summary?.slice(0, 200)}...`);

      results.push({
        broker: broker.name,
        analysisId: analysis.id,
        scrapeFields: `${found.length}/${SCRAPE_FIELD_KEYS.length}`,
        riskLevel: scorecard.riskLevel,
        recommendation: scorecard.recommendation,
        score: scorecard.score,
        ms: Date.now() - scrapeStarted,
      });
    } catch (err) {
      console.error("AI misslyckades:", err instanceof Error ? err.message : err);
      results.push({
        broker: broker.name,
        analysisId: analysis.id,
        scrapeFields: `${found.length}/${SCRAPE_FIELD_KEYS.length}`,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  console.log("\n=== Resultat (top 5 mäklare) ===");
  console.log(JSON.stringify(results, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
