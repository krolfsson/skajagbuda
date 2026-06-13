import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** Shared 1200×630 social preview image for Open Graph and Twitter. */
export async function generateOgImage() {
  const logoBuffer = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "#f5f5f3",
          padding: "56px 72px",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: "#123f35",
          }}
        />

        <img
          src={logoSrc}
          height={68}
          width={257}
          style={{ marginLeft: -18, marginBottom: 44 }}
          alt=""
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            maxWidth: 920,
          }}
        >
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              color: "#111111",
              letterSpacing: "-0.04em",
              lineHeight: 1.06,
              marginBottom: 18,
            }}
          >
            Få koll innan du budar.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#505050",
              lineHeight: 1.35,
              marginBottom: 30,
            }}
          >
            Beslutsstöd för bostadsköp
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              fontSize: 22,
              fontWeight: 600,
              color: "#123f35",
              background: "#eef4f2",
              border: "1px solid #c5d9d2",
              borderRadius: 8,
              padding: "12px 22px",
            }}
          >
            Preliminär risknivå gratis
          </div>
        </div>

        <div
          style={{
            fontSize: 21,
            color: "#888888",
            borderTop: "1px solid #e2e2e0",
            paddingTop: 22,
            letterSpacing: "0.01em",
          }}
        >
          Pris · förening · budstrategi
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  );
}
