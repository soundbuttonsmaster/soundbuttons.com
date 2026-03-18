import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import { SITE, getLocaleBase } from "@/lib/constants/site"
import SearchResultsClient from "@/app/search/[query]/SearchResultsClient"

export const revalidate = 60
const PAGE_SIZE = 35

function slugToQuery(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\s+/g, " ").trim()
}

function toTitleCase(str: string): string {
  return str.split(/\s+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")
}

export async function generateMetadata({ params }: { params: Promise<{ query: string }> }): Promise<Metadata> {
  const { query } = await params
  const searchQuery = slugToQuery(query)
  if (!searchQuery || searchQuery.length < 2) return { title: "Rechercher - Sound Buttons" }
  let totalItems = 0
  try {
    const { meta } = await apiClient.searchSounds(searchQuery, 1, 10)
    totalItems = meta.total_items ?? 0
  } catch { /* ignore */ }
  const base = getLocaleBase("fr")
  const canonicalUrl = `${base}/search/${query}`
  const searchName = toTitleCase(searchQuery)
  const soundCount = totalItems
  const title = `${searchName} Soundboard :Bouton d'Effet Sonore Instantané`
  const description = `Jouez et téléchargez ${soundCount} boutons sonores ${searchName} gratuitement. MP3 haute qualité pour mèmes, TikTok et Discord.`
  const ogImageUrl = `${base}/search/${query}/opengraph-image`
  return {
    title: { absolute: title },
    description,
    authors: [{ name: "SoundButtons.com" }],
    creator: "SoundButtons.com",
    publisher: "SoundButtons.com",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE.baseUrl}/search/${query}`,
        es: `${SITE.baseUrl}/es/search/${query}`,
        pt: `${SITE.baseUrl}/pt/search/${query}`,
        fr: canonicalUrl,
        "x-default": `${SITE.baseUrl}/search/${query}`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sound Buttons",
      images: [{ url: ogImageUrl, width: 1200, height: 630, type: "image/png" as const, alt: title, secureUrl: ogImageUrl }],
      locale: "fr_FR",
    },
    twitter: { card: "summary_large_image", site: "@soundbuttons", creator: "@soundbuttons", title, description, images: [ogImageUrl] },
    robots: { index: true, follow: true },
  }
}

export default async function FrSearchResultsPage({ params }: { params: Promise<{ query: string }> }) {
  const { query: querySlug } = await params
  const searchQuery = slugToQuery(querySlug)
  if (!searchQuery || searchQuery.length < 2) redirect("/fr/search")
  const sanitizedQuery = searchQuery.replace(/[<>]/g, "").trim()
  if (!sanitizedQuery) redirect("/fr/search")

  const headersList = await headers()
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(headersList.get("user-agent") ?? "")

  let initialSounds: Awaited<ReturnType<typeof apiClient.searchSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }
  try {
    const result = await apiClient.searchSounds(sanitizedQuery, 1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch { /* ignore */ }

  const base = getLocaleBase("fr")
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: base },
      { "@type": "ListItem", position: 2, name: "search", item: `${base}/search` },
      { "@type": "ListItem", position: 3, name: searchQuery, item: `${base}/search/${querySlug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SearchResultsClient searchQuery={sanitizedQuery} initialSounds={initialSounds} initialMeta={meta} isMobileDevice={isMobile} locale="fr" />
    </>
  )
}
