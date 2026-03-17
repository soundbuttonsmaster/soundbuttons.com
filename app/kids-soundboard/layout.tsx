import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Kids Soundboard: Funny Sound Buttons for Children | SoundButtons.com" },
  description:
    "Discover fun and safe sound buttons designed especially for kids! Animal sounds, musical instruments, and educational audio effects that children will love.",
  keywords:
    "kids soundboard, children sounds, animal sounds, educational sounds, kid-friendly audio, safe sound buttons, fun sounds for kids",
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
    canonical: "https://soundbuttons.com/kids-soundboard",
    languages: {
      en: "https://soundbuttons.com/kids-soundboard",
      "x-default": "https://soundbuttons.com/kids-soundboard",
    },
  },
  openGraph: {
    type: "website",
    title: "Kids Soundboard: Funny Sound Buttons for Children",
    description:
      "Discover fun and safe sound buttons designed especially for kids! Animal sounds, musical instruments, and educational audio effects.",
    url: "https://soundbuttons.com/kids-soundboard",
    siteName: "Sound Buttons",
    locale: "en_US",
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Kids Soundboard: Funny Sound Buttons for Children",
    description:
      "Discover fun and safe sound buttons designed especially for kids! Animal sounds, musical instruments, and educational audio effects.",
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

export default function KidsSoundboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
