import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { buildLocaleMetadata, getLocaleBase } from "@/lib/i18n/metadata"
import SearchPageClient from "@/app/search/SearchPageClient"

export const revalidate = 3600

export const metadata = buildLocaleMetadata("es", "search")

function slugify(str: string): string {
  if (!str) return ""
  return str.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") || ""
}

export default async function EsSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  if (params.q && typeof params.q === "string" && params.q.trim()) {
    const slug = slugify(params.q.trim())
    if (slug) redirect(`/es/search/${slug}`)
  }

  const BASE = getLocaleBase("es")
  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Buscar Sound Buttons",
    url: `${BASE}/search`,
    isPartOf: { "@type": "WebSite", name: "SoundButtons.com", url: `${BASE}/` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }} />
      <SearchPageClient />
    </>
  )
}
