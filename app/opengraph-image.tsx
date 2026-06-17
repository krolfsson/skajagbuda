import { ImageResponse } from "next/og";
import { OG_DESCRIPTION, PRODUCT_DOMAIN, BRAND_GREEN } from "@/lib/brand";

export const runtime = "edge";
export const alt = "skajagbuda.se – beslutsstöd inför budgivning";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #eef4f2 0%, #f5f5f3 55%, #ffffff 100%)",
          color: BRAND_GREEN,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <p style={{ fontSize: 28, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.72, margin: 0 }}>
            Beslutsstöd för bostadsköp
          </p>
          <h1 style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, margin: 0, letterSpacing: "-0.03em" }}>
            Få koll innan du budar
          </h1>
          <p style={{ fontSize: 30, lineHeight: 1.45, color: "#334e5c", margin: 0, maxWidth: 880 }}>
            {OG_DESCRIPTION}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 34, fontWeight: 700, margin: 0 }}>{PRODUCT_DOMAIN}</p>
          <p style={{ fontSize: 24, color: "#505050", margin: 0 }}>Preliminär risknivå gratis</p>
        </div>
      </div>
    ),
    { ...size, headers: { "Cache-Control": "public, max-age=86400, immutable" } },
  );
}
