import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import { buildLocaleMetadata, getLocaleBase } from "@/lib/i18n/metadata"
import { getBreadcrumbLabels } from "@/lib/i18n/strings"
import TrendsPageClient from "@/app/trends/TrendsPageClient"

export const revalidate = 300
const PAGE_SIZE = 44

export const metadata = buildLocaleMetadata("pt", "trends")

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

  const BASE = getLocaleBase("pt")
  const labels = getBreadcrumbLabels("pt")
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: labels.home, item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: labels.trending, item: `${BASE}/trends` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <TrendsPageClient initialSounds={initialSounds} initialMeta={meta} isMobileDevice={isMobile} />
    </>
  )
}
