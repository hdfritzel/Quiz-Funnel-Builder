import { getStripe } from "@/lib/stripe";
import { getCredits, initOrGetCredits } from "@/lib/kv";

export type AccessResult =
  | { ok: true; remaining: number }
  | { ok: false; remaining: number; error: string };

/**
 * Prüft gemäß quiz-funnel-builder-spec.md, Abschnitt 6 (/api/generate):
 * ist die session_id bei Stripe als bezahlt bestätigt UND ist der Zähler in
 * Vercel KV > 0? Niemals dem Frontend-Zähler vertrauen.
 */
export async function checkAccess(sessionId: string | null | undefined): Promise<AccessResult> {
  if (!sessionId) {
    return { ok: false, remaining: 0, error: "Keine gültige Session gefunden." };
  }

  let paid = false;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    paid = session.payment_status === "paid";
  } catch (error) {
    console.error("[checkAccess] Fehler beim Verifizieren der Stripe-Session:", error);
    return { ok: false, remaining: 0, error: "Die Session konnte nicht verifiziert werden." };
  }

  if (!paid) {
    return { ok: false, remaining: 0, error: "Zahlung wurde noch nicht bestätigt." };
  }

  // Zähler sollte bereits durch /api/verify-session initialisiert sein.
  // Defensiv trotzdem initialisieren, falls dieser Call übersprungen wurde.
  const existing = await getCredits(sessionId);
  const remaining = existing ?? (await initOrGetCredits(sessionId));

  if (remaining <= 0) {
    return { ok: false, remaining: 0, error: "Kontingent aufgebraucht. Bitte neues Kontingent kaufen." };
  }

  return { ok: true, remaining };
}
