import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
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
    ];
  },
};

export default nextConfig;
