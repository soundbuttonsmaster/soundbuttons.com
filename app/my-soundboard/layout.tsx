import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "My Soundboard - Create & Enjoy Custom Sound Buttons | SoundButtons.com" },
  description:
    "Access My Sounds Board on SoundButtons to manage, customize, and share your favorite sound buttons. Create your own sounds and enjoy endless audio fun.",
  keywords:
    "my soundboard, custom soundboard, sound board, create soundboard, personal soundboard, manage sounds, custom audio buttons, my sounds",
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
    canonical: "https://soundbuttons.com/my-soundboard",
    languages: {
      en: "https://soundbuttons.com/my-soundboard",
      "x-default": "https://soundbuttons.com/my-soundboard",
    },
  },
  openGraph: {
    type: "website",
    title: "My Soundboard - Create & Enjoy Custom Sound Buttons",
    description:
      "Access My Sounds Board on SoundButtons to manage, customize, and share your favorite sound buttons. Create your own sounds and enjoy endless audio fun.",
    url: "https://soundbuttons.com/my-soundboard",
    siteName: "Sound Buttons",
    locale: "en_US",
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "My Soundboard - Create & Enjoy Custom Sound Buttons",
    description:
      "Access My Sounds Board on SoundButtons to manage, customize, and share your favorite sound buttons.",
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

export default function MySoundboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
