import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz-Funnel-Builder — Fertige Quiz-Funnels für Coaches & Networker",
  description:
    "Generiere in unter einer Minute einen kompletten Quiz-Funnel: Diagnose-Fragen, Ergebnispfade und ManyChat-Routing-Text zum Copy-Paste.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center px-4 py-4">
            <Link href="/" className="text-sm font-semibold tracking-tight text-slate-900">
              Quiz-Funnel-Builder
            </Link>
          </div>
        </header>
        {children}
        <footer className="border-t border-slate-200 bg-white py-6">
          <div className="mx-auto max-w-4xl px-4 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Quiz-Funnel-Builder
          </div>
        </footer>
      </body>
    </html>
  );
}
