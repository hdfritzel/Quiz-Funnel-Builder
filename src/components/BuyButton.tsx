"use client";

import { useState } from "react";

type BuyButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export default function BuyButton({ className, children }: BuyButtonProps) {
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
      <button type="button" onClick={handleClick} disabled={isLoading} className={className}>
        {isLoading ? "Wird geladen …" : children}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
