import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Meme Buttons: 100k+ Sound Buttons Unblocked | SoundButtons.com" },
  description:
    "Play meme buttons unblocked and get instant access to trending sound buttons, funny sounds, viral memes, and sound effects on our free soundboard.",
  keywords:
    "meme buttons, meme sounds, viral meme sounds, funny sounds, meme sound effects, meme soundboard, trending memes, discord sounds, tiktok sounds, sound buttons",
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
    canonical: "https://soundbuttons.com/meme-buttons",
    languages: {
      en: "https://soundbuttons.com/meme-buttons",
      "x-default": "https://soundbuttons.com/meme-buttons",
    },
  },
  openGraph: {
    type: "website",
    title: "Meme Buttons: 100k+ Sound Buttons Unblocked",
    description:
      "Play meme buttons unblocked and get instant access to trending sound buttons, funny sounds, viral memes, and sound effects on our free soundboard.",
    url: "https://soundbuttons.com/meme-buttons",
    siteName: "Sound Buttons",
    locale: "en_US",
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Meme Buttons: 100k+ Sound Buttons Unblocked",
    description:
      "Play meme buttons unblocked and get instant access to trending sound buttons, funny sounds, viral memes, and sound effects on our free soundboard.",
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

export default function MemeButtonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
