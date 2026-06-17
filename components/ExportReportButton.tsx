"use client";

import { useState } from "react";
import type { Scorecard } from "@/lib/schemas";
import { scorecardFilename, scorecardToMarkdown } from "@/lib/export-scorecard";

export function ExportReportButton({
  title,
  meta,
  scorecard,
}: {
  title: string;
  meta: string | null;
  scorecard: Scorecard;
}) {
  const [label, setLabel] = useState("Markdown");

  function handleExport() {
    const markdown = scorecardToMarkdown(title, meta, scorecard);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = scorecardFilename(title);
    link.click();
    URL.revokeObjectURL(url);
    setLabel("Nedladdad!");
    setTimeout(() => setLabel("Markdown"), 2000);
  }

  return (
      <button
        type="button"
        className="btn-primary btn-primary--sm no-print"
        onClick={handleExport}
      >
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
