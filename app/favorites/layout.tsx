import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "My Favorites - Saved Sound Buttons | SoundButtons.com" },
  description:
    "View and play your favorite sound buttons. Sign in to save and manage your favorite meme sounds and sound effects on SoundButtons.com.",
  keywords:
    "favorites, saved sound buttons, favorite sounds, sound button favorites, meme sound favorites, sound effects favorites",
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
    canonical: "https://soundbuttons.com/favorites",
  },
  openGraph: {
    type: "website",
    title: "My Favorites - Saved Sound Buttons | SoundButtons.com",
    description:
      "View and play your favorite sound buttons. Sign in to save and manage your favorite meme sounds and sound effects on SoundButtons.com.",
    url: "https://soundbuttons.com/favorites",
    siteName: "Sound Buttons",
    locale: "en_US",
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "My Favorites - Saved Sound Buttons | SoundButtons.com",
    description:
      "View and play your favorite sound buttons. Sign in to save and manage your favorite meme sounds and sound effects on SoundButtons.com.",
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

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
