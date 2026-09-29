import Stripe from "stripe";
import { FULL_ANALYSIS_PRICE_SEK, SITE_URL } from "@/lib/brand";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export { FULL_ANALYSIS_PRICE_SEK };
export const FULL_ANALYSIS_PRICE_ORE = FULL_ANALYSIS_PRICE_SEK * 100;

/** Absolute base URL for Stripe redirects — canonical host, no trailing slash. */
export function getAppUrl(): string {
  return SITE_URL;
}
