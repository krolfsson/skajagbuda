"use client";

import { useState } from "react";
import { scorecardPdfFilename } from "@/lib/export-scorecard";

export function DownloadPdfButton({ title }: { title: string }) {
  const [label, setLabel] = useState("Ladda ner PDF");

  function handlePrint() {
    const originalTitle = document.title;
    document.title = scorecardPdfFilename(title);
    window.print();
    document.title = originalTitle;
    setLabel("Välj Spara som PDF i dialogen");
    setTimeout(() => setLabel("Ladda ner PDF"), 3000);
  }

  return (
      <button
        type="button"
        className="btn-secondary-sm btn-secondary-sm--brand no-print"
        onClick={handlePrint}
      >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M4 2h5l3 3v9H4V2zM9 2v3h3M6 9h4M6 11.5h4"
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
