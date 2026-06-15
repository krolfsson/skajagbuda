import { scrapeBrokerListing } from "../lib/broker-scrape";
import { SCRAPE_FIELD_KEYS } from "../lib/broker-scrape-types";

export const BROKER_TEST_URLS = [
  {
    name: "Fastighetsbyrån",
    share: "16%",
    url: "https://www.fastighetsbyran.com/sv/sverige/till-salu/stockholms-lan/jarfalla-kommun/objekt/?objektID=3405978",
  },
  {
    name: "Länsförsäkringar",
    share: "14%",
    url: "https://www.lansfast.se/till-salu/bostadsratt/stockholm/stockholm/vallingby/vittangigatan-20-2tr/cmbolgh5etr927ob61b3t9n/",
  },
  {
    name: "Bjurfors",
    share: "9%",
    url: "https://www.bjurfors.se/sv/tillsalu/stockholm/stockholm/sodermalm-hogalid/ringvagen-14/",
  },
  {
    name: "Svensk Fastighetsförmedling",
    share: "8%",
    url: "https://www.svenskfast.se/bostadsratt/stockholm/tyreso/tyreso/centrala-tyreso/axel-wennergrens-vag-18/458909/",
  },
  {
    name: "Erik Olsson",
    share: "7%",
    url: "https://www.erikolsson.se/homes/Lagenhet-3rum-Ringvagen-139-25tr-Stockholm-Stockholm-kommun-5984648",
  },
  {
    name: "SkandiaMäklarna",
    share: "5%",
    url: "https://www.skandiamaklarna.se/hitta-hem/bostadsratt/stockholm/kungsholmen/86842416/",
  },
  {
    name: "Notar",
    share: "5%",
    url: "https://www.notar.se/kopa-bostad/objekt/OBJ5P5LKRG2GRZ5QTP9BE",
  },
  {
    name: "HusmanHagberg",
    share: "5%",
    url: "https://www.husmanhagberg.se/objekt/olandsgatan-48-5-tr-sodermalm-sofo/OBJ5NH3CX63DVKKH5FDB2/",
  },
  {
    name: "Mäklarhuset",
    share: "5%",
    url: "https://www.maklarhuset.se/bostad/sverige/stockholm/stockholm/668948",
  },
  {
    name: "Svenska Mäklarhuset",
    share: "3%",
    url: "https://svenskamaklarhuset.se/objekt/obj5pgv9jf2v59pnc86bz-frejgatan-53-2-tr-vasastan/",
  },
] as const;

async function main() {
  const results = [];

  for (const broker of BROKER_TEST_URLS) {
    const started = Date.now();
    const result = await scrapeBrokerListing(broker.url);
    const found = SCRAPE_FIELD_KEYS.filter((k) => result.fieldStatus[k] === "found");
    const missing = SCRAPE_FIELD_KEYS.filter((k) => result.fieldStatus[k] !== "found");
    const annual = result.documents.filter((d) => d.kind === "annual_report" && d.extracted);

    results.push({
      broker: broker.name,
      share: broker.share,
      ok: result.ok,
      ms: Date.now() - started,
      foundCount: found.length,
      total: SCRAPE_FIELD_KEYS.length,
      missing,
      form: {
        address: result.form.address,
        area: result.form.area,
        city: result.form.city,
        askingPrice: result.form.askingPrice,
        monthlyFee: result.form.monthlyFee,
        livingAreaSqm: result.form.livingAreaSqm,
        rooms: result.form.rooms,
        floor: result.form.floor,
        totalFloors: result.form.totalFloors,
        associationName: result.form.associationName,
        listingTextLen: result.form.listingText?.length ?? 0,
        annualReportLen: result.form.annualReportText?.length ?? 0,
      },
      pdfCount: result.documents.length,
      annualPdfCount: annual.length,
      warnings: result.warnings,
    });

    console.log(
      `${broker.name.padEnd(28)} ${found.length}/${SCRAPE_FIELD_KEYS.length}  pdf:${result.documents.length}  annual:${annual.length}  ${Date.now() - started}ms`
    );
    if (missing.length) console.log(`  saknas: ${missing.join(", ")}`);
  }

  console.log("\n=== Sammanfattning ===");
  const avg =
    results.reduce((sum, r) => sum + r.foundCount, 0) / (results.length * SCRAPE_FIELD_KEYS.length);
  console.log(`Snitt: ${(avg * 100).toFixed(0)}% fält ifyllda`);
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
