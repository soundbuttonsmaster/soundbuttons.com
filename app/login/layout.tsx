import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "Login - Sign In | SoundButtons.com" },
  description:
    "Sign in to your SoundButtons.com account to save favorites, create soundboards, and access your profile. Free meme soundboard and sound effects.",
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
    canonical: "https://soundbuttons.com/login",
    languages: {
      en: "https://soundbuttons.com/login",
      "x-default": "https://soundbuttons.com/login",
    },
  },
  openGraph: {
    type: "website",
    title: "Login - Sign In | SoundButtons.com",
    description:
      "Sign in to your SoundButtons.com account to save favorites, create soundboards, and access your profile.",
    url: "https://soundbuttons.com/login",
    siteName: "Sound Buttons",
    locale: "en_US",
    // Uses opengraph-image.tsx for dynamic OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Login - Sign In | SoundButtons.com",
    description: "Sign in to your SoundButtons.com account.",
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

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
