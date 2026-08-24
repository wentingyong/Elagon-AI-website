import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import {
  absoluteUrl,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_URL,
  seoCopy,
} from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${seoCopy.home.title} — ${SITE_NAME}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: seoCopy.home.description,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/brand/icon.png"),
    description: seoCopy.home.description,
    email: "jordan@elagon.ai",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "Ontario",
      addressCountry: "CA",
    },
    areaServed: "Worldwide",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: SITE_LANGUAGE,
    description: seoCopy.home.description,
    publisher: { "@type": "Organization", name: SITE_NAME },
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isVercel = Boolean(process.env.VERCEL);
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <a className="skip-link" href="#main">Skip to content</a>
        <MotionProvider><main id="main">{children}</main><Footer /></MotionProvider>
        <Analytics />{isVercel && <VercelAnalytics />}{isVercel && <SpeedInsights />}
      </body>
    </html>
  );
}
