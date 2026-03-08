import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DreamScope — Speak Your Dream",
  description:
    "Speak your dream. See what it means — through science, not mysticism. AI-powered dream analysis grounded in real psychological frameworks.",
  openGraph: {
    title: "DreamScope — What did you dream last night?",
    description:
      "AI-powered dream analysis using Jungian, Cognitive, and Clinical psychology. Voice-first. Trauma-informed. Built by an MSc Psychology student.",
    type: "website",
    siteName: "DreamScope",
  },
  twitter: {
    card: "summary_large_image",
    title: "DreamScope — Speak Your Dream",
    description:
      "AI-powered dream analysis grounded in real psychological frameworks.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dream-bg text-dream-text`}>
        {children}
      </body>
    </html>
  );
}
