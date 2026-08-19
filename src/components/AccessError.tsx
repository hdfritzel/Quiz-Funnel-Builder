import Link from "next/link";

type AccessErrorProps = {
  message?: string;
};

export default function AccessError({
  message = "Wir konnten deinen Kauf nicht bestätigen. Der Link ist entweder abgelaufen, ungültig, oder die Zahlung wurde noch nicht abgeschlossen.",
}: AccessErrorProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <div>
        <h1 className="mb-2 text-xl font-semibold text-slate-900">Kein Zugriff</h1>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}
