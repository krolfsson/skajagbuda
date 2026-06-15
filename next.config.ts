import type { NextConfig } from "next";
import path from "path";

const pdfTraceIncludes = [
  "./node_modules/pdf-parse/**/*",
  "./node_modules/pdfjs-dist/**/*",
  "./node_modules/@napi-rs/canvas/**/*",
  "./node_modules/@napi-rs/canvas-linux-x64-gnu/**/*",
  "./node_modules/@napi-rs/canvas-linux-x64-musl/**/*",
  "./node_modules/@napi-rs/canvas-darwin-arm64/**/*",
  "./node_modules/@napi-rs/canvas-darwin-x64/**/*",
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "@napi-rs/canvas"],
  outputFileTracingIncludes: {
    "/api/scrape-listing": pdfTraceIncludes,
    "/api/parse-pdf": pdfTraceIncludes,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      { source: "/budstrategi", destination: "/guider/budstrategi-bostadsratt", permanent: true },
      { source: "/strategi-budgivning", destination: "/guider/budstrategi-bostadsratt", permanent: true },
      { source: "/vinna-budgivning", destination: "/guider/budstrategi-bostadsratt", permanent: true },
      { source: "/budgivning-tips", destination: "/guider/checklista-innan-budgivning", permanent: true },
      { source: "/budgivning-bostadsratt", destination: "/guider/budgivning-stockholm", permanent: true },
      { source: "/omraden", destination: "/guider", permanent: true },
      { source: "/omraden/:slug", destination: "/guider", permanent: true },
    ];
  },
};

export default nextConfig;
