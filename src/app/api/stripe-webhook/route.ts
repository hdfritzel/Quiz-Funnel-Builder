import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { initOrGetCredits } from "@/lib/kv";

const QUENTN_TRIGGER_URL = "https://pitozm.eu-1.quentn.com/public/api/v1/cb/758";

// POST /api/stripe-webhook — siehe quiz-funnel-builder-spec.md, Abschnitt 6.
// Absicherung, falls der Client-seitige Verify-Call (/api/verify-session) fehlschlägt:
// bestätigt checkout.session.completed und initialisiert den Zähler serverseitig.

/**
 * Meldet einen erfolgreichen Kauf an Quentn (E-Mail-Marketing-Automation).
 * Läuft bewusst fehlertolerant: Ein Fehlschlag hier darf die Freischaltung
 * der Generierungen niemals blockieren.
 */
async function notifyQuentn(email: string | null): Promise<void> {
  if (!email) {
    console.error("[stripe-webhook] Keine E-Mail-Adresse in der Session — Quentn-Trigger übersprungen.");
    return;
  }
  const apiKey = process.env.QUENTN_API_KEY;
  if (!apiKey) {
    console.error("[stripe-webhook] QUENTN_API_KEY ist nicht gesetzt — Quentn-Trigger übersprungen.");
    return;
  }

  try {
    const res = await fetch(QUENTN_TRIGGER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ mail: email }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`[stripe-webhook] Quentn-Trigger fehlgeschlagen: HTTP ${res.status}`);
    }
  } catch (error) {
    console.error("[stripe-webhook] Quentn-Trigger fehlgeschlagen:", error);
  }
}

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
      await notifyQuentn(session.customer_details?.email ?? session.customer_email);
    }
  }

  return NextResponse.json({ received: true });
}
