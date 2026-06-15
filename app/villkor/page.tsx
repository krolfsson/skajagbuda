import type { Metadata } from "next";
import { InfoPageLayout, InfoSection } from "@/components/InfoPageLayout";
import { FULL_ANALYSIS_PRICE_SEK, PRODUCT_DOMAIN } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Villkor",
  description: `Användarvillkor för ${PRODUCT_DOMAIN} — beslutsstöd för bostadsköpare, inte finansiell rådgivning.`,
  alternates: { canonical: "/villkor" },
};

export default function VillkorPage() {
  return (
    <InfoPageLayout
      title="Villkor"
      lead="En enkel översikt över hur tjänsten får användas. Detta är inte en fullständig juridisk avtalstext utan en översikt inför lansering."
    >
      <InfoSection title="Vad tjänsten är">
        <p>
          {PRODUCT_DOMAIN} är ett beslutsstöd för bostadsköpare. Tjänsten strukturerar information du
          matar in och ger en preliminär risknivå gratis. Full analys kan låsas upp mot
          engångsbetalning.
        </p>
        <p>
          Tjänsten är inte finansiell, juridisk eller ekonomisk rådgivning. Analysen kan vara
          ofullständig eller felaktig. Du ansvarar själv för dina köpbeslut och bör verifiera
          uppgifter med mäklare, bostadsrättsförening, bank eller annan relevant expert.
        </p>
      </InfoSection>

      <InfoSection title="Pris och betalning">
        <p>
          Full analys kostar {FULL_ANALYSIS_PRICE_SEK} kr som engångsbetalning. Det finns ingen
          prenumeration. Betalning sker via Stripe med kort, Apple Pay eller Google Pay där det
          stöds.
        </p>
        <p>
          Efter genomförd betalning låses hela analysen upp direkt. Återbetalningsregler kan
          kompletteras vid behov — kontakta oss om något inte fungerar som förväntat.
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
