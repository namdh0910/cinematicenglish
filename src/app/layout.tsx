import type { Metadata } from "next";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Cinematic English — Learn English Like Netflix, Not School",
  description:
    "The world's most immersive English learning platform. Learn through cinematic stories, AI conversation coaches, psychology, philosophy, and emotional storytelling. Netflix meets Duolingo.",
  keywords: [
    "learn english",
    "AI english learning",
    "cinematic english",
    "speak english fluently",
    "english learning app",
    "AI speaking coach",
  ],
  authors: [{ name: "Cinematic English" }],
  openGraph: {
    title: "Cinematic English — Learn English Like Netflix, Not School",
    description:
      "The world's most immersive English learning platform powered by AI. Stories, emotion, and cinematic narration.",
    type: "website",
    locale: "en_US",
    siteName: "Cinematic English",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cinematic English — Learn English Like Netflix",
    description:
      "AI-powered English learning through stories, emotion, and cinematic narration.",
  },
  robots: "index, follow",
};

import { AdaptiveProvider } from "@/context/AdaptiveContext";
import AdaptiveSwitcher from "@/components/debug/AdaptiveSwitcher";
import ObservabilityInitializer from "@/components/observability/ObservabilityInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Cinematic English",
              description:
                "AI-powered English learning through cinematic stories and emotional narration.",
              applicationCategory: "EducationApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                },
              }),
            }}
          />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900">
        <ObservabilityInitializer />
        <AdaptiveProvider>
          {children}
          <AdaptiveSwitcher />
        </AdaptiveProvider>
      </body>
    </html>
  );
}
