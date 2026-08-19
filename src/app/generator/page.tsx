import { Suspense } from "react";
import type { Metadata } from "next";
import GeneratorClient from "./GeneratorClient";
import Loader from "@/components/Loader";

export const metadata: Metadata = {
  title: "Generator — Quiz-Funnel-Builder",
};

export default function GeneratorPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-12">
      <Suspense fallback={<Loader message="Wird geladen …" />}>
        <GeneratorClient />
      </Suspense>
    </main>
  );
}
