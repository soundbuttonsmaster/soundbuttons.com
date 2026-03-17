import type { Metadata } from "next"
import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import HomePageClient from "@/components/home/HomePageClient"
import { SITE, getLocaleBase } from "@/lib/constants/site"

export const revalidate = 60

const BASE = getLocaleBase("fr")

export const metadata: Metadata = {
  title: { absolute: "Myinstants: Boutons sonores 999 999+ Table d'harmonie des mèmes déverrouillée" },
  description:
    "Myinstants: Sound Buttons est la collection ultime de tables d'harmonie, de boutons sonores et de tables d'harmonie de mèmes non bloquées, avec des milliards de tables d'harmonie et de boutons de mèmes.",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: BASE,
    languages: {
      en: SITE.baseUrl,
      es: getLocaleBase("es"),
      pt: getLocaleBase("pt"),
      fr: BASE,
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Myinstants: Boutons sonores 999 999+ Table d'harmonie des mèmes déverrouillée",
    description:
      "Myinstants: Sound Buttons est la collection ultime de tables d'harmonie, de boutons sonores et de tables d'harmonie de mèmes non bloquées, avec des milliards de tables d'harmonie et de boutons de mèmes.",
    url: BASE,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, type: "image/png" as const, alt: "Boutons sonores", secureUrl: `${BASE}/opengraph-image` }],
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Myinstants: Boutons sonores 999 999+ Table d'harmonie des mèmes déverrouillée",
    description:
      "Myinstants: Sound Buttons est la collection ultime de tables d'harmonie, de boutons sonores et de tables d'harmonie de mèmes non bloquées, avec des milliards de tables d'harmonie et de boutons de mèmes.",
    images: [`${BASE}/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

export default async function FrHomePage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const mobileHint = headersList.get("sec-ch-ua-mobile")
  const isMobile = mobileHint === "?1" || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  const trendingCount = isMobile ? 16 : 44
  const newCount = 22

  let trendingSounds: Awaited<ReturnType<typeof apiClient.getTrendingSounds>>["data"] = []
  let newSounds: Awaited<ReturnType<typeof apiClient.getNewSounds>>["data"] = []
  let trendingMeta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const [trendingResult, newResult] = await Promise.allSettled([
      apiClient.getTrendingSounds(1, trendingCount),
      apiClient.getNewSounds(1, newCount),
    ])
    if (trendingResult.status === "fulfilled") {
      trendingSounds = trendingResult.value.data
      trendingMeta = trendingResult.value.meta
    }
    if (newResult.status === "fulfilled") newSounds = newResult.value.data
  } catch {
    // ignore
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "soundboard", item: BASE }],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HomePageClient
        initialTrendingSounds={trendingSounds}
        initialNewSounds={newSounds}
        initialTrendingMeta={trendingMeta}
        isMobileDevice={isMobile}
        locale="fr"
      />
    </>
  )
}
