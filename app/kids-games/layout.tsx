import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Kids Games - Fun Sound Buttons for Everyone | SoundButtons.com" },
  description:
    "Discover kids games sound buttons on SoundButtons! Play fun, safe, and interactive sound effects perfect for children and enjoy endless audio entertainment.",
  keywords:
    "kids games, fun games, sound games, tic tac toe, sound effects, children games, colorful games, interactive games",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  applicationName: "Sound Buttons",
  metadataBase: new URL("https://soundbuttons.com"),
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://soundbuttons.com/kids-games",
    languages: { en: "https://soundbuttons.com/kids-games", "x-default": "https://soundbuttons.com/kids-games" },
  },
  openGraph: {
    type: "website",
    title: "Kids Games - Fun Sound Buttons for Everyone",
    description:
      "Discover kids games sound buttons on SoundButtons! Play fun, safe, and interactive sound effects perfect for children.",
    url: "https://soundbuttons.com/kids-games",
    siteName: "Sound Buttons",
    locale: "en_US",
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Kids Games - Fun Sound Buttons for Everyone",
    description:
      "Discover kids games sound buttons on SoundButtons! Play fun, safe, and interactive sound effects.",
  },
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    title: "SoundButtons",
    statusBarStyle: "default",
  },
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

export default function KidsGamesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
              { "@type": "ListItem", position: 2, name: "Kids Games", item: `${BASE}/kids-games` },
            ],
          }),
        }}
      />
      {children}
    </>
  )
}
