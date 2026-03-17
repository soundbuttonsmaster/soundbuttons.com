import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl

export const viewport: Viewport = {
  width: "device-width",
}

export const metadata: Metadata = {
  title: {
    absolute: "Sound Buttons Unblocked for School - Play Free Sounds Online | SoundButtons.com",
  },
  description:
    "Access sound buttons unblocked for school on SoundButtons. Play and download free sound effects safely, create fun buttons, and enjoy audio anywhere, anytime.",
  keywords:
    "sound buttons unblocked for school, school sound effects, classroom sound buttons, educational sound effects, school-friendly sounds, teacher sound resources",
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
    canonical: `${BASE}/sound-buttons-unblocked-for-school`,
    languages: {
      en: `${BASE}/sound-buttons-unblocked-for-school`,
      "x-default": `${BASE}/sound-buttons-unblocked-for-school`,
    },
  },
  openGraph: {
    type: "website",
    title: "Sound Buttons Unblocked for School - Play Free Sounds Online",
    description:
      "Access sound buttons unblocked for school on SoundButtons. Play and download free sound effects safely, create fun buttons, and enjoy audio anywhere, anytime.",
    url: `${BASE}/sound-buttons-unblocked-for-school`,
    siteName: "Sound Buttons",
    images: [
      {
        url: `${BASE}/sound-buttons-unblocked-for-school/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Sound Buttons for School",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Sound Buttons Unblocked for School - Play Free Sounds Online",
    description:
      "Access sound buttons unblocked for school on SoundButtons. Play and download free sound effects safely, create fun buttons, and enjoy audio anywhere, anytime.",
    images: [
      {
        url: `${BASE}/sound-buttons-unblocked-for-school/opengraph-image`,
        alt: "Sound Buttons for School",
        width: 1200,
        height: 630,
      },
    ],
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
    {
      "@type": "ListItem" as const,
      position: 1,
      name: "sound-buttons-unblocked-for-school",
      item: `${BASE}/sound-buttons-unblocked-for-school`,
    },
  ],
}

export default function SoundButtonsForSchoolLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
