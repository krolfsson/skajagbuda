import type { Metadata } from "next";
import { SeoGuideLayout } from "@/components/SeoGuideLayout";
import { SITE_URL } from "@/lib/brand";

const TITLE = "Hur du ökar chansen att vinna en budgivning – utan att betala för mycket";
const DESCRIPTION =
  "Vinna budgivning handlar inte alltid om högsta budet. Lär dig hur du ökar chanserna med finansiering, timing, villkor och en tydlig strategi – utan att spränga budgeten.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "vinna budgivning",
    "vinna bud",
    "hur vinner man budgivning",
    "öka chansen budgivning",
    "bli vald budgivare",
    "budgivning vinnare",
  ],
  alternates: { canonical: "/vinna-budgivning" },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/vinna-budgivning`,
    title: TITLE,
    description: DESCRIPTION,
  },
};

const TOC = [
  { id: "hogsta", label: "Högsta budet vinner inte alltid" },
  { id: "chanser", label: "Så ökar du chanserna" },
  { id: "undvik", label: "Vad du ska undvika" },
  { id: "beslut", label: "När du ska acceptera förlust" },
];

const FAQ = [
  {
    q: "Vinner alltid det högsta budet?",
    a: "Nej. Säljaren väljer fritt vem den säljer till. Finansieringssäkerhet, tillträdesdatum, personlig kontakt och hur smidig affären verkar kan väga tyngre än ett marginellt högre bud.",
  },
  {
    q: "Hur vinner man en budgivning?",
    a: "Kombinera ett konkurrenskraftigt bud med stark ekonomi: beviljat lånelöfte, tydlig finansiering, flexibelt tillträde och professionellt bemötande. Ha också en tydlig maxgräns så du inte vinner till ett pris du inte har råd med.",
  },
  {
    q: "Kan man vinna med lägre bud?",
    a: "Ja. Om ditt bud har bättre villkor – snabbare tillträde, säkrare finansiering, färre villkor – kan säljaren välja dig framför ett högre bud med osäker ekonomi.",
  },
  {
    q: "Är det värt att vinna till varje pris?",
    a: "Nej. Att vinna en budgivning men betala mer än bostaden är värd – eller mer än du har råd med – är ingen vinst. Walk-away-nivån skyddar dig från att betala för mycket i hettan.",
  },
];

export default function VinnaBudgivningPage() {
  return (
    <SeoGuideLayout
      slug="vinna-budgivning"
      breadcrumbLabel="Vinna budgivning"
      eyebrow="Guide · Vinna budgivning"
      title={TITLE}
      description={DESCRIPTION}
      h1="Hur du ökar chansen att vinna en budgivning"
      lead="Många tror att man vinner budgivningen genom att buda högst. Ibland stämmer det – men ofta väger andra faktorer tyngre. Här går vi igenom hur du ökar chanserna utan att betala mer än du borde."
      toc={TOC}
      faq={FAQ}
    >
      <section id="hogsta" className="guide-section">
        <h2 className="guide-h2">Högsta budet vinner inte alltid</h2>
        <p>
          I Sverige är bud vid bostadsaffärer inte bindande förrän köpekontraktet är signerat – men
          säljaren väljer ändå fritt vem den säljer till. Det betyder att &quot;vinna budgivning&quot;
          inte är samma sak som &quot;buda högst&quot;.
        </p>
        <p>Säljaren och mäklaren kan prioritera:</p>
        <ul className="guide-list">
          <li>Finansieringssäkerhet – beviljat lån, inte bara lånelöfte.</li>
          <li>Tillträdesdatum som passar säljarens plan.</li>
          <li>Få villkor och smidig affär utan onödig osäkerhet.</li>
          <li>En köpare som verkar seriös och genomförbar.</li>
        </ul>
        <p>
          Det förklarar varför du ibland hör att någon vann med lägre bud – och varför du ibland
          förlorar trots att du budade högst.
        </p>
      </section>

      <section id="chanser" className="guide-section">
        <h2 className="guide-h2">Så ökar du chanserna att vinna</h2>
        <ul className="guide-list">
          <li>
            <strong>Ha lånelöfte klart.</strong> Visa att du har ekonomin på plats. Bankens
            förhandsbesked ger säljaren trygghet.
          </li>
          <li>
            <strong>Var tydlig med tillträde.</strong> Om du kan vara flexibel med datum ökar det
            chansen – särskilt om säljaren har bråttom eller väntar på eget köp.
          </li>
          <li>
            <strong>Bud nära din walk-away tidigt.</strong> Ett starkt öppningsbud kan avskräcka
            svagare budgivare och avsluta budgivningen snabbt.
          </li>
          <li>
            <strong>Var professionell mot mäklaren.</strong> Snabba svar, tydlig kommunikation och
            seriositet räknas – mäklaren rekommenderar ofta den köpare de tror affären går igenom med.
          </li>
          <li>
            <strong>Förstå objektet.</strong> Visa att du granskat föreningen och ställt relevanta
            frågor. Det signalerar att du inte hoppar av i sista stund.
          </li>
        </ul>
        <div className="guide-callout">
          <p>
            Det bästa sättet att &quot;vinna&quot; är att hitta rätt objekt till rätt pris – inte att
            överbuda på fel bostad. En vunnen budgivning du ångrar ekonomiskt är ingen seger.
          </p>
        </div>
      </section>

      <section id="undvik" className="guide-section">
        <h2 className="guide-h2">Vad du ska undvika</h2>
        <ul className="guide-list">
          <li>Buda högre än din walk-away för att &quot;inte förlora&quot;.</li>
          <li>Lova tillträde eller villkor du inte kan hålla.</li>
          <li>Lita på att högsta budet automatiskt vinner.</li>
          <li>Buda innan du förstått föreningens ekonomi och framtida kostnader.</li>
          <li>Låta budgivningens tempo pressa dig till snabba beslut.</li>
        </ul>
      </section>

      <section id="beslut" className="guide-section">
        <h2 className="guide-h2">När du ska acceptera att förlora</h2>
        <p>
          Att förlora en budgivning är inte alltid dåligt. Om slutpriset passerar din walk-away, eller
          om föreningen har risker du inte vill betala för, är förlusten ett bra beslut. Det finns
          alltid fler objekt – men det finns inte mer pengar i budgeten.
        </p>
        <p>
          Analysera varje förlorad budgivning: var priset rimligt? Var din strategi rätt? Bygg
          erfarenhet inför nästa gång.
        </p>
      </section>
    </SeoGuideLayout>
  );
}
