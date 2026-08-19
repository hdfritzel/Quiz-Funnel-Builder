import { NextResponse } from "next/server";
import { checkAccess } from "@/lib/access";
import { generateQuiz } from "@/lib/anthropic";
import { decrementCredits } from "@/lib/kv";
import type { QuizFormInput } from "@/lib/prompt";

// POST /api/generate — siehe quiz-funnel-builder-spec.md, Abschnitt 6.

function readField(body: Record<string, unknown>, key: keyof QuizFormInput): string | null {
  const value = body[key];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const sessionId = typeof body.session_id === "string" ? body.session_id : null;

  const nische = readField(body, "nische");
  const zielgruppe = readField(body, "zielgruppe");
  const zielangebot = readField(body, "zielangebot");

  if (!nische || !zielgruppe || !zielangebot) {
    return NextResponse.json(
      { error: "Bitte fülle alle drei Felder aus (Nische, Zielgruppe, Zielangebot)." },
      { status: 400 }
    );
  }

  const access = await checkAccess(sessionId);
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: 403 });
  }

  const input: QuizFormInput = { nische, zielgruppe, zielangebot };

  let result;
  try {
    result = await generateQuiz(input);
  } catch {
    // Zähler wird bei Fehler NICHT reduziert.
    return NextResponse.json(
      { error: "Generierung fehlgeschlagen, bitte erneut versuchen." },
      { status: 502 }
    );
  }

  if (!result) {
    return NextResponse.json(
      { error: "Generierung fehlgeschlagen, bitte erneut versuchen." },
      { status: 502 }
    );
  }

  // sessionId ist an dieser Stelle garantiert gesetzt (sonst hätte checkAccess abgelehnt).
  const remaining = await decrementCredits(sessionId as string);

  return NextResponse.json({ result, remaining });
}
