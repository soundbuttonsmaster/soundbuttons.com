import type { Metadata } from "next"
import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import { SITE, getLocaleBase } from "@/lib/constants/site"
import TrendsPageClient from "@/app/trends/TrendsPageClient"

export const revalidate = 300
const PAGE_SIZE = 44

const BASE = getLocaleBase("pt")

export const metadata: Metadata = {
  title: { absolute: "Botões de Som em Alta & Meme Soundboard Viral" },
  description:
    "Descubra os botões de som mais populares em alta e os meme soundboard virais e efeitos sonoros no SoundButtons.com.",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: `${BASE}/trends`,
    languages: {
      en: `${SITE.baseUrl}/trends`,
      es: `${getLocaleBase("es")}/trends`,
      pt: `${BASE}/trends`,
      fr: `${getLocaleBase("fr")}/trends`,
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Botões de Som em Alta & Meme Soundboard Viral",
    description:
      "Descubra os botões de som mais populares em alta e os meme soundboard virais e efeitos sonoros no SoundButtons.com.",
    url: `${BASE}/trends`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/trends/opengraph-image`, width: 1200, height: 630, type: "image/png" as const, alt: "Botões de Som em Alta", secureUrl: `${BASE}/trends/opengraph-image` }],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Botões de Som em Alta & Meme Soundboard Viral",
    description:
      "Descubra os botões de som mais populares em alta e os meme soundboard virais e efeitos sonoros no SoundButtons.com.",
    images: [`${BASE}/trends/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

export default async function PtTrendsPage() {
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
      { "@type": "ListItem", position: 1, name: "Início", item: BASE },
      { "@type": "ListItem", position: 2, name: "trends", item: `${BASE}/trends` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TrendsPageClient initialSounds={initialSounds} initialMeta={meta} isMobileDevice={isMobile} />
    </>
  )
}
