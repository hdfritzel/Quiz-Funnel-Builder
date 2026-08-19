# Produkt-Spec: Quiz-Funnel-Builder (MVP)

Dieses Dokument ist das Briefing für Claude Code. Es beschreibt WAS gebaut wird, nicht das Prompt-Engineering für die KI-Generierung selbst (das kommt in einem separaten Dokument: `quiz-generation-prompt.md`).

---

## 1. Zweck

Ein Tool, mit dem Coaches/Networker (Krypto, Fitness, generell Network Marketing) einen kompletten Quiz-Funnel nach dem Vorbild "Bin ich bereit für Krypto?" generieren lassen können — inklusive Fragen, Ergebnispfaden und ManyChat-Routing-Text.

**Zielgruppe des Tools selbst:** Coaches und Networker, 30-60 Jahre, wenig technisches Know-how, wollen fertigen Text zum Copy-Paste, keine Konfigurationsoberfläche.

---

## 2. Kern-Flow (User Journey)

1. Landing Page → Nutzer sieht Beispiel-Output + Preis → klickt "Jetzt kaufen"
2. Stripe Checkout → Zahlung
3. Redirect zu `/generator?session_id=xxx`
4. Nutzer füllt 3 Eingabefelder aus → klickt "Generieren"
5. Serverless Function ruft Claude API auf → Ergebnis wird angezeigt
6. Nutzer kann jedes Element einzeln kopieren oder alles als Textdatei exportieren
7. Nutzer kann bis zu 10x generieren (Limit pro Kauf, siehe Abschnitt 7)

Kein Login, kein Account. Zugriff läuft über die Stripe Session ID im Link.

---

## 3. Screens im Detail

### Screen 1 — Landing Page (`/`)
- Kurzer Hook + 1 Beispiel-Output (vorgefertigt, statisch, zeigt Qualität)
- Preis + CTA-Button "Jetzt kaufen" → triggert Stripe Checkout
- Kein Formular auf dieser Seite

### Screen 2 — Generator (`/generator`)
- 3 Eingabefelder:
  - Nische (z.B. "Krypto-Coaching")
  - Zielgruppe (z.B. "Frauen 35-55, wenig Erfahrung mit Geldanlage")
  - Zielangebot (z.B. "1:1 Coaching Erstgespräch")
- Button "Funnel generieren"
- Zähler sichtbar: "Noch 7 von 10 Generierungen übrig"
- Loading-State während des API-Calls (3-8 Sekunden realistisch)

### Screen 3 — Ergebnis
- 5 Diagnose-Fragen (jeweils mit Copy-Button)
- 3 Ergebnispfade / Personas (jeweils mit Copy-Button)
- ManyChat-Routing-Text (ein Block, ein Copy-Button)
- 3 Freebie-Titel-Vorschläge
- Button "Als Textdatei exportieren" (Gesamtpaket)
- Button "Neue Generierung" → zurück zu Screen 2

### Screen 4 — Payment-Fehler / Kein Zugriff
- Wird gezeigt, wenn `session_id` fehlt, ungültig ist oder Zahlung nicht bestätigt
- Freundlicher Hinweis + Link zurück zur Landing Page

---

## 4. Output-Schema (JSON, von der Claude API zurückgegeben)

```json
{
  "fragen": [
    { "frage": "string", "antworten": ["string", "string", "string"] }
  ],
  "ergebnispfade": [
    { "typ": "string", "beschreibung": "string", "ansprache": "string" }
  ],
  "manychat_routing": "string",
  "freebie_titel": ["string", "string", "string"]
}
```

Genau 5 Einträge in `fragen`, genau 3 in `ergebnispfade`, genau 3 in `freebie_titel`. Das Frontend validiert diese Struktur vor der Anzeige (Fallback-Fehlermeldung, falls die KI-Antwort nicht dem Schema entspricht).

---

## 5. Tech-Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Next.js API Routes / Vercel Serverless Functions
- **KI:** Anthropic API (`claude-sonnet-4-6`), Aufruf ausschließlich serverseitig
- **Payment:** Stripe Checkout (bereits eingerichtet)
- **Nutzungszähler:** Vercel KV (Redis) — KEIN vollständiges Datenbankschema nötig für v1. Key = `session_id`, Value = Anzahl verbleibender Generierungen.
- **Hosting:** Vercel

