import { isDevPaymentBypassEnabled } from "@/lib/dev-bypass";

/**
 * Skip Stripe unlock when PAYWALL_DISABLED=true (works in all environments).
 * Set PAYWALL_DISABLED=false or remove the variable to enable payments again.
 */
export function isPaywallDisabled(): boolean {
  return process.env.PAYWALL_DISABLED === "true";
}

export function isPaywallBypassActive(): boolean {
  return isPaywallDisabled() || isDevPaymentBypassEnabled();
}

export function isAnalysisUnlocked(analysis: {
  paymentStatus: string;
  analysisUnlocked: boolean;
}): boolean {
  if (isPaywallBypassActive()) return true;
  return analysis.paymentStatus === "PAID" && analysis.analysisUnlocked;
}
