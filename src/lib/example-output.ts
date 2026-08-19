import type { QuizResult } from "@/types/quiz";

// Statisches Beispiel für die Landing Page (Screen 1) — zeigt die Qualität
// des Outputs, ohne einen echten API-Call auszulösen. Orientiert sich am
// Referenzbeispiel aus quiz-generation-prompt.md (Nische: Krypto-Coaching,
// Zielgruppe: Frauen 35-55, wenig Erfahrung mit Geldanlage).

export const EXAMPLE_NISCHE = "Krypto-Coaching";
export const EXAMPLE_ZIELGRUPPE = "Frauen 35-55, wenig Erfahrung mit Geldanlage";
export const EXAMPLE_ZIELANGEBOT = "1:1 Coaching Erstgespräch";

export const EXAMPLE_OUTPUT: QuizResult = {
  fragen: [
    {
      frage: "Wie fühlst du dich, wenn du das Wort \"Blockchain\" hörst?",
      antworten: [
        "Ehrlich gesagt: überfordert. Ich verstehe nur Bahnhof.",
        "Ich hab schon mal was drüber gelesen, aber so richtig hängen geblieben ist wenig.",
        "Ich kenne die Grundidee, will aber sicherer im Detail werden.",
      ],
    },
    {
      frage: "Was hält dich bisher am meisten davon ab, dich mit Krypto zu beschäftigen?",
      antworten: [
        "Die Angst, etwas Falsches zu machen und Geld zu verlieren.",
        "Ich weiß nicht, wo ich anfangen soll — zu viele Meinungen, zu viel Fachchinesisch.",
        "Eigentlich nichts mehr — ich will jetzt einfach strukturiert loslegen.",
      ],
    },
    {
      frage: "Hast du schon einmal eigenes Geld in Kryptowährungen investiert?",
      antworten: [
        "Nein, noch nie — bisher nur beobachtet.",
        "Ja, einmal ausprobiert, dann aber unsicher geworden und gestoppt.",
        "Ja, kleinere Beträge — jetzt will ich es strategischer angehen.",
      ],
    },
  ],
  ergebnispfade: [
    {
      typ: "Die Neugierige",
      beschreibung:
        "Du stehst ganz am Anfang und das ist völlig in Ordnung. Du willst verstehen, bevor du handelst — eine kluge Grundhaltung, kein Rückstand.",
      ansprache:
        "Im kostenlosen Erstgespräch zeigen wir dir in einfachen Worten, wie du sicher starten kannst — ganz ohne Fachchinesisch und ohne Druck.",
    },
    {
      typ: "Die Zögernde",
      beschreibung:
        "Du hast schon erste Schritte gemacht, aber irgendwo hakt es — meist ist es nicht fehlendes Wissen, sondern fehlende Klarheit über den nächsten richtigen Schritt.",
      ansprache:
        "Lass uns im 1:1 Erstgespräch gemeinsam draufschauen, wo genau deine Blockade liegt, und einen Plan machen, der zu deiner Lebenssituation passt.",
    },
    {
      typ: "Die Startklare",
      beschreibung:
        "Du hast dich bereits informiert und erste Erfahrungen gesammelt. Jetzt geht es darum, aus Bauchgefühl eine echte Strategie zu machen.",
      ansprache:
        "Im Erstgespräch entwickeln wir gemeinsam deine persönliche Strategie, damit du ab jetzt überlegt statt spontan investierst.",
    },
  ],
  manychat_routing:
    "Trigger-Keyword: \"KRYPTOTEST\" — Nutzerin startet das Quiz über einen Kommentar- oder DM-Trigger mit diesem Keyword. Je nach Mehrheits-Antwortmuster (A/B/C über alle 5 Fragen) leitet ManyChat in eine von drei Nachrichten-Sequenzen: Sequenz \"Neugierige\" (3 Nachrichten, sanfte Wissensvermittlung + Einladung zum Erstgespräch), Sequenz \"Zögernde\" (3 Nachrichten, Ansprache der häufigsten Blockaden + Erstgespräch als nächster Schritt), Sequenz \"Startklare\" (2 Nachrichten, direkte Einladung zum Erstgespräch mit Kalender-Link). Jede Sequenz endet mit demselben Call-to-Action-Button zur Terminbuchung.",
  freebie_titel: [
    "Bin ich bereit für Krypto? Der 2-Minuten-Selbsttest",
    "Krypto-Klarheits-Check: Wo stehst du wirklich?",
    "Der Krypto-Ampel-Test für Einsteigerinnen",
  ],
};
