import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import MemeSoundboardClient from "./MemeSoundboardClient"

export const revalidate = 300

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

  const defaultTrendingMeta = { current_page: 1, last_page: 1, total_items: 0 }
  const defaultNewMeta = { current_page: 1, last_page: 1 }

  const trendingData =
    trendingResult.status === "fulfilled" ? trendingResult.value : { data: [], meta: defaultTrendingMeta }
  const newData = newResult.status === "fulfilled" ? newResult.value : { data: [], meta: defaultNewMeta }

  const initialTrendingSounds = trendingData.data || []
  const initialNewSounds = newData.data || []
  const initialTrendingMeta =
    trendingData.meta && typeof trendingData.meta.current_page === "number"
      ? trendingData.meta
      : defaultTrendingMeta
  const initialNewMeta =
    newData.meta && typeof newData.meta.current_page === "number"
      ? newData.meta
      : defaultNewMeta

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "meme-soundboard",
        item: "https://soundbuttons.com/meme-soundboard",
      },
    ],
  }

  return (
    <>
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
