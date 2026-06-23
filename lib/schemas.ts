import { z } from "zod";

export const CreateAnalysisSchema = z.object({
  title: z.string().min(1, "Titel är obligatorisk").max(200),
  address: z.string().max(300).optional(),
  area: z.string().max(200).optional(),
  city: z.string().max(200).optional(),

  askingPrice: z.coerce.number().int().positive().optional(),
  currentBid: z.coerce.number().int().positive().optional(),
  monthlyFee: z.coerce.number().int().positive().optional(),

  livingAreaSqm: z.coerce.number().positive().optional(),
  rooms: z.coerce.number().positive().optional(),
  floor: z.coerce.number().optional(),
  totalFloors: z.coerce.number().int().optional(),
  hasBalcony: z.coerce.boolean().optional().default(false),
  balconyDirection: z.string().max(50).optional(),
  hasElevator: z.coerce.boolean().optional().default(false),
  hasFireplace: z.coerce.boolean().optional().default(false),

  associationName: z.string().max(300).optional(),
  associationDebtPerSqm: z.coerce.number().int().optional(),
  associationCash: z.coerce.number().int().optional(),
  associationAnnualFeeChangePercent: z.coerce.number().optional(),
  ownershipShare: z.coerce.number().optional(),

  plannedRenovations: z.string().optional(),
  upcomingPipeReplacement: z.coerce.boolean().optional().default(false),
  pipeReplacementDetails: z.string().optional(),

  userMaxBudget: z.coerce.number().int().positive().optional(),
  userDownPayment: z.coerce.number().int().positive().optional(),
  userMonthlyComfortLimit: z.coerce.number().int().positive().optional(),
  userNotes: z.string().optional(),

  listingUrl: z.string().url().optional().or(z.literal("")),
  listingText: z.string().optional(),
  annualReportText: z.string().optional(),
  biddingText: z.string().optional(),
  agentInfoText: z.string().optional(),
});

export type CreateAnalysisInput = z.infer<typeof CreateAnalysisSchema>;

// ─── AI scorecard ──────────────────────────────────────────────────────────────

export const BidStrategySchema = z.object({
  openingMove: z.string(),
  nextStep: z.string(),
  walkAwayPoint: z.string(),
  negotiationNotes: z.string(),
});

export const CategoryScoresSchema = z.object({
  price: z.number().int().min(0).max(100),
  association: z.number().int().min(0).max(100),
  condition: z.number().int().min(0).max(100),
  location: z.number().int().min(0).max(100),
  liquidity: z.number().int().min(0).max(100),
  risk: z.number().int().min(0).max(100),
});

export const ComparisonObjectSchema = z.object({
  address: z.string(),
  soldDate: z.string().optional(),
  sqm: z.number().positive().nullable().optional(),
  soldPrice: z.number().int().positive().nullable().optional(),
  pricePerSqm: z.number().int().positive().nullable().optional(),
  relevance: z.enum(["Hög", "Medel", "Låg"]).optional(),
  comment: z.string().optional(),
  isSameAddress: z.boolean().optional().default(false),
});

export const BidIntervalsSchema = z.object({
  fairValueLow: z.number().int().positive().nullable(),
  fairValueHigh: z.number().int().positive().nullable(),
  recommendedCeiling: z.number().int().positive().nullable(),
  stretchLevel: z.number().int().positive().nullable(),
  walkAwayLevel: z.number().int().positive().nullable(),
  uncertaintyNote: z.string().optional(),
});

export const PriceAnalysisSchema = z.object({
  askingPriceNote: z.string(),
  pricePerSqmNote: z.string(),
  estimatedFairRangeLow: z.number().int().positive().nullable(),
  estimatedFairRangeHigh: z.number().int().positive().nullable(),
  areaComparison: z.string(),
  comparableSummary: z.string().optional(),
  priorSalesNote: z.string().optional(),
  verdict: z.enum(["Rimligt", "Pressat", "Överprisat", "Osäkert"]),
  conclusion: z.string(),
  missingComparablesNote: z.string().optional(),
});

export const BidArgumentsSchema = z.object({
  holdBack: z.array(z.string()).min(1),
  premiumJustification: z.array(z.string()),
});

export const BudgetContextSchema = z.object({
  userMaxBudget: z.number().int().positive().nullable().optional(),
  budgetVsRecommendation: z.string(),
});

export const ScorecardSchema = z.object({
  score: z.number().int().min(0).max(100),
  recommendation: z.enum(["Buda inte", "Buda försiktigt", "Buda", "Starkt case"]),
  riskLevel: z.enum(["Låg", "Medel", "Hög", "Mycket hög"]),
  /** Rekommenderat budtak — oberoende marknadsbedömning, inte användarens budget. */
  maxBidSuggestion: z.number().int().positive().nullable(),
  bidIntervals: BidIntervalsSchema,
  priceAnalysis: PriceAnalysisSchema,
  bidArguments: BidArgumentsSchema,
  comparisonObjects: z.array(ComparisonObjectSchema),
  budgetContext: BudgetContextSchema,
  associationRiskSummary: z.string(),
  oneSentenceSummary: z.string(),
  summary: z.string(),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()),
  redFlags: z.array(z.string()),
  questionsToAsk: z.array(z.string()),
  bidStrategy: BidStrategySchema,
  categoryScores: CategoryScoresSchema,
  disclaimer: z.string(),
});

export type Scorecard = z.infer<typeof ScorecardSchema>;

// ─── Free risk preview ────────────────────────────────────────────────────────

export const FreeRiskSchema = z.object({
  riskLevel: z.enum(["Låg", "Medel", "Hög", "Mycket hög"]),
});

export type FreeRiskResult = z.infer<typeof FreeRiskSchema>;
