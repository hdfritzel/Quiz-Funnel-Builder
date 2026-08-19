import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// POST /api/create-checkout-session — siehe quiz-funnel-builder-spec.md, Abschnitt 7.
// Erstellt eine Stripe Checkout Session für den Einmalkauf (10 Generierungen).
// success_url enthält den {CHECKOUT_SESSION_ID}-Platzhalter für den Redirect zu /generator.

export async function POST() {
  const priceId = process.env.STRIPE_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const hasSecretKey = Boolean(process.env.STRIPE_SECRET_KEY);

  if (!priceId || !siteUrl || !hasSecretKey) {
    // Explizit prüfen und loggen statt getStripe() intern werfen zu lassen —
    // sonst landet der Fehler unsichtbar im catch-Block unten (kein Log,
    // kein ausgehender Request, siehe Postmortem).
    const missing = [
      !hasSecretKey && "STRIPE_SECRET_KEY",
      !priceId && "STRIPE_PRICE_ID",
      !siteUrl && "NEXT_PUBLIC_SITE_URL",
    ]
      .filter(Boolean)
      .join(", ");
    console.error(`[create-checkout-session] Fehlende Umgebungsvariable(n): ${missing}`);
    return NextResponse.json(
      { error: "Server ist nicht vollständig konfiguriert. Bitte Betreiber kontaktieren." },
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
      console.error(`[create-checkout-session] Stripe-Session ohne url zurückgegeben (id: ${session.id}).`);
      return NextResponse.json({ error: "Checkout-Session konnte nicht erstellt werden." }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[create-checkout-session] Fehler beim Stripe-API-Call:", error);
    return NextResponse.json({ error: "Checkout-Session konnte nicht erstellt werden." }, { status: 502 });
  }
}
