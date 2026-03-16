import { redirect } from "next/navigation"
import { buildLocaleMetadata, getLocaleBase } from "@/lib/i18n/metadata"
import SearchPageClient from "@/app/search/SearchPageClient"

export const revalidate = 3600
export const metadata = buildLocaleMetadata("pt", "search")

function slugify(str: string): string {
  if (!str) return ""
  return str.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") || ""
}

export default async function PtSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  if (params.q && typeof params.q === "string" && params.q.trim()) {
    const slug = slugify(params.q.trim())
    if (slug) redirect(`/pt/search/${slug}`)
  }

  const BASE = getLocaleBase("pt")
  const searchSchema = { "@context": "https://schema.org", "@type": "WebPage", name: "Pesquisar Sound Buttons", url: `${BASE}/search`, isPartOf: { "@type": "WebSite", name: "SoundButtons.com", url: `${BASE}/` } }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }} />
      <SearchPageClient />
    </>
  )
}
