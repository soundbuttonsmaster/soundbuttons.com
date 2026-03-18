import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Create Sound Button - Make Your Own Fun Audio Effects | SoundButtons.com" },
  description:
    "Create Sound Button on SoundButtons to make your own fun and unique audio effects. Play, customize, and share sound buttons easily with friends anytime.",
  keywords:
    "create sound button, make sound effects, custom audio, sound button creator, audio effects maker, create meme sounds, custom soundboard, audio button maker",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  applicationName: "Sound Buttons",
  metadataBase: new URL("https://soundbuttons.com"),
  robots: {
    index: false,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: { index: false, follow: true },
  },
  alternates: {
    canonical: "https://soundbuttons.com/create-sound",
  },
  openGraph: {
    type: "website",
    title: "Create Sound Button - Make Your Own Fun Audio Effects | SoundButtons.com",
    description:
      "Create Sound Button on SoundButtons to make your own fun and unique audio effects. Play, customize, and share sound buttons easily with friends anytime.",
    url: "https://soundbuttons.com/create-sound",
    siteName: "Sound Buttons",
    locale: "en_US",
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Create Sound Button - Make Your Own Fun Audio Effects | SoundButtons.com",
    description:
      "Create Sound Button on SoundButtons to make your own fun and unique audio effects.",
  },
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    title: "SoundButtons",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  other: {
    "fb:app_id": "123456789012345",
    "wot-verification": "4342162e8c0f7503ba1f",
    language: "en",
    rating: "general",
    distribution: "global",
    bingbot: "index, follow",
    HandheldFriendly: "true",
    MobileOptimized: "width",
    "mobile-web-app-capable": "yes",
    coverage: "worldwide",
    target: "all",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
    "twitter:domain": "soundbuttons.com",
    "twitter:app:name:iphone": "SoundButtons",
    "twitter:app:name:ipad": "SoundButtons",
    "twitter:app:name:googleplay": "SoundButtons",
  },
}

import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export default function CreateSoundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "create-sound", item: `${BASE}/create-sound` },
    ],
  }
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
