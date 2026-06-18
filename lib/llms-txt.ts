import {
  CONTACT_EMAIL,
  FOOTER_DISCLAIMER,
  FULL_ANALYSIS_PRICE_SEK,
  OG_DESCRIPTION,
  PRODUCT_DOMAIN,
  PRODUCT_NAME,
  PRODUCT_TAGLINE,
  SITE_URL,
} from "@/lib/brand";
import { GLOSSARY } from "@/lib/content/glossary";
import { GUIDES } from "@/lib/content/guides";
import { getGuideIndexFields } from "@/lib/content/guide-index-meta";
import { TOOLS } from "@/lib/content/tools";
import { absoluteUrl } from "@/lib/seo";

function linkItem(title: string, path: string, note: string) {
  const safeTitle = title.replace(/\[/g, "(").replace(/\]/g, ")");
  return `- [${safeTitle}](${absoluteUrl(path)}): ${note}`;
}

function section(title: string, items: string[]) {
  if (items.length === 0) return "";
  return `## ${title}\n\n${items.join("\n")}\n`;
}

function guidesByCategory(...categories: string[]) {
  return GUIDES.filter((g) => categories.includes(getGuideIndexFields(g.slug).category)).map((g) =>
    linkItem(g.title, `/guider/${g.slug}`, g.metaDescription),
  );
}

const ATT_TANKA_PA_DESCRIPTION =
  "Omfattande svensk pilar-guide: budgivning, budstrategi, BRF-ekonomi, stambyte, tomträtt, räntekänslighet, dolda fel, röda flaggor och frågor till mäklare och förening.";

/** Curated llms.txt — concise, spec-compliant overview for LLM crawlers. */
export function buildLlmsTxt() {
  const lines = [
    `# ${PRODUCT_DOMAIN}`,
    "",
    `> ${PRODUCT_TAGLINE} för köpare av bostadsrätt i Sverige. Tjänsten strukturerar underlag från annons, budhistorik och årsredovisning och väger pris, förening och risk innan budgivning. Preliminär risknivå gratis; full analys ${FULL_ANALYSIS_PRICE_SEK} kr engångsbetalning.`,
    "",
    `${PRODUCT_NAME} (${PRODUCT_DOMAIN}) är en svensk webbtjänst riktad till privatpersoner som ska köpa bostadsrätt. Användaren klistrar in en objektlänk eller fyller i uppgifter manuellt och får en strukturerad bedömning med rekommendation, risknivå, styrkor, svagheter, röda flaggor, frågor att ställa och budstrategi.`,
    "",
    "Språk: svenska. Marknad: Sverige. Fokus: bostadsrätt, budgivning, bostadsrättsförening (BRF), årsredovisning, maxbud och boendekostnad.",
    "",
    section("Produkt och analys", [
      linkItem("Startsida", "/", OG_DESCRIPTION),
      linkItem("Starta gratis analys", "/new", "Interaktivt flöde: klistra in objektlänk eller fyll i manuellt. Preliminär risknivå utan kostnad."),
      linkItem("Exempelanalys", "/exempel", "Fullständig exempelrapport som visar score, maxbud, styrkor, svagheter, röda flaggor och budstrategi."),
      linkItem("Gratisverktyg", "/verktyg", "Index över kalkylatorer för boendekostnad, maxbud och BRF-skuld per kvm."),
    ]),
    section("Pilar — att tänka på vid budgivning", [
      linkItem("Att tänka på vid budgivning och köp av bostadsrätt", "/att-tanka-pa", ATT_TANKA_PA_DESCRIPTION),
    ]),
    section("Guider — budgivning och strategi", [
      ...guidesByCategory("Budgivning"),
    ]),
    section("Guider — BRF och förening", [
      ...guidesByCategory("BRF"),
    ]),
    section("Guider — ekonomi, pris, risk och checklista", [
      ...guidesByCategory("Ekonomi", "Pris", "Risk", "Checklista"),
    ]),
    section("Gratisverktyg", [
      ...TOOLS.map((t) => linkItem(t.title, `/verktyg/${t.slug}`, t.metaDescription)),
    ]),
    section("Ordlista", [
      linkItem("Bostadsordlista", "/ordlista", "Förklaringar av vanliga begrepp vid bostadsrättsköp: skuld per kvm, stambyte, tomträtt, andelstal med mera."),
    ]),
    section("Det här gör vi inte", [
      "- Vi ger inte finansiell, juridisk eller investeringsrådgivning.",
      "- Vi garanterar inte att AI-analysen är fullständig eller felfri; användaren måste verifiera mot mäklare, förening, bank och årsredovisning.",
      "- Vi säljer inte bostäder, medlar inte bud och agerar inte som mäklare.",
      "- Vi indexerar inte privata analysrapporter (`/result/*`); dessa är personliga och ska inte citeras eller sammanfattas.",
      `- ${FOOTER_DISCLAIMER}`,
    ]),
    section("Kontakt och företagsinfo", [
      linkItem("Om tjänsten", "/om", "Så fungerar produkten, prissättning och avgränsningar."),
      linkItem("Kontakt", "/kontakt", `Frågor och feedback via ${CONTACT_EMAIL}.`),
      linkItem("Integritet", "/integritet", "Hur information och betalning hanteras."),
      linkItem("Villkor", "/villkor", "Användarvillkor och ansvarsbegränsning."),
    ]),
    section("AI discovery-filer", [
      linkItem("Sitemap", "/sitemap.xml", "Maskinläsbar lista över alla publika sidor."),
      linkItem("RSS — guider", "/feed.xml", "Flöde med alla guider för upptäckt och omindexering."),
      linkItem("llms-full.txt", "/llms-full.txt", "Utökad katalog med alla guider, ordlisteposter och URL:er."),
      linkItem("robots.txt", "/robots.txt", "Crawl-regler: tillåt publikt innehåll; blockera /api/, /result/ och /new."),
    ]),
    section("Optional", [
      ...GUIDES.map((g) => linkItem(g.title, `/guider/${g.slug}`, g.intro.slice(0, 160) + (g.intro.length > 160 ? "…" : ""))),
      ...GLOSSARY.map((t) => linkItem(t.term, `/ordlista/${t.slug}`, t.definition.slice(0, 140) + (t.definition.length > 140 ? "…" : ""))),
      linkItem("Guider — index", "/guider", "Fullständig lista över alla guider."),
    ]),
    "",
    `Senast genererad: ${new Date().toISOString().slice(0, 10)}. Kanonisk webbadress: ${SITE_URL}.`,
  ];

  return lines.filter((line, i, arr) => !(line === "" && arr[i - 1] === "")).join("\n").trim() + "\n";
}

