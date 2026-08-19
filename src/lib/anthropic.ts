import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildUserMessage, stripCodeBlockFences } from "@/lib/prompt";
import type { QuizFormInput } from "@/lib/prompt";
import { isValidQuizResult, type QuizResult } from "@/types/quiz";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY ist nicht gesetzt.");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

// Model + temperature gemäß quiz-generation-prompt.md ("API-Call-Konfiguration").
// Über ANTHROPIC_MODEL überschreibbar, falls sich die Modell-ID ändert.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const TEMPERATURE = 0.7;
const MAX_TOKENS = 4096;

async function callClaude(input: QuizFormInput): Promise<QuizResult | null> {
  const message = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    system: buildSystemPrompt(input),
    messages: [{ role: "user", content: buildUserMessage(input) }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  const cleaned = stripCodeBlockFences(textBlock.text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }

  if (!isValidQuizResult(parsed)) return null;
  return parsed;
}

/**
 * Ruft die Claude API auf und parsed das Ergebnis gemäß Output-Schema.
 * Bei Parse- oder Schema-Fehler genau EIN automatischer Retry mit demselben
 * Call (siehe quiz-generation-prompt.md, "API-Call-Konfiguration").
 * Gibt `null` zurück, wenn auch der Retry fehlschlägt — der Aufrufer darf den
 * Nutzungszähler in diesem Fall NICHT reduzieren.
 */
export async function generateQuiz(input: QuizFormInput): Promise<QuizResult | null> {
  const first = await callClaude(input);
  if (first) return first;
  return callClaude(input);
}
