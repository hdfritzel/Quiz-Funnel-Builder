import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Quiz-Funnel-Builder",
};

const ABSCHNITTE = [
  {
    titel: "1. Verantwortlicher",
    inhalt: (
      <p>
        NOVACREST SOLUTIONS MANAGEMENT-FZCO, Building A1, Dubai Digital Park, Dubai Silicon
        Oasis, Dubai, VAE. Vertreten durch Heinz-Dieter Fritzel. Kontakt:{" "}
        <a href="mailto:info@heinzdieterfritzel.com" className="text-indigo-600 hover:underline">
          info@heinzdieterfritzel.com
        </a>
      </p>
    ),
  },
  {
    titel: "2. Arten der verarbeiteten Daten",
    inhalt: (
      <p>
        Kontaktdaten (E-Mail-Adresse beim Kauf), Inhaltsdaten (von Ihnen eingegebene Texte zur
        Generierung), Nutzungsdaten, Zahlungsdaten (verarbeitet ausschließlich durch Stripe, siehe
        unten).
      </p>
    ),
  },
  {
    titel: "3. Zahlungsabwicklung über Stripe",
    inhalt: (
      <p>
        Zur Abwicklung von Zahlungen setzen wir den Zahlungsdienstleister Stripe, Inc., 354 Oyster
        Point Blvd, South San Francisco, CA 94080, USA, ein. Bei einem Kauf werden die zur
        Zahlungsabwicklung erforderlichen Daten direkt an Stripe übermittelt und dort verarbeitet.
        Wir selbst erhalten keine vollständigen Zahlungsdaten, sondern lediglich eine Bestätigung
        über den erfolgreichen Zahlungseingang. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
        Weitere Informationen:{" "}
        <a
          href="https://stripe.com/de/privacy"
          className="text-indigo-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          stripe.com/de/privacy
        </a>
      </p>
    ),
  },
  {
    titel: "4. KI-gestützte Generierung (Anthropic)",
    inhalt: (
      <p>
        Zur Erstellung der von Ihnen angeforderten Inhalte übermitteln wir die von Ihnen
        eingegebenen Texte an Anthropic PBC, 548 Market Street, San Francisco, CA 94104, USA, zur
        Verarbeitung durch deren KI-Modell „Claude&quot;. Die Übermittlung in die USA erfolgt auf
        Grundlage von Standardvertragsklauseln der EU-Kommission. Rechtsgrundlage: Art. 6 Abs. 1
        lit. b DSGVO. Weitere Informationen:{" "}
        <a
          href="https://www.anthropic.com/legal/privacy"
          className="text-indigo-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          anthropic.com/legal/privacy
        </a>
      </p>
    ),
  },
  {
    titel: "5. Hosting (Vercel) und Datenbank (Upstash)",
    inhalt: (
      <p>
        Diese Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA,
        gehostet. Zur technischen Umsetzung des Kaufvorgangs nutzen wir zudem die Datenbank
        Upstash, Inc. (Redis-Datenbank), in der ausschließlich eine anonyme Sitzungs-ID und ein
        Zähler gespeichert werden, keine personenbezogenen Inhalte. Die Übermittlung in die USA
        erfolgt auf Grundlage von Standardvertragsklauseln der EU-Kommission. Rechtsgrundlage:
        Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen:{" "}
        <a
          href="https://vercel.com/legal/privacy-policy"
          className="text-indigo-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          vercel.com/legal/privacy-policy
        </a>
      </p>
    ),
  },
  {
    titel: "6. Cookies",
    inhalt: (
      <p>
        Wir setzen ausschließlich technisch notwendige Session-Daten ein, die zur Abwicklung des
        Kaufvorgangs erforderlich sind. Es werden keine Tracking- oder Marketing-Cookies
        eingesetzt.
      </p>
    ),
  },
  {
    titel: "7. Newsletter (Quentn)",
    inhalt: (
      <p>
        Der Versand unseres Newsletters erfolgt über den Dienstleister Quentn.com GmbH,
        Friedrich-Ebert-Straße 51, 14469 Potsdam, Deutschland. Die Anmeldung erfolgt im
        Double-Opt-In-Verfahren. Die Datenschutzbestimmungen von Quentn finden Sie hier:{" "}
        <a
          href="https://quentn.com/en/privacy-policy"
          className="text-indigo-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          quentn.com/en/privacy-policy
        </a>
        . Sie können den Empfang des Newsletters jederzeit über den Abmeldelink am Ende jeder
        E-Mail widerrufen. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
      </p>
    ),
  },
  {
    titel: "8. Ihre Rechte",
    inhalt: (
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
        Verarbeitung Ihrer Daten sowie das Recht auf Datenübertragbarkeit und das Recht, eine
        Beschwerde bei einer Aufsichtsbehörde einzureichen. Wenden Sie sich hierzu an:{" "}
        <a href="mailto:info@heinzdieterfritzel.com" className="text-indigo-600 hover:underline">
          info@heinzdieterfritzel.com
        </a>
      </p>
    ),
  },
  {
    titel: "9. Änderungen dieser Datenschutzerklärung",
    inhalt: (
      <p>
        Wir passen diese Datenschutzerklärung an, sobald Änderungen an unseren Verarbeitungen dies
        erforderlich machen.
      </p>
    ),
  },
];

export default function DatenschutzPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Datenschutzerklärung</h1>

      <div className="mt-8 space-y-8">
        {ABSCHNITTE.map((abschnitt) => (
          <section key={abschnitt.titel}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {abschnitt.titel}
            </h2>
            <div className="mt-2 text-sm leading-relaxed text-slate-700">{abschnitt.inhalt}</div>
          </section>
        ))}
      </div>
    </main>
  );
}