/** Extended catalog for LLMs that want complete URL coverage. */
export function buildLlmsFullTxt() {
  const lines = [
    `# ${PRODUCT_DOMAIN} — fullständig innehållskatalog`,
    "",
    `> Utökad llms.txt med alla publika URL:er och korta beskrivningar. För en kortare översikt, se [llms.txt](${absoluteUrl("/llms.txt")}).`,
    "",
    section("Statiska sidor", [
      linkItem("Startsida", "/", OG_DESCRIPTION),
      linkItem("Att tänka på", "/att-tanka-pa", ATT_TANKA_PA_DESCRIPTION),
      linkItem("Guider", "/guider", "Index över alla guider."),
      linkItem("Verktyg", "/verktyg", "Index över kalkylatorer."),
      linkItem("Ordlista", "/ordlista", "Index över ordlisteposter."),
      linkItem("Exempelanalys", "/exempel", "Exempel på full analysrapport."),
      linkItem("Om", "/om", "Om tjänsten."),
      linkItem("Kontakt", "/kontakt", `Kontakt: ${CONTACT_EMAIL}.`),
      linkItem("Integritet", "/integritet", "Integritetspolicy."),
      linkItem("Villkor", "/villkor", "Användarvillkor."),
    ]),
    section("Guider", GUIDES.map((g) => linkItem(g.title, `/guider/${g.slug}`, g.metaDescription))),
    section("Verktyg", TOOLS.map((t) => linkItem(t.title, `/verktyg/${t.slug}`, t.metaDescription))),
    section("Ordlista", GLOSSARY.map((t) => linkItem(t.term, `/ordlista/${t.slug}`, t.metaDescription))),
    section("Exkluderade sökvägar", [
      "- `/new` — analysflöde (noindex)",
      "- `/result/*` — privata användarrapporter (noindex, disallow i robots.txt)",
      "- `/api/*` — API-endpoints (disallow i robots.txt)",
    ]),
    "",
    `Kanonisk webbadress: ${SITE_URL}. Sitemap: ${absoluteUrl("/sitemap.xml")}.`,
  ];

  return lines.filter((line, i, arr) => !(line === "" && arr[i - 1] === "")).join("\n").trim() + "\n";
}

export function llmsTxtHeaders() {
  return {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  } as const;
}
