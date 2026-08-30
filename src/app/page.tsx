import BuyButton from "@/components/BuyButton";
import {
  EXAMPLE_NISCHE,
  EXAMPLE_OUTPUT,
  EXAMPLE_ZIELANGEBOT,
  EXAMPLE_ZIELGRUPPE,
} from "@/lib/example-output";

const CTA_CLASSES =
  "inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70";

const NISCHEN = [
  "Coaching",
  "Network-Marketing",
  "Krypto",
  "Gewichtsreduktion",
  "Nahrungsergänzung",
  "Kosmetik-/Pflegeprodukte",
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:pt-24">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Für Coaches &amp; Networker
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Dein Quiz-Funnel, fertig getextet — in unter einer Minute
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Gib deine Nische, Zielgruppe und dein Zielangebot ein. Du bekommst 5 Diagnose-Fragen,
          3 Ergebnispfade, fertigen ManyChat-Routing-Text und 3 Freebie-Titel — zum Copy-Paste,
          ganz ohne Konfigurationsoberfläche.
        </p>
        <div className="mt-8">
          <BuyButton className={CTA_CLASSES}>Jetzt kaufen — 47&nbsp;€</BuyButton>
          <p className="mt-3 text-sm text-slate-500">Einmalig · 10 Generierungen · sofortiger Zugriff</p>
        </div>

        <div className="mt-10">
          <p className="text-sm font-medium text-slate-500">Funktioniert für jede Nische</p>
          <ul className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {NISCHEN.map((nische) => (
              <li
                key={nische}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700"
              >
                {nische}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Nutzen-Absatz */}
      <section className="mx-auto max-w-2xl px-4 pb-16 text-center">
        <p className="text-lg font-medium text-slate-900">
          Ein Quiz macht aus kaltem Traffic warme Anfragen — bevor du auch nur eine Nachricht
          geschrieben hast.
        </p>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-400">So läuft&apos;s</p>
        <ol className="mx-auto mt-3 max-w-md space-y-2 text-left text-sm text-slate-600">
          <li>
            <span className="font-semibold text-slate-900">1.</span> Du teilst den Quiz-Link in deiner
            Story.
          </li>
          <li>
            <span className="font-semibold text-slate-900">2.</span> Interessenten beantworten 5 Fragen
            zu ihrer Situation.
          </li>
          <li>
            <span className="font-semibold text-slate-900">3.</span> Automatisch bekommst du
            vorqualifizierte Anfragen in ManyChat (dem Automatisierungs-Tool für Instagram-/
            Facebook-Nachrichten) — sortiert danach, wie bereit sie fürs Erstgespräch sind.
          </li>
        </ol>
      </section>

      {/* Beispiel-Output */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-slate-900">So sieht ein fertiger Funnel aus</h2>
          <p className="mt-1 text-sm text-slate-500">
            Beispiel-Input: Nische „{EXAMPLE_NISCHE}“, Zielgruppe „{EXAMPLE_ZIELGRUPPE}“, Zielangebot „
            {EXAMPLE_ZIELANGEBOT}“
          </p>
        </div>

        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Diagnose-Frage (Auszug)
            </h3>
            <p className="font-medium text-slate-900">{EXAMPLE_OUTPUT.fragen[0].frage}</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {EXAMPLE_OUTPUT.fragen[0].antworten.map((a, i) => (
                <li key={i}>{String.fromCharCode(97 + i)}) {a}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Ergebnispfad (Auszug)
            </h3>
            <p className="font-medium text-slate-900">{EXAMPLE_OUTPUT.ergebnispfade[1].typ}</p>
            <p className="mt-1 text-sm text-slate-600">{EXAMPLE_OUTPUT.ergebnispfade[1].beschreibung}</p>
            <p className="mt-1 text-sm italic text-slate-500">{EXAMPLE_OUTPUT.ergebnispfade[1].ansprache}</p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Freebie-Titel-Vorschläge
            </h3>
            <ul className="space-y-1 text-sm text-slate-700">
              {EXAMPLE_OUTPUT.freebie_titel.map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Preis / CTA */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-14 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Quiz-Funnel-Builder — 10 Generierungen</h2>
          <p className="mt-2 text-4xl font-bold text-slate-900">47&nbsp;€ <span className="text-lg font-normal text-slate-500">einmalig</span></p>
          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-slate-600">
            <li>✓ 5 Diagnose-Fragen mit echtem Nutzen für deine Zielgruppe</li>
            <li>✓ 3 klar unterscheidbare Ergebnispfade inkl. Verkaufs-Ansprache</li>
            <li>✓ Fertiger ManyChat-Routing-Text zum Einbauen</li>
            <li>✓ 3 Freebie-Titel-Vorschläge</li>
            <li>✓ Export als Textdatei, kein Login nötig</li>
          </ul>

          <div className="mx-auto mt-6 max-w-sm rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              🎁 Inklusive: Fertiger ManyChat-Flow (Wert: 97&nbsp;€) — kostenlos dabei
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Für die Auslieferung nutzt du ManyChat — ein kostenloses Tool für automatische
              Instagram-Antworten. Du musst nichts selbst bauen: Du bekommst eine fertige Vorlage
              dazu, trägst nur noch deinen generierten Text ein. Keine Vorkenntnisse nötig.
            </p>
          </div>

          <div className="mt-8">
            <BuyButton className={CTA_CLASSES}>Jetzt kaufen — 47&nbsp;€</BuyButton>
          </div>
        </div>
      </section>
    </main>
  );
}
