import type { Metadata } from "next"
import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import HomePageClient from "@/components/home/HomePageClient"
import { SITE, getLocaleBase } from "@/lib/constants/site"
import { generateSlug } from "@/lib/utils/slug"

export const revalidate = 60

const BASE = getLocaleBase("es")

export const metadata: Metadata = {
  title: { absolute: "Myinstants: Botones de Sonido con Soundboard de Memes" },
  description:
    "Reproduce miles de botones de sonido con los mejores sonidos, botón de meme, bromas, efectos sonoros y audio de alta calidad en un poderoso soundboard desbloqueado.",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: BASE,
    languages: {
      en: SITE.baseUrl,
      es: BASE,
      pt: getLocaleBase("pt"),
      fr: getLocaleBase("fr"),
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Myinstants: Botones de Sonido con Soundboard de Memes",
    description:
      "Reproduce miles de botones de sonido con los mejores sonidos, botón de meme, bromas, efectos sonoros y audio de alta calidad en un poderoso soundboard desbloqueado.",
    url: BASE,
    siteName: "Sound Buttons",
    images: [{ url: `${SITE.baseUrl}/home.jpg`, width: 1200, height: 630, type: "image/jpeg" as const, alt: "Botones de Sonido", secureUrl: `${SITE.baseUrl}/home.jpg` }],
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Myinstants: Botones de Sonido con Soundboard de Memes",
    description:
      "Reproduce miles de botones de sonido con los mejores sonidos, botón de meme, bromas, efectos sonoros y audio de alta calidad en un poderoso soundboard desbloqueado.",
    images: [{ url: `${SITE.baseUrl}/home.jpg`, alt: "Botones de Sonido", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export default async function EsHomePage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const mobileHint = headersList.get("sec-ch-ua-mobile")
  const isMobile =
    mobileHint === "?1" ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

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
    itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: BASE }],
  }

  const allSoundsForList = [...trendingSounds, ...newSounds]
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Botones de Sonido con Soundboard de Memes",
    description: "Reproduce miles de botones de sonido con los mejores sonidos, botón de meme, bromas, efectos sonoros y audio de alta calidad.",
    numberOfItems: allSoundsForList.length,
    itemListElement: allSoundsForList.map((sound, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: sound.name,
      url: `${BASE}/${generateSlug(sound.name)}/${sound.id}`,
    })),
  }

  const siteNavSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Inicio", url: `${BASE}/` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Nuevo", url: `${BASE}/new` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Tendencia", url: `${BASE}/trends` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Categorías", url: `${BASE}/categories` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Soundboard de Memes", url: `${BASE}/meme-soundboard` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Efectos de Sonido", url: `${BASE}/sound-effects` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Reproducir Aleatorio", url: `${BASE}/play-random` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavSchema) }}
      />
      <HomePageClient
        initialTrendingSounds={trendingSounds}
        initialNewSounds={newSounds}
        initialTrendingMeta={trendingMeta}
        isMobileDevice={isMobile}
        locale="es"
      />
    </>
  )
}
