import type { Metadata } from "next";
import { InfoPageLayout, InfoSection } from "@/components/InfoPageLayout";
import { PRODUCT_DOMAIN } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Om tjänsten",
  description: `${PRODUCT_DOMAIN} är ett beslutsstöd för bostadsköpare. Strukturera underlag från annons, budhistorik och årsredovisning innan du går vidare i budgivningen.`,
  alternates: { canonical: "/om" },
};

export default function OmPage() {
  return (
    <InfoPageLayout
      title={`Om ${PRODUCT_DOMAIN}`}
      lead={`${PRODUCT_DOMAIN} är ett beslutsstöd för bostadsköpare. Tjänsten hjälper dig strukturera underlag från annons, budhistorik och årsredovisning och väga pris, förening och risk innan du går vidare i budgivningen.`}
      showCta
    >
      <InfoSection title="Så fungerar det">
        <ol className="info-page-list info-page-list--ordered">
          <li>Klistra in det du vet om bostaden.</li>
          <li>Få en preliminär risknivå gratis.</li>
          <li>
            Lås upp full analys om du vill se maxbud, budstrategi, röda flaggor och frågor att
            ställa.
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
