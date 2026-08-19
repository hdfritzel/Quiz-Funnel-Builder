import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

/**
 * Lazy-Singleton: wirft erst beim ersten tatsächlichen Aufruf, falls die ENV
 * fehlt, statt schon beim Modul-Import (wichtig für Build-Zeit ohne Secrets).
 */
export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY ist nicht gesetzt.");
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2026-07-29.dahlia",
    });
  }
  return stripeInstance;
}
