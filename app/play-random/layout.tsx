import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Play Random Sound – Fun Sound Button Generator | SoundButtons.com" },
  description:
    "Play random sounds with one click! Discover fun, trending, and new sound buttons for everyone. Try your luck and enjoy endless sound surprises on SoundButtons.com.",
  keywords:
    "play random sound, random sound button, sound button generator, random soundboard, surprise sounds, random meme sounds, fun sound effects, random audio generator",
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
    canonical: `${BASE}/play-random`,
    languages: { en: `${BASE}/play-random`, "x-default": `${BASE}/play-random` },
  },
  openGraph: {
    type: "website",
    title: "Play Random Sound – Fun Sound Button Generator",
    description:
      "Play random sounds with one click! Discover fun, trending, and new sound buttons for everyone. Try your luck and enjoy endless sound surprises on SoundButtons.com.",
    url: `${BASE}/play-random`,
    siteName: "Sound Buttons",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Play Random Sound – Fun Sound Button Generator",
    description:
      "Play random sounds with one click! Discover fun, trending, and new sound buttons for everyone.",
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
    { "@type": "ListItem" as const, position: 1, name: "Home", item: `${BASE}/` },
    { "@type": "ListItem" as const, position: 2, name: "play-random", item: `${BASE}/play-random` },
  ],
}

export default function PlayRandomLayout({ children }: { children: React.ReactNode }) {
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
