import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import HomePageClient from "@/components/home/HomePageClient"
import { buildLocaleMetadata, getLocaleBase } from "@/lib/i18n/metadata"

export const revalidate = 60

export const metadata = buildLocaleMetadata("es", "home")

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

  const BASE = getLocaleBase("es")

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SoundButtons.com",
    url: `${BASE}/`,
    inLanguage: "es",
    description: "Sound buttons - Meme soundboard y efectos de sonido.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE}/search/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
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
