import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: {
    absolute: "Meme Soundboard: 100k+ Instant Play Soundboards Unblocked | SoundButtons.com",
  },
  description:
    "Play and download 100,000+ free meme soundboard buttons instantly and explore unblocked meme soundboards with viral prank sounds and funny sound effects.",
  keywords:
    "meme soundboard, meme soundboard unblocked, unblocked meme soundboard, meme sound buttons, meme sounds, viral meme sounds, funny meme sounds, meme sound effects, free meme soundboard, meme soundboard for school",
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
    canonical: "https://soundbuttons.com/meme-soundboard",
    languages: {
      en: "https://soundbuttons.com/meme-soundboard",
      "x-default": "https://soundbuttons.com/meme-soundboard",
    },
  },
  openGraph: {
    type: "website",
    title: "Meme Soundboard: 100k+ Instant Play Soundboards Unblocked",
    description:
      "Play and download 100,000+ free meme soundboard buttons instantly and explore unblocked meme soundboards with viral prank sounds and funny sound effects.",
    url: "https://soundbuttons.com/meme-soundboard",
    siteName: "Sound Buttons",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Meme Soundboard: 100k+ Instant Play Soundboards Unblocked",
    description:
      "Play and download 100,000+ free meme soundboard buttons instantly and explore unblocked meme soundboards with viral prank sounds and funny sound effects.",
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

export default function MemeSoundboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
