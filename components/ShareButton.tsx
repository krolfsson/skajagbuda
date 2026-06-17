"use client";

import { useState } from "react";
import { PRODUCT_NAME } from "@/lib/brand";

export function ShareButton({
  title,
  text,
}: {
  title?: string;
  text?: string;
}) {
  const [label, setLabel] = useState("Dela");

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title: title ?? "Bostadsanalys",
      text: text ?? `Se min bostadsanalys på ${PRODUCT_NAME}`,
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        setLabel("Delat!");
        setTimeout(() => setLabel("Dela"), 2000);
        return;
      } catch (err) {
        if ((err as DOMException).name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setLabel("Länk kopierad");
      setTimeout(() => setLabel("Dela"), 2000);
    } catch {
      window.prompt("Kopiera länken:", url);
    }
  }

  return (
    <button type="button" className="btn-secondary-sm no-print" onClick={handleShare}>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 2v9m0 0l-3-3m3 3l3-3M3 13h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </button>
  );
}
