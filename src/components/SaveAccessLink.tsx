"use client";

import CopyButton from "@/components/CopyButton";

type SaveAccessLinkProps = {
  url: string;
  remaining?: number;
  className?: string;
};

// Zeigt die aktuelle, session_id-tragende URL an und macht sie kopierbar.
// Hintergrund: Der Zugriff auf Formular/Ergebnisse läuft ausschließlich über
// den ?session_id=... Query-Parameter (siehe GeneratorClient) — ohne diesen
// Link gibt es keinen Weg zurück zu einem laufenden Kontingent.
export default function SaveAccessLink({ url, remaining, className = "" }: SaveAccessLinkProps) {
  return (
    <div className={`rounded-xl border border-indigo-100 bg-indigo-50 p-4 ${className}`}>
      <p className="mb-2 text-sm font-medium text-slate-900">
        🔖 Speichere diesen Link — er ist dein Zugang zu{" "}
        {typeof remaining === "number" && remaining > 0
          ? `deinen restlichen ${remaining} Generierungen`
          : "deinem Kauf"}
        .
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-md border border-indigo-100 bg-white px-2.5 py-1.5 text-xs text-slate-600">
          {url}
        </code>
        <CopyButton text={url} label="Link kopieren" />
      </div>
    </div>
  );
}
