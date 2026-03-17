import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Leaderboard - Top Sound Button Creators | SoundButtons.com" },
  description:
    "See the top creators and most popular sound buttons on SoundButtons.com. Leaderboard of trending sounds and community rankings.",
  keywords:
    "sound buttons leaderboard, top sound creators, soundboard rankings, popular sound effects, top meme sounds, sound button rankings",
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
    canonical: "https://soundbuttons.com/leaderboard",
    languages: {
      en: "https://soundbuttons.com/leaderboard",
      "x-default": "https://soundbuttons.com/leaderboard",
    },
  },
  openGraph: {
    type: "website",
    title: "Leaderboard - Top Sound Button Creators",
    description:
      "See the top creators and most popular sound buttons on SoundButtons.com. Leaderboard of trending sounds and community rankings.",
    url: "https://soundbuttons.com/leaderboard",
    siteName: "Sound Buttons",
    locale: "en_US",
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Leaderboard - Top Sound Button Creators",
    description:
      "See the top creators and most popular sound buttons on SoundButtons.com.",
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

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
