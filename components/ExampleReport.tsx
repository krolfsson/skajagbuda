import { EXAMPLE_PROPERTY, EXAMPLE_SCORECARD, EXAMPLE_CONCLUSION } from "@/lib/example-scorecard";
import { ScorecardReport } from "@/components/ScorecardReport";

/**
 * Full example scorecard — shared by landing page and /exempel.
 */
export function ExampleReport({
  showHeading = true,
  mobileCompactPreview = false,
}: {
  showHeading?: boolean;
  mobileCompactPreview?: boolean;
}) {
  return (
    <ScorecardReport
      title={EXAMPLE_PROPERTY.title}
      meta={EXAMPLE_PROPERTY.metaShort}
      scorecard={EXAMPLE_SCORECARD}
      conclusionLine={EXAMPLE_CONCLUSION}
      showHeading={showHeading}
      mobileCompactPreview={mobileCompactPreview}
    />
  );
}
