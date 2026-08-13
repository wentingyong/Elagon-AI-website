import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://elagon.ai"),
  title: { default: "Elagon — AI that works. Value that lasts.", template: "%s — Elagon" },
  description: "Elagon redesigns critical workflows and builds production-ready AI systems that deliver measurable business value.",
  openGraph: { title: "Elagon — AI that works. Value that lasts.", description: "AI systems for complex operations.", type: "website", locale: "en_CA" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isVercel = Boolean(process.env.VERCEL);
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <MotionProvider><main id="main">{children}</main><Footer /></MotionProvider>
        <Analytics />{isVercel && <VercelAnalytics />}{isVercel && <SpeedInsights />}
      </body>
    </html>
  );
}
