import type { Metadata, Viewport } from "next"
import { SITE } from "@/lib/constants/site"

const BASE = SITE.baseUrl
const NEW_DESCRIPTION =
  "Discover the latest sound buttons and soundboard with fresh, trending audio clips updated daily to play, download, and share for memes and entertainment!"

export const viewport: Viewport = {
  width: "device-width",
  themeColor: "#2563eb",
}

export const metadata: Metadata = {
  title: { absolute: "New Sound Buttons: Fresh Meme Soundboard Audio Updated Daily" },
  description: NEW_DESCRIPTION,
  keywords:
    "new sound buttons, latest sound effects, fresh audio clips, new meme sounds, trending sound buttons, latest soundboard, new audio effects, fresh sound effects, new gaming sounds, latest meme buttons, new notification sounds, fresh soundboard, new viral sounds, latest audio clips, new comedy sounds, fresh meme sounds, new music sounds, latest sound effects, new unblocked sounds, fresh gaming sounds, new discord sounds, latest meme effects, new tiktok sounds, fresh notification sounds, new streaming sounds, latest comedy effects, new entertainment sounds, fresh viral effects, new content creation sounds, latest gaming effects, new social media sounds",
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
    canonical: `${BASE}/new`,
    languages: { en: `${BASE}/new`, fr: `${BASE}/fr/new`, "x-default": `${BASE}/new` },
  },
  openGraph: {
    type: "website",
    title: "New Sound Buttons: Fresh Meme Soundboard Audio Updated Daily",
    description: NEW_DESCRIPTION,
    url: `${BASE}/new`,
    siteName: "Sound Buttons",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "New Sound Buttons: Fresh Meme Soundboard Audio Updated Daily",
    description: NEW_DESCRIPTION,
  },
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
    { "@type": "ListItem" as const, position: 1, name: "Home", item: BASE },
    { "@type": "ListItem" as const, position: 2, name: "New", item: `${BASE}/new` },
  ],
}

export default function NewLayout({ children }: { children: React.ReactNode }) {
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
