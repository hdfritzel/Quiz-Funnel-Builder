// Fester Bonus-Inhalt "Fertiger ManyChat-Flow" — bewusst nicht Teil der
// KI-Generierung, immer identisch. Einzige Quelle für diesen Text, damit
// Export-Datei (export.ts) und Bildschirm-Ansicht (QuizResultView) nicht
// auseinanderlaufen können.

export const MANYCHAT_BONUS_HEADING = "BONUS: FERTIGER MANYCHAT-FLOW";

export const MANYCHAT_BONUS_INTRO =
  "Was ist ManyChat? Ein kostenloses Tool für automatische Instagram-Antworten. Kommentiert jemand ein bestimmtes Wort unter deinem Post, schickt ManyChat automatisch eine passende Nachricht zurück.";

export const MANYCHAT_BONUS_STEPS_INTRO = "So holst du dir den fertigen Flow:";

export const MANYCHAT_BONUS_STEPS = [
  "Falls noch kein ManyChat-Konto: kostenlos erstellen auf manychat.com",
  "Diesen Link öffnen: https://app.manychat.com/flowPlayerPage?share_hash=2306999305977049_24056e30c49bce457c118ffc4122c410db57771d",
  "Dein ManyChat-Konto auswählen, Flow installieren",
  "Die Platzhalter in eckigen Klammern [FRAGE 1] etc. durch deine obigen generierten Fragen/Ergebnisse ersetzen",
  "Eigenes Trigger-Wort und eigenen Link (z.B. Kalender) einsetzen",
  "Testen, indem du selbst dein Trigger-Wort kommentierst",
] as const;

/** Klartext-Version für Copy-Button und Textdatei-Export. */
export function buildManyChatBonusText(): string {
  const lines: string[] = [MANYCHAT_BONUS_INTRO, "", MANYCHAT_BONUS_STEPS_INTRO];
  MANYCHAT_BONUS_STEPS.forEach((step, i) => lines.push(`${i + 1}. ${step}`));
  return lines.join("\n");
}
