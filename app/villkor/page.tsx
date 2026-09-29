import type { Metadata } from "next";
import { InfoPageLayout, InfoSection } from "@/components/InfoPageLayout";
import { FULL_ANALYSIS_PRICE_SEK, PRODUCT_DOMAIN } from "@/lib/brand";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/villkor",
  title: "Villkor",
  description: `Användarvillkor för ${PRODUCT_DOMAIN} — beslutsstöd för bostadsköpare, inte finansiell rådgivning.`,
});

export default function VillkorPage() {
  return (
    <InfoPageLayout
      title="Villkor"
      lead="En enkel översikt över hur tjänsten får användas. Detta är inte en fullständig juridisk avtalstext utan en översikt inför lansering."
    >
      <InfoSection title="Vad tjänsten är">
        <p>
          {PRODUCT_DOMAIN} är ett beslutsstöd för bostadsköpare. Tjänsten strukturerar information du
          matar in och ger en analys av pris, förening, risker och budnivåer.
        </p>
        <p>
          Tjänsten är inte finansiell, juridisk eller ekonomisk rådgivning. Analysen kan vara
          ofullständig eller felaktig. Du ansvarar själv för dina köpbeslut och bör verifiera
          uppgifter med mäklare, bostadsrättsförening, bank eller annan relevant expert.
        </p>
      </InfoSection>

      <InfoSection title="Pris och betalning">
        <p>
          Tjänsten är i beta och just nu gratis — du betalar ingenting och behöver inte ange
          kortuppgifter.
        </p>
        <p>
          När betaperioden är slut planerar vi att ta {FULL_ANALYSIS_PRICE_SEK} kr per analys som
          engångsbetalning, utan prenumeration, via Stripe. Det framgår alltid tydligt innan du
          betalar något.
        </p>
      </InfoSection>

      <InfoSection title="Ansvar">
        <p>
          Du använder tjänsten på eget ansvar. {PRODUCT_DOMAIN} lämnar inga garantier om att
          analysen är fullständig, korrekt eller lämplig för ditt specifika köp. Beslut om bud,
          köp och finansiering fattar du själv.
        </p>
      </InfoSection>
    </InfoPageLayout>
  );
}