Bewusst keine vollständige Datenbank/kein Login in v1 — reduziert Baukomplexität deutlich. Kommt in v2, falls Wiederkehr/Verlauf gebraucht wird.

---

## 6. API-Endpunkte

### `POST /api/generate`
- Input: `{ nische, zielgruppe, zielangebot, session_id }`
- Prüft: ist `session_id` bei Stripe als bezahlt bestätigt? Ist Zähler in Vercel KV > 0?
- Ruft Claude API mit dem Generierungs-Prompt auf (siehe `quiz-generation-prompt.md`)
- Reduziert Zähler um 1
- Gibt JSON gemäß Schema aus Abschnitt 4 zurück

### `POST /api/verify-session`
- Input: `{ session_id }`
- Fragt Stripe: ist diese Checkout Session bezahlt?
- Falls ja und neu: setzt Zähler in Vercel KV auf 10
- Gibt `{ valid: true/false, remaining: number }` zurück

### `POST /api/stripe-webhook`
- Nimmt Stripe-Webhook-Events entgegen (Absicherung, falls Client-Verify fehlschlägt)
- Bestätigt `checkout.session.completed`

---

## 7. Payment-Flow im Detail

1. Landing Page → Stripe Checkout Session wird über `/api/create-checkout-session` erstellt (success_url enthält `{CHECKOUT_SESSION_ID}` Platzhalter)
2. Nach Zahlung: Redirect zu `/generator?session_id={CHECKOUT_SESSION_ID}`
3. Generator-Seite ruft beim Laden `/api/verify-session` auf → setzt Zähler, zeigt "10 von 10 übrig"
4. Jede Generierung reduziert den Zähler serverseitig (niemals im Frontend vertrauen)
5. Bei 0 verbleibenden Generierungen: Hinweis "Kontingent aufgebraucht" + Link zu neuem Kauf

---

## 8. Umgebungsvariablen (ENV)

```
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
KV_REST_API_URL=
KV_REST_API_TOKEN=
NEXT_PUBLIC_SITE_URL=
```

`STRIPE_PRICE_ID` bekommst du, wenn du das Produkt im Stripe-Dashboard anlegst (Abschnitt 10).

---

## 9. Bewusst NICHT im MVP

- Kein Login/Account-System
- Keine gespeicherte Historie über Sessions hinweg
- Kein Editieren der generierten Texte im Tool selbst (nur kopieren/exportieren)
- Keine mehrsprachige Version (nur Deutsch)
- Kein Team-/Mehrnutzer-Zugriff

Das sind alles sinnvolle v2-Erweiterungen, aber jede davon verlangsamt den Launch unnötig.

---

## 10. Build-Reihenfolge für Claude Code

1. Next.js-Projekt aufsetzen, Tailwind konfigurieren
2. Screen 2 (Generator-Formular) + Screen 3 (Ergebnis-Anzeige) bauen — erstmal mit Dummy-Daten, ohne Payment
3. `/api/generate` bauen, Claude-API-Prompt integrieren (Prompt kommt aus separatem Dokument)
4. Export-Funktion (Textdatei-Download) bauen
5. Screen 1 (Landing Page) bauen
6. Stripe Checkout Integration (`/api/create-checkout-session`, `/api/stripe-webhook`)
7. Vercel KV einrichten, Zähler-Logik in `/api/verify-session` und `/api/generate` einbauen
8. Screen 4 (Fehlerfall) bauen
9. Deploy auf Vercel, alle ENV-Variablen setzen
10. Testkauf im Stripe Test-Mode durchführen, kompletten Flow einmal durchklicken
11. Auf Live-Mode umstellen

---

## Manuelle Vorbereitung (vor Schritt 1, durch Dieter selbst)

1. Stripe-Dashboard → Produkt anlegen: "Quiz-Funnel-Builder — 10 Generierungen", Preis 47€, einmalig
2. `STRIPE_PRICE_ID` aus dem angelegten Preis kopieren
3. GitHub-Repo erstellen (leer, Claude Code füllt es)
4. Vercel-Account mit dem Repo verbinden
5. Vercel KV Datenbank in Vercel-Dashboard anlegen (Free Tier reicht für den Start)
