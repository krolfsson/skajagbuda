import type { Metadata } from "next";
import { InfoPageLayout, InfoSection } from "@/components/InfoPageLayout";
import { PRODUCT_DOMAIN } from "@/lib/brand";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/integritet",
  title: "Integritet",
  description: `Hur ${PRODUCT_DOMAIN} hanterar information du matar in och betalning via Stripe.`,
});

export default function IntegritetPage() {
  return (
    <InfoPageLayout
      title="Integritet"
      lead="En enkel översikt över hur vi hanterar information i tjänsten. Detta är inte en fullständig integritetspolicy utan en översikt inför lansering."
    >
      <InfoSection title="Vad du matar in">
        <p>
          Du klistrar in eller laddar upp bostadsrelaterad information — till exempel annonstext,
          budhistorik och årsredovisning. Den informationen används för att skapa din analys.
        </p>
        <p>
          Underlaget kan innehålla det du själv väljer att dela. Klistra inte in onödiga
          personuppgifter som inte behövs för analysen.
        </p>
      </InfoSection>

      <InfoSection title="Betalning">
        <p>
          Betalning för full analys hanteras av Stripe. {PRODUCT_DOMAIN} lagrar inte dina
          kortuppgifter. Stripe behandlar betalningsinformation enligt sina egna villkor och
          säkerhetsrutiner.
        </p>
      </InfoSection>

      <InfoSection title="Lagring och användning">
        <p>
          Analysunderlag och resultat lagras för att du ska kunna gå tillbaka till din analys och
          låsa upp full analys efter betalning. Vi säljer inte dina uppgifter till tredje part.
        </p>
        <p>
          En mer detaljerad integritetspolicy kan kompletteras vid behov. Kontakta oss om du har
          frågor om hur dina uppgifter hanteras.
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
}
