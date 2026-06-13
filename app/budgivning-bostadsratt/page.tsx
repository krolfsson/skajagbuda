import type { Metadata } from "next";
import { SeoGuideLayout } from "@/components/SeoGuideLayout";
import { SITE_URL } from "@/lib/brand";

const TITLE = "Budgivning bostadsrätt – så fungerar processen steg för steg";
const DESCRIPTION =
  "Komplett guide till budgivning bostadsrätt: hur processen startar, öppen vs dold budgivning, budförteckning, när affären blir bindande och vad som händer efter accepterat bud.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "budgivning bostadsrätt",
    "budgivning lägenhet",
    "hur fungerar budgivning",
    "budgivning process",
    "bud bostadsrätt",
    "budgivning steg för steg",
  ],
  alternates: { canonical: "/budgivning-bostadsratt" },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/budgivning-bostadsratt`,
    title: TITLE,
    description: DESCRIPTION,
  },
};

const TOC = [
  { id: "start", label: "Hur budgivningen startar" },
  { id: "format", label: "Öppen och dold budgivning" },
  { id: "bud", label: "Så lägger du bud" },
  { id: "efter", label: "Efter accepterat bud" },
];

const FAQ = [
  {
    q: "Hur startar en budgivning på bostadsrätt?",
    a: "Budgivningen startar vanligtvis efter visningen när mäklaren fått in intresse. Mäklaren kontaktar spekulanter och meddelar hur budgivningen går till – öppen, dold eller via budgivning online. Processen kan ta några timmar till flera dagar.",
  },
  {
    q: "Är bud på bostadsrätt bindande?",
    a: "Nej, inte förrän köpekontraktet är undertecknat av både köpare och säljare. Fram till dess kan bud dras tillbaka, men du bör bara lägga bud du menar allvar med.",
  },
  {
    q: "Vad är skillnaden på öppen och dold budgivning?",
    a: "I öppen budgivning ser alla budgivare varandra bud. I dold budgivning vet du inte vad andra budat – du budar till mäklaren som förmedlar. Dold budgivning är vanligast i storstäderna.",
  },
  {
    q: "Vem bestämmer vem som får köpa?",
    a: "Säljaren väljer fritt. Det högsta budet vinner inte automatiskt – finansiering, tillträde och helhetsintryck kan väga in.",
  },
];

export default function BudgivningBostadsrattPage() {
  return (
    <SeoGuideLayout
      slug="budgivning-bostadsratt"
      breadcrumbLabel="Budgivning bostadsrätt"
      eyebrow="Guide · Budgivning"
      title={TITLE}
      description={DESCRIPTION}
      h1="Budgivning bostadsrätt – så fungerar det"
      lead="Budgivning på bostadsrätt följer inga fasta regler i lagen – men det finns etablerade mönster och mäklarpraxis. Här går vi igenom processen steg för steg så du vet vad som händer från visning till köpekontrakt."
      toc={TOC}
      faq={FAQ}
    >
      <section id="start" className="guide-section">
        <h2 className="guide-h2">Hur budgivningen startar</h2>
        <p>
          Efter visningen samlar mäklaren in intresse. Om flera spekulanter vill köpa startar
          budgivningen – ofta samma dag eller dagen efter. Mäklaren meddelar hur processen går till:
          öppen eller dold, tidsfrister och hur bud läggs (telefon, mejl eller budgivning online).
        </p>
        <p>
          Utgångspriset i annonsen är sällan det pris säljaren förväntar sig. Det är ofta satt för
          att locka spekulanter – ett så kallat lockpris. Jämför alltid med slutpriser på liknande
          objekt i området.
        </p>
      </section>

      <section id="format" className="guide-section">
        <h2 className="guide-h2">Öppen och dold budgivning</h2>
        <p>
          <strong>Öppen budgivning:</strong> Alla budgivare ser varandras bud i realtid. Transparent
          men pressande – du ser exakt var du ligger och hur andra reagerar.
        </p>
        <p>
          <strong>Dold budgivning:</strong> Du budar till mäklaren utan att se andras bud. Vanligast
          i Stockholm, Göteborg och Malmö. Mäklaren meddelar om ditt bud är högst och ber om
          förbättring om det behövs.
        </p>
        <p>
          I båda fallen ska mäklaren dokumentera budgivningen. Efter avslutad affär kan du begära
          budförteckning med belopp och tidpunkter.
        </p>
      </section>

      <section id="bud" className="guide-section">
        <h2 className="guide-h2">Så lägger du bud</h2>
        <ul className="guide-list">
          <li>
            <strong>Ha lånelöfte klart.</strong> Mäklaren vill veta att du har ekonomin på plats.
          </li>
          <li>
            <strong>Lägg bud via mäklaren.</strong> Bud ska gå via den ansvariga mäklaren – inte
            direkt till säljaren.
          </li>
          <li>
            <strong>Ange belopp och villkor.</strong> T.ex. bud på 3 250 000 kr med tillträde 1
            september och beviljat lånelöfte.
          </li>
          <li>
            <strong>Vänta på svar.</strong> Mäklaren återkopplar om budet är högst, om säljaren
            accepterar eller om högre bud finns.
          </li>
        </ul>
        <div className="guide-callout">
          <p>
            Ett bud är inte bindande förrän köpekontraktet är signerat. Men lägg bara bud du är
            beredd att fullfölja – din trovärdighet som köpare spelar roll i framtida affärer.
          </p>
        </div>
      </section>

      <section id="efter" className="guide-section">
        <h2 className="guide-h2">Efter accepterat bud</h2>
        <p>När säljaren accepterat ditt bud händer följande:</p>
        <ul className="guide-list">
          <li>
            <strong>Köpekontrakt.</strong> Affären blir bindande när båda parter undertecknat
            kontraktet.
          </li>
          <li>
            <strong>Handpenning.</strong> Vanligen 10 % av köpeskillingen till mäklarens
            klientmedelskonto.
          </li>
          <li>
            <strong>Föreningsgodkännande.</strong> Styrelsen måste godkänna dig som medlem i
            bostadsrättsföreningen.
          </li>
          <li>
            <strong>Tillträde.</strong> På tillträdesdagen betalas resterande belopp och du får
            tillgång till lägenheten.
          </li>
        </ul>
        <p>
          Ha bolånet klart i tid och läs igenom kontraktet noga. Eventuella besiktnings- eller
          lånevillkor bör skrivas in om de är aktuella.
        </p>
      </section>
    </SeoGuideLayout>
  );
}
