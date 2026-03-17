import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Sound Button Categories – Browse All | SoundButtons.com" },
  description:
    "Browse all sound button categories on SoundButtons.com! From memes to music, gaming to comedy, find and explore thousands of organized sound effects.",
  keywords:
    "sound button categories, meme sounds, gaming sound effects, comedy audio, music soundboard, viral sounds, free sound effects, unblocked sound buttons, audio categories, soundboard categories, sound effects library, meme audio, gaming audio, comedy sounds, music effects, viral audio, free audio, unblocked audio, sound categories, audio library, sound effects collection, meme soundboard, gaming soundboard, comedy soundboard, music soundboard, viral soundboard, free soundboard, unblocked soundboard, sound categories, audio categories, sound effects categories",
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
    canonical: "https://soundbuttons.com/categories",
  },
  openGraph: {
    type: "website",
    title: "Sound Button Categories – Browse All | SoundButtons.com",
    description:
      "Browse all sound button categories on SoundButtons.com! From memes to music, gaming to comedy, find and explore thousands of organized sound effects.",
    url: "https://soundbuttons.com/categories",
    siteName: "Sound Buttons",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Sound Button Categories – Browse All | SoundButtons.com",
    description:
      "Browse all sound button categories on SoundButtons.com! From memes to music, gaming to comedy, find and explore thousands of organized sound effects.",
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

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
