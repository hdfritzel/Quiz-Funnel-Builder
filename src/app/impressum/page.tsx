import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — Quiz-Funnel-Builder",
};

export default function ImpressumPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Impressum</h1>
      <p className="mt-6 text-sm text-slate-600">Angaben gemäß § 5 TMG / § 55 RStV:</p>

      <div className="mt-4 space-y-1 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">NOVACREST SOLUTIONS MANAGEMENT-FZCO</p>
        <p>Building A1, Dubai Digital Park</p>
        <p>Dubai Silicon Oasis</p>
        <p>Dubai, Vereinigte Arabische Emirate</p>
      </div>

      <div className="mt-6 space-y-1 text-sm text-slate-700">
        <p>Vertreten durch: Heinz-Dieter Fritzel</p>
        <p>Telefon: +971 585712910</p>
        <p>
          E-Mail:{" "}
          <a href="mailto:info@heinzdieterfritzel.com" className="text-indigo-600 hover:underline">
            info@heinzdieterfritzel.com
          </a>
        </p>
      </div>

      <div className="mt-6 space-y-1 text-sm text-slate-700">
        <p>Handelsregister: Dubai Silicon Oasis Authority (DSOA)</p>
        <p>Registernummer: 54011</p>
      </div>

      <p className="mt-6 text-sm text-slate-700">
        Verantwortlich für den Inhalt: Heinz-Dieter Fritzel
      </p>
    </main>
  );
}
