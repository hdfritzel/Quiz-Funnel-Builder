"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { QuizResult } from "@/types/quiz";
import type { QuizFormInput } from "@/lib/prompt";
import type { ExportMeta } from "@/lib/export";
import GeneratorForm from "@/components/GeneratorForm";
import QuizResultView from "@/components/QuizResultView";
import AccessError from "@/components/AccessError";
import SaveAccessLink from "@/components/SaveAccessLink";
import Loader from "@/components/Loader";

type Status = "checking" | "no-access" | "form" | "result";

// Fallback-Speicher für die session_id, falls der Nutzer /generator ohne
// den ?session_id=...-Query-Parameter erneut aufruft (z.B. über die
// Browser-History). Bookmarken der URL mit Parameter bleibt der primäre Weg
// zurück — siehe SaveAccessLink.
const SESSION_STORAGE_KEY = "qfb_session_id";

export default function GeneratorClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParamSessionId = searchParams.get("session_id");

  const [sessionId, setSessionId] = useState<string | null>(queryParamSessionId);
  const [status, setStatus] = useState<Status>("checking");
  const [remaining, setRemaining] = useState(0);
  const [accessMessage, setAccessMessage] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [meta, setMeta] = useState<ExportMeta | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    let cancelled = false;

    // Ermittelt die effektive session_id: bevorzugt aus der URL, sonst als
    // Fallback aus localStorage (siehe SESSION_STORAGE_KEY oben). Wird sie
    // aus localStorage wiederhergestellt, synchronisieren wir die URL, damit
    // Adressleiste und "Link kopieren" wieder den echten Zugang zeigen.
    async function resolveSessionId(): Promise<string | null> {
      if (queryParamSessionId) return queryParamSessionId;

      try {
        const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          router.replace(`/generator?session_id=${encodeURIComponent(stored)}`);
          return stored;
        }
      } catch {
        // localStorage evtl. nicht verfügbar (z.B. Privacy-Mode) — ignorieren.
      }
      return null;
    }

    async function run() {
      const id = await resolveSessionId();
      if (cancelled) return;

      if (!id) {
        setStatus("no-access");
        return;
      }

      setSessionId(id);

      try {
        const res = await fetch("/api/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: id }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (res.ok && data.valid) {
          try {
            window.localStorage.setItem(SESSION_STORAGE_KEY, id);
          } catch {
            // localStorage evtl. nicht verfügbar — der Query-Parameter bleibt
            // dann der einzige Weg zurück, kein harter Fehler nötig.
          }
          setCurrentUrl(window.location.href);
          setRemaining(data.remaining);
          setStatus("form");
        } else {
          setStatus("no-access");
        }
      } catch {
        if (!cancelled) setStatus("no-access");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [queryParamSessionId, router]);

  async function handleSubmit(input: QuizFormInput) {
    setIsSubmitting(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, session_id: sessionId }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setAccessMessage(data.error);
          setStatus("no-access");
          return;
        }
        setGenerateError(data.error ?? "Generierung fehlgeschlagen, bitte erneut versuchen.");
        return;
      }

      setResult(data.result);
      setMeta(input);
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      setStatus("result");
    } catch {
      setGenerateError("Generierung fehlgeschlagen, bitte erneut versuchen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setResult(null);
    setMeta(null);
    setGenerateError(null);
    setStatus("form");
  }

  if (status === "checking") {
    return <Loader message="Zugriff wird geprüft …" />;
  }

  if (status === "no-access") {
    return <AccessError message={accessMessage} />;
  }

  if (status === "result" && result && meta) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        {currentUrl && <SaveAccessLink url={currentUrl} remaining={remaining} className="mb-6" />}
        <QuizResultView result={result} meta={meta} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {currentUrl && (
        <div className="mx-auto mb-6 w-full max-w-xl">
          <SaveAccessLink url={currentUrl} remaining={remaining} />
        </div>
      )}
      <GeneratorForm remaining={remaining} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      {isSubmitting && <Loader message="Dein Quiz-Funnel wird generiert … (das kann bis zu 10 Sekunden dauern)" />}
      {generateError && (
        <div className="mx-auto mt-4 w-full max-w-xl rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {generateError}
        </div>
      )}
    </div>
  );
}
