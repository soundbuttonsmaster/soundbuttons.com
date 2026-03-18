import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import MemeButtonsClient from "./MemeButtonsClient"

const BASE = SITE.baseUrl

export const revalidate = 300

export default async function MemeButtonsPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  const PAGE_SIZE = 44
  let initialSounds: Awaited<ReturnType<typeof apiClient.getSoundsByCategory>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getSoundsByCategory("Memes", 1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    try {
      const res = await apiClient.getTrendingSounds(1, PAGE_SIZE)
      initialSounds = res.data
      meta = res.meta
    } catch {
      // ignore
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "meme-buttons", item: `${BASE}/meme-buttons` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MemeButtonsClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={isMobile}
      />
    </>
  )
}
