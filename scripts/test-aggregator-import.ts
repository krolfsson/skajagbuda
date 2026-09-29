/** Run: npx tsx scripts/test-aggregator-import.ts — hits Hemnet/Booli once per URL. */
import assert from "node:assert/strict";
import { parseHemnetUrl } from "../lib/aggregator-listing";
import { scrapeBrokerListing } from "../lib/broker-scrape";

const slugCases: Array<[string, Record<string, string>]> = [
  ["https://www.hemnet.se/bostad/lagenhet-2rum-kungholmen-stockholms-kommun-kungsklippan-12-18179179",
    { rooms: "2", area: "Kungholmen", city: "Stockholm", address: "Kungsklippan 12" }],
  ["https://www.hemnet.se/bostad/lagenhet-2rum-vendelso-vendelsomalm-haninge-kommun-lorensbergsvagen-1-19830758",
    { rooms: "2", area: "Vendelso Vendelsomalm", city: "Haninge", address: "Lorensbergsvagen 1" }],
  ["https://www.hemnet.se/bostad/lagenhet-3rum-centrum-upplands-vasby-kommun-dragonvagen-5b-12345678",
    { rooms: "3", area: "Centrum", city: "Upplands Väsby", address: "Dragonvagen 5b" }],
  ["https://www.hemnet.se/bostad/villa-5rum-hogsbo-goteborgs-kommun-klippstigen-7-22334455",
    { rooms: "5", area: "Hogsbo", city: "Göteborg", address: "Klippstigen 7" }],
];
for (const [url, expected] of slugCases) {
  const { fields } = parseHemnetUrl(url);
  assert.deepEqual(fields, expected, url);
}
console.log("slug parsing OK");

async function main() {
for (const url of [
  "https://www.hemnet.se/bostad/lagenhet-2rum-sodermalm-stockholms-kommun-heleneborgsgatan-3-20002618",
  "https://www.booli.se/annons/5712345",
]) {
  const t = Date.now();
  const r = await scrapeBrokerListing(url);
  console.log(url, `${Date.now() - t}ms`, JSON.stringify({ ok: r.ok, source: r.source, blocked: r.blocked, missing: r.missingEssentials, form: r.form, warnings: r.warnings, logs: r.logs }, null, 1));
}
}

void main();
