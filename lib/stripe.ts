import Stripe from "stripe";
import { FULL_ANALYSIS_PRICE_SEK } from "@/lib/brand";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export { FULL_ANALYSIS_PRICE_SEK };
export const FULL_ANALYSIS_PRICE_ORE = FULL_ANALYSIS_PRICE_SEK * 100;

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
