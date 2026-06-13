/** Shared UI colors aligned with Ska jag buda? brand palette. */

export const REC_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  "Buda inte":       { text: "#be123c", bg: "#fff1f2", border: "#fecdd3" },
  "Buda försiktigt": { text: "#6b5c45", bg: "#f8f6f2", border: "#e4ddd0" },
  "Buda":            { text: "#123f35", bg: "#eef4f2", border: "#c5d9d2" },
  "Starkt case":     { text: "#0d2d26", bg: "#eef4f2", border: "#a8c4bb" },
};

export const RISK_DOT: Record<string, string> = {
  "Låg":        "#123f35",
  "Medel":      "#6b5c45",
  "Hög":        "#be123c",
  "Mycket hög":"#881337",
};

export const BRAND = {
  primary: "#123f35",
  secondary: "#334e5c",
  good: "#123f35",
  caution: "#6b5c45",
  bad: "#be123c",
} as const;

export function scoreBarColor(value: number, inverted?: boolean): string {
  const good = BRAND.good;
  const mid = BRAND.caution;
  const bad = BRAND.bad;
  return inverted
    ? value >= 70 ? bad : value >= 45 ? mid : good
    : value >= 70 ? good : value >= 45 ? mid : bad;
}
