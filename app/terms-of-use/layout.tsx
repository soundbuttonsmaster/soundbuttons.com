import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Terms of Service | SoundButtons" },
  description:
    "Terms of Service for SoundButtons.com - Review the guidelines for using our sound button platform.",
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
    canonical: "https://soundbuttons.com/terms-of-use",
  },
  openGraph: {
    type: "website",
    title: "Terms of Service | SoundButtons",
    description:
      "Terms of Service for SoundButtons.com - Review the guidelines for using our sound button platform.",
    url: "https://soundbuttons.com/terms-of-use",
    siteName: "Sound Buttons",
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

export default function TermsOfUseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
