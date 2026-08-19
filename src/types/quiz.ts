// Output-Schema gemäß quiz-funnel-builder-spec.md, Abschnitt 4.

export type QuizFrage = {
  frage: string;
  antworten: [string, string, string];
};

export type QuizErgebnispfad = {
  typ: string;
  beschreibung: string;
  ansprache: string;
};

export type QuizResult = {
  fragen: QuizFrage[];
  ergebnispfade: QuizErgebnispfad[];
  manychat_routing: string;
  freebie_titel: [string, string, string];
};

/**
 * Validiert, dass ein unbekannter Wert dem Output-Schema entspricht:
 * genau 5 Fragen (je 3 Antworten), genau 3 Ergebnispfade, genau 3 Freebie-Titel.
 * Wird sowohl serverseitig (nach dem Claude-API-Call) als auch clientseitig
 * (als Fallback-Absicherung) verwendet.
 */
export function isValidQuizResult(value: unknown): value is QuizResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;

  if (!Array.isArray(v.fragen) || v.fragen.length !== 5) return false;
  for (const f of v.fragen) {
    if (!f || typeof f !== "object") return false;
    const frage = f as Record<string, unknown>;
    if (typeof frage.frage !== "string" || !frage.frage.trim()) return false;
    if (!Array.isArray(frage.antworten) || frage.antworten.length !== 3) return false;
    if (!frage.antworten.every((a) => typeof a === "string" && a.trim())) return false;
  }

  if (!Array.isArray(v.ergebnispfade) || v.ergebnispfade.length !== 3) return false;
  for (const e of v.ergebnispfade) {
    if (!e || typeof e !== "object") return false;
    const pfad = e as Record<string, unknown>;
    if (typeof pfad.typ !== "string" || !pfad.typ.trim()) return false;
    if (typeof pfad.beschreibung !== "string" || !pfad.beschreibung.trim()) return false;
    if (typeof pfad.ansprache !== "string" || !pfad.ansprache.trim()) return false;
  }

  if (typeof v.manychat_routing !== "string" || !v.manychat_routing.trim()) return false;

  if (!Array.isArray(v.freebie_titel) || v.freebie_titel.length !== 3) return false;
  if (!v.freebie_titel.every((t) => typeof t === "string" && t.trim())) return false;

  return true;
}
