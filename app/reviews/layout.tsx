import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: { absolute: "User Reviews - SoundButtons.com | What Our Users Say" },
  description:
    "Read what our users say about SoundButtons.com. Share your own experience and rate our service to help us improve.",
  keywords:
    "user reviews, sound buttons reviews, soundboard reviews, sound effects feedback, meme soundboard reviews",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  applicationName: "Sound Buttons",
  metadataBase: new URL(BASE),
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: `${BASE}/reviews`,
    languages: { en: `${BASE}/reviews`, "x-default": `${BASE}/reviews` },
  },
  openGraph: {
    type: "website",
    title: "User Reviews - SoundButtons.com",
    description:
      "Read what our users say about SoundButtons.com. Share your own experience and rate our service to help us improve.",
    url: `${BASE}/reviews`,
    siteName: "Sound Buttons",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "User Reviews - SoundButtons.com",
    description:
      "Read what our users say about SoundButtons.com. Share your own experience and rate our service to help us improve.",
  },
  themeColor: "#2563eb",
  appleWebApp: { capable: true, title: "SoundButtons", statusBarStyle: "default" },
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

const breadcrumbSchema = {
  "@context": "https://schema.org" as const,
  "@type": "BreadcrumbList" as const,
  itemListElement: [
    { "@type": "ListItem" as const, position: 1, name: "reviews", item: `${BASE}/reviews` },
  ],
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  )
}
