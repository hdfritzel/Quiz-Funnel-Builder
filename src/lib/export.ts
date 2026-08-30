import type { QuizResult } from "@/types/quiz";

export type ExportMeta = {
  nische: string;
  zielgruppe: string;
  zielangebot: string;
};

/**
 * Baut den Gesamt-Export als Klartext (Screen 3, "Als Textdatei exportieren").
 */
export function buildExportText(result: QuizResult, meta: ExportMeta): string {
  const lines: string[] = [];

  lines.push("QUIZ-FUNNEL — GENERIERT MIT QUIZ-FUNNEL-BUILDER");
  lines.push("=".repeat(50));
  lines.push(`Nische: ${meta.nische}`);
  lines.push(`Zielgruppe: ${meta.zielgruppe}`);
  lines.push(`Zielangebot: ${meta.zielangebot}`);
  lines.push("");

  lines.push("FREEBIE-TITEL-VORSCHLÄGE");
  lines.push("-".repeat(50));
  result.freebie_titel.forEach((titel, i) => {
    lines.push(`${i + 1}. ${titel}`);
  });
  lines.push("");

  lines.push("DIAGNOSE-FRAGEN");
  lines.push("-".repeat(50));
  result.fragen.forEach((f, i) => {
    lines.push(`${i + 1}. ${f.frage}`);
    f.antworten.forEach((a, j) => {
      lines.push(`   ${String.fromCharCode(97 + j)}) ${a}`);
    });
    lines.push("");
  });

  lines.push("ERGEBNISPFADE");
  lines.push("-".repeat(50));
  result.ergebnispfade.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.typ}`);
    lines.push(`   Beschreibung: ${p.beschreibung}`);
    lines.push(`   Ansprache: ${p.ansprache}`);
    lines.push("");
  });

  lines.push("MANYCHAT-ROUTING");
  lines.push("-".repeat(50));
  lines.push(result.manychat_routing);
  lines.push("");

  // Fester Bonus-Abschnitt — bewusst nicht Teil der KI-Generierung, immer
  // identischer Inhalt bei jedem Export.
  lines.push("BONUS: FERTIGER MANYCHAT-FLOW");
  lines.push("-".repeat(50));
  lines.push(
    "Was ist ManyChat? Ein kostenloses Tool für automatische Instagram-Antworten. Kommentiert jemand ein bestimmtes Wort unter deinem Post, schickt ManyChat automatisch eine passende Nachricht zurück."
  );
  lines.push("");
  lines.push("So holst du dir den fertigen Flow:");
  lines.push("1. Falls noch kein ManyChat-Konto: kostenlos erstellen auf manychat.com");
  lines.push(
    "2. Diesen Link öffnen: https://app.manychat.com/flowPlayerPage?share_hash=2306999305977049_24056e30c49bce457c118ffc4122c410db57771d"
  );
  lines.push("3. Dein ManyChat-Konto auswählen, Flow installieren");
  lines.push(
    "4. Die Platzhalter in eckigen Klammern [FRAGE 1] etc. durch deine obigen generierten Fragen/Ergebnisse ersetzen"
  );
  lines.push("5. Eigenes Trigger-Wort und eigenen Link (z.B. Kalender) einsetzen");
  lines.push("6. Testen, indem du selbst dein Trigger-Wort kommentierst");
  lines.push("");

  return lines.join("\n");
}

/**
 * Triggert den Download der Textdatei im Browser. Nur clientseitig aufrufen.
 */
export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "quiz-funnel"
  );
}
