import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// POST /api/create-checkout-session — siehe quiz-funnel-builder-spec.md, Abschnitt 7.
// Erstellt eine Stripe Checkout Session für den Einmalkauf (10 Generierungen).
// success_url enthält den {CHECKOUT_SESSION_ID}-Platzhalter für den Redirect zu /generator.

export async function POST() {
  const priceId = process.env.STRIPE_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!priceId || !siteUrl) {
    return NextResponse.json(
      { error: "STRIPE_PRICE_ID oder NEXT_PUBLIC_SITE_URL ist nicht konfiguriert." },
      { status: 500 }
    );
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/generator?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Checkout-Session konnte nicht erstellt werden." }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Checkout-Session konnte nicht erstellt werden." }, { status: 502 });
  }
}
