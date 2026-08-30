"use client";

import type { QuizResult } from "@/types/quiz";
import CopyButton from "@/components/CopyButton";
import { buildExportText, downloadTextFile, slugify, type ExportMeta } from "@/lib/export";
import {
  MANYCHAT_BONUS_INTRO,
  MANYCHAT_BONUS_STEPS,
  MANYCHAT_BONUS_STEPS_INTRO,
  buildManyChatBonusText,
} from "@/lib/manychat-bonus";

type QuizResultViewProps = {
  result: QuizResult;
  meta: ExportMeta;
  onReset: () => void;
};

export default function QuizResultView({ result, meta, onReset }: QuizResultViewProps) {
  function handleExport() {
    const text = buildExportText(result, meta);
    downloadTextFile(`quiz-funnel-${slugify(meta.nische)}.txt`, text);
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Dein Quiz-Funnel ist fertig</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Als Textdatei exportieren
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Neue Generierung
          </button>
        </div>
      </div>

      {/* Freebie-Titel */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Freebie-Titel-Vorschläge</h2>
        <div className="space-y-2">
          {result.freebie_titel.map((titel, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"
            >
              <p className="text-sm text-slate-800">{titel}</p>
              <CopyButton text={titel} />
            </div>
          ))}
        </div>
      </section>

      {/* Diagnose-Fragen */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">5 Diagnose-Fragen</h2>
        <div className="space-y-3">
          {result.fragen.map((f, i) => {
            const fullText = `${f.frage}\n${f.antworten.map((a, j) => `${String.fromCharCode(97 + j)}) ${a}`).join("\n")}`;
            return (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="font-medium text-slate-900">
                    {i + 1}. {f.frage}
                  </p>
                  <CopyButton text={fullText} />
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  {f.antworten.map((a, j) => (
                    <li key={j}>
                      {String.fromCharCode(97 + j)}) {a}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ergebnispfade */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">3 Ergebnispfade</h2>
        <div className="space-y-3">
          {result.ergebnispfade.map((p, i) => {
            const fullText = `${p.typ}\n\n${p.beschreibung}\n\n${p.ansprache}`;
            return (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="font-medium text-slate-900">{p.typ}</p>
                  <CopyButton text={fullText} />
                </div>
                <p className="mb-2 text-sm text-slate-600">{p.beschreibung}</p>
                <p className="text-sm italic text-slate-500">{p.ansprache}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ManyChat Routing */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">ManyChat-Routing-Text</h2>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex justify-end">
            <CopyButton text={result.manychat_routing} />
          </div>
          <p className="whitespace-pre-wrap text-sm text-slate-700">{result.manychat_routing}</p>
        </div>
      </section>

      {/* Bonus: ManyChat-Flow — fester Inhalt, siehe lib/manychat-bonus.ts */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">🎁 Bonus: Fertiger ManyChat-Flow</h2>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex justify-end">
            <CopyButton text={buildManyChatBonusText()} />
          </div>
          <p className="text-sm text-slate-700">{MANYCHAT_BONUS_INTRO}</p>
          <p className="mt-3 text-sm font-medium text-slate-900">{MANYCHAT_BONUS_STEPS_INTRO}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {MANYCHAT_BONUS_STEPS.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
