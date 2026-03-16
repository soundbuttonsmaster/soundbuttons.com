import { headers } from "next/headers"
import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import MemeSoundboardClient from "./MemeSoundboardClient"

export const revalidate = 300
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Meme Soundboard: 9,99,999+ Sound Buttons Unblocked" },
  description:
    "Play thousands of meme soundboard buttons unblocked! The best collection of meme soundboard, unblocked sound buttons, viral meme sounds, and funny sound effects. Free meme soundboard for school, work, and home.",
  keywords:
    "meme soundboard, meme soundboard unblocked, unblocked meme soundboard, meme sound buttons, meme sounds, viral meme sounds, funny meme sounds, meme sound effects, free meme soundboard, meme soundboard for school",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: `${BASE}/meme-soundboard`,
    languages: {
      en: `${BASE}/meme-soundboard`,
      "x-default": `${BASE}/meme-soundboard`,
    },
  },
  openGraph: {
    type: "website",
    title: "Meme Soundboard: 9,99,999+ Sound Buttons Unblocked",
    description:
      "Play thousands of meme soundboard buttons unblocked! The best collection of meme soundboard, unblocked sound buttons, viral meme sounds, and funny sound effects.",
    url: `${BASE}/meme-soundboard`,
    siteName: "Sound Buttons",
    images: [
      {
        url: `${BASE}/og.png`,
        width: 1200,
        height: 630,
        alt: "Meme Soundboard: 9,99,999+ Sound Buttons Unblocked",
      },
    ],
    locale: "en_US",
    alternateLocale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Meme Soundboard: 9,99,999+ Sound Buttons Unblocked",
    description:
      "Play thousands of meme soundboard buttons unblocked! The best collection of meme soundboard, unblocked sound buttons, viral meme sounds, and funny sound effects.",
    images: [`${BASE}/og.png`],
  },
}

export default async function MemeSoundboardPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  const TRENDING_PAGE_SIZE = 44
  const newCount = 22

  const [trendingResult, newResult] = await Promise.allSettled([
    apiClient.getTrendingSounds(1, TRENDING_PAGE_SIZE),
    apiClient.getNewSounds(1, newCount),
  ])

  const trendingData =
    trendingResult.status === "fulfilled" ? trendingResult.value : { data: [], meta: {} }
  const newData = newResult.status === "fulfilled" ? newResult.value : { data: [], meta: {} }

  const initialTrendingSounds = trendingData.data || []
  const initialNewSounds = newData.data || []
  const initialTrendingMeta = trendingData.meta || {
    current_page: 1,
    last_page: 1,
    total_items: 0,
  }
  const initialNewMeta = newData.meta || { current_page: 1, last_page: 1 }

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Meme Soundboard - SoundButtons.com",
    url: `${BASE}/meme-soundboard`,
    description:
      "Meme Soundboard is the ultimate collection of unblocked meme soundboard, meme sound buttons, viral meme sounds, and funny sound effects with millions of sound buttons.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE}/search/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Meme Soundboard",
        item: `${BASE}/meme-soundboard`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MemeSoundboardClient
        initialTrendingSounds={initialTrendingSounds}
        initialNewSounds={initialNewSounds}
        initialTrendingMeta={initialTrendingMeta}
        initialNewMeta={initialNewMeta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
