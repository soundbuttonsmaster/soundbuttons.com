import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Sound Buttons Unblocked - Play & Download Free Sounds | SoundButtons.com" },
  description:
    "Discover a world of fun and safe sound buttons unblocked for kids! Play popular sound effects and enjoy endless entertainment on SoundButtons.com.",
  keywords:
    "sound buttons unblocked, unblocked sound buttons, kids sound buttons, fun sounds, safe sounds for kids, sound effects unblocked",
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
    canonical: `${BASE}/sound-buttons-unblocked`,
    languages: {
      en: `${BASE}/sound-buttons-unblocked`,
      "x-default": `${BASE}/sound-buttons-unblocked`,
    },
  },
  openGraph: {
    type: "website",
    title: "Sound Buttons Unblocked - Play & Download Free Sounds",
    description:
      "Discover a world of fun and safe sound buttons unblocked for kids! Play popular sound effects and enjoy endless entertainment on SoundButtons.com.",
    url: `${BASE}/sound-buttons-unblocked`,
    siteName: "Sound Buttons",
    images: [
      {
        url: `${BASE}/sound-buttons-unblocked/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Sound Buttons Unblocked",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Sound Buttons Unblocked - Play & Download Free Sounds",
    description:
      "Discover a world of fun and safe sound buttons unblocked for kids! Play popular sound effects and enjoy endless entertainment on SoundButtons.com.",
    images: [
      {
        url: `${BASE}/sound-buttons-unblocked/opengraph-image`,
        alt: "Sound Buttons Unblocked",
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
    { "@type": "ListItem" as const, position: 1, name: "Home", item: `${BASE}/` },
    {
      "@type": "ListItem" as const,
      position: 2,
      name: "sound-buttons-unblocked",
      item: `${BASE}/sound-buttons-unblocked`,
    },
  ],
}

export default function SoundButtonsUnblockedLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
