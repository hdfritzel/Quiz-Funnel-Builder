"use client";

import { useId, useState } from "react";

type BuyButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export default function BuyButton({ className, children }: BuyButtonProps) {
  const checkboxId = useId();
  const [widerrufBestaetigt, setWiderrufBestaetigt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout konnte nicht gestartet werden.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout konnte nicht gestartet werden.");
      setIsLoading(false);
    }
  }

  return (
    <div>
      <label htmlFor={checkboxId} className="mb-3 flex items-start justify-center gap-2 text-left">
        <input
          id={checkboxId}
          type="checkbox"
          required
          checked={widerrufBestaetigt}
          onChange={(e) => setWiderrufBestaetigt(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="max-w-xs text-sm text-slate-600">
          Ich verzichte ausdrücklich auf mein 14-tägiges Widerrufsrecht, da ich mit dem Kauf
          sofortigen Zugriff auf die digitale Leistung erhalte.
        </span>
      </label>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading || !widerrufBestaetigt}
        className={className}
      >
        {isLoading ? "Wird geladen …" : children}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
