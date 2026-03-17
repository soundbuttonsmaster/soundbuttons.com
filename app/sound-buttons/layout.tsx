import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Sound Buttons Guide - Meme Soundboard Unblocked | SoundButtons.com" },
  description:
    "Learn all about sound buttons and explore 100,000+ sounds for memes, streaming, and content creation. Discover, play, and download your favorite audio clips!",
  keywords:
    "sound buttons, sound buttons guide, meme soundboard, unblocked sound buttons, sound effects, audio clips, streaming sounds, content creation",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  applicationName: "Sound Buttons",
  metadataBase: new URL(BASE),
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: `${BASE}/sound-buttons`,
    languages: { en: `${BASE}/sound-buttons`, "x-default": `${BASE}/sound-buttons` },
  },
  openGraph: {
    type: "website",
    title: "Sound Buttons Guide - Meme Soundboard Unblocked",
    description:
      "Learn all about sound buttons and explore 100,000+ sounds for memes, streaming, and content creation. Discover, play, and download your favorite audio clips!",
    url: `${BASE}/sound-buttons`,
    siteName: "Sound Buttons",
    images: [
      {
        url: `${BASE}/sound-buttons/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Sound Buttons Guide | SoundButtons.com",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Sound Buttons Guide - Meme Soundboard Unblocked",
    description:
      "Learn all about sound buttons and explore 100,000+ sounds for memes, streaming, and content creation.",
    images: [
      {
        url: `${BASE}/sound-buttons/opengraph-image`,
        alt: "Sound Buttons Guide | SoundButtons.com",
        width: 1200,
        height: 630,
      },
    ],
  },
  themeColor: "#2563eb",
  appleWebApp: { capable: true, title: "SoundButtons", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  other: {
    "wot-verification": "4342162e8c0f7503ba1f",
    language: "en",
    rating: "general",
    distribution: "global",
    coverage: "worldwide",
    target: "all",
    HandheldFriendly: "true",
    MobileOptimized: "width",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org" as const,
  "@type": "BreadcrumbList" as const,
  itemListElement: [
    { "@type": "ListItem" as const, position: 1, name: "sound-buttons", item: `${BASE}/sound-buttons` },
  ],
}

export default function SoundButtonsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  )
}
