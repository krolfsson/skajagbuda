/** Run: npx tsx scripts/test-text-extract.ts */
import assert from "node:assert/strict";
import { extractFieldsFromText, parseSwedishMoney } from "../lib/listing-text-extract";

// Hemnet-style copy (label and value on separate lines)
const hemnet = `Kungsklippan 12
Kungsholmen, Stockholms kommun
2 995 000 kr
Bostadstyp
Lägenhet
Upplåtelseform
Bostadsrätt
Antal rum
2 rum
Boarea
30,5 m²
Balkong
Ja
Våning
3 av 6, hiss finns
Byggår
1936
Förening
Brf Kungsklippan 5
Avgift
2 657 kr/mån
Driftkostnad
3 600 kr/år
Pris/m²
98 197 kr/m²
Utgångspris
2 995 000 kr`;
const h = extractFieldsFromText(hemnet);
console.log("hemnet", h);
assert.equal(h.fields.askingPrice, "2995000");
assert.equal(h.fields.monthlyFee, "2657");
assert.equal(h.fields.livingAreaSqm, "30.5");
assert.equal(h.fields.rooms, "2");
assert.equal(h.fields.floor, "3");
assert.equal(h.fields.totalFloors, "6");
assert.equal(h.fields.address, "Kungsklippan 12");
assert.equal(h.fields.area, "Kungsholmen");
assert.equal(h.fields.city, "Stockholm");
assert.equal(h.fields.associationName, "Brf Kungsklippan 5");
assert.equal(h.hasBalcony, true);
assert.equal(h.hasElevator, true);

// Booli / broker inline style
const booli = `Heleneborgsgatan 3, Södermalm
Utropspris: 6 750 000 kr
Avgift: 4 120 kr/mån
Boarea: 75 m²
Rum: 3 rok
Våning: 2 tr
Hiss: Nej
Västerås kommun`;
const b = extractFieldsFromText(booli);
console.log("booli", b);
assert.equal(b.fields.askingPrice, "6750000");
assert.equal(b.fields.monthlyFee, "4120");
assert.equal(b.fields.livingAreaSqm, "75");
assert.equal(b.fields.rooms, "3");
assert.equal(b.fields.floor, "2");
assert.equal(b.fields.address, "Heleneborgsgatan 3");
assert.equal(b.fields.city, "Västerås");
assert.equal(b.hasElevator, false);
assert.equal(b.hasBalcony, undefined);

// Nothing stated → nothing invented
const empty = extractFieldsFromText("Ljus och fin lägenhet med närhet till kommunikationer.");
assert.deepEqual(empty.fields, {});
assert.equal(empty.hasBalcony, undefined);

assert.equal(parseSwedishMoney("4,95 milj"), 4_950_000);
assert.equal(parseSwedishMoney("4.950.000 kr"), 4_950_000);
console.log("OK");
