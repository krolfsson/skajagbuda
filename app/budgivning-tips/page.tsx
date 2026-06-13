import type { Metadata } from "next";
import { SeoGuideLayout } from "@/components/SeoGuideLayout";
import { SITE_URL } from "@/lib/brand";

const TITLE = "Budgivning tips – 12 saker att veta innan du lägger första budet";
const DESCRIPTION =
  "Praktiska budgivning tips för bostadsköpare: lånelöfte, budförteckning, lockpris, maxbud, föreningsgranskning och vanliga misstag att undvika inför budgivningen.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "budgivning tips",
    "tips budgivning",
    "tips inför budgivning",
    "råd budgivning bostad",
    "budgivning råd",
  ],
  alternates: { canonical: "/budgivning-tips" },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/budgivning-tips`,
    title: TITLE,
    description: DESCRIPTION,
  },
};

const TOC = [
  { id: "innan", label: "Tips innan budgivningen" },
  { id: "under", label: "Tips under budgivningen" },
  { id: "misstag", label: "Misstag att undvika" },
];

const FAQ = [
  {
    q: "Vad är det viktigaste tipset inför budgivning?",
    a: "Sätt ditt maxbud innan budgivningen börjar – baserat på slutpriser i området, föreningens ekonomi och din budget. Det skyddar dig från att buda på känsla.",
  },
  {
    q: "Ska man alltid buda över utgångspriset?",
    a: "Inte nödvändigtvis. Utgångspriset är ett marknadsföringspris som ofta sätts lågt. Jämför med faktiska slutpriser för liknande objekt och låt det styra ditt bud – inte annonsen.",
  },
  {
    q: "Hur förbereder man sig ekonomiskt?",
    a: "Skaffa lånelöfte, räkna total månadskostnad (avgift + ränta + amortering) vid olika prisnivåer och säkerställ att du har kontantinsats (minst 15 %) och buffert för handpenning.",
  },
  {
    q: "Kan man dra tillbaka ett bud?",
    a: "Ett bud är inte juridiskt bindande förrän kontraktet är signerat. Men att lägga bud du inte menar skadar din trovärdighet hos mäklaren. Buda bara när du är beredd att gå vidare.",
  },
];

export default function BudgivningTipsPage() {
  return (
    <SeoGuideLayout
      slug="budgivning-tips"
      breadcrumbLabel="Budgivning tips"
      eyebrow="Guide · Tips"
      title={TITLE}
      description={DESCRIPTION}
      h1="Budgivning tips – innan, under och efter"
      lead="Budgivning tips som faktiskt hjälper handlar mindre om hemliga knep och mer om förberedelse, tydliga gränser och att förstå hur processen fungerar. Här är de viktigaste råden samlade."
      toc={TOC}
      faq={FAQ}
    >
      <section id="innan" className="guide-section">
        <h2 className="guide-h2">Tips innan budgivningen</h2>
        <ul className="guide-list">
          <li>
            <strong>Skaffa lånelöfte.</strong> Bankens förhandsbesked visar hur mycket du kan låna och
            ger dig en tydlig budgetram.
          </li>
          <li>
            <strong>Jämför slutpriser, inte utgångspriser.</strong> Kolla vad liknande bostäder
            faktiskt sålts för i samma område de senaste månaderna.
          </li>
          <li>
            <strong>Läs årsredovisningen.</strong> Skuld/kvm, avgiftshöjningar, underhållsplan och
            kassaflöde kan förändra hur mycket bostaden är värd för dig.
          </li>
          <li>
            <strong>Sätt maxbud och walk-away.</strong> Skriv ner det. Dela det inte. Det är din
            viktigaste regel.
          </li>
          <li>
            <strong>Räkna total månadskostnad.</strong> Inte bara köpeskillingen – avgift, ränta och
            amortering ska klara din vardagsekonomi.
          </li>
          <li>
            <strong>Fråga om budgivningsformat.</strong> Öppen eller dold? Tidsbegränsad? Det påverkar
            hur du ska tänka taktiskt.
          </li>
        </ul>
      </section>

      <section id="under" className="guide-section">
        <h2 className="guide-h2">Tips under budgivningen</h2>
        <ul className="guide-list">
          <li>
            <strong>Budsteg i förväg.</strong> Bestäm hur mycket du höjer per gång – 25 000, 50 000
            eller 100 000 kr beroende på prisnivå.
          </li>
          <li>
            <strong>Låt inte tempot styra.</strong> Snabba bud från andra är ofta taktik. Ta tid att
            tänka mellan dina egna bud.
          </li>
          <li>
            <strong>Begär budförteckning.</strong> Efter avslutad budgivning har du rätt att se
            dokumentationen. Bra om något känns oklart.
          </li>
          <li>
            <strong>Kommunisera finansiering.</strong> Berätta att du har lånelöfte klart – det kan
            väga positivt om säljaren väljer mellan likvärdiga bud.
          </li>
          <li>
            <strong>Stanna vid walk-away.</strong> När du når din gräns – sluta. Det finns fler
            bostäder.
          </li>
        </ul>
        <div className="guide-callout">
          <p>
            Ett bud är inte bindande förrän kontraktet är signerat – men lägg bara bud du menar
            allvar med. Din trovärdighet som köpare räknas i nästa budgivning också.
          </p>
        </div>
      </section>

      <section id="misstag" className="guide-section">
        <h2 className="guide-h2">Misstag att undvika</h2>
        <ul className="guide-list">
          <li>Buda på grund av FOMO – rädsla att missa – utan att ha granskat underlaget.</li>
          <li>Tro att utgångspriset speglar marknaden (lockpris är vanligt).</li>
          <li>Ignorera föreningens framtida kostnader: stambyte, tomträtt, räntehöjningar.</li>
          <li>Höja budet för att &quot;testa&quot; hur långt andra går – du avslöjar ditt intresse och ditt tak.</li>
          <li>Glömma att affären kräver föreningsgodkännande och ibland lång tid till tillträde.</li>
        </ul>
      </section>
    </SeoGuideLayout>
  );
}
