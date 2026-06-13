/** Local dev only — skip Stripe and treat analyses as paid. Never enable in production. */
export function isDevPaymentBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.DEV_BYPASS_PAYMENT === "true"
  );
}
