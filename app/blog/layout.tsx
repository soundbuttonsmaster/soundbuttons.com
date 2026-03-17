import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Blog | SoundButtons - Sound Effect Button Collection" },
  description:
    "Read the latest news, updates, and articles about sound buttons, memes, and trending sounds on the SoundButtons blog. Discover tips, tutorials, and featured sound collections.",
  keywords:
    "sound buttons blog, sound effects articles, meme sounds, trending sound effects, sound button tutorials, sound collections",
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
    canonical: "https://soundbuttons.com/blog",
  },
  openGraph: {
    type: "website",
    url: "https://soundbuttons.com/blog",
    title: "Blog | SoundButtons - Sound Effect Button Collection",
    description:
      "Read the latest news, updates, and articles about sound buttons, memes, and trending sounds on the SoundButtons blog. Discover tips, tutorials, and featured sound collections.",
    siteName: "Sound Buttons",
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Blog | SoundButtons - Sound Effect Button Collection",
    description:
      "Read the latest news, updates, and articles about sound buttons, memes, and trending sounds on the SoundButtons blog.",
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
    "twitter:url": "https://soundbuttons.com/blog",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
