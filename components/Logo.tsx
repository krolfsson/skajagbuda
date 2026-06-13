import Image from "next/image";
import { PRODUCT_NAME } from "@/lib/brand";

export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt={PRODUCT_NAME}
      width={1024}
      height={341}
      priority
      className="site-logo"
    />
  );
}
