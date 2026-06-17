import Image from "next/image";
import { PRODUCT_NAME } from "@/lib/brand";

export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt={PRODUCT_NAME}
      width={846}
      height={137}
      priority
      className="site-logo"
    />
  );
}
