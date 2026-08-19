import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { initOrGetCredits } from "@/lib/kv";

// POST /api/stripe-webhook — siehe quiz-funnel-builder-spec.md, Abschnitt 6.
// Absicherung, falls der Client-seitige Verify-Call (/api/verify-session) fehlschlägt:
// bestätigt checkout.session.completed und initialisiert den Zähler serverseitig.

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET ist nicht gesetzt.");
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET ist nicht gesetzt." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Fehlende Stripe-Signatur." }, { status: 400 });
  }

  // Raw Body wird für die Signaturprüfung benötigt (kein request.json()).
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe-webhook] Signaturprüfung fehlgeschlagen:", error);
    return NextResponse.json({ error: "Ungültige Webhook-Signatur." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      await initOrGetCredits(session.id);
    }
  }

  return NextResponse.json({ received: true });
}
