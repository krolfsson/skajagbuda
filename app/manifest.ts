import type { MetadataRoute } from "next";
import { PRODUCT_DOMAIN, PRODUCT_TAGLINE, BRAND_GREEN } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PRODUCT_DOMAIN,
    short_name: "Ska jag buda?",
    description: PRODUCT_TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f3",
    theme_color: BRAND_GREEN,
    lang: "sv",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
