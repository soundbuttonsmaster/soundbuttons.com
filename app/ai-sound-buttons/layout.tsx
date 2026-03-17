import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
  themeColor: "#2563eb",
}

export const metadata: Metadata = {
  title: { absolute: "AI Sound Buttons Chat Bot | Play Any Soundboard by Category" },
  description:
    "Ask our AI chat bot to play any sound button or soundboard by category. Instantly play, discover, and share sound effects!",
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
  },
  alternates: {
    canonical: "https://soundbuttons.com/ai-sound-buttons",
  },
  openGraph: {
    type: "website",
    title: "AI Sound Buttons Chat Bot | Play Any Soundboard by Category",
    description:
      "Ask our AI chat bot to play any sound button or soundboard by category. Instantly play, discover, and share sound effects!",
    url: "https://soundbuttons.com/ai-sound-buttons",
    siteName: "Sound Buttons",
    // Uses opengraph-image.tsx for dynamic OG image
  },
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

export default function AiSoundButtonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
