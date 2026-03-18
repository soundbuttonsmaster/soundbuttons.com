import type { Metadata } from "next"
import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import { SITE, getLocaleBase } from "@/lib/constants/site"
import TrendsPageClient from "@/app/trends/TrendsPageClient"

export const revalidate = 300
const PAGE_SIZE = 44

const BASE = getLocaleBase("es")

export const metadata: Metadata = {
  title: { absolute: "Botones de Sonido en Tendencia y Soundboard de Memes Viral" },
  description:
    "Descubre los botones de sonido más populares en tendencia y el soundboard de memes viral y efectos sonoros en SoundButtons.com.",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: `${BASE}/trends`,
    languages: {
      en: `${SITE.baseUrl}/trends`,
      es: `${BASE}/trends`,
      pt: `${getLocaleBase("pt")}/trends`,
      fr: `${getLocaleBase("fr")}/trends`,
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Botones de Sonido en Tendencia y Soundboard de Memes Viral",
    description:
      "Descubre los botones de sonido más populares en tendencia y el soundboard de memes viral y efectos sonoros en SoundButtons.com.",
    url: `${BASE}/trends`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/trends/opengraph-image`, width: 1200, height: 630, type: "image/png" as const, alt: "Botones de Sonido en Tendencia", secureUrl: `${BASE}/trends/opengraph-image` }],
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Botones de Sonido en Tendencia y Soundboard de Memes Viral",
    description:
      "Descubre los botones de sonido más populares en tendencia y el soundboard de memes viral y efectos sonoros en SoundButtons.com.",
    images: [`${BASE}/trends/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

export default async function EsTrendsPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const mobileHint = headersList.get("sec-ch-ua-mobile")
  const isMobile = mobileHint === "?1" || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  let initialSounds: Awaited<ReturnType<typeof apiClient.getTrendingSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getTrendingSounds(1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE },
      { "@type": "ListItem", position: 2, name: "trends", item: `${BASE}/trends` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TrendsPageClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
