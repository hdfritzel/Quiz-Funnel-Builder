"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { QuizResult } from "@/types/quiz";
import type { QuizFormInput } from "@/lib/prompt";
import type { ExportMeta } from "@/lib/export";
import GeneratorForm from "@/components/GeneratorForm";
import QuizResultView from "@/components/QuizResultView";
import AccessError from "@/components/AccessError";
import Loader from "@/components/Loader";

type Status = "checking" | "no-access" | "form" | "result";

export default function GeneratorClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<Status>(() => (sessionId ? "checking" : "no-access"));
  const [remaining, setRemaining] = useState(0);
  const [accessMessage, setAccessMessage] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [meta, setMeta] = useState<ExportMeta | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function verify() {
      try {
        const res = await fetch("/api/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (res.ok && data.valid) {
          setRemaining(data.remaining);
          setStatus("form");
        } else {
          setStatus("no-access");
        }
      } catch {
        if (!cancelled) setStatus("no-access");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

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
    return <QuizResultView result={result} meta={meta} onReset={handleReset} />;
  }

  return (
    <div className="w-full">
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
