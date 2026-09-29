import type { Metadata } from "next";
import { InfoPageLayout, InfoSection } from "@/components/InfoPageLayout";
import { PRODUCT_DOMAIN } from "@/lib/brand";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/om",
  title: "Om tjänsten",
  description: `${PRODUCT_DOMAIN} är ett beslutsstöd för bostadsköpare. Strukturera underlag från annons, budhistorik och årsredovisning innan du går vidare i budgivningen.`,
});

export default function OmPage() {
  return (
    <InfoPageLayout
      title={`Om ${PRODUCT_DOMAIN}`}
      lead={`${PRODUCT_DOMAIN} är ett beslutsstöd för bostadsköpare. Tjänsten hjälper dig strukturera underlag från annons, budhistorik och årsredovisning och väga pris, förening och risk innan du går vidare i budgivningen.`}
      showCta
    >
      <InfoSection title="Så fungerar det">
        <ol className="info-page-list info-page-list--ordered">
          <li>Klistra in länken från mäklarens hemsida – eller annonstexten om du inte har en länk.</li>
          <li>Kontrollera och komplettera uppgifterna, till exempel utgångspris och boarea.</li>
          <li>
            Få en analys med rimligt budintervall, föreningsrisk, röda flaggor och frågor att
            ställa. Just nu gratis under betan.
          </li>
        </ol>
      </InfoSection>

      <InfoSection title="Viktigt att veta">
        <p>
          Analysen är ett beslutsstöd och ersätter inte rådgivning från bank, jurist, mäklare eller
          annan expert. Kontrollera alltid uppgifter själv.
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
}
