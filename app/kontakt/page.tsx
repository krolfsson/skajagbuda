import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/InfoPageLayout";
import { CONTACT_EMAIL, PRODUCT_DOMAIN } from "@/lib/brand";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/kontakt",
  title: "Kontakt",
  description: `Kontakta ${PRODUCT_DOMAIN} med frågor, feedback eller om något i analysen inte stämmer.`,
});

export default function KontaktPage() {
  return (
    <InfoPageLayout
      title="Kontakt"
      lead="Har du frågor, feedback eller vill rapportera något som inte stämmer?"
    >
      <p>
        Mejla oss på{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="info-page-link">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
      <p className="info-page-muted">
        Vi svarar så snart vi kan. Beskriv gärna vilket objekt eller vilken analys det gäller om du
        kontaktar oss om ett specifikt underlag.
      </p>
    </InfoPageLayout>
  );
}
