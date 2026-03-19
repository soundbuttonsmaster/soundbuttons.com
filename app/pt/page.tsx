import type { Metadata } from "next"
import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import HomePageClient from "@/components/home/HomePageClient"
import { SITE, getLocaleBase } from "@/lib/constants/site"
import { generateSlug } from "@/lib/utils/slug"

export const revalidate = 300

const BASE = getLocaleBase("pt")

export const metadata: Metadata = {
  title: { absolute: "Myinstants: Botões de som com mesa de som de memes" },
  description:
    "Toque milhares de botões de som com os melhores sons, botão de meme, pegadinhas, efeitos sonoros e áudio de alta qualidade em um poderoso soundboard desbloqueado.",
  authors: [{ name: "SoundButtons.com" }],
  creator: "SoundButtons.com",
  publisher: "SoundButtons.com",
  alternates: {
    canonical: BASE,
    languages: {
      en: SITE.baseUrl,
      es: getLocaleBase("es"),
      pt: BASE,
      fr: getLocaleBase("fr"),
      "x-default": SITE.baseUrl,
    },
  },
  openGraph: {
    type: "website",
    title: "Myinstants: Botões de som com mesa de som de memes",
    description:
      "Toque milhares de botões de som com os melhores sons, botão de meme, pegadinhas, efeitos sonoros e áudio de alta qualidade em um poderoso soundboard desbloqueado.",
    url: BASE,
    siteName: "Sound Buttons",
    images: [{ url: `${SITE.baseUrl}/home.jpg`, width: 1200, height: 630, type: "image/jpeg" as const, alt: "Botões de Som", secureUrl: `${SITE.baseUrl}/home.jpg` }],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundbuttons",
    creator: "@soundbuttons",
    title: "Myinstants: Botões de som com mesa de som de memes",
    description:
      "Toque milhares de botões de som com os melhores sons, botão de meme, pegadinhas, efeitos sonoros e áudio de alta qualidade em um poderoso soundboard desbloqueado.",
    images: [{ url: `${SITE.baseUrl}/home.jpg`, alt: "Botões de Som", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export default async function PtHomePage() {
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
    itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: BASE }],
  }

  const allSoundsForList = [...trendingSounds, ...newSounds]
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Botões de som com mesa de som de memes",
    description: "Toque milhares de botões de som com os melhores sons, botão de meme, pegadinhas, efeitos sonoros e áudio de alta qualidade.",
    numberOfItems: allSoundsForList.length,
    itemListElement: allSoundsForList.map((sound, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: sound.name,
      url: `${BASE}/${generateSlug(sound.name)}/${sound.id}`,
    })),
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SoundButtons.com",
    url: SITE.baseUrl,
    sameAs: [
      "https://www.facebook.com/soundbuttons/",
      "https://x.com/sound_buttons",
      "https://www.instagram.com/soundbuttons_com",
      "https://www.youtube.com/@SoundButtons-07",
      "https://www.threads.com/@soundbuttons_com",
      "https://open.spotify.com/show/3KHK8lf8sr6Y0TQ0kGnGwW",
    ],
  }

  const siteNavSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Início", url: `${BASE}/` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Novo", url: `${BASE}/new` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Em Alta", url: `${BASE}/trends` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Categorias", url: `${BASE}/categories` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Mesa de Som de Memes", url: `${BASE}/meme-soundboard` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Efeitos Sonoros", url: `${BASE}/sound-effects` },
      { "@type": "SiteNavigationElement", "@id": `${BASE}/#navigation`, name: "Reproduzir Aleatório", url: `${BASE}/play-random` },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
        locale="pt"
      />
    </>
  )
}
