# Quiz-Funnel-Builder

Tool für Coaches/Networker: generiert per Klick einen kompletten Quiz-Funnel
(5 Diagnose-Fragen, 3 Ergebnispfade, ManyChat-Routing-Text, 3 Freebie-Titel).

Vollständige Produkt-Spec: [`quiz-funnel-builder-spec.md`](./quiz-funnel-builder-spec.md)
Generierungs-Prompt: [`quiz-generation-prompt.md`](./quiz-generation-prompt.md)

## Tech-Stack

- Next.js (App Router) + Tailwind CSS
- Next.js API Routes (serverless) für Claude-API, Stripe, Zähler-Logik
- Anthropic API (`claude-sonnet-4-6`)
- Stripe Checkout (Einmalkauf)
- Vercel KV (Redis) als Nutzungszähler
- Hosting: Vercel

## Lokales Setup

```bash
npm install
cp .env.example .env.local
# .env.local mit echten Keys befüllen (siehe unten)
npm run dev
```

Läuft dann auf `http://localhost:3000`.

## Umgebungsvariablen

Siehe `.env.example`. Kurzfassung:

| Variable | Woher |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `STRIPE_SECRET_KEY` | Stripe-Dashboard → Entwickler → API-Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe-Dashboard → Entwickler → Webhooks (nach Anlegen des Endpoints) |
| `STRIPE_PRICE_ID` | Stripe-Dashboard → Produkt „Quiz-Funnel-Builder — 10 Generierungen“ → Preis-ID |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel-Dashboard → Storage → KV-Datenbank |
| `NEXT_PUBLIC_SITE_URL` | Deploy-URL bzw. `http://localhost:3000` lokal |

## Manuelle Vorbereitung (vor dem ersten Deploy)

Diese Schritte erfordern Zugriff auf deine eigenen Accounts (Stripe, GitHub,
Vercel) und wurden hier **nicht** ausgeführt — siehe `quiz-funnel-builder-spec.md`,
Abschnitt „Manuelle Vorbereitung“ und Build-Schritte 9–11:

1. **Stripe-Produkt anlegen**: Dashboard → Produkte → „Quiz-Funnel-Builder — 10 Generierungen“,
   47&nbsp;€, einmalig. Die dabei entstehende Preis-ID → `STRIPE_PRICE_ID`.
2. **GitHub-Repo verbinden**: Dieses lokale Repo zu GitHub pushen (`git remote add origin …`, `git push`).
3. **Vercel-Projekt anlegen**: Repo in Vercel importieren, alle ENV-Variablen aus der
   Tabelle oben im Vercel-Projekt (Settings → Environment Variables) eintragen.
4. **Vercel KV anlegen**: Vercel-Dashboard → Storage → KV-Datenbank erstellen, mit dem
   Projekt verbinden (Free Tier reicht) → `KV_REST_API_URL`/`KV_REST_API_TOKEN` werden
   dabei meist automatisch als Projekt-ENV gesetzt.
5. **Stripe-Webhook einrichten**: Nach dem ersten Deploy im Stripe-Dashboard einen
   Webhook-Endpoint auf `https://<deine-domain>/api/stripe-webhook` anlegen, Event
   `checkout.session.completed` abonnieren → das dabei erzeugte Signing-Secret in
   `STRIPE_WEBHOOK_SECRET` eintragen (in Vercel + redeployen).
6. **Testkauf**: Im Stripe Test-Mode einmal komplett durchklicken (Landing Page →
   Checkout → `/generator?session_id=…` → generieren → exportieren).
7. **Live-Mode**: Stripe auf Live umstellen, Live-Keys + neue `STRIPE_PRICE_ID` +
   neuen Live-Webhook in Vercel eintragen, redeployen.

## Projektstruktur

```
src/
  app/
    page.tsx                 Screen 1 — Landing Page
    generator/                Screen 2/3/4 — Formular, Ergebnis, Fehlerfall
    api/
      generate/                POST — ruft Claude API auf
      verify-session/          POST — prüft Stripe-Zahlung, initialisiert Zähler
      create-checkout-session/ POST — erstellt Stripe Checkout Session
      stripe-webhook/          POST — Absicherung via Stripe-Webhook
  components/                 UI-Bausteine (Formular, Ergebnis-Anzeige, Copy-Buttons, …)
  lib/                        Prompt, Claude-Client, Stripe-Client, KV-Zähler, Export
  types/quiz.ts                Output-Schema + Validierung
```

## Hinweis zur Modell-ID

`quiz-generation-prompt.md` gibt `claude-sonnet-4-6` als Modell vor; das steht so
in `src/lib/anthropic.ts` (per `ANTHROPIC_MODEL`-ENV überschreibbar). Bitte vor dem
ersten echten API-Call in der Anthropic-Konsole verifizieren, dass diese Modell-ID
für deinen Account gültig ist — falls nicht, `ANTHROPIC_MODEL` auf die korrekte ID setzen.
