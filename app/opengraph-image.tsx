import { OG_IMAGE_ALT } from "@/lib/brand";
import { generateOgImage, OG_IMAGE_SIZE } from "@/lib/generate-og-image";

export const alt = OG_IMAGE_ALT;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default generateOgImage;
