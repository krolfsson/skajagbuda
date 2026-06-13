import type { Metadata } from "next";
import { SeoGuideLayout } from "@/components/SeoGuideLayout";
import { SITE_URL } from "@/lib/brand";

const TITLE = "Budstrategi vid bostadsköp – 7 taktiker som används i praktiken";
const DESCRIPTION =
  "Lär dig budstrategi inför bostadsköp: maxbud direkt, små höjningar, trötta ut, psykologiska gränser och walk-away. Så väljer du strategi utifrån objekt och konkurrens.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "budstrategi",
    "budstrategi bostadsrätt",
    "budstrategi lägenhet",
    "budstrategi bostad",
    "strategi budgivning",
    "maxbud",
    "walk-away budgivning",
  ],
  alternates: { canonical: "/budstrategi" },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/budstrategi`,
    title: TITLE,
    description: DESCRIPTION,
  },
};

const TOC = [
  { id: "varfor", label: "Varför budstrategi spelar roll" },
  { id: "taktiker", label: "7 budstrategier" },
  { id: "valja", label: "Så väljer du strategi" },
  { id: "misstag", label: "Vanliga misstag" },
];

const FAQ = [
  {
    q: "Vad är den bästa budstrategin?",
    a: "Det finns ingen universell bästa strategi. Valet beror på hur många budgivare som är med, hur snabbt budgivningen går, om utgångspriset verkar lågt satt och hur stark din ekonomi är. Den viktigaste regeln är att sätta ett maxbud innan budgivningen börjar.",
  },
  {
    q: "Ska man börja med maxbud direkt?",
    a: "Ibland, särskilt om du vill signalera beslutsamhet och få bort svagare budgivare. Risken är att du betalar mer än nödvändigt om ingen annan hade gått så högt. Använd strategin när du är säker på objektet och vill undvika en lång budstrid.",
  },
  {
    q: "Vad är walk-away i budgivning?",
    a: "Walk-away är den högsta nivå du är beredd att betala – din absoluta gräns. Den ska sättas innan budgivningen börjar, baserat på budget, lånelöfte och en nykter värdering av bostaden. När du når den nivån ska du sluta buda, oavsett tempo eller konkurrens.",
  },
  {
    q: "Hur mycket ska man höja budet i taget?",
    a: "I en aktiv budgivning är 25 000–100 000 kr vanligt beroende på prisnivå. Små höjningar döljer ditt tak men kan dra ut på processen. Större steg signalerar styrka men avslöjar snabbare hur långt du är villig att gå.",
  },
];

export default function BudstrategiPage() {
  return (
    <SeoGuideLayout
      slug="budstrategi"
      breadcrumbLabel="Budstrategi"
      eyebrow="Guide · Budstrategi"
      title={TITLE}
      description={DESCRIPTION}
      h1="Budstrategi vid bostadsköp"
      lead="Budstrategi handlar inte om att vinna till varje pris – utan om att buda smart utifrån budget, konkurrens och objektets faktiska värde. Här går vi igenom de vanligaste taktikerna och hur du väljer rätt strategi inför din budgivning."
      toc={TOC}
      faq={FAQ}
    >
      <section id="varfor" className="guide-section">
        <h2 className="guide-h2">Varför budstrategi spelar roll</h2>
        <p>
          De flesta köpare går in i en budgivning med känsla men utan plan. De reagerar på motbud,
          låter tempot styra och höjer tills det gör ont – eller tills de förlorar objektet. En tydlig
          budstrategi skyddar dig från båda fallen.
        </p>
        <p>
          Budgivningen är lika mycket psykologi som ekonomi. Mäklaren vill skapa tempo. Andra budgivare
          testar hur långt du går. Utgångspriset är ofta satt för att locka in spekulanter, inte för
          att spegla marknaden. Utan strategi riskerar du att betala mer än bostaden är värd – eller
          att backa för tidigt trots att du hade råd.
        </p>
        <div className="guide-callout">
          <p>
            Sätt ditt maxbud <strong>innan</strong> första budet. Skriv ner det. Dela det inte med
            mäklaren. Det är din viktigaste skyddsnät.
          </p>
        </div>
      </section>

      <section id="taktiker" className="guide-section">
        <h2 className="guide-h2">7 budstrategier som används i praktiken</h2>
        <ul className="guide-list">
          <li>
            <strong>Maxbud direkt.</strong> Du lägger det du faktiskt är beredd att betala redan från
            start. Signalen är tydlig: jag är seriös och jag har råd. Fungerar när få starka
            konkurrenter finns och du vill undvika budstrid.
          </li>
          <li>
            <strong>Små höjningar.</strong> Du höjer lite i taget för att inte avslöja ditt tak. Bra
            när flera budgivare är med och du vill hålla nere slutpriset. Risk: budgivningen drar ut
            på tiden och fler hinner gå in.
          </li>
          <li>
            <strong>Trötta ut-taktiken.</strong> Snabba, täta bud för att psykologiskt nöta ner
            motståndet. Fungerar bäst när du har ekonomisk marginal och motståndaren verkar osäker.
          </li>
          <li>
            <strong>Återhållsam budgivare.</strong> Du håller dig i bakgrunden och går in sent, när
            färre budgivare återstår. Kräver tålamod och att budgivningen inte stängs snabbt.
          </li>
          <li>
            <strong>Bud över psykologiska gränser.</strong> Många har ett mentalt tak vid jämna summor.
            Ett bud på 3 010 000 kr i stället för 3 000 000 kr kan få andra att backa.
          </li>
          <li>
            <strong>Tidsbegränsat bud.</strong> Ett bud som bara gäller till en viss tid sätter press
            på säljaren att bestämma sig. Använd med försiktighet – det ska fortfarande ligga inom ditt
            maxbud.
          </li>
          <li>
            <strong>Finansieringssäkerhet som strategi.</strong> I tight budgivning kan säljaren välja
            ett lägre bud från en köpare med beviljat lån och kort tillträde. Ha lånelöfte klart och
            kommunicera det tydligt till mäklaren.
          </li>
        </ul>
      </section>

      <section id="valja" className="guide-section">
        <h2 className="guide-h2">Så väljer du rätt budstrategi</h2>
        <p>Utgå från tre faktorer: konkurrens, utgångspris och din egen ekonomi.</p>
        <ul className="guide-list">
          <li>
            <strong>Många budgivare + lågt utgångspris:</strong> Räkna med budstrid. Undvik maxbud
            direkt om du inte vill betala överpris. Sätt walk-away och håll dig till den.
          </li>
          <li>
            <strong>Få budgivare + rimligt pris:</strong> Ett tydligt bud nära ditt max kan avsluta
            snabbt utan onödig uppbudning.
          </li>
          <li>
            <strong>Osäker förening eller dyrt underhåll:</strong> Var mer konservativ. Din strategi
            ska spegla risken – inte bara hur mycket du vill ha lägenheten.
          </li>
        </ul>
        <p>
          Jämför alltid med faktiska slutpriser i området, inte utgångspriset. Om tre liknande
          lägenheter sålts för 8,1–8,4 Mkr är det din referens – inte mäklarens 7,95 Mkr i utgångspris.
        </p>
      </section>

      <section id="misstag" className="guide-section">
        <h2 className="guide-h2">Vanliga misstag i budstrategin</h2>
        <ul className="guide-list">
          <li>Buda utan att ha räknat på total månadskostnad (avgift + ränta + amortering).</li>
          <li>Låta tempot i budgivningen styra höjningarna i stället för din plan.</li>
          <li>Anta att högsta budet alltid vinner – säljaren kan välja lägre bud med bättre villkor.</li>
          <li>Öka budet för att &quot;inte förlora&quot; när objektet redan passerat din walk-away.</li>
          <li>Ignorera föreningens ekonomi och bara fokusera på lägenheten och läget.</li>
        </ul>
      </section>
    </SeoGuideLayout>
  );
}
