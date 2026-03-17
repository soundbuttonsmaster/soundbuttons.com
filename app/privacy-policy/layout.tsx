import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy - SoundButtons.com | Data Protection & Rights" },
  description:
    "Read our comprehensive privacy policy to learn how we handle your data, cookies, and user rights at SoundButtons.com. We're committed to protecting your privacy and personal information.",
  keywords:
    "privacy policy soundbuttons, soundbuttons privacy, data protection soundbuttons, cookie policy soundbuttons, user rights soundbuttons, privacy policy sound button, data protection sound button, cookie policy sound button, user rights sound button, privacy policy audio platform, data protection audio platform, cookie policy audio platform, user rights audio platform, privacy policy sound effects, data protection sound effects, cookie policy sound effects, user rights sound effects, privacy policy meme sounds, data protection meme sounds, cookie policy meme sounds, user rights meme sounds, privacy policy gaming sounds, data protection gaming sounds, cookie policy gaming sounds, user rights gaming sounds, privacy policy comedy sounds, data protection comedy sounds, cookie policy comedy sounds, user rights comedy sounds, privacy policy music sounds, data protection music sounds, cookie policy music sounds, user rights music sounds",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
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
    canonical: "https://soundbuttons.com/privacy-policy",
  },
  openGraph: {
    type: "website",
    title: "Privacy Policy - SoundButtons.com | Data Protection & Rights",
    description:
      "Read our comprehensive privacy policy to learn how we handle your data, cookies, and user rights at SoundButtons.com. We're committed to protecting your privacy and personal information.",
    url: "https://soundbuttons.com/privacy-policy",
    siteName: "Sound Buttons",
    locale: "en_US",
    alternateLocale: ["en_GB"],
    // Uses opengraph-image.tsx for dynamic SVG-based OG image
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Privacy Policy - SoundButtons.com | Data Protection & Rights",
    description:
      "Read our comprehensive privacy policy to learn how we handle your data, cookies, and user rights at SoundButtons.com. We're committed to protecting your privacy and personal information.",
  },
  themeColor: "#2563eb",
  applicationName: "Sound Buttons",
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

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
