import type { Metadata } from "next"
import { NotFoundContent } from "@/components/404-content"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl
const TITLE = "Page Not Found (404) | SoundButtons.com - Sound Buttons & Sound Effects"
const DESCRIPTION =
  "The page you're looking for doesn't exist. Explore our collection of thousands of free sound buttons, sound effects, and meme soundboards instead!"

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: "404, page not found, sound buttons, sound effects, meme soundboard, soundboard unblocked",
  authors: [{ name: "SoundButtons.com", url: BASE }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  generator: "Next.js",
  metadataBase: new URL(BASE),
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  alternates: { canonical: `${BASE}/404` },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE}/404`,
    siteName: "SoundButtons.com",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: `${BASE}/404/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Page Not Found | SoundButtons.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: `${BASE}/404/opengraph-image`,
        alt: "Page Not Found | SoundButtons.com",
        width: 1200,
        height: 630,
      },
    ],
  },
  themeColor: "#2563eb",
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, title: "SoundButtons", statusBarStyle: "default" },
  other: {
    rating: "general",
    target: "all",
    coverage: "worldwide",
    copyright: "© 2025 SoundButtons.com",
    distribution: "global",
    language: "en",
    MobileOptimized: "width",
    HandheldFriendly: "true",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
  },
}

export default function NotFoundPage() {
  return <NotFoundContent />
}
