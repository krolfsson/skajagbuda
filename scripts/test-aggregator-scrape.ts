import { scrapeBrokerListing } from "../lib/broker-scrape";
import { parseHemnetUrl } from "../lib/aggregator-listing";
import { SCRAPE_FIELD_KEYS } from "../lib/broker-scrape-types";
import { getBooliCredentials } from "../lib/booli-api";

const HEMNET_SAMPLES = [
  "https://www.hemnet.se/bostad/lagenhet-3rum-stockholm-sodermalm-ringvagen-139-12345678",
  "https://www.hemnet.se/bostad/lagenhet-1rum-stockholm-vallingby-vittangigatan-20-98765432",
];

const BOOLI_SAMPLES = [
  "https://www.booli.se/annons/123456",
  "https://www.booli.se/bostad/789012",
];

async function testUrl(label: string, url: string) {
  const started = Date.now();
  const result = await scrapeBrokerListing(url);
  const found = SCRAPE_FIELD_KEYS.filter((k) => result.fieldStatus[k] === "found");

  console.log(`\n=== ${label} ===`);
  console.log(`URL: ${url}`);
  console.log(`OK: ${result.ok}  ${found.length}/${SCRAPE_FIELD_KEYS.length}  ${Date.now() - started}ms`);
  console.log("Logs:", result.logs.join(" | "));
  if (result.warnings.length) console.log("Warnings:", result.warnings.join(" | "));
  console.log("Form:", {
    address: result.form.address,
    area: result.form.area,
    city: result.form.city,
    askingPrice: result.form.askingPrice,
    monthlyFee: result.form.monthlyFee,
    livingAreaSqm: result.form.livingAreaSqm,
    rooms: result.form.rooms,
    floor: result.form.floor,
    associationName: result.form.associationName,
    listingTextLen: result.form.listingText?.length ?? 0,
    annualReportLen: result.form.annualReportText?.length ?? 0,
  });
}

async function main() {
  const creds = getBooliCredentials();
  console.log(`Booli API: ${creds ? "konfigurerad" : "SAKNAS — lägg till BOOLI_CALLER_ID + BOOLI_API_KEY i .env"}`);

  console.log("\n--- Hemnet slug-parsing ---");
  for (const url of HEMNET_SAMPLES) {
    const { hemnetId, fields } = parseHemnetUrl(url);
    console.log(url);
    console.log(`  id=${hemnetId}`, fields);
  }

  for (const url of HEMNET_SAMPLES) await testUrl("Hemnet scrape", url);
  for (const url of BOOLI_SAMPLES) await testUrl("Booli scrape", url);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
