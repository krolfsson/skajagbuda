import type { Metadata } from "next";
import { SeoGuideLayout } from "@/components/SeoGuideLayout";
import { SITE_URL } from "@/lib/brand";

const TITLE = "Strategi inför budgivningen – så planerar du innan du budar";
const DESCRIPTION =
  "Komplett strategi inför budgivningen: förberedelse, maxbud, budsteg, ekonomi och beslut under press. Planera innan budgivningen börjar så du inte budar på känsla.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "strategi budgivning",
    "strategi inför budgivning",
    "planera budgivning",
    "förberedelse budgivning",
    "budgivning bostadsrätt strategi",
  ],
  alternates: { canonical: "/strategi-budgivning" },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/strategi-budgivning`,
    title: TITLE,
    description: DESCRIPTION,
  },
};

const TOC = [
  { id: "forberedelse", label: "Förberedelse innan budgivning" },
  { id: "maxbud", label: "Sätt maxbud och walk-away" },
  { id: "under", label: "Strategi under budgivningen" },
  { id: "efter", label: "Efter att du vunnit eller förlorat" },
];

const FAQ = [
  {
    q: "När ska man börja planera sin budgivningsstrategi?",
    a: "Redan efter visningen, innan budgivningen startar. Då ska du ha koll på slutpriser i området, föreningens ekonomi, ditt lånelöfte och ditt maxbud. Att vänta tills första budet kommer in är för sent.",
  },
  {
    q: "Hur sätter man ett realistiskt maxbud?",
    a: "Utgå från jämförbara slutpriser för liknande objekt, justera för föreningens risker (stambyte, skuldsättning, tomträtt) och begränsa till det lägsta av marknadsvärde och din budget. Avrunda till en tydlig gräns du inte passerar.",
  },
  {
    q: "Ska man buda före eller efter att ha läst årsredovisningen?",
    a: "Helst efter. Föreningens ekonomi kan ändra din bedömning av hur mycket bostaden faktiskt är värd. Om du budar innan du granskat underlaget riskerar du att betala för ett objekt med dolda kostnader framför dig.",
  },
  {
    q: "Vad gör man om budgivningen går snabbare än planerat?",
    a: "Håll fast vid din walk-away. Tempo är en taktik från mäklaren och andra budgivare. Om du inte hinner tänka klart mellan buden, be om tid eller acceptera att du kanske inte hinner med – det är bättre än att överbuda.",
  },
];

export default function StrategiBudgivningPage() {
  return (
    <SeoGuideLayout
      slug="strategi-budgivning"
      breadcrumbLabel="Strategi budgivning"
      eyebrow="Guide · Strategi"
      title={TITLE}
      description={DESCRIPTION}
      h1="Strategi inför budgivningen"
      lead="En bra strategi inför budgivningen börjar inte när första budet läggs – den börjar när du har sett bostaden, granskat underlaget och bestämt vad du faktiskt är beredd att betala. Här är en praktisk plan i fyra steg."
      toc={TOC}
      faq={FAQ}
    >
      <section id="forberedelse" className="guide-section">
        <h2 className="guide-h2">Förberedelse innan budgivningen</h2>
        <p>
          Strategi budgivning handlar om att samla fakta innan känslorna tar över. Innan du lägger
          ett enda bud bör du ha svar på:
        </p>
        <ul className="guide-list">
          <li>Vad liknande bostäder faktiskt sålts för i området (slutpriser, inte utgångspriser).</li>
          <li>Hur föreningens ekonomi ser ut – skuld/kvm, avgiftshöjningar, planerat underhåll.</li>
          <li>Ditt lånelöfte och hur total månadskostnad blir vid olika budnivåer.</li>
          <li>Om utgångspriset verkar lågt satt för att locka budgivning (lockpris).</li>
          <li>Hur många som varit på visning och hur mäklaren beskriver intresset.</li>
        </ul>
        <p>
          Be om budförteckning efter avslutad budgivning om du är osäker på hur processen gått till.
          Mäklaren ska dokumentera bud med belopp och tidpunkter.
        </p>
      </section>

      <section id="maxbud" className="guide-section">
        <h2 className="guide-h2">Sätt maxbud och walk-away</h2>
        <p>
          Ditt maxbud ska baseras på tre tak som möts: marknadsvärde, budget och risk. Om föreningen
          har stambyte framför sig eller hög skuldsättning ska det prisas in – inte ignoreras.
        </p>
        <div className="guide-callout">
          <p>
            Skriv ner tre siffror: <strong>öppningsbud</strong>, <strong>nästa steg</strong> och{" "}
            <strong>walk-away</strong>. Exempel: öppning 7,7 Mkr → nästa steg +50 000 kr → walk-away
            8,15 Mkr. Buda aldrig över walk-away, oavsett hur budgivningen känns.
          </p>
        </div>
        <p>
          Räkna total månadskostnad vid walk-away-nivån: avgift + ränta + amortering. Ligger den över
          din komfortgräns är maxbudet för högt – oavsett vad marknaden verkar acceptera.
        </p>
      </section>

      <section id="under" className="guide-section">
        <h2 className="guide-h2">Strategi under budgivningen</h2>
        <p>När budgivningen väl startar är det lätt att tappa planen. Håll dig till dessa regler:</p>
        <ul className="guide-list">
          <li>
            <strong>Budsteg i förväg.</strong> Bestäm hur mycket du höjer per steg (t.ex. 25 000–100 000
            kr beroende på prisnivå) innan du börjar.
          </li>
          <li>
            <strong>Inga impulsbud.</strong> Vänta alltid minst några minuter mellan dina bud så du
            hinner tänka.
          </li>
          <li>
            <strong>Läs motståndet.</strong> Många snabba små höjningar kan betyda att någon testar
            ditt tak. Ett enda starkt bud kan betyda att de närmar sig sin gräns.
          </li>
          <li>
            <strong>Öppen vs dold budgivning.</strong> I öppen budgivning ser alla bud – då är det
            extra viktigt att inte avslöja ditt max för tidigt.
          </li>
        </ul>
      </section>

      <section id="efter" className="guide-section">
        <h2 className="guide-h2">Efter budgivningen</h2>
        <p>
          Om du vinner: affären är inte klar förrän köpekontraktet är signerat. Ha lån, besiktning
          och föreningsgodkännande klart. Om du förlorar: analysera varför. Var priset över din
          walk-away, eller förlorade du trots lägre bud? Lär dig inför nästa objekt.
        </p>
        <p>
          Oavsett utfall – spara budförteckningen och dina egna anteckningar. Det bygger din
          erfarenhet och gör nästa strategi bättre.
        </p>
      </section>
    </SeoGuideLayout>
  );
}
