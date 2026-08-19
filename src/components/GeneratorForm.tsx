"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { QuizFormInput } from "@/lib/prompt";

type GeneratorFormProps = {
  remaining: number;
  isSubmitting: boolean;
  onSubmit: (input: QuizFormInput) => void;
  buyUrl?: string;
};

const FIELD_CONFIG: {
  key: keyof QuizFormInput;
  label: string;
  placeholder: string;
  type: "input" | "textarea";
}[] = [
  {
    key: "nische",
    label: "Nische",
    placeholder: 'z.B. "Krypto-Coaching"',
    type: "input",
  },
  {
    key: "zielgruppe",
    label: "Zielgruppe",
    placeholder: 'z.B. "Frauen 35-55, wenig Erfahrung mit Geldanlage"',
    type: "textarea",
  },
  {
    key: "zielangebot",
    label: "Zielangebot",
    placeholder: 'z.B. "1:1 Coaching Erstgespräch"',
    type: "input",
  },
];

export default function GeneratorForm({ remaining, isSubmitting, onSubmit, buyUrl = "/" }: GeneratorFormProps) {
  const [values, setValues] = useState<QuizFormInput>({
    nische: "",
    zielgruppe: "",
    zielangebot: "",
  });

  const exhausted = remaining <= 0;
  const canSubmit =
    !isSubmitting &&
    !exhausted &&
    values.nische.trim().length > 0 &&
    values.zielgruppe.trim().length > 0 &&
    values.zielangebot.trim().length > 0;

  function handleChange(key: keyof QuizFormInput, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(values);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Quiz-Funnel generieren</h1>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            exhausted ? "bg-red-50 text-red-700" : "bg-indigo-50 text-indigo-700"
          }`}
        >
          Noch {remaining} von 10 Generierungen übrig
        </span>
      </div>

      {exhausted ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="mb-4 font-medium text-red-800">
            Kontingent aufgebraucht. Du hast alle 10 Generierungen dieses Kaufs verwendet.
          </p>
          <Link
            href={buyUrl}
            className="inline-flex items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            Neues Kontingent kaufen
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {FIELD_CONFIG.map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="mb-1.5 block text-sm font-medium text-slate-700">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  value={values[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={2}
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
                />
              ) : (
                <input
                  id={field.key}
                  type="text"
                  value={values[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "Generiere …" : "Funnel generieren"}
          </button>
        </form>
      )}
    </div>
  );
}
