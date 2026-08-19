import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { initOrGetCredits } from "@/lib/kv";

// POST /api/verify-session — siehe quiz-funnel-builder-spec.md, Abschnitt 6.
// Input: { session_id }. Fragt Stripe, ob die Checkout Session bezahlt ist.
// Falls ja und neu: setzt Zähler in Vercel KV auf 10. Gibt { valid, remaining } zurück.

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const sessionId = body?.session_id;

  if (typeof sessionId !== "string" || !sessionId.trim()) {
    return NextResponse.json({ valid: false, remaining: 0 }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ valid: false, remaining: 0 });
    }

    const remaining = await initOrGetCredits(sessionId);
    return NextResponse.json({ valid: true, remaining });
  } catch {
    return NextResponse.json({ valid: false, remaining: 0 }, { status: 400 });
  }
}
