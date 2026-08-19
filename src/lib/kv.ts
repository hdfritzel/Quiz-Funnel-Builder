import { kv } from "@vercel/kv";

// Nutzungszähler gemäß quiz-funnel-builder-spec.md, Abschnitt 5 + 7.
// Key = Stripe checkout session_id, Value = Anzahl verbleibender Generierungen.
// @vercel/kv liest KV_REST_API_URL / KV_REST_API_TOKEN automatisch aus den ENV-Variablen.

const STARTING_CREDITS = 10;

/**
 * Wird von /api/verify-session aufgerufen, nachdem Stripe die Zahlung bestätigt hat.
 * Setzt den Zähler nur, wenn die Session noch nicht bekannt ist ("falls ja und neu").
 * Gibt die aktuell verbleibende Anzahl zurück.
 */
export async function initOrGetCredits(sessionId: string): Promise<number> {
  const existing = await kv.get<number>(sessionId);
  if (existing !== null && existing !== undefined) {
    return existing;
  }
  await kv.set(sessionId, STARTING_CREDITS);
  return STARTING_CREDITS;
}

/**
 * Liefert den aktuellen Zählerstand, ohne ihn zu verändern. `null`, wenn die
 * Session noch nie über verify-session initialisiert wurde.
 */
export async function getCredits(sessionId: string): Promise<number | null> {
  const value = await kv.get<number>(sessionId);
  return value ?? null;
}

/**
 * Reduziert den Zähler um 1. Wird ausschließlich nach einer ERFOLGREICHEN
 * Generierung aufgerufen — bei Fehlern (Parse-Fehler etc.) NICHT reduzieren,
 * siehe quiz-generation-prompt.md.
 */
export async function decrementCredits(sessionId: string): Promise<number> {
  return kv.decr(sessionId);
}
