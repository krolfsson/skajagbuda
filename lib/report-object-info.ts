import type { PropertyAnalysis } from "@/app/generated/prisma/client";
import { fmtMoney } from "@/lib/report-ui";

export type ReportObjectInfo = {
  title: string;
  address: string | null;
  rooms: number | null;
  sqm: number | null;
  associationName: string | null;
  askingPrice: number | null;
  monthlyFee: number | null;
  userMaxBudget: number | null;
  associationDebtPerSqm: number | null;
  associationCash: number | null;
  associationAnnualFeeChangePercent: number | null;
  hasAnnualReport: boolean;
};

export function reportObjectInfoFromAnalysis(analysis: PropertyAnalysis): ReportObjectInfo {
  return {
    title: analysis.title,
    address: analysis.address ?? analysis.title,
    rooms: analysis.rooms ? Number(analysis.rooms) : null,
    sqm: analysis.livingAreaSqm ? Number(analysis.livingAreaSqm) : null,
    associationName: analysis.associationName,
    askingPrice: analysis.askingPrice,
    monthlyFee: analysis.monthlyFee,
    userMaxBudget: analysis.userMaxBudget,
    associationDebtPerSqm: analysis.associationDebtPerSqm,
    associationCash: analysis.associationCash,
    associationAnnualFeeChangePercent: analysis.associationAnnualFeeChangePercent
      ? Number(analysis.associationAnnualFeeChangePercent)
      : null,
    hasAnnualReport: !!analysis.annualReportText?.trim(),
  };
}

export function formatObjectMeta(info: ReportObjectInfo): string {
  return [
    info.rooms ? `${info.rooms} rok` : null,
    info.sqm ? `${info.sqm} kvm` : null,
    info.associationName,
    info.askingPrice ? `Utgångspris ${fmtMoney(info.askingPrice)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
